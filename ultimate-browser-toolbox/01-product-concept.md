# Product Concept

## Vision

Build a focused, privacy-first web toolbox inspired by large utility sites such as FreeMediaTools, but with a smaller set of high-value tools that are faster, easier to use, and more polished.

The target is approximately **50–100 excellent tools**, not hundreds of low-value pages.

> **Fast browser tools. Your files stay on your device whenever possible.**

Where technically practical, processing should happen locally in the browser using WebAssembly, FFmpeg.wasm, PDF.js, pdf-lib, Canvas APIs, Web Workers and client-side JavaScript.

## Primary Tool Categories

### Video

- Video cutter / trimmer
- Video compressor
- Video converter
- Merge videos
- Crop video
- Resize / change resolution
- Speed changer
- Reverse video
- Extract audio
- Video to GIF
- Frame / thumbnail extractor
- Add subtitles / captions
- Burn subtitles into video
- Clip cutter using timestamps
- Merge clips from multiple videos
- Blur / pixelate regions or faces
- Add text / watermark
- Video metadata viewer

### YouTube & Social

- YouTube transcript extractor
- Timestamp / chapter generator
- Thumbnail downloader
- Video ID extractor
- Channel ID extractor
- Subtitle / SRT tools
- Transcript cleaner
- Playlist utilities
- Metadata viewer
- Queue / playlist organizer
- Social media post helper

YouTube and social-media functionality must comply with platform Terms of Service and copyright rules.

### PDF & Documents

- Merge / combine PDF
- Split PDF
- Compress PDF
- PDF to images
- Images to PDF
- Rotate / reorder / delete / extract pages
- Watermark PDF
- Sign / annotate PDF
- PDF metadata viewer
- OCR scanned documents
- PDF to text
- PDF to DOCX / Excel / HTML
- DOCX / HTML / Markdown / TXT to PDF
- Markdown editor and export
- Resume / invoice generators

### Images & Graphics

- Image compressor
- Image resizer
- Cropper
- JPG / PNG / WebP / BMP conversion
- Background remover
- Upscale / downscale
- Image to SVG/vector
- Metadata / EXIF viewer
- Remove EXIF
- Merge / split images
- Watermark / annotate / blur / pixelate
- Color palette extractor and generator
- Sprite sheet maker
- Icon / favicon maker
- Bulk image converter

### Audio

- Audio cutter
- Audio merger
- Converter
- Compressor
- Playback speed changer
- Pitch changer
- Normalize volume
- Vocal remover / karaoke maker
- Speech to text
- Text to speech
- Audio recorder
- Microphone tester

### Developer & Data

- JSON formatter / validator / minifier
- JSON ↔ CSV / XML / YAML / INI / HJSON
- JSON Schema tools
- CSV viewer and converter
- SQL generators / builders
- HTML / CSS / JavaScript formatter
- JSX / React / TypeScript converters
- Base64 / URL encode-decode
- JWT encode / decode
- Regex tester
- UUID generator
- Hash generators
- Markdown editor
- cURL formatter / builder
- REST API tester
- API mocking
- GraphQL editor
- Fake/mock data generator

### Web / SEO / Network

- DNS lookup / performance
- MX / SPF / DMARC / BIMI checks
- IP lookup / traceroute / subnet tools
- SSL checker
- Website speed / screenshot / source viewer
- Link analyzer / broken-link checker
- Sitemap and robots.txt generators
- Keyword tools
- SERP simulator
- Meta tag generator
- HTTP header viewer

## Product Differentiation

### Privacy-first local processing

Show a clear trust indicator whenever processing stays local:

> **Private: This file never leaves your device.**

### Better UX

- Drag-and-drop everywhere
- Batch processing
- Before/after file-size comparison
- Clear progress and cancellation
- Undo/redo where relevant
- Keyboard shortcuts
- Dark mode
- Mobile-friendly layouts
- No forced registration for basic tools
- Consistent controls across all tools

### Tool chaining

Allow an output to become the input of the next tool without downloading/re-uploading.

Examples:

- Video Compressor → Video Cutter → Caption Tool
- PDF Split → OCR → Text Export
- Image Resize → Compress → WebP
- Transcript → Cleaner → Chapters / Summary

### Browser workspace

Provide a temporary local workspace where files and outputs can be reused across tools during a session.

Potential later PWA/desktop version could retain workspace state more persistently.

## Core Principle

Build utilities people repeatedly search for and actually use. Prioritize **utility, speed, privacy, SEO demand, low operating cost and repeat workflows** over raw tool count.
