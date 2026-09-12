// ─── Pure Canvas Confetti Utility (Zero external dependencies) ───────
export function triggerCelebrationConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    vRot: number;
    alpha: number;
  }[] = [];

  const colors = ['#ffe5a4', '#f2b5a5', '#e8c872', '#a5b4fc', '#ffffff', '#fb7185'];

  for (let i = 0; i < 90; i++) {
    const angle = (Math.PI / 4) + Math.random() * (Math.PI / 2);
    const speed = 6 + Math.random() * 10;
    particles.push({
      x: window.innerWidth * (0.3 + Math.random() * 0.4),
      y: window.innerHeight * 0.6,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.sin(angle) * speed,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      alpha: 1,
    });
  }

  let startTime = performance.now();

  function animate(now: number) {
    const elapsed = (now - startTime) / 1000;
    ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let active = false;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // air drag
      p.rotation += p.vRot;
      p.alpha = Math.max(0, 1 - elapsed / 2.8);

      if (p.alpha > 0.01) {
        active = true;
        ctx!.save();
        ctx!.globalAlpha = p.alpha;
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx!.restore();
      }
    }

    if (active && elapsed < 3.2) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(animate);
}
