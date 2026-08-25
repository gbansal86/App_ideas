const fs=require('fs'),assert=require('assert'),{JSDOM}=require('jsdom');
const html=`<!doctype html><body><div role="main" id="main">
  <h1>Current Blue Sofa</h1><div>C$500</div>
  <section><span>Description</span><div>The selected blue sofa description.</div></section>
  <img src="https://scontent.fbcdn.net/current-1.jpg" width="1200" height="900" alt="Current Blue Sofa">
  <video src="https://video.fbcdn.net/current.mp4"></video>
  <section><h2 role="heading">Related items</h2>
    <a href="/marketplace/item/999"><img src="https://scontent.fbcdn.net/related.jpg" width="1400" height="1000" alt="Related couch"><video src="https://video.fbcdn.net/related.mp4"></video></a>
  </section>
  <section aria-label="More from this seller"><img src="https://scontent.fbcdn.net/other-seller.jpg" width="1300" height="900" alt="Other item"></section>
  <section aria-label="Sponsored"><img src="https://scontent.fbcdn.net/ad.jpg" width="1600" height="900" alt="Advertisement"></section>
</div></body>`;
const dom=new JSDOM(html,{url:'https://www.facebook.com/marketplace/item/123',runScripts:'outside-only'});
Object.defineProperty(dom.window.HTMLElement.prototype,'innerText',{get(){return this.textContent;}});
Object.defineProperty(dom.window.document.getElementById('main'),'innerText',{value:'Current Blue Sofa\nC$500\nDescription\nThe selected blue sofa description.\nRelated items\nUnrelated chair'});
let listener;dom.window.browser={runtime:{onMessage:{addListener:fn=>listener=fn}}};
dom.window.eval(fs.readFileSync('extension/content.js','utf8'));
(async()=>{
  const item=(await listener({type:'capture-current'})).listings[0];
  assert.deepStrictEqual(Array.from(item.images),['https://scontent.fbcdn.net/current-1.jpg']);
  assert.deepStrictEqual(Array.from(item.videos),['https://video.fbcdn.net/current.mp4']);
  assert(!item.pageText.includes('Unrelated chair'));
  assert.strictEqual(item.captureStats.scope,'current-listing-only');
  console.log('STRICT_LISTING_SCOPE_TEST_PASSED');
})().catch(error=>{console.error(error);process.exit(1);});
