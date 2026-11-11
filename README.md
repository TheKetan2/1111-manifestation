# 11:11 Manifestation PWA

A static, installable Progressive Web App for reading 44 daily intentions, one at a time.

## Included
- Four categories: Health, Wealth, Career, Relationship
- One-wish-at-a-time reading flow
- Previous / Next and category navigation
- Reading progress stored locally in the browser
- Offline cache through a service worker
- Web app manifest and Android install icons
- Basic in-app reminder preference (best-effort; browser timers are not a reliable background alarm)

## Run locally
A PWA must be served over HTTPS or localhost; opening `index.html` directly as a `file://` URL will not enable installation or service workers.

With Python installed:
```bash
python -m http.server 8080
```
Then open `http://localhost:8080` in Chrome.

## Deploy free
Upload the contents of this folder to a static host with HTTPS, such as GitHub Pages, Netlify, or Cloudflare Pages. Keep the folder structure intact.

For GitHub Pages:
1. Create a repository.
2. Upload all files and the `icons` folder to the repository root.
3. In Settings → Pages, deploy from the `main` branch and `/ (root)`.
4. Open the published HTTPS URL on Android Chrome.
5. Use Chrome menu → Install app (or Add to Home screen).

## Important limitations
- Reading progress and settings are stored in this browser on this device. There is no cloud sync or account login.
- The reminder is not a guaranteed background notification. Android may suspend browser timers. For dependable scheduled notifications, use a native Android app or a push-notification service.
- To update the app after changing files, increment the cache version in `sw.js`.
