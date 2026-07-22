# Marginalia

*Marginalia: notes written in the margins of a book.* A React frontend for a
Retrieval-Augmented Generation (RAG) API — upload documents, then ask
questions and get answers grounded in their content, with clickable source
citations back to the text and multi-turn conversation context.

Backend: [simple-rag-backend](https://github.com/agamarnik/simple-rag-backend)

## Features

- **Document upload** — PDF, TXT, and MD files, routed to the right backend
  endpoint automatically based on file type
- **Chat with citations** — every assistant answer lists which documents it
  was sourced from
- **Multi-turn conversations** — follow-up questions resolve context (e.g.
  "why did it end?" correctly resolves against a prior question) via the
  backend's query-rewriting
- **Markdown-rendered responses** — lists, bold text, and other formatting in
  answers render properly rather than showing raw syntax

## Tech stack

- React + Vite
- [react-markdown](https://github.com/remarkjs/react-markdown) for rendering
  assistant responses
- Plain CSS (no framework)

## Setup

Requires Node 18+.

```
bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

### Environment variables

Create a `.env` file in the project root:

`VITE_API_KEY=your-api-key-here`

This is required — the app sends it as an `X-API-Key` header on every
request to the backend. `.env` is already gitignored.

### Connecting to the backend

This app is built against
[simple-rag-backend](https://github.com/agamarnik/simple-rag-backend),
expected running locally at `http://127.0.0.1:8000` by default (see
`App.jsx` for the base URL). It calls:

- `POST /query` — `{ question, conversation_id }` → `{ answer, sources, conversation_id }`
- `POST /upload` — `{ source, content }` for text/markdown files
- `POST /upload-pdf` — multipart file upload for PDFs
- `GET /documents` - fetch all uploaded documents
- `DELETE /documents/source` - delete a document

Make sure the backend is running and has CORS configured to allow requests
from `http://localhost:5173` before testing locally.

## Project structure
```
src/
├── App.jsx                    Top-level state and handler functions
components/
├── Header.jsx                 Static app header
├── Sidebar.jsx                Document upload + list
├── MessageList.jsx            Scrolling chat history, markdown + citations
├── ChatComposer.jsx           Question input + submit button
```

## Building for deployment

```
bash
npm run build
```

Outputs a static site to `dist/`, deployable to any static host (Netlify,
Vercel, GitHub Pages). Note the backend also needs to be reachable from
wherever this is hosted, with CORS updated accordingly.
