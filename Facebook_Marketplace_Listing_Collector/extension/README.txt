MARKETPLACE LISTING COLLECTOR — FIREFOX, NO ADMIN REQUIRED
Version 1.3.0

INSTALL FOR TESTING
1. Extract the ZIP file.
2. In Firefox, type about:debugging in the address bar.
3. Select "This Firefox".
4. Click "Load Temporary Add-on".
5. Open the extracted folder and select manifest.json.

USE
1. Log in to Facebook normally and open Marketplace.
2. Click the extension icon.
3. Use "Save current listing" only after opening the exact listing you want.
4. Open Dashboard to search, sort, delete and export records.
5. Use Batch Download to create one Downloads/Marketplace Listings folder per
   saved listing with listing.json, description.txt, an offline HTML summary,
   the original .url shortcut, media URL list, images and direct videos.
6. The dashboard accepts multiple direct listing or Facebook share URLs, one per
   line. Batch Capture opens up to 20 links one at a time and closes each tab.

NOTES
- All collected records remain in Firefox local extension storage.
- Your Facebook password and cookies are never read or exported.
- CSV contains image URLs, not the image files themselves.
- Facebook may expose video as a temporary blob stream. Direct HTTP video URLs
  are downloaded; blob-only streams are reported but cannot be saved directly.
- Re-capturing a listing keeps its first capture date, notes/tags and price
  history. The dashboard displays media and price-history counts.
- Batch capture shows live per-listing progress, retries pages that load slowly,
  and can be stopped after the current listing.
- Strict listing-only mode excludes Related Items, More from this seller,
  Today's Picks, Sponsored sections, and media linked to a different listing ID.
- Page-wide network video detection is disabled so unrelated recommended videos
  are never mixed into the selected listing archive.
- Search-result collection has been removed. Records can only come from the
  currently opened listing or the exact links supplied to Batch Capture.
- Batch mode resolves Facebook Copy Link/share URLs, retries four times, and
  temporarily activates a stubborn tab on later attempts so Facebook renders it.
- Failed URLs include the final redirected address and exact reason. A JSON
  failure report is automatically placed in Downloads when any link fails.
- Facebook can change its page layout. If capture stops working, the content
  extraction logic may need an update.
- A temporary extension is removed when Firefox restarts. For repeated use,
  reload manifest.json through about:debugging or have the extension signed.
- Use conservatively and follow Facebook's terms. This version captures only
  the opened listing or explicitly supplied links; it does not bypass controls.
