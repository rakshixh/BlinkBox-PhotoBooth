# blinkbox — your little memory machine

**blinkbox** catches the in-between moments and turns them into keepsakes. Upload one photo for a Polaroid or three for a film-style strip, choose a film look and backdrop, add a note, and save the finished image. Photos are processed in your browser and stay on your device.

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Camera access requires a secure context, so use localhost for local development and HTTPS when deployed.

## Scripts

- `npm run dev` starts the development server.
- `npm run build` creates the production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint.
- `npm run format` formats the project with Prettier.

## Project layout

```text
app/                         Next.js App Router entry and global styles
  icon.svg                   blinkbox app icon
components/                  UI components; each owns a JSX file and SCSS module
  BrandMark/                 Custom blinkbox instant-frame logo
  BoothArtifact/             Illustrated three-frame keepsake in the hero
  BoothHeader/
  BackdropPicker/
  CaptureControls/
  CustomizePanel/
  FilterGallery/
  PhotoBooth/
  StripCustomization/
  StripPreview/
data/data.js                 UI copy, filter presets, strip settings, and icons
lib/formatPhotoDate.js       Shared photo strip date stamp formatter
styles/_tokens.scss          Shared color, type, and font-family tokens
styles/_mixins.scss          Shared responsive breakpoints
```

Filter presets, patterned and plain backgrounds, print edges, and strip dimensions live in `data/data.js`. Shared design tokens and responsive breakpoints live in `styles/`. The customization drawer groups the controls into Background, Film, and Print sections and becomes a bottom sheet on mobile. For one photo, turning off the background exports only the filtered image. The blinkbox logo is a custom instant-frame and flash mark, also used as the app icon.
