const api = typeof browser !== "undefined" ? browser : chrome;
const $ = id => document.getElementById(id);
async function getAll(){ return (await api.storage.local.get("listings")).listings || []; }
async function refresh(){ $("count").textContent = `${(await getAll()).length} saved`; }
function message(text, bad=false){ $("status").textContent=text; $("status").className=bad?"bad":"ok"; }
async function collect(type){
  try {
    const [tab] = await api.tabs.query({active:true,currentWindow:true});
    if (!/^https:\/\/(?:[^/]+\.)?facebook\.com\/marketplace\//i.test(tab?.url||"")) throw new Error("Open a Facebook Marketplace page first.");
    let result;
    try { result=await api.tabs.sendMessage(tab.id,{type}); }
    catch(firstError) {
      await api.tabs.executeScript(tab.id,{file:"content.js"});
      result=await api.tabs.sendMessage(tab.id,{type});
    }
    const old = await getAll(), map = new Map(old.map(x=>[x.id||x.url,x]));
    let added=0, updated=0;
    const saved=[];
    for(const x of result.listings||[]){ const key=x.id||x.url; if(!key) continue; map.has(key)?updated++:added++; const merged=MLC.mergeListing(map.get(key),x);map.set(key,merged);saved.push(merged); }
    await api.storage.local.set({listings:[...map.values()]}); await refresh();
    message(`Saved ${added} new; updated ${updated}. Images: ${saved.reduce((n,x)=>n+(x.images?.length||0),0)}; videos: ${saved.reduce((n,x)=>n+(x.videos?.length||0),0)}.`);
    return saved;
  } catch(e){ message(e.message || "Could not read this page. Reload it and try again.",true); }
}
function csvCell(v){ return `"${String(v??"").replace(/"/g,'""')}"`; }
async function exportCsv(){
  const rows=(await getAll()).map(x=>({...x,imageCount:x.images?.length||0,videoCount:x.videos?.length||0})), fields=["id","title","price","location","condition","seller","listed","description","url","image","imageCount","videoCount","firstCapturedAt","capturedAt"];
  const csv="\ufeff"+[fields.join(","),...rows.map(r=>fields.map(f=>csvCell(r[f])).join(","))].join("\r\n");
  api.runtime.sendMessage({type:"download",content:csv,mime:"text/csv;charset=utf-8",filename:`marketplace-listings-${new Date().toISOString().slice(0,10)}.csv`});
}
$("current").onclick=()=>collect("capture-current");
$("saveDownload").onclick=async()=>{const saved=await collect("capture-current");if(!saved?.length)return;message("Saved. Queueing listing archive…");try{const r=await api.runtime.sendMessage({type:"download-listings",listings:saved});message(`Saved and queued ${r.queued} files; ${r.failed} could not be queued.`);}catch(e){message(e.message||"Download failed.",true);}};
$("dashboard").onclick=()=>api.tabs.create({url:api.runtime.getURL("dashboard.html")}); $("csv").onclick=exportCsv; refresh();
$("download").onclick=async()=>{const rows=await getAll();if(!rows.length)return message("No saved listings to download.",true);message("Queueing downloads…");try{const r=await api.runtime.sendMessage({type:"download-listings",listings:rows});message(`Queued ${r.queued} files from ${r.listings} listings; ${r.failed} failed, ${r.skipped} skipped.`);}catch(e){message(e.message||"Batch download failed.",true);}};
