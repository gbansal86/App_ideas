const fs=require('fs'),vm=require('vm'),assert=require('assert');
const dir='extension',read=name=>fs.readFileSync(`${dir}/${name}`,'utf8');
let inbound,stored=[],downloads=0,updates=0,currentUrl='';
const browser={
  runtime:{onMessage:{addListener:fn=>inbound=fn},sendMessage:async()=>({})},
  storage:{local:{get:async()=>({listings:stored}),set:async value=>{stored=value.listings;}}},
  downloads:{download:async()=>++downloads},
  tabs:{
    create:async({url})=>{currentUrl=url.includes('/share/')?'https://www.facebook.com/marketplace/item/555':url;return {id:8,url:currentUrl};},
    get:async()=>({id:8,status:'complete',url:currentUrl}),update:async()=>{updates++;return {id:8,url:currentUrl};},
    executeScript:async()=>{},remove:async()=>{},onUpdated:{addListener:()=>{},removeListener:()=>{}},
    sendMessage:async(id,msg)=>msg.type==='page-info'?{isListing:currentUrl.includes('/marketplace/item/')}:{listings:[{id:(currentUrl.match(/\/item\/(\d+)/)||[])[1]||'',url:currentUrl,title:'Resolved Sofa',price:'C$50',images:[],videos:[],capturedAt:'2026-08-07T00:00:00Z'}]}
  }
};
const fastTimeout=(fn)=>setTimeout(fn,0),context={browser,chrome:undefined,Blob,URL,console,setTimeout:fastTimeout,clearTimeout};context.globalThis=context;
vm.createContext(context);vm.runInContext(read('shared.js'),context);vm.runInContext(read('background.js'),context);
(async()=>{
  const success=await inbound({type:'batch-capture',urls:['https://www.facebook.com/share/abc123?tracking=1']});
  assert.strictEqual(success.captured,1);assert.strictEqual(success.failed,0);assert.strictEqual(stored[0].id,'555');
  currentUrl='';stored=[];downloads=0;
  browser.tabs.create=async()=>{currentUrl='https://www.facebook.com/login/';return {id:8,url:currentUrl};};
  const failure=await inbound({type:'batch-capture',urls:['https://www.facebook.com/share/broken']});
  assert.strictEqual(failure.captured,0);assert.strictEqual(failure.failed,1);assert(failure.errors[0].reason.includes('did not resolve'));
  assert.strictEqual(failure.errors[0].finalUrl,'https://www.facebook.com/login/');assert(failure.reportQueued);assert(updates>0);
  console.log('BATCH_SHARE_AND_FAILURE_TESTS_PASSED');
})().catch(error=>{console.error(error);process.exit(1);});
