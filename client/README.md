# Guidra Client

The frontend is a React 19 application built with Vite and Material UI.

## Development

From this directory:

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `client/.env` to the backend URL when the API is not served from the same origin. This is used by the Vite dev server. Docker builds default to `/`, which uses Nginx to proxy `/api/` requests to the backend service.

## Production Build

```bash
npm run build
npm run preview
```

The application uses route-level lazy loading. Heavy learning and diagram dependencies are loaded when the user opens the learning experience rather than during the initial landing page load.

The Vite PWA configuration caches static assets and selected content-cache responses for offline use. User authentication, profile, progress, and preference responses are intentionally excluded from browser offline caching.

## Main Routes

- `/` and `/login`: landing and authentication
- `/explore`: browse or create learning topics
- `/learn`: structured lessons and recall mode
- `/custom-topic`: create a custom learning path
- `/study-timer`: focus timer
- `/profile`: profile, progress, and account security
- `/settings`: preferences, appearance, timer visibility, and password management

## Quality Checks

```bash
npm run lint
npm run build
```

The repository currently contains existing ESLint issues outside the recent optimization changes; the production build remains the primary release check until those are addressed.
