# FDP Online

## Gemini API key

Copy `.env.example` to `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Keep `.env` private. The key is read by the local server and is not included in
the browser bundle. Never use a `VITE_` prefix for this secret.

## Run locally

Use Node.js 20.6 or newer. For local development, start the Gemini API server:

```sh
npm run server
```

In a second terminal, start the web app:

```sh
npm run dev
```

The development server forwards `/api` requests to the local API server. If
`GEMINI_API_KEY` is missing or Gemini is unavailable, roster scanning falls
back to local OCR.

## Deploy to Cloud Run

Deploy from the repository root (the directory containing `package.json`) on
the `master` branch. The build creates the frontend, and `npm start` serves it
alongside the Gemini API. Cloud Run provides the `PORT` environment variable;
set `GEMINI_API_KEY` as a server-side Cloud Run secret, not as a frontend
build variable. Never commit `.env` or put the key in source code.
