globalThis.MLC = (() => {
  const validListingUrl = value => {
    try {
      const url=new URL(value);
      return /(^|\.)facebook\.com$/i.test(url.hostname) && /^\/marketplace\/item\/\d+/i.test(url.pathname);
    } catch { return false; }
  };
  const validBatchUrl = value => {
    try {
      const url=new URL(value),facebook=/(^|\.)facebook\.com$/i.test(url.hostname);
      return facebook && (/^\/marketplace\/item\/\d+/i.test(url.pathname)||/^\/share\//i.test(url.pathname));
    } catch { return false; }
  };
  const cleanUrl = value => { try { const url=new URL(value); return `${url.origin}${url.pathname}`; } catch { return ""; } };
  const mergeListing = (oldItem={},newItem={}) => {
    const now=newItem.capturedAt||new Date().toISOString();
    const priceHistory=Array.isArray(oldItem.priceHistory)?[...oldItem.priceHistory]:[];
    const price=newItem.price||oldItem.price||"";
    if(price && priceHistory.at(-1)?.price!==price) priceHistory.push({price,capturedAt:now});
    return {
      ...oldItem,...newItem,
      notes:oldItem.notes||newItem.notes||"",
      tags:Array.isArray(oldItem.tags)?oldItem.tags:(newItem.tags||[]),
      priceHistory:priceHistory.slice(-100),
      firstCapturedAt:oldItem.firstCapturedAt||oldItem.capturedAt||now,
      capturedAt:now
    };
  };
  return {validListingUrl,validBatchUrl,cleanUrl,mergeListing};
})();
