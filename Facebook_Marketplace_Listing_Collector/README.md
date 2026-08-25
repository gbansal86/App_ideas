# Facebook Marketplace Listing Collector

A Firefox extension that saves information and downloadable media from the exact Facebook Marketplace listing currently open, or from exact listing/share links supplied in a controlled batch.

The extension is designed for personal research and archiving without administrator access. It does not read or export Facebook passwords or cookies, bypass access controls, or scrape search-result and recommendation cards.

## Current release

- Version: `1.3.0`
- Browser: Firefox 142 or newer
- Installation: temporary add-on through `about:debugging`
- Packaged build: [`release/fb-marketplace-collector-v1.3.0.zip`](release/fb-marketplace-collector-v1.3.0.zip)
- SHA-256: `797467384b48278c60bf8945e8b783156a6e666d795388b9b49deed7c7823bdf`

## What it captures

- Listing ID and original URL
- Title and price
- Full visible description/listing text
- Seller and seller profile link when displayed
- Location, condition, and listed/posted information when displayed
- Listing image URLs and downloadable image files
- Direct HTTP(S) video URLs and downloadable video files when Facebook exposes them
- Capture timestamps, notes, tags, duplicate updates, and price history

## Strict listing-only scope

The collector deliberately excludes:

- Related items
- More from this seller
- Today's picks
- Sponsored listings
- Search-result collection
- Images or videos tied to a different Marketplace listing ID
- Page-wide network video detection that cannot reliably identify the owning listing

Records can be created only from the listing currently open or from exact URLs pasted into Batch Capture.

## Batch capture

The dashboard accepts up to 20 direct Marketplace URLs or Facebook Copy Link/share URLs, one per line. It processes the links sequentially, follows Facebook redirects, retries each page up to four times, and can activate a throttled background tab when necessary.

One failed URL does not stop the remaining batch. Failures include the original URL, final redirected URL, and reason. When failures occur, a JSON report is queued in Firefox Downloads.

The batch process does not bypass login screens, captchas, unavailable/deleted listings, permission restrictions, or Facebook access controls.

## Downloaded folder structure

Files are placed under the Firefox download directory, normally:

```text
C:\Users\YourName\Downloads\Marketplace Listings\
└── Listing Name [Listing ID]\
    ├── listing-summary.html
    ├── listing.json
    ├── description.txt
    ├── original-listing.url
    ├── media-urls.txt
    ├── image_001.jpg
    ├── image_002.jpg
    └── video_001.mp4
```

Facebook sometimes serves video only as a temporary `blob:` stream. Blob-only streams do not provide a normal downloadable file URL; the listing record reports that limitation while preserving the rest of the data.

## Install in Firefox

1. Download and extract `release/fb-marketplace-collector-v1.3.0.zip`.
2. Open Firefox.
3. Enter `about:debugging#/runtime/this-firefox` in the address bar.
4. Select **Load Temporary Add-on**.
5. Choose `manifest.json` from the extracted `fb-marketplace-collector` folder.
6. Open or reload Facebook Marketplace.

Firefox removes temporary add-ons when it restarts. Repeat steps 3–5 after a restart. Permanent distribution would require packaging and Firefox signing.

## Use

### One open listing

1. Log in to Facebook normally.
2. Open the exact Marketplace listing.
3. Open **Marketplace Listing Collector** from the Firefox Extensions menu.
4. Select **Save current listing** or **Save + download current**.

### Exact listing links in a batch

1. Open the extension dashboard.
2. Paste one direct listing URL or Facebook share URL per line.
3. Select **Capture full listings**.
4. Monitor the live progress or stop after the current listing.
5. Select **Download all listing files** when capture completes.

## Repository layout

| Path | Contents |
|---|---|
| `extension/` | Unpacked Firefox extension source code |
| `release/` | Exact installable ZIP and checksum |
| `tests/` | Mocked batch/scope tests and 100-cycle package verifier |
| `CHAT_TRANSCRIPT.md` | Product decisions, user requests, fixes, and release history |

## Development and tests

Requirements:

- Node.js 20 or newer
- npm
- Bash, Python 3, `unzip`, and `rg` for the 100-cycle package test

Run the functional tests:

```bash
npm install
npm test
```

Run the repeated clean-package verification:

```bash
bash tests/verify_v130_100.sh
```

The final package passed:

- 100/100 clean extraction and validation cycles
- Manifest JSON validation
- JavaScript syntax checks
- Batch share-link redirect and failure-report simulations
- Strict rejection of related, seller-recommendation, and sponsored media
- Firefox extension lint with 0 errors, 0 warnings, and 0 notices at build time

## Important limitations

- Facebook changes its HTML structure and may require future extraction updates.
- Visible fields differ by account, country, listing type, and page state.
- A logged-in browser may still encounter captchas, blocked pages, expired share links, or deleted listings.
- Direct HTTP(S) media can be downloaded; blob-only video streams cannot be saved by this implementation.
- Use the extension conservatively and only for data you are permitted to collect. Follow Facebook's terms and applicable privacy/copyright laws.
