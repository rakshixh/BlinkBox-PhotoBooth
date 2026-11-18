import { stripSettings } from '@/data/data';
import { addVignette, applyFilmEffects, drawBackdropPattern } from '@/lib/canvasPhotoEffects';
import { downloadCanvas } from '@/lib/downloadCanvas';
import { formatPhotoDate } from '@/lib/formatPhotoDate';

export async function exportPhotoDesign({
  images,
  format,
  filter,
  background,
  caption,
  includeDate,
  captionStyle,
}) {
  if (images.length === 0) return;
  if (format === 'photo') {
    await downloadBarePhoto(images[0], filter);
    return;
  }

  const canvas = document.createElement('canvas');
  const singlePhoto = format === 'polaroid';
  const settings = singlePhoto ? stripSettings.polaroid : stripSettings;
  const { width, height, padding, gap = 0, photoHeight } = settings;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  const rootStyles = getComputedStyle(document.documentElement);
  context.fillStyle = rootStyles.getPropertyValue(background.baseToken).trim();
  context.fillRect(0, 0, width, height);
  drawBackdropPattern(context, background, rootStyles, width, height);

  const photoWidth = width - padding * 2;
  for (let index = 0; index < images.length; index += 1) {
    const image = await loadImage(images[index]);
    const x = padding;
    const y = padding + index * (photoHeight + gap);
    const scale = Math.max(photoWidth / image.width, photoHeight / image.height);
    const cropWidth = photoWidth / scale;
    const cropHeight = photoHeight / scale;
    const sourceX = (image.width - cropWidth) / 2;
    const sourceY = (image.height - cropHeight) / 2;

    context.save();
    context.beginPath();
    context.rect(x, y, photoWidth, photoHeight);
    context.clip();
    context.filter = filter.css;
    context.drawImage(
      image,
      sourceX,
      sourceY,
      cropWidth,
      cropHeight,
      x,
      y,
      photoWidth,
      photoHeight,
    );
    context.restore();

    if (filter.grade || filter.grain > 0) {
      applyFilmEffects(context, x, y, photoWidth, photoHeight, {
        grade: filter.grade,
        grain: filter.grain,
        seed: index + 1,
      });
    }
    if (filter.vignette > 0)
      addVignette(context, x, y, photoWidth, photoHeight, filter.vignette, rootStyles);
  }

  drawCaption(context, {
    width,
    height,
    padding,
    background,
    includeDate,
    caption,
    captionStyle,
    rootStyles,
  });
  downloadCanvas(canvas, singlePhoto ? 'polaroid' : 'strip');
}

function drawCaption(
  context,
  { width, height, padding, background, includeDate, caption, captionStyle, rootStyles },
) {
  context.fillStyle = rootStyles.getPropertyValue(background.inkToken).trim();
  context.textBaseline = 'middle';
  const rootFontSize = Number.parseFloat(rootStyles.fontSize);
  const stampFontSize =
    Number.parseFloat(rootStyles.getPropertyValue('--font-export-stamp')) * rootFontSize;
  const metaFontSize =
    Number.parseFloat(rootStyles.getPropertyValue('--font-export-meta')) * rootFontSize;
  const captionFont = rootStyles.getPropertyValue(captionStyle.fontToken).trim();
  const dateStamp = includeDate ? formatPhotoDate() : '';
  const fullCaptionWidth = width - padding * 2;
  const dateFont = `${captionStyle.fontStyle} ${metaFontSize}px ${captionFont}`;
  let captionMaxWidth = fullCaptionWidth;

  if (includeDate) {
    context.font = dateFont;
    captionMaxWidth = Math.max(1, fullCaptionWidth - context.measureText(dateStamp).width - 16);
  }

  context.font = `${captionStyle.fontStyle} 500 ${stampFontSize}px ${captionFont}`;
  context.textAlign = 'left';
  if (caption.trim()) context.fillText(caption.trim(), padding, height - 41, captionMaxWidth);

  if (includeDate) {
    context.textAlign = 'right';
    context.font = dateFont;
    context.fillText(dateStamp, width - padding, height - 41);
  }
}

async function downloadBarePhoto(source, filter) {
  const image = await loadImage(source);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.filter = filter.css;
  context.drawImage(image, 0, 0);
  context.restore();

  if (filter.grade || filter.grain > 0) {
    applyFilmEffects(context, 0, 0, canvas.width, canvas.height, {
      grade: filter.grade,
      grain: filter.grain,
    });
  }
  if (filter.vignette > 0) addVignette(context, 0, 0, canvas.width, canvas.height, filter.vignette);
  downloadCanvas(canvas, 'photo');
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}
