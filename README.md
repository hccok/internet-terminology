# Internet Terminology 🌐

互联网打工牛马的那些话 — A PWA glossary for internet workers.

Look up industry jargon, abbreviations, and slang across programming, e-commerce, office meetings, business emails, and daily chat. 354 terms, fully offline.

**[Live Demo](https://hccok.github.io/internet-terminology/)**

## Features

- **Fuzzy search** — match by term, alias, full name, or meaning in Chinese/English
- **5 categories** — Programming, E-commerce, Office Lingo, Email Abbreviations, Chat Slang
- **PWA offline** — Service Worker cache, no network needed after first visit
- **Favorites** — bookmark terms with localStorage persistence
- **Web Speech** — built-in pronunciation for English terms and abbreviations
- **User contributions** — add, edit, or delete your own terms (stored locally)
- **Dark theme** — glass-morphism cards with animated starfield background

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vue 3 (Composition API) |
| Build | Vite 5 |
| UI | Vant 4 + custom glass-morphism |
| PWA | vite-plugin-pwa |
| Data | Static JSON (zero backend) |

## Development

```bash
npm --prefix dev-terms-101 install
npm --prefix dev-terms-101 run dev
```

Build:

```bash
npm --prefix dev-terms-101 run build
```

## License

MIT
