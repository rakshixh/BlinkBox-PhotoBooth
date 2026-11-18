<p align="center">
  <img src="app/icon.svg" alt="BlinkBox Photo Booth icon" width="88" height="88" />
</p>

<h1 align="center">BlinkBox Photo Booth</h1>

<p align="center">
  Vintage-inspired photo keepsakes, made right on your device.
</p>

<p align="center">
  <a href="https://github.com/rakshixh/BlinkBox-PhotoBooth">View the project on GitHub</a>
</p>

---

BlinkBox helps you give your favorite photos a vintage feel. Choose a filter, then download a single photo, a Polaroid, or a three-photo strip as a JPEG. Your photos stay on your device and are never uploaded.

## Make a keepsake

| Format | Photos | What you get |
| --- | ---: | --- |
| **Single photo** | 1 | A filtered JPEG with no added frame or background. |
| **Polaroid** | 1 | A framed print with a choice of background, caption, caption style, and optional date. |
| **3-photo strip** | 3 | A three-frame print with a choice of background, caption, caption style, and optional date. |

All formats include the film filter picker. Photos can be selected from your device or captured with your camera. For a strip, choose three photos at once or tap a frame in the preview to replace it.

## Highlights

- **Twelve film looks**, from natural color to vintage-inspired tones.
- **Four print backgrounds** and **four patterned backgrounds** for Polaroids and strips.
- **Four caption styles**, with an optional date on print formats.
- **JPEG downloads** rendered in the browser at high export quality.
- **Responsive layout** for phones, tablets, and desktop browsers.
- **Installable PWA** with a standalone home-screen experience on supported browsers.
- **Offline revisit support** after the app has been opened online and its shell and assets have been cached.

## Privacy and offline use

BlinkBox has no photo upload service or account system. Selected and captured photos stay in the current browser session while you edit and export them. The service worker caches the app shell and same-origin app assets for offline revisits; it does not cache your photos.

The first visit needs a network connection to load the app and prepare its offline cache. Offline availability depends on the browser retaining its cache. The service worker is enabled in production, not in the development server.

Camera access requires a secure browser context: use `localhost` while developing and HTTPS when deployed.

### Add BlinkBox to your home screen

Open the deployed site in a supported browser and use its install option. On iPhone or iPad, open BlinkBox in Safari, tap **Share**, then choose **Add to Home Screen**. Browser menus and install prompts vary by platform.

## Run locally

You’ll need Node.js and npm installed.

```bash
git clone https://github.com/rakshixh/BlinkBox-PhotoBooth.git
cd BlinkBox-PhotoBooth
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To run the production build locally, which enables the production service worker:

```bash
npm run build
npm run start
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create the production build. |
| `npm run start` | Serve the production build. |
| `npm run format` | Format JavaScript, JSON, SCSS, and Markdown files with Prettier. |

## Project structure

```text
app/                  Next.js routes, page metadata, manifest, and global styles
components/           Photo booth UI, previews, controls, and reusable pickers
data/data.js          App copy, filters, backgrounds, caption styles, and print sizes
hooks/                Photo booth session and offline app-cache hooks
lib/                  Photo effects, JPEG export, downloads, and date formatting
public/               Service worker and installable app icons
styles/
  _tokens.scss        Shared color, typography, and font-family tokens
  _variables.scss     Shared spacing, borders, sizes, tracking, and breakpoints
  _mixins.scss        Responsive breakpoint mixins
```

## Contributing

Contributions and feedback are welcome. Open an issue or submit a pull request in the [BlinkBox Photo Booth repository](https://github.com/rakshixh/BlinkBox-PhotoBooth).

## License

BlinkBox is released under the [MIT License](LICENSE).
