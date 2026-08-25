# Chat Transcript and Build History — Facebook Marketplace Listing Collector

Saved: 2026-08-25

This transcript preserves the user requests, product decisions, fixes, and delivered releases. Short internal work updates are condensed, while the requested behavior and final outcomes are retained.

---

## Initial idea

### User

> can i create app or something where i can downlod all the information of listing from fb marketplace

### Assistant

Confirmed that a personal Marketplace Listing Collector was feasible, but explained that Facebook Marketplace access and automation restrictions determine what can be collected safely.

Recommended a portable browser extension that works while the user browses Marketplace normally. Proposed capturing the title, description, price, location, seller, URL, Marketplace ID, condition, posted/updated information, status, images, capture date, notes/tags, duplicate detection, price history, and searchable CSV/Excel/HTML output.

Explained that downloading every listing across Facebook is neither reliable nor appropriate because Marketplace uses continuous scrolling, personalized results, regional limits, and anti-automation controls. Recommended collecting only pages already displayed to the logged-in user and avoiding high-speed cookie-based scraping.

### User

> you will create exension or what

### Assistant

Recommended a Firefox extension because the user uses Firefox and does not have administrator rights. Proposed:

- Save current listing
- Capture visible search results in the early design
- Optional controlled auto-scroll
- Local-only storage
- CSV/JSON export
- Image download
- Duplicate detection
- Price history
- Searchable local dashboard

The initial installation method was Firefox's `about:debugging` temporary-add-on workflow.

### User

> ok do it .

## Version 1.0.0 / 1.0.1

### Assistant

Built the first Firefox extension with listing capture, visible-result collection, local storage, CSV/JSON export, image links, duplicate handling, and a searchable dashboard.

The package was validated repeatedly. Firefox's extension linter initially identified a new privacy-declaration requirement and dynamic `innerHTML` usage in the dashboard. Both were corrected. The minimum Firefox version was aligned with the privacy field.

Final v1.0.1 validation result:

- 100/100 clean-package cycles passed
- 0 Firefox linter errors
- 0 warnings
- 0 notices
- Safer dashboard rendering
- Correct no-data-collection declaration

Delivered package: `fb-marketplace-collector-v1.0.1.zip`.

### User

> how to install

### Assistant

Provided the no-admin Firefox instructions:

1. Extract the ZIP.
2. Open `about:debugging#/runtime/this-firefox`.
3. Select **Load Temporary Add-on**.
4. Choose `manifest.json`.
5. Open Facebook Marketplace and use the extension from Firefox's Extensions menu.

Also explained that Firefox removes a temporary add-on after restart, so the manifest must be loaded again.

## Connection error and richer downloads

### User

> Could not establish connection. Receiving end does not exist. want to save everthing in listing videos images ,description . can we create batch option also to download links

### Assistant

Identified that the Marketplace tab could already be open before the temporary extension loaded, leaving no receiving content script in that tab.

Implemented automatic script injection/reconnection and expanded the design to capture full listing text, image URLs, and direct video URLs. Added two batch workflows:

1. Paste up to 20 exact listing links and capture them sequentially.
2. Download saved listing files into one folder per listing.

Each folder was designed to include `listing.json`, `description.txt`, images, and directly downloadable video files. The assistant noted that Facebook sometimes exposes video only as a temporary `blob:` stream, which cannot be downloaded as a normal URL.

Version 1.1.0 passed 100/100 validation cycles and Firefox lint with zero issues.

## Deeper audit and version 1.2.0

### User

> check again and how you can make more better

### Assistant

Performed a deeper behavioral review rather than only repeating syntax checks. The audit found several weaknesses:

- Image collection could include avatars or recommendation thumbnails.
- “Downloaded” meant queued rather than confirmed.
- Batch loading had a timing race.
- Seller, condition, and posted information were under-extracted.
- Repeated captures did not preserve price history.

Version 1.2.0 improved:

- Connection recovery
- Title, price, seller, location, condition, and posted-date extraction
- Filtering of avatars, emojis, and small unrelated images
- Higher-quality image selection
- Direct video URL capture when available
- Price history
- Batch retries for slow pages
- Live batch progress and stop button
- Per-listing download
- Save-and-download-current action
- Backward compatibility with older saved records
- Duplicate updates instead of repeated records

Each archive now included:

- `listing.json`
- `description.txt`
- `listing-summary.html`
- `original-listing.url`
- `media-urls.txt`
- Images
- Downloadable videos

The package passed functional connection recovery, extraction, price history, batch capture, 100/100 package cycles, and Firefox lint with zero issues.

### User

> where it will download

### Assistant

Explained that files go to Firefox's configured Downloads folder, normally:

```text
C:\Users\YourName\Downloads\Marketplace Listings\
```

Each listing receives its own folder with metadata, description, offline summary, original URL, media URLs, images, and direct video files.

## Strict current-listing scope

### User

> download only items related to listing opened or link given not other listing showed

### Assistant

Changed the collector to a strict listing-only model. It excludes:

- Related items
- More from this seller
- Today's picks
- Sponsored items
- Media tied to another listing ID

Page-wide network-video collection was removed because ownership could not be attributed reliably. A simulated page containing a larger related-item image, related video, another seller's media, sponsored media, and unrelated text proved that those assets were rejected.

The earlier **Collect visible results** option was removed completely. From version 1.2.2 onward, records could come only from the currently open listing or exact URLs supplied to Batch Capture.

Version 1.2.2 passed the strict-scope test, 100/100 package cycles, and Firefox lint with zero issues.

## Batch failure and version 1.3.0

### User

> it failed in batch

### Assistant

Identified likely batch failure paths: Facebook share links, redirects, delayed rendering in inactive tabs, login/non-listing redirects, and a single failed listing stopping or obscuring progress.

Version 1.3.0 added:

- Support for direct Marketplace URLs and Facebook Copy Link/share URLs
- Redirect resolution
- Up to 45 seconds of page/redirect waiting
- Four attempts per listing
- Temporary activation of a stubborn background tab on later attempts
- Continued processing after individual failures
- User-visible error reasons
- Final redirected URL in error details
- Automatic JSON failure report in Downloads

The repaired build passed:

- Share-link redirect simulation
- Login/non-listing failure-report simulation
- Strict related-item rejection test
- 100/100 clean-package cycles
- Firefox lint with 0 errors, 0 warnings, and 0 notices

Delivered package: `fb-marketplace-collector-v1.3.0.zip`.

The assistant asked the user to upload `batch-failure-report-....json` if a live Facebook batch still failed, because it would identify login redirection, invalid links, unavailable Marketplace access, slow rendering, or a future Facebook page change.

## Saving the project

### User

> save the chat and code in github idea

### Result

The final v1.3.0 source code, exact release ZIP, reproducible tests, checksum, README, and this transcript were organized in:

```text
Facebook_Marketplace_Listing_Collector/
```

inside `gbansal86/App_ideas`.
