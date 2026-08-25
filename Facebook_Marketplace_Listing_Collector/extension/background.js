const api=typeof browser!=="undefined"?browser:chrome;
const safe=value=>String(value||"listing").replace(/[<>:"/\\|?*\x00-\x1f]/g,"_").replace(/[. ]+$/g,"").slice(0,100)||"listing";
const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const extension=(url,fallback)=>{try{const match=new URL(url).pathname.match(/\.([a-z0-9]{2,5})$/i);return match?match[1].toLowerCase():fallback;}catch{return fallback;}};
const textDownload=async(content,mime,filename,saveAs=false)=>{
  const blob=new Blob([content],{type:mime||"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob);
  try{return await api.downloads.download({url,filename,saveAs,conflictAction:"uniquify"});}
  finally{setTimeout(()=>URL.revokeObjectURL(url),60000);}
};
const summaryHtml=item=>`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(item.title)}</title><style>body{font:16px system-ui;max-width:1000px;margin:30px auto;padding:0 20px;color:#17202a}h1{margin-bottom:4px}.price{font-size:24px;color:#1769e0;font-weight:700}.meta{color:#667085}.media{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.media img,.media video{width:100%;max-height:500px;object-fit:contain;background:#eee}pre{white-space:pre-wrap;font:inherit}a{color:#1769e0}</style></head><body><h1>${escapeHtml(item.title)}</h1><div class="price">${escapeHtml(item.price||"Price unavailable")}</div><p class="meta">${escapeHtml([item.condition,item.location,item.listed,item.seller].filter(Boolean).join(" · "))}</p><p><a href="${escapeHtml(item.url)}">Open original listing</a></p><h2>Description</h2><pre>${escapeHtml(item.description||item.pageText||"")}</pre><h2>Downloaded media</h2><div class="media">${(item.images||[]).map((url,i)=>`<img src="image_${String(i+1).padStart(3,"0")}.${extension(url,"jpg")}" alt="Image ${i+1}">`).join("")}${(item.videos||[]).map((url,i)=>`<video controls src="video_${String(i+1).padStart(3,"0")}.${extension(url,"mp4")}"></video>`).join("")}</div></body></html>`;
async function downloadListings(listings){
  let queued=0,failed=0,skipped=0;
  for(const item of listings){
    const folder=`Marketplace Listings/${safe(item.title||item.id)} [${safe(item.id||"no-id")}]`;
    const images=item.images?.length?[...new Set(item.images)]:[item.image].filter(Boolean),videos=[...new Set(item.videos||[])];
    const archiveItem={...item,images,videos};
    const texts=[
      [JSON.stringify(archiveItem,null,2),"application/json",`${folder}/listing.json`],
      [item.description||item.pageText||"","text/plain;charset=utf-8",`${folder}/description.txt`],
      [`[InternetShortcut]\r\nURL=${item.url||""}\r\n`,"text/plain;charset=utf-8",`${folder}/original-listing.url`],
      [[...images,...videos].join("\r\n"),"text/plain;charset=utf-8",`${folder}/media-urls.txt`],
      [summaryHtml(archiveItem),"text/html;charset=utf-8",`${folder}/listing-summary.html`]
    ];
    for(const args of texts){try{await textDownload(...args);queued++;}catch{failed++;}}
    for(const [kind,urls,fallback] of [["image",images,"jpg"],["video",videos,"mp4"]]){
      for(const [index,url] of [...new Set(urls)].entries()){
        if(!/^https?:/i.test(url)){skipped++;continue;}
        try{await api.downloads.download({url,filename:`${folder}/${kind}_${String(index+1).padStart(3,"0")}.${extension(url,fallback)}`,saveAs:false,conflictAction:"uniquify"});queued++;}catch{failed++;}
      }
    }
  }
  return {queued,failed,skipped,listings:listings.length};
}
const waitForTab=async(tabId,timeout=45000)=>{
  if((await api.tabs.get(tabId)).status==="complete")return;
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{api.tabs.onUpdated.removeListener(done);reject(new Error("Page load timed out"));},timeout);
    function finish(error){clearTimeout(timer);api.tabs.onUpdated.removeListener(done);error?reject(error):resolve();}
    function done(id,info){if(id===tabId&&info.status==="complete")finish();}
    api.tabs.onUpdated.addListener(done);
    api.tabs.get(tabId).then(tab=>{if(tab.status==="complete")finish();}).catch(finish);
  });
};
let cancelBatch=false;
const progress=payload=>api.runtime.sendMessage({type:"batch-progress",...payload}).catch(()=>{});
async function captureTab(tabId,expectedId){
  let lastError;
  for(let attempt=1;attempt<=4;attempt++){
    try{
      await pause(attempt===1?4000:2500);
      if(attempt===3){await progress({status:"activating",message:"Facebook did not render in the background; activating this listing once."});await api.tabs.update(tabId,{active:true});await pause(2000);}
      await api.tabs.executeScript(tabId,{file:"content.js"});
      const info=await api.tabs.sendMessage(tabId,{type:"page-info"}),tab=await api.tabs.get(tabId);
      if(!info?.isListing)throw new Error(`Link did not resolve to a Marketplace item (${tab.url||"unknown page"})`);
      const result=await api.tabs.sendMessage(tabId,{type:"capture-current"}),item=result?.listings?.[0];
      if(!item?.id)throw new Error("Facebook opened the listing but its ID/content was not ready");
      if(expectedId&&item.id!==expectedId)throw new Error(`Facebook redirected to a different listing ID (${item.id})`);
      if(!item.title||/^(facebook|marketplace)$/i.test(item.title))throw new Error("Listing title was not ready");
      return item;
    }catch(error){lastError=error;}
  }
  throw lastError||new Error("Capture failed");
}
async function batchCapture(urls){
  const accepted=[...new Set(urls.filter(MLC.validBatchUrl).map(MLC.cleanUrl))],limited=accepted.slice(0,20);
  let captured=0,failed=0;const errors=[];cancelBatch=false;
  for(const [index,url] of limited.entries()){
    if(cancelBatch)break;let tab;
    await progress({index:index+1,total:limited.length,status:"loading",url});
    try{
      tab=await api.tabs.create({url,active:false});await waitForTab(tab.id);
      const expectedId=(url.match(/\/item\/(\d+)/)||[])[1]||"",item=await captureTab(tab.id,expectedId);
      const stored=(await api.storage.local.get("listings")).listings||[],map=new Map(stored.map(x=>[x.id||x.url,x]));
      map.set(item.id||item.url,MLC.mergeListing(map.get(item.id||item.url),item));
      await api.storage.local.set({listings:[...map.values()]});captured++;
      await progress({index:index+1,total:limited.length,status:"captured",title:item.title});
    }catch(error){failed++;let finalUrl="";if(tab?.id)try{finalUrl=(await api.tabs.get(tab.id)).url||"";}catch{}const failure={inputUrl:url,finalUrl,reason:error.message||"Capture failed"};errors.push(failure);await progress({index:index+1,total:limited.length,status:"failed",error:failure.reason});}
    finally{if(tab?.id)try{await api.tabs.remove(tab.id);}catch{}if(index<limited.length-1)await pause(3000);}
  }
  let reportQueued=false;
  if(errors.length){try{await textDownload(JSON.stringify({createdAt:new Date().toISOString(),captured,failed,errors},null,2),"application/json",`Marketplace Listings/batch-failure-report-${new Date().toISOString().replace(/[:.]/g,"-")}.json`);reportQueued=true;}catch{}}
  return {captured,failed,total:limited.length,cancelled:cancelBatch,truncated:accepted.length>20,errors,reportQueued};
}
api.runtime.onMessage.addListener(msg=>{
  if(msg?.type==="download")return textDownload(msg.content,msg.mime,msg.filename,true);
  if(msg?.type==="download-listings")return downloadListings(msg.listings||[]);
  if(msg?.type==="batch-capture")return batchCapture(msg.urls||[]);
  if(msg?.type==="cancel-batch"){cancelBatch=true;return Promise.resolve({cancelled:true});}
});
