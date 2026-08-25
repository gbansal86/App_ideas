const api=typeof browser!=="undefined"?browser:chrome, $=id=>document.getElementById(id); let all=[];
const num=s=>Number(String(s||"").replace(/[^\d.]/g,""))||0;
const el=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
function card(x){
  const article=el("article"), img=el("img"), body=el("div","cardbody"), footer=el("footer");
  img.src=x.image||""; img.alt=""; img.loading="lazy"; article.append(img);
  body.append(el("div","price",x.price||"Price unavailable"),el("h2","",x.title||"Untitled listing"));
  body.append(el("p","",[x.condition,x.location,x.listed,x.seller].filter(Boolean).join(" · ")));
  body.append(el("p","mediaCount",`${x.images?.length||0} images · ${x.videos?.length||0} videos · ${x.priceHistory?.length||0} price records`));
  body.append(el("p","desc",String(x.description||"").slice(0,320)));
  const link=el("a","","Open listing"); link.href=x.url||"#"; link.target="_blank"; link.rel="noopener noreferrer";
  const archive=el("button","","Download");archive.addEventListener("click",async()=>{archive.disabled=true;archive.textContent="Queueing…";try{const r=await api.runtime.sendMessage({type:"download-listings",listings:[x]});archive.textContent=`Queued ${r.queued}`;}catch{archive.textContent="Failed";}finally{setTimeout(()=>{archive.disabled=false;archive.textContent="Download";},2500);}});
  const del=el("button","","Delete"); del.addEventListener("click",async()=>{all=all.filter(i=>(i.id||i.url)!==(x.id||x.url));await save();render();});
  footer.append(link,archive,del); body.append(footer); article.append(body); return article;
}
function render(){
  const q=$("search").value.toLowerCase(); let rows=all.filter(x=>JSON.stringify(x).toLowerCase().includes(q));
  const s=$("sort").value; rows.sort((a,b)=>s==="title"?String(a.title||"").localeCompare(String(b.title||"")):s==="priceLow"?num(a.price)-num(b.price):s==="priceHigh"?num(b.price)-num(a.price):String(b.capturedAt||"").localeCompare(String(a.capturedAt||"")));
  $("summary").textContent=`${rows.length} shown · ${all.length} saved`; $("empty").hidden=rows.length>0;
  const cards=$("cards"); cards.replaceChildren(...rows.map(card));
}
async function save(){await api.storage.local.set({listings:all});} function csvCell(v){return `"${String(v??"").replace(/"/g,'""')}"`;}
function download(content,mime,name){api.runtime.sendMessage({type:"download",content,mime,filename:name});}
$("csv").onclick=()=>{const f=["id","title","price","location","condition","seller","listed","description","url","image","imageCount","videoCount","firstCapturedAt","capturedAt"];const rows=all.map(x=>({...x,imageCount:x.images?.length||0,videoCount:x.videos?.length||0}));download("\ufeff"+[f.join(","),...rows.map(r=>f.map(k=>csvCell(r[k])).join(","))].join("\r\n"),"text/csv;charset=utf-8","marketplace-listings.csv");};
$("json").onclick=()=>download(JSON.stringify(all,null,2),"application/json","marketplace-listings.json");
$("download").onclick=async()=>{if(!all.length)return alert("No saved listings.");const r=await api.runtime.sendMessage({type:"download-listings",listings:all});alert(`Queued ${r.queued} files from ${r.listings} listings. Could not queue: ${r.failed}; skipped: ${r.skipped}.`);};
const pastedUrls=()=>$("links").value.split(/\r?\n/).map(x=>x.trim()).filter(MLC.validBatchUrl).map(MLC.cleanUrl);
$("addLinks").onclick=async()=>{const urls=pastedUrls().filter(MLC.validListingUrl),existing=new Set(all.map(x=>x.url));let added=0;for(const clean of urls){if(!existing.has(clean)){const item={id:(clean.match(/\/item\/(\d+)/)||[])[1]||"",url:clean,title:`Uncaptured listing ${(clean.match(/\/item\/(\d+)/)||[])[1]||""}`,price:"",description:"Open this listing and use Save current listing to capture its contents.",images:[],videos:[],capturedAt:new Date().toISOString()};all.push(MLC.mergeListing({},item));existing.add(clean);added++;}}await save();$("batchStatus").textContent=`Added ${added} direct item links. Share URLs require Capture full listings.`;$("links").value="";render();};
$("captureLinks").onclick=async()=>{const urls=pastedUrls();if(!urls.length)return $("batchStatus").textContent="No valid Marketplace or Facebook share links found.";$("captureLinks").disabled=true;$("cancelBatch").hidden=false;$("batchStatus").textContent=`Starting ${Math.min(urls.length,20)} listings…`;try{const r=await api.runtime.sendMessage({type:"batch-capture",urls});all=(await api.storage.local.get("listings")).listings||[];const firstError=r.errors?.[0]?.reason;$("batchStatus").textContent=`Captured ${r.captured}/${r.total}; failed ${r.failed}${r.cancelled?"; stopped early":""}${r.truncated?". Only first 20 processed.":"."}${firstError?" First error: "+firstError:""}${r.reportQueued?" Failure report saved to Downloads.":""}`;render();}catch(error){$("batchStatus").textContent=`Batch stopped: ${error.message||error}`;}finally{$("captureLinks").disabled=false;$("cancelBatch").hidden=true;}};
$("cancelBatch").onclick=()=>api.runtime.sendMessage({type:"cancel-batch"});
api.runtime.onMessage.addListener(msg=>{if(msg?.type!=="batch-progress")return;const label=msg.title||msg.error||msg.url||"";$("batchStatus").textContent=`${msg.index}/${msg.total}: ${msg.status}${label?" — "+label:""}`;});
$("clear").onclick=async()=>{if(confirm(`Delete all ${all.length} saved listings?`)){all=[];await save();render();}};
$("search").oninput=render; $("sort").onchange=render; api.storage.local.get("listings").then(x=>{all=x.listings||[];render();});
