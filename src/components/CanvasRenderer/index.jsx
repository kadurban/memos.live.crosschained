import React, {useEffect} from 'react';

const cardWidth = 320;
const cardHeight = 450;
const imageSize = 260;

async function createPreview({ imageUrl }) {
  const canvas = document.getElementById('marketPreview');
  const canvasResizer = document.getElementById('resizer');
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(cardWidth/2, cardHeight/2, 20, cardWidth/2, cardHeight/2, 390);
  ctx.beginPath();
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.28, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.72, 'rgba(228,205,105,1)');
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.roundRect(0, 0, cardWidth, cardHeight, 32);
  ctx.fill();
  ctx.closePath();
  await resizeMainImage(canvasResizer, imageUrl);

  ctx.beginPath();
  const image = new Image();
  image.src = canvasResizer.toDataURL();
  image.onload = function() {
    ctx.drawImage(image, (cardWidth - imageSize) / 2, 85, imageSize, imageSize);
  };
  ctx.closePath();

  ctx.fill();
}

async function resizeMainImage(canvas, imageUrl) {
  return new Promise(resolve => {

    const ctxResizer = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      const ratioX = canvas.offsetWidth / img.width;
      const ratioY = canvas.offsetHeight / img.height;
      const ratio = ratioX < ratioY ? ratioX : ratioY;

      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      if (ratioX <= ratioY) {
        const sizesDiff = Math.abs(newWidth - newHeight);
        ctxResizer.drawImage(img, -sizesDiff / 2, 0, newWidth + sizesDiff, newHeight + sizesDiff);
      }
      if (ratioX > ratioY) {
        const sizesDiff = Math.abs(newWidth - newHeight);
        ctxResizer.drawImage(img, 0, 0 - sizesDiff / 2, imageSize, newHeight + sizesDiff);
      }
      ctxResizer.save();
      ctxResizer.globalCompositeOperation = 'destination-in';
      ctxResizer.beginPath();
      ctxResizer.arc(canvas.offsetWidth/2, canvas.offsetHeight/2, canvas.offsetWidth/2, 0, 2 * Math.PI, false);
      ctxResizer.fill();
      ctxResizer.restore();
      resolve();
    };
    img.src = imageUrl;
  });
}

function CanvasRenderer(props) {
  useEffect(() => {
    createPreview({
      imageUrl: props.imageUrl
    });
  });

  return (
    <>
      <canvas id="resizer" width={imageSize} height={imageSize} style={{ position: 'absolute', transform: 'scale(0)', pointerEvents: 'none', zIndex: -1000 }}/>
      <canvas id="marketPreview" width={cardWidth} height={cardHeight}/>
    </>
  );
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  return this;
}

export default CanvasRenderer;
