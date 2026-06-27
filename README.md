# Quran Studio

A caption studio for turning Qur'an verses into transparent-PNG cards for video
creators. Pick a surah and ayah range, choose a canvas size, style the Arabic
caption, and the verse is auto-split into cards you can fine-tune and export as
transparent PNGs.

Built with **Vite + React**. The UI is a port of the Quran Studio design canvas;
the data, fonts, and export pipeline are ported from the production
`ayah-share` app so the output is real (not a mockup).

## Getting started

```bash
npm install
npm run dev      # then open the URL Vite prints
npm run build    # production build into dist/
npm run preview  # preview the production build
```

The QCF fonts (`public/fonts`, ~142 MB) are required for the glyph fonts to
render and for export.

## What's real (ported from ayah-share)

- **quran.com API v4** (`src/quran/client.js`) — no key. All 114 chapters, plus
  per-verse word/glyph or unicode text fetched with bounded concurrency.
- **Font drivers** (`src/fonts/`) — four font types behind one interface, each
  emitting generic `Token { text, family, isEnd, … }`:
  - **QCF2 / QCF1** (glyph path): words are fetched as page-specific *glyph
    codes* (`code_v2`/`code_v1`), not readable Arabic. Each Mushaf page (1–604)
    has its own woff2, loaded at runtime via `FontFace` + a base64 data URL
    (also embedded into the export SVG). Using the wrong page font yields
    garbage glyphs — so the page font is selected per word.
  - **Uthmani / IndoPak** (unicode path): a single woff2; verse text is fetched
    via `text_uthmani`/`text_indopak` with the ayah-end ornament embedded.
- **Measurement + splitting** (`src/caption/`) — a canvas measurer sizes every
  token; the verse range is greedily wrapped into lines, then grouped into cards
  of *lines-per-card* lines (cards may span ayahs; boundary words are nudgeable).
- **Export** (`src/export/`) — `html-to-image`'s `toSvg` + a manual canvas draw
  (deliberately not `toPng`, which hangs on large SVGs) → a transparent PNG at
  the exact canvas resolution. Single card downloads directly; **Export files**
  rasterizes every card and downloads a ZIP (JSZip + file-saver).

## Design decisions / deviations from the mockup

- **Font type is global** (it drives the API fetch + font loading), matching how
  the production app works. Per-card overrides cover **size, color, and line
  height** — mixing QCF page-fonts per card would require re-fetching glyph
  codes per card.
- **Native ayah-end ornaments** from the real fonts are used instead of the
  mockup's drawn badge — authentic to the Mushaf and consistent with "same
  fonts".

## Project structure

```
src/
  data.js            Themes, presets, colors, font-type list
  studio.js          Preset + background + fit-to-stage helpers
  StudioContext.jsx  State, async load pipeline (fetch→fonts→measure→split), export
  quran/client.js    quran.com API v4 client
  fonts/             pageFonts (QCF), unicodeFonts, drivers
  caption/           measure (canvas), splitter (wrap + card grouping)
  export/            png (toSvg+canvas), zip, filename
  components/
    TopBar, LeftRail, panels/{Size,Verses,Style}Panel,
    Stage, Filmstrip, CardInspector, CaptionFrame, ExportLayer, Toast, ui
public/fonts/        hafs/v{1,2}/woff2/p1..p604, uthmanic-hafs, indopak
```

The original design is kept at `design/Quran Studio.dc.html` for reference.
