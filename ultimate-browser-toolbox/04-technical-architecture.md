# Technical Architecture

## Architecture principle

Prefer **browser-local processing**. Use a backend only when a task cannot be handled reliably, securely or efficiently in the browser.

## Suggested frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- PWA support later

## Browser processing stack

### Video / audio

- FFmpeg.wasm
- Web Workers
- MediaRecorder API
- Web Audio API

### PDF

- PDF.js for reading/rendering
- pdf-lib for editing, merging, splitting and page manipulation
- Canvas for previews/annotations
- OCR engine only where needed

### Images

- Canvas API / OffscreenCanvas
- Web Workers
- WebCodecs where browser support is appropriate
- WASM image codecs for optimized conversion/compression

### Developer/data tools

Most JSON, CSV, XML, YAML, regex, encoding, hashing and formatter utilities can run entirely client-side.

## Shared tool framework

Every tool should plug into a common shell:

1. Input adapter — file, text, URL or structured form
2. Validator — type/size/format checks
3. Processor — worker/WASM/browser API/cloud job
4. Progress/cancel model
5. Preview
6. Output adapter — download, copy, ZIP, or send to next tool
7. Analytics event — tool usage only; never file contents

## Workspace model

Use browser storage for temporary results:

- IndexedDB for blobs/files
- localStorage only for lightweight preferences
- session expiry / explicit clear workspace

Later, optional authenticated cloud workspace can be added for Pro users.

## Tool chaining

Represent outputs with normalized metadata, for example:

- MIME type
- file name
- size
- duration/dimensions/pages where applicable
- compatible next tools

The UI can then offer actions such as:

- Compress → Convert → Download
- Split PDF → OCR selected pages
- Resize image → Convert to WebP
- Extract audio → Trim → Normalize

## Performance safeguards

- Run heavy processing in workers
- Add per-tool memory estimates
- Warn before processing files likely to exceed browser memory
- Stream where possible
- Avoid loading full large files into multiple copies
- Support cancellation
- Clean object URLs and temporary buffers aggressively

## Privacy model

Each tool should state one of these processing modes:

- **Local** — file never leaves device
- **Hybrid** — local first, optional cloud fallback
- **Cloud** — upload required

Never imply local processing when a network request is made with file content.

## Backend services for later phases

- Authentication
- Subscription/billing
- Cloud conversion workers
- Saved presets/workspaces
- Usage quotas
- API keys
- Job history
- Rate limiting

A queue-based worker model is appropriate for heavy cloud processing.

## Observability

Track:

- Tool opens
- Successful completions
- Processing failures
- Median processing time
- File-size buckets (not names/content)
- Chain-next-tool usage
- Conversion funnel
- Search landing page → successful output

These metrics should drive which tools receive engineering and SEO investment.
