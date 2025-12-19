// src/components/adventure2d/effects/particles.ts
export type Vec2 = { x: number; y: number };

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // seconds
  age: number; // seconds
  size: number;
  gravity: number;
  drag: number; // 0..1
  color: string;
  alpha: number;
};

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export function createParticles() {
  const list: Particle[] = [];

  function spawnBurst(
    pos: Vec2,
    opts?: {
      count?: number;
      speed?: [number, number];
      life?: [number, number];
      size?: [number, number];
      gravity?: number;
      drag?: number;
      color?: string;
      spread?: number; // radians
      dir?: number; // center direction in radians
      alpha?: [number, number];
    }
  ) {
    const count = opts?.count ?? 16;
    const speed = opts?.speed ?? [80, 220];
    const life = opts?.life ?? [0.25, 0.6];
    const size = opts?.size ?? [2, 4];
    const gravity = opts?.gravity ?? 280;
    const drag = opts?.drag ?? 0.06;
    const color = opts?.color ?? '#ffffff';
    const spread = opts?.spread ?? Math.PI * 2;
    const dir = opts?.dir ?? 0;
    const alpha = opts?.alpha ?? [0.75, 1];

    for (let i = 0; i < count; i++) {
      const a = dir + rand(-spread / 2, spread / 2);
      const sp = rand(speed[0], speed[1]);
      const vx = Math.cos(a) * sp;
      const vy = Math.sin(a) * sp;

      list.push({
        x: pos.x,
        y: pos.y,
        vx,
        vy,
        life: rand(life[0], life[1]),
        age: 0,
        size: rand(size[0], size[1]),
        gravity,
        drag,
        color,
        alpha: rand(alpha[0], alpha[1]),
      });
    }
  }

  // bụi khi chạy (nhẹ, hướng ngược lại)
  function spawnDust(pos: Vec2, dirRad: number) {
    spawnBurst(pos, {
      count: 3,
      speed: [30, 70],
      life: [0.18, 0.35],
      size: [2, 3],
      gravity: 160,
      drag: 0.12,
      color: 'rgba(255,255,255,0.7)',
      spread: Math.PI / 2,
      dir: dirRad + Math.PI, // ngược hướng chạy
      alpha: [0.3, 0.6],
    });
  }

  // spark khi hit
  function spawnHit(pos: Vec2) {
    spawnBurst(pos, {
      count: 18,
      speed: [120, 320],
      life: [0.2, 0.5],
      size: [2, 5],
      gravity: 420,
      drag: 0.04,
      color: '#fbbf24',
      spread: Math.PI * 2,
      alpha: [0.7, 1],
    });
  }

  // nổ nhẹ khi win/lose
  function spawnConfetti(pos: Vec2) {
    const colors = ['#60a5fa', '#a78bfa', '#34d399', '#f472b6', '#fbbf24'];
    for (let i = 0; i < 5; i++) {
      spawnBurst(pos, {
        count: 14,
        speed: [90, 260],
        life: [0.5, 1.1],
        size: [2, 4],
        gravity: 260,
        drag: 0.02,
        color: colors[i],
        spread: Math.PI * 2,
        alpha: [0.7, 1],
      });
    }
  }

  function update(dt: number) {
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.age += dt;
      if (p.age >= p.life) {
        list.splice(i, 1);
        continue;
      }

      // physics
      p.vx *= 1 - p.drag;
      p.vy *= 1 - p.drag;
      p.vy += p.gravity * dt;

      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  function draw(ctx: CanvasRenderingContext2D, cam: Vec2) {
    for (const p of list) {
      const t = p.age / p.life;
      const fade = 1 - t;

      ctx.globalAlpha = p.alpha * fade;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x - cam.x, p.y - cam.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  return {
    update,
    draw,
    // events
    spawnDust,
    spawnHit,
    spawnConfetti,
    // generic
    spawnBurst,
    // debug
    count: () => list.length,
  };
}
