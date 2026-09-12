import * as THREE from 'three';

/** Paper texture – warm ivory with subtle grain */
export function makePaperTexture(size = 512): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#EFE6D3';
  ctx.fillRect(0, 0, size, size);
  // noise grain
  for (let i = 0; i < 8000; i++) {
    const alpha = Math.random() * 0.04;
    ctx.fillStyle = `rgba(120,100,70,${alpha})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
  }
  // subtle horizontal fibers
  for (let i = 0; i < 60; i++) {
    ctx.strokeStyle = `rgba(160,130,90,${0.015 + Math.random() * 0.02})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * size);
    ctx.lineTo(size, Math.random() * size);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Wood texture – warm brown with grain lines */
export function makeWoodTexture(size = 512): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#8a6a45';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 60; i++) {
    ctx.strokeStyle = `rgba(60,40,20,${0.04 + Math.random() * 0.08})`;
    ctx.lineWidth = 0.8 + Math.random() * 2.5;
    ctx.beginPath();
    const y = Math.random() * size;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      size * 0.3, y + (Math.random() - 0.5) * 24,
      size * 0.7, y + (Math.random() - 0.5) * 24,
      size,       y + (Math.random() - 0.5) * 12
    );
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Fabric / ribbon texture – champagne gold weave */
export function makeFabricTexture(size = 256): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#C9A667';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < size; i += 4) {
    ctx.strokeStyle = 'rgba(160,120,60,0.12)';
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke();
    ctx.strokeStyle = 'rgba(200,160,80,0.08)';
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Wax seal texture – rough dusty rose */
export function makeWaxTexture(size = 128): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#B5473F';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 1200; i++) {
    const alpha = Math.random() * 0.12;
    const r = Math.random() > 0.5 ? 90 : 150;
    ctx.fillStyle = `rgba(${r},30,20,${alpha})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }
  // "T" glyph stamped in center
  ctx.fillStyle = 'rgba(255,220,200,0.25)';
  ctx.font = `bold ${size * 0.42}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('T', size / 2, size / 2);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

/** Tag texture – small ivory card with "For Tithi ✦" */
export function makeTagTexture(size = 256): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = size; c.height = size * 0.7;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#F7F1E7';
  ctx.fillRect(0, 0, c.width, c.height);
  // border
  ctx.strokeStyle = 'rgba(197,161,90,0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, c.width - 12, c.height - 12);
  // text
  ctx.fillStyle = '#18233A';
  ctx.font = `italic ${size * 0.13}px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('For Tithi ✦', c.width / 2, c.height / 2);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

/** Frosting texture for cake top */
export function makeFrostingTexture(size = 256): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#F3E9D8';
  ctx.fillRect(0, 0, size, size);
  // swirl marks
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = `rgba(200,170,130,${0.08 + Math.random() * 0.06})`;
    ctx.lineWidth = 2 + Math.random() * 3;
    ctx.beginPath();
    const cx = Math.random() * size, cy = Math.random() * size;
    ctx.arc(cx, cy, 15 + Math.random() * 30, 0, Math.PI * 1.5);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}
