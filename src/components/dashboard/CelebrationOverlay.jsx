import { useRef, useEffect } from 'react';
import { playCelebration } from '../../utils/sounds.js';

export default function CelebrationOverlay({ active, onDone }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    playCelebration();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#639922', '#97C459', '#EAF3DE', '#F5C87A', '#5DCAA5', '#FDEBD0'];
    const particles = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.4 - canvas.height * 0.1,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 1,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.005 + Math.random() * 0.01,
      });
    }

    const startTime = Date.now();
    const duration = 3000;

    function draw() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Global fade out in last 30%
      const globalAlpha = progress > 0.7 ? 1 - ((progress - 0.7) / 0.3) : 1;

      particles.forEach((p) => {
        p.x += p.vx;
        p.vy += 0.05;
        p.y += p.vy;
        p.alpha = Math.max(0, p.alpha - p.decay);

        ctx.globalAlpha = p.alpha * globalAlpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (progress < 1) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        onDone?.();
      }
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active, onDone]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
}
