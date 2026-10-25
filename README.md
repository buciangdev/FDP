# FDP Online

## Gemini API key

Copy `.env.example` to `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Keep `.env` private. The key is read by the local server and is not included in
the browser bundle. Never use a `VITE_` prefix for this secret.

## Run locally

Use Node.js 20.6 or newer. In one terminal, start the Gemini API server:

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

## Build

```sh
npm run build
```

For deployment, run the API server with `GEMINI_API_KEY` configured in the
server environment and route `/api` requests to it. Do not put the key in
frontend hosting settings or ship it with static assets.
