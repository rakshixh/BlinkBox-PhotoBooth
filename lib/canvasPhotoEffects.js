export function drawBackdropPattern(context, backdrop, rootStyles, width, height) {
  const accent = rootStyles.getPropertyValue(backdrop.accentToken).trim();
  if (backdrop.pattern === 'dots') {
    context.fillStyle = accent;
    for (let y = 14; y < height; y += 28) {
      for (let x = 14; x < width; x += 28) {
        context.beginPath();
        context.arc(x, y, 2.2, 0, Math.PI * 2);
        context.fill();
      }
    }
  } else if (backdrop.pattern === 'stars') {
    context.fillStyle = accent;
    for (let y = 16; y < height; y += 34) {
      for (let x = y % 68 ? 16 : 33; x < width; x += 34) drawStar(context, x, y, 5, 6, 2.5);
    }
  } else if (backdrop.pattern === 'velvet' || backdrop.pattern === 'curtain') {
    const spacing = backdrop.pattern === 'velvet' ? 135 : 105;
    for (let x = 0; x < width; x += spacing) {
      const fold = context.createLinearGradient(x, 0, x + spacing * 0.55, 0);
      fold.addColorStop(0, rootStyles.getPropertyValue('--transparent').trim());
      fold.addColorStop(0.35, accent);
      fold.addColorStop(1, rootStyles.getPropertyValue('--transparent').trim());
      context.fillStyle = fold;
      context.fillRect(x, 0, spacing * 0.75, height);
    }
  }
}

export function applyFilmEffects(context, x, y, width, height, { grade, grain = 0, seed = 1 }) {
  const pixels = context.getImageData(x, y, width, height);
  const data = pixels.data;
  let noiseValue = seed * 7919;

  for (let index = 0; index < data.length; index += 4) {
    if (grade) {
      const luminance =
        (data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722) / 255;
      if (grade === 'fxn-r') {
        const highlights = luminance;
        const shadows = 1 - luminance;
        data[index] += 5 * highlights - 2 * shadows;
        data[index + 1] += 2 * highlights + 3 * shadows;
        data[index + 2] -= 4 * highlights - 5 * shadows;
      } else if (grade === 'classic-u') {
        data[index] = (data[index] - 128) * 1.08 + 128 + 5;
        data[index + 1] = (data[index + 1] - 128) * 1.06 + 128 + 1;
        data[index + 2] = (data[index + 2] - 128) * 1.04 + 128 - 5;
      } else if (grade === 's67-fc100') {
        const highlights = luminance;
        const shadows = 1 - luminance;
        data[index] += 2 * highlights + 3 * shadows;
        data[index + 1] -= highlights;
        data[index + 2] += 5 * highlights + 7 * shadows;
      }

      data[index] = Math.max(0, Math.min(255, data[index]));
      data[index + 1] = Math.max(0, Math.min(255, data[index + 1]));
      data[index + 2] = Math.max(0, Math.min(255, data[index + 2]));
    }

    if (grain > 0) {
      noiseValue = (noiseValue * 16807) % 2147483647;
      const noise = (noiseValue / 2147483647 - 0.5) * grain * 105;
      data[index] = Math.max(0, Math.min(255, data[index] + noise));
      data[index + 1] = Math.max(0, Math.min(255, data[index + 1] + noise));
      data[index + 2] = Math.max(0, Math.min(255, data[index + 2] + noise));
    }
  }
  context.putImageData(pixels, x, y);
}

export function addVignette(
  context,
  x,
  y,
  width,
  height,
  strength,
  rootStyles = getComputedStyle(document.documentElement),
) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const radius = Math.hypot(width / 2, height / 2);
  const vignette = context.createRadialGradient(
    centerX,
    centerY,
    radius * 0.38,
    centerX,
    centerY,
    radius,
  );
  const ink = rootStyles.getPropertyValue('--film-vignette-ink').trim();
  vignette.addColorStop(0, rootStyles.getPropertyValue('--transparent').trim());
  vignette.addColorStop(0.72, withAlpha(ink, strength * 0.35));
  vignette.addColorStop(1, withAlpha(ink, strength));
  context.fillStyle = vignette;
  context.fillRect(x, y, width, height);
}

function drawStar(context, centerX, centerY, points, outerRadius, innerRadius) {
  context.beginPath();
  for (let point = 0; point < points * 2; point += 1) {
    const angle = (Math.PI * point) / points - Math.PI / 2;
    const radius = point % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (point === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
  context.fill();
}

function withAlpha(hexColor, alpha) {
  const hex = hexColor.replace('#', '');
  const alphaHex = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${hex}${alphaHex}`;
}
