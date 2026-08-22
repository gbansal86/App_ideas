# MVP Priorities

## Recommended first 20 tools

Score tools against search demand, repeat use, browser feasibility, operating cost, competition, monetization potential and ability to chain with other tools.

| Priority | Tool | Why it belongs in MVP |
|---:|---|---|
| 1 | Image Compressor | Broad demand, cheap local processing, strong SEO |
| 2 | Image Resizer | High-frequency utility, easy to build |
| 3 | Image Converter | Natural companion to resize/compress |
| 4 | PDF Merge | Very common document task |
| 5 | PDF Split | Strong search intent and repeat use |
| 6 | Image to PDF | Broad consumer/business use |
| 7 | PDF to Images | Complements image/PDF cluster |
| 8 | PDF Compressor | High-value utility; optimize implementation carefully |
| 9 | Video Cutter / Trimmer | Core media workflow |
| 10 | Video Compressor | High demand and good differentiation with local processing |
| 11 | Video Converter | Foundational FFmpeg.wasm capability |
| 12 | Video Speed Changer | Useful for creator workflows |
| 13 | Audio Cutter | Reuses media pipeline |
| 14 | Audio Converter | Reuses FFmpeg stack |
| 15 | YouTube Transcript Utility | Strong creator/research demand; comply with platform rules |
| 16 | YouTube Thumbnail Utility | Simple, high-intent creator tool |
| 17 | JSON Formatter / Validator | Frequent developer utility |
| 18 | JSON ↔ CSV | Strong data workflow and easy chaining |
| 19 | Markdown Editor → PDF/HTML | Useful for developers and writers |
| 20 | Bulk File Renamer | Excellent browser-local utility |

## Next 20

- Background remover
- Image watermark tool
- Image metadata / EXIF viewer
- Merge images
- SVG converter/viewer
- Video to GIF
- Extract audio from video
- Merge video clips
- Video thumbnail/frame extractor
- Audio compressor
- Pitch / speed changer
- PDF page reorder/delete/rotate
- PDF metadata viewer
- CSV viewer/editor
- XML/JSON/YAML converters
- Regex tester
- Base64 encoder/decoder
- cURL formatter/builder
- REST API tester
- Website screenshot / metadata utility

## Phased roadmap

### Phase 1 — Foundation

- Shared design system
- File-picker / drag-and-drop component
- Local-processing status badge
- Shared job/progress model
- Download/export system
- Analytics that never captures user file contents

### Phase 2 — Image + PDF cluster

Launch 8–10 tools that share infrastructure and cross-link heavily.

### Phase 3 — Media cluster

Add FFmpeg.wasm-based video/audio utilities with workers, progress, cancellation and memory guards.

### Phase 4 — Developer/data cluster

Add JSON/CSV/XML/YAML, regex, encoding and API utilities.

### Phase 5 — Creator workflows

Add transcripts, timestamps, thumbnails, subtitle utilities and safe platform integrations.

### Phase 6 — Tool chaining + workspace

Let outputs flow directly between compatible tools without repeat upload/download.

### Phase 7 — Pro

Potential paid benefits:

- Larger local/cloud jobs
- Larger batch sizes
- Saved presets
- Persistent workspace
- No ads
- Priority cloud processing where needed
- API access

## What not to build first

- Generic browser games
- Novelty generators
- Extremely niche calculators
- Dozens of duplicate pages for the same implementation
- Expensive AI tools before traffic and monetization justify inference cost
