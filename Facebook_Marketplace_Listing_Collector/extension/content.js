(() => {
  if (window.__marketplaceCollectorLoaded) return;
  window.__marketplaceCollectorLoaded = true;
  const api = typeof browser !== "undefined" ? browser : chrome;
  const clean = value => String(value || "").replace(/\s+/g," ").trim();
  const canonical = value => { if(!value)return "";try { const u=new URL(value,location.origin); return `${u.origin}${u.pathname}`; } catch { return ""; } };
  const idFrom = url => (String(url).match(/\/marketplace\/item\/(\d+)/)||[])[1]||"";
  const uniqueHttp = values => [...new Set(values.filter(x=>/^https?:/i.test(x||"")))];
  const excludedSection = /^(?:related items?|related listings?|more from this seller|today['’]s picks|sponsored|you may also like|similar items?)$/i;
  const linkedListingId = node => {
    const link=node.closest?.('a[href*="/marketplace/item/"]');
    return link?idFrom(link.href):"";
  };
  const isInsideExcludedSection = (node,root) => {
    let current=node.parentElement;
    for(let level=0;current&&current!==root&&level<8;level++,current=current.parentElement){
      const label=clean(current.getAttribute?.("aria-label"));if(excludedSection.test(label))return true;
      const nearby=[...current.querySelectorAll(':scope > h1,:scope > h2,:scope > h3,:scope > [role="heading"],:scope > * > [role="heading"]')]
        .slice(0,3).map(x=>clean(x.innerText));
      if(nearby.some(x=>excludedSection.test(x)))return true;
    }
    return false;
  };
  const belongsToListing = (node,root,currentId) => {
    const linkedId=linkedListingId(node);
    return (!linkedId||linkedId===currentId)&&!isInsideExcludedSection(node,root);
  };
  const money = text => (String(text).match(/(?:CA\$|C\$|US\$|A\$|\$|₹|£|€)\s?[\d,.]+(?:\.\d{1,2})?/i)||[])[0]||"";
  const bestImageUrl = img => {
    const choices=(img.srcset||"").split(",").map(part=>part.trim().split(/\s+/)).filter(x=>x[0]);
    choices.sort((a,b)=>(parseFloat(b[1])||0)-(parseFloat(a[1])||0));
    return choices[0]?.[0]||img.currentSrc||img.src||"";
  };
  const isListingImage = img => {
    const width=img.naturalWidth||img.width||0, height=img.naturalHeight||img.height||0;
    const label=`${img.alt||""} ${img.getAttribute("aria-label")||""}`;
    return bestImageUrl(img) && width>=180 && height>=120 && !/(profile picture|avatar|emoji|sticker)/i.test(label);
  };
  const allImages = (root,currentId) => uniqueHttp([...root.querySelectorAll("img")].filter(img=>isListingImage(img)&&belongsToListing(img,root,currentId)).sort((a,b)=>
    ((b.naturalWidth||b.width)*(b.naturalHeight||b.height))-((a.naturalWidth||a.width)*(a.naturalHeight||a.height)))
    .map(bestImageUrl)).slice(0,60);
  const allVideos = (root,currentId) => uniqueHttp([...root.querySelectorAll("video,video source")]
    .filter(video=>belongsToListing(video,root,currentId)).flatMap(v=>[v.currentSrc,v.src])).slice(0,20);
  const titleFrom = (root,text,price) => {
    const h1=clean(root.querySelector("h1")?.innerText); if(h1&&h1!==price)return h1;
    const candidates=[...root.querySelectorAll('h2,[role="heading"]')].map(x=>clean(x.innerText)).filter(x=>
      x.length>=3&&x.length<=180&&x!==price&&!/^(facebook|marketplace|details|description|seller information|message|share|save|sold|pending)$/i.test(x));
    return candidates[0]||clean(text.replace(price,"")).slice(0,180);
  };
  const sectionText = (root,label) => {
    const headings=[...root.querySelectorAll('h1,h2,h3,h4,[role="heading"],span')].filter(x=>clean(x.innerText).toLowerCase()===label.toLowerCase());
    for(const heading of headings){
      let node=heading;
      for(let i=0;i<3&&node.parentElement;i++,node=node.parentElement){
        const value=clean(node.innerText);
        if(value.length>label.length+10&&value.length<6000)return clean(value.replace(new RegExp(`^${label}\\s*`,"i"),""));
      }
    }
    return "";
  };
  const descriptionFrom = (root,lines,pageText) => {
    const section=sectionText(root,"Description");
    if(section&&section.length>10)return section.slice(0,5000);
    const index=lines.findIndex(x=>/^description$/i.test(x));
    if(index>=0){
      const stop=/^(seller information|details|location|meetup|delivery|sponsored|related searches)$/i;
      return lines.slice(index+1).filter((x,i)=>i===0||!stop.test(x)).join(" ").slice(0,5000);
    }
    return pageText.slice(0,5000);
  };
  const listing = (root,url) => {
    const raw=root.innerText||"",allLines=raw.split("\n").map(clean).filter(Boolean);
    const cutoff=allLines.findIndex(line=>excludedSection.test(line));
    const lines=cutoff>=0?allLines.slice(0,cutoff):allLines,pageText=clean(lines.join("\n")).slice(0,15000);
    const price=money(pageText), title=titleFrom(root,pageText,price), itemPage=/\/marketplace\/item\//.test(location.pathname),currentId=idFrom(url);
    const images=allImages(root,currentId), videos=allVideos(root,currentId);
    const sellerLink=[...root.querySelectorAll("a[href]")].find(a=>/\/(?:marketplace\/profile|people|profile\.php)/i.test(a.getAttribute("href")||"")&&clean(a.innerText));
    const listedLine=lines.find(x=>/\b(listed|posted)\b.*(?:ago|today|yesterday|in\s)/i.test(x))||"";
    const locationLine=lines.find(x=>/^listed in\s+/i.test(x))||lines.find(x=>/(?:,\s*[A-Z]{2}\b|\bkm away\b|\bmiles away\b)/i.test(x))||"";
    const condition=lines.find(x=>/^(?:new|used(?:\s*[-–]\s*(?:like new|good|fair))?|like new|good|fair|poor)$/i.test(x))||"";
    return {
      schemaVersion:3,id:currentId,url:canonical(url),title,price,
      description:itemPage?descriptionFrom(root,lines,pageText):"",
      pageText:itemPage?pageText:"", location:locationLine.replace(/^listed in\s+/i,""), condition,
      seller:clean(sellerLink?.innerText), sellerUrl:canonical(sellerLink?.href), listed:listedLine,
      image:images[0]||"",images,videos,
      captureStats:{images:images.length,videos:videos.length,textCharacters:pageText.length,scope:"current-listing-only"},
      mediaWarnings:[...root.querySelectorAll("video")].some(v=>String(v.currentSrc||v.src).startsWith("blob:"))
        ? ["A streamed blob video was visible but has no direct downloadable URL."]:[],
      capturedAt:new Date().toISOString(),source:"Facebook Marketplace"
    };
  };
  const current = () => listing(document.querySelector('div[role="main"]')||document.body,location.href);
  api.runtime.onMessage.addListener(msg=>{
    if(msg?.type==="capture-current")return Promise.resolve({listings:[current()]});
    if(msg?.type==="page-info")return Promise.resolve({isMarketplace:location.pathname.startsWith("/marketplace"),isListing:/\/marketplace\/item\//.test(location.pathname),url:location.href});
  });
})();
