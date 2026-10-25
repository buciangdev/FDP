import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT ?? process.env.API_PORT ?? 3001);
const HOST = process.env.HOST ?? (process.env.PORT ? '0.0.0.0' : '127.0.0.1');
const MAX_REQUEST_SIZE = 16 * 1024 * 1024;
const DIST_DIRECTORY = resolve(fileURLToPath(new URL('./dist/', import.meta.url)));
const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};
const GEMINI_PROMPT = `Act as an expert aviation schedule OCR reader. Read this airline flight roster schedule screenshot carefully.
Extract all duty days with the exact format:
[Date Header like "10 Thu"]
Reporting time : HHMM
[FlightNo] [DepTime] [DepIATA] [ArrIATA] [ArrTime] [DHC if positioning]
Debriefing time : HHMM
Rest : HH:MM (Date HH:MM)

Output ONLY the plain text formatted schedule lines, with no markdown code blocks, no explanation.`;

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

async function serveFrontend(request, response, pathname) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    sendJson(response, 400, { error: 'Invalid URL path' });
    return;
  }

  const requestedFile = resolve(DIST_DIRECTORY, `.${decodedPath}`);
  if (
    requestedFile !== DIST_DIRECTORY &&
    !requestedFile.startsWith(`${DIST_DIRECTORY}${sep}`)
  ) {
    sendJson(response, 400, { error: 'Invalid URL path' });
    return;
  }

  let filePath = requestedFile;
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      throw Object.assign(new Error('Not a file'), { code: 'ENOENT' });
    }
  } catch (error) {
    if (
      error.code !== 'ENOENT' ||
      !request.headers.accept?.includes('text/html') ||
      extname(decodedPath)
    ) {
      sendJson(response, error.code === 'ENOENT' ? 404 : 500, { error: 'Not found' });
      return;
    }
    filePath = resolve(DIST_DIRECTORY, 'index.html');
  }

  try {
    const content = await readFile(filePath);
    const contentType = CONTENT_TYPES[extname(filePath)] ?? 'application/octet-stream';
    response.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': extname(filePath) === '.html' ? 'no-cache' : 'public, max-age=3600',
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    console.error('Failed to serve frontend file:', error instanceof Error ? error.name : 'unknown error');
    sendJson(response, 500, { error: 'Unable to serve frontend' });
  }
}

async function readJson(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_REQUEST_SIZE) {
      const error = new Error('Request body is too large');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Request body must be valid JSON');
    error.statusCode = 400;
    throw error;
  }
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  if (requestUrl.pathname !== '/api/gemini') {
    if (requestUrl.pathname.startsWith('/api/')) {
      sendJson(response, 404, { error: 'Not found' });
      return;
    }
    await serveFrontend(request, response, requestUrl.pathname);
    return;
  }

  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed' });
    return;
  }

  if (!request.headers['content-type']?.startsWith('application/json')) {
    sendJson(response, 415, { error: 'Content-Type must be application/json' });
    return;
  }

  if (Number(request.headers['content-length']) > MAX_REQUEST_SIZE) {
    sendJson(response, 413, { error: 'Request body is too large' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    sendJson(response, 503, { error: 'GEMINI_API_KEY is not configured on the server' });
    return;
  }

  let body;
  try {
    body = await readJson(request);
  } catch (error) {
    sendJson(response, error.statusCode ?? 400, { error: error.message });
    return;
  }

  const { imageBase64, mimeType } = body ?? {};
  if (
    typeof imageBase64 !== 'string' ||
    imageBase64.length === 0 ||
    imageBase64.length > MAX_REQUEST_SIZE ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(imageBase64) ||
    !['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)
  ) {
    sendJson(response, 400, { error: 'A valid base64 image and supported MIME type are required' });
    return;
  }

  try {
    const geminiUrl = new URL(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent'
    );

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { text: GEMINI_PROMPT },
            { inlineData: { mimeType, data: imageBase64 } }
          ]
        }]
      })
    });

    if (!geminiResponse.ok) {
      console.error(`Gemini API returned HTTP ${geminiResponse.status}`);
      sendJson(response, 502, { error: 'Gemini API request failed' });
      return;
    }

    const result = await geminiResponse.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== 'string' || text.length === 0) {
      sendJson(response, 502, { error: 'Gemini API returned no schedule text' });
      return;
    }

    sendJson(response, 200, { text });
  } catch (error) {
    console.error('Gemini API request failed:', error instanceof Error ? error.name : 'unknown error');
    sendJson(response, 502, { error: 'Gemini API request failed' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`FDP server listening on http://${HOST}:${PORT}`);
});
