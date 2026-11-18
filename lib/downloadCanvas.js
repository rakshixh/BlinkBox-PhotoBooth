import { boothCopy } from '@/data/data';

export function downloadCanvas(canvas, layout) {
  canvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const extension = blob.type === 'image/jpeg' ? 'jpg' : 'png';
      link.download = createOutputFilename(layout, extension);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    },
    boothCopy.exportMimeType,
    boothCopy.exportQuality,
  );
}

function createOutputFilename(layout, extension) {
  const date = new Date();
  const two = (value) => String(value).padStart(2, '0');
  const three = (value) => String(value).padStart(3, '0');
  const timestamp = `${date.getFullYear()}${two(date.getMonth() + 1)}${two(date.getDate())}-${two(date.getHours())}${two(date.getMinutes())}${two(date.getSeconds())}${three(date.getMilliseconds())}`;
  const unique =
    globalThis.crypto?.randomUUID?.().slice(0, 6) ?? Math.random().toString(36).slice(2, 8);

  return boothCopy.outputFilenameTemplate
    .replace('{layout}', layout)
    .replace('{timestamp}', timestamp)
    .replace('{unique}', unique)
    .replace('{extension}', extension);
}
