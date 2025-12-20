'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRafLoop } from './useRafLoop';
import { createCameraShake } from './effects/cameraShake';
import { createParticles } from './effects/particles';

import QuizModal, { QuizQuestion } from './quiz/QuizModal';
import { MATH_QUESTIONS, SOCIAL_QUESTIONS } from './quiz/quizData';
import { useQuizBank } from './quiz/useQuiz';

import { applyReward, type Reward } from './engine/rewards';
import { dealDamageToBoss } from './engine/combat';

import {
  TILE,
  MAP,
  MAP_W,
  MAP_H,
  isWall,
  floorTypeAt,
  findFirstOpenTile,
} from './engine/mapData';

import StatusBar from './ui/StatusBar';
import Boss from './entities/Boss';

type Vec2 = { x: number; y: number };

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function dist(a: Vec2, b: Vec2) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

type GameStatus = 'PLAYING' | 'WIN' | 'LOSE';

type ChallengeType = 'MATH' | 'SOCIAL';
type Challenge = {
  id: string;
  type: ChallengeType;
  tx: number;
  ty: number;
  label: string;
  done: boolean;
};

export default function AdventureGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keys = useRef<Record<string, boolean>>({});

  const [running, setRunning] = useState(true);
  const [status, setStatus] = useState<GameStatus>('PLAYING');

  const [toast, setToast] = useState('WASD/Arrow để đi • E tương tác • J đánh');
  const toastTimer = useRef(2.5);

  const [coin, setCoin] = useState(0);

  // ✅ force re-render mỗi frame để UI 
  // overlay cập nhật theo ref
  const [, forceRender] = useState(0);

  // Quiz modal
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizContext, setQuizContext] = useState('Nhiệm vụ');
  const [quizPool, setQuizPool] = useState<QuizQuestion[]>([]);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(
    null
  );

  // Boss speech
  const [bossSpeech, setBossSpeech] = useState<string>('');
  const bossSpeechTimer = useRef(0);

  // Gate
  const [gateOpen, setGateOpen] = useState(false);
  const gate = useMemo(() => ({ tx: 13, ty: 6 }), []);

  // spawn
  const spawn = useMemo(() => findFirstOpenTile(), []);
  const player = useRef({
    pos: { x: (spawn.x + 0.5) * TILE, y: (spawn.y + 0.5) * TILE },
    hp: 100,
    maxHp: 100,
    atk: 10,
    iq: 0,
    empathy: 0,
  });

  // camera/effects
  const camera = useRef({ x: 0, y: 0 });
  const shake = useRef(createCameraShake());
  const particles = useRef(createParticles());

  // NPC (hướng dẫn)
  const npc = useMemo(() => ({ x: 5.5 * TILE, y: 2.5 * TILE, r: 14 }), []);

  // Boss (spawn muộn)
  const boss = useRef({
    pos: { x: 19 * TILE, y: 11 * TILE },
    r: 18,
    hp: 150,
    maxHp: 200,
    alive: false,

    // AI
    state: 'IDLE' as 'IDLE' | 'HUNT' | 'RAGE' | 'DASH',
    speed: 140, // ✅ base hunt
    dashSpeed: 280, // ✅ dash mạnh
    vision: 99999, // ✅ luôn thấy player
    dashCooldown: 0,

    hitCooldown: 0,
    touchCooldown: 0,
  });

  // Quiz banks (để không hỏi lại cùng câu)
  const mathBank = useQuizBank(MATH_QUESTIONS);
  const socialBank = useQuizBank(SOCIAL_QUESTIONS);

  // ✅ NHIỀU THỬ THÁCH rải trong map (tọa độ tile)
  const [challenges, setChallenges] = useState<Challenge[]>(() => [
    { id: 'c1', type: 'SOCIAL', tx: 3, ty: 5, label: 'S1', done: false },
    { id: 'c2', type: 'MATH', tx: 8, ty: 2, label: 'M1', done: false },
    { id: 'c3', type: 'SOCIAL', tx: 6, ty: 9, label: 'S2', done: false },
    { id: 'c4', type: 'MATH', tx: 11, ty: 9, label: 'M2', done: false },
    { id: 'c5', type: 'SOCIAL', tx: 4, ty: 13, label: 'S3', done: false },
    { id: 'c6', type: 'MATH', tx: 10, ty: 13, label: 'M3', done: false },
  ]);

  const challengesDone = challenges.filter((c) => c.done).length;
  const challengesTotal = challenges.length;

  function showToast(msg: string, sec = 2.5) {
    setToast(msg);
    toastTimer.current = sec;
  }

  function canMoveTo(x: number, y: number) {
    const r = 9;
    const corners = [
      { x: x - r, y: y - r },
      { x: x + r, y: y - r },
      { x: x - r, y: y + r },
      { x: x + r, y: y + r },
    ];

    for (const c of corners) {
      const tx = Math.floor(c.x / TILE);
      const ty = Math.floor(c.y / TILE);

      // Gate chặn nếu chưa mở
      if (tx === gate.tx && ty === gate.ty && !gateOpen) return false;

      if (isWall(tx, ty)) return false;
    }
    return true;
  }

  function clampCameraToMap(cw: number, ch: number) {
    const maxX = MAP_W - cw;
    const maxY = MAP_H - ch;

    if (maxX <= 0) camera.current.x = -(cw - MAP_W) / 2;
    else camera.current.x = clamp(camera.current.x, 0, maxX);

    if (maxY <= 0) camera.current.y = -(ch - MAP_H) / 2;
    else camera.current.y = clamp(camera.current.y, 0, maxY);
  }

  function nearTileCenter(tx: number, ty: number, radius = 55) {
    const p = player.current.pos;
    const center = { x: (tx + 0.5) * TILE, y: (ty + 0.5) * TILE };
    return dist(p, center) < radius;
  }

  function findOpenTileNear(tx: number, ty: number, radius = 8) {
    for (let r = 0; r <= radius; r++) {
      for (let oy = -r; oy <= r; oy++) {
        for (let ox = -r; ox <= r; ox++) {
          const x = tx + ox;
          const y = ty + oy;
          if (!isWall(x, y)) return { tx: x, ty: y };
        }
      }
    }
    const fallback = findFirstOpenTile();
    return { tx: fallback.x, ty: fallback.y };
  }

  function openQuizForChallenge(ch: Challenge) {
    setActiveChallengeId(ch.id);
    setQuizContext(
      `Thử thách ${ch.label} (${ch.type === 'MATH' ? 'Toán' : 'Ứng xử'})`
    );

    const picked =
      ch.type === 'MATH' ? mathBank.pickRandom() : socialBank.pickRandom();

    if (!picked) {
      showToast('Bạn đã làm hết câu hỏi của nhóm này rồi! 🎉', 2);
      return;
    }

    setQuizPool([picked]); // ✅ 1 câu / challenge
    setQuizOpen(true);
  }

  function checkGateAndBossSpawn() {
    // mở cổng khi xong hết thử thách
    if (!gateOpen && challengesDone === challengesTotal) {
      setGateOpen(true);
      showToast('✅ Bạn đã hoàn thành hết thử thách! Cổng mở rồi!', 3);
      shake.current.shake(5, 0.16);
      particles.current.spawnConfetti({
        x: (gate.tx + 0.5) * TILE,
        y: (gate.ty + 0.5) * TILE,
      });
    }

    // boss chỉ xuất hiện khi cổng mở + xong hết thử thách
    if (gateOpen && challengesDone === challengesTotal && !boss.current.alive) {
      const spawnTile = findOpenTileNear(19, 11, 10);
      boss.current.pos.x = (spawnTile.tx + 0.5) * TILE;
      boss.current.pos.y = (spawnTile.ty + 0.5) * TILE;

      boss.current.alive = true;
      boss.current.hp = boss.current.maxHp;

      boss.current.state = 'HUNT';
      boss.current.dashCooldown = 0;

      setBossSpeech('Ngươi dám thách đấu ta ư?');
      bossSpeechTimer.current = 2.6;

      showToast('⚠️ Boss xuất hiện! Nó sẽ săn bạn ngay lập tức!', 3);

      particles.current.spawnConfetti({
        x: boss.current.pos.x,
        y: boss.current.pos.y,
      });
      shake.current.shake(7, 0.2);
    }
  }

  function interact() {
    if (status !== 'PLAYING') return;

    // ưu tiên: gần challenge thì mở quiz
    for (const ch of challenges) {
      if (ch.done) continue;
      if (nearTileCenter(ch.tx, ch.ty, 52)) {
        showToast(`Bắt đầu thử thách ${ch.label}!`, 1.2);
        openQuizForChallenge(ch);
        return;
      }
    }

    // NPC talk
    if (dist(player.current.pos, npc) < 45) {
      if (challengesDone < challengesTotal) {
        showToast(
          `NPC: Hãy hoàn thành thử thách (${challengesDone}/${challengesTotal}) nhé!`,
          2.4
        );
      } else if (!gateOpen) {
        showToast('NPC: Bạn đã xong thử thách! Ra cổng để mở!', 2.2);
      } else if (!boss.current.alive) {
        showToast('NPC: Boss sẽ xuất hiện khi bạn bước qua cổng!', 2.2);
      } else {
        showToast('NPC: Cố lên! Nhấn J khi đứng gần boss!', 2.2);
      }
      return;
    }

    // Gate hint
    if (!gateOpen && nearTileCenter(gate.tx, gate.ty, 55)) {
      showToast('Cổng chỉ mở khi bạn hoàn thành TẤT CẢ thử thách!', 2.4);
      return;
    }

    showToast('Không có gì để tương tác ở đây.');
  }

  function attack() {
    if (status !== 'PLAYING') return;
    if (!boss.current.alive) {
      showToast('Boss chưa xuất hiện. Hãy hoàn thành hết thử thách trước!', 2);
      return;
    }

    const p = player.current.pos;
    const b = boss.current.pos;
    const d = dist(p, b);

    if (d < 55) {
      if (boss.current.hitCooldown > 0) return;

      const { killed } = dealDamageToBoss(boss.current, player.current.atk);
      boss.current.hitCooldown = 0.25;

      setBossSpeech('Hừm... cũng khá đấy!');
      bossSpeechTimer.current = 1.2;

      shake.current.shake(8, 0.18);
      particles.current.spawnHit({ x: b.x, y: b.y });

      showToast(`Bạn đánh Boss -${player.current.atk} HP!`, 1.2);

      if (killed) {
        setCoin((c) => c + 50);
        showToast('🏆 Boss bị hạ! +50 coin!', 3);
        particles.current.spawnConfetti({ x: b.x, y: b.y });

        setBossSpeech('Ta... thua sao?');
        bossSpeechTimer.current = 2.0;

        setStatus('WIN');
        setRunning(false);
      }
    } else {
      showToast('Đứng gần boss hơn để đánh!', 1.2);
    }
  }

  // Focus canvas
  useEffect(() => {
    const focusCanvas = () => {
      const c = canvasRef.current;
      if (c) c.focus();
    };
    focusCanvas();
    window.addEventListener('click', focusCanvas);
    return () => window.removeEventListener('click', focusCanvas);
  }, []);

  // Input
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current[k] = true;

      if (k === 'e') interact();
      if (k === 'j') attack();
      if (e.key === ' ') setRunning((s) => !s);
      if (k === 'escape') setQuizOpen(false);
    };

    const onUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gateOpen, quizOpen, status, challengesDone, challengesTotal]);

  // RAF loop
  useRafLoop(
    (dt) => {
      if (!running) return;

      // ✅ force render overlay mỗi frame
      forceRender((n) => (n + 1) % 1000000);

      // toast timer
      if (toastTimer.current > 0) {
        toastTimer.current -= dt;
        if (toastTimer.current <= 0) setToast('');
      }

      // particles + shake
      particles.current.update(dt);
      const shakeOffset = shake.current.update(dt);

      // boss cooldown
      if (boss.current.hitCooldown > 0) boss.current.hitCooldown -= dt;
      if (boss.current.touchCooldown > 0) boss.current.touchCooldown -= dt;

      // Boss speech timer
      if (bossSpeechTimer.current > 0) {
        bossSpeechTimer.current -= dt;
        if (bossSpeechTimer.current <= 0) setBossSpeech('');
      }

      // ================================
      // ✅ BOSS AI DUY NHẤT (SĂN LÙNG + DASH + WALL-SLIDE + HIT-RATE)
      // ================================
      if (boss.current.alive && status === 'PLAYING') {
        const b = boss.current;
        const p = player.current.pos;

        const dx = p.x - b.pos.x;
        const dy = p.y - b.pos.y;
        const d = Math.hypot(dx, dy) || 1;

        // cooldown
        if (b.dashCooldown > 0) b.dashCooldown -= dt;

        // luôn hunt
        if (b.state === 'IDLE') b.state = 'HUNT';

        const hpPct = b.maxHp > 0 ? b.hp / b.maxHp : 1;

        // rage khi thấp máu
        if (hpPct < 0.45) b.state = 'RAGE';

        // dash khi ở tầm trung
        const dashWindow = d > 90 && d < 280;
        const dashChance = b.state === 'RAGE' ? dt * 1.25 : dt * 0.55;
        if (dashWindow && b.dashCooldown <= 0 && Math.random() < dashChance) {
          const wasRage = b.state === 'RAGE';
          b.state = 'DASH';
          b.dashCooldown = wasRage ? 2.0 : 2.8;
          setBossSpeech('Chạy đi đâu!?');
          bossSpeechTimer.current = 1.0;
          shake.current.shake(5, 0.12);
        }

        const nx = dx / d;
        const ny = dy / d;

        const huntSpeed = b.speed; // 140
        const rageSpeed = 185;
        const dashSpeed = b.dashSpeed; // 280

        const spd =
          b.state === 'DASH' ? dashSpeed : b.state === 'RAGE' ? rageSpeed : huntSpeed;

        // wall-slide: thử X rồi Y
        const nextX = b.pos.x + nx * spd * dt;
        const nextY = b.pos.y + ny * spd * dt;

        const txX = Math.floor(nextX / TILE);
        const tyX = Math.floor(b.pos.y / TILE);

        const txY = Math.floor(b.pos.x / TILE);
        const tyY = Math.floor(nextY / TILE);

        if (!isWall(txX, tyX)) b.pos.x = nextX;
        if (!isWall(txY, tyY)) b.pos.y = nextY;

        // HIT: chỉ trừ máu theo nhịp (không dùng *dt để “rõ ràng hơn”)
        if (d < 44 && b.touchCooldown <= 0) {
          const dmg = b.state === 'DASH' ? 38 : b.state === 'RAGE' ? 30 : 18;
          const cd = b.state === 'RAGE' ? 0.14 : 0.2;
          b.touchCooldown = cd;

          player.current.hp -= dmg;

          setBossSpeech(b.state === 'DASH' ? 'Bắt được rồi!' : 'ĐỪNG HÒNG TRỐN!');
          bossSpeechTimer.current = 1.0;

          shake.current.shake(7, 0.14);
          particles.current.spawnBurst(
            { x: p.x, y: p.y },
            {
              count: 18,
              speed: [160, 280],
              life: [0.22, 0.48],
              size: [2, 4],
              color: '#fb7185',
            }
          );

          if (player.current.hp <= 0) {
            player.current.hp = 0;
            setStatus('LOSE');
            setRunning(false);
            showToast('💀 Boss đã hạ gục bạn!', 6);
          }
        }

        // thoát dash sau 1 nhịp
        if (b.state === 'DASH' && b.dashCooldown < 1.9) {
          b.state = hpPct < 0.45 ? 'RAGE' : 'HUNT';
        }
      }

      // Player move: khóa khi quiz mở
      if (!quizOpen && status === 'PLAYING') {
        const p = player.current.pos;
        const speed = 170;

        const up = keys.current['w'] || keys.current['arrowup'];
        const down = keys.current['s'] || keys.current['arrowdown'];
        const left = keys.current['a'] || keys.current['arrowleft'];
        const right = keys.current['d'] || keys.current['arrowright'];

        let vx = 0,
          vy = 0;
        if (up) vy -= 1;
        if (down) vy += 1;
        if (left) vx -= 1;
        if (right) vx += 1;

        if (vx !== 0 || vy !== 0) {
          const len = Math.hypot(vx, vy) || 1;
          vx = (vx / len) * speed;
          vy = (vy / len) * speed;

          const nx = p.x + vx * dt;
          const ny = p.y + vy * dt;

          const movedX = canMoveTo(nx, p.y);
          const movedY = canMoveTo(p.x, ny);
          if (movedX) p.x = nx;
          if (movedY) p.y = ny;

          const dir = Math.atan2(vy, vx);
          particles.current.spawnDust({ x: p.x, y: p.y }, dir);
        }

        // camera follow
        const cw = canvasRef.current?.width ?? 900;
        const ch = canvasRef.current?.height ?? 520;

        const targetCamX = p.x - cw / 2;
        const targetCamY = p.y - ch / 2;

        camera.current.x += (targetCamX - camera.current.x) * clamp(dt * 8, 0, 1);
        camera.current.y += (targetCamY - camera.current.y) * clamp(dt * 8, 0, 1);

        clampCameraToMap(cw, ch);

        camera.current.x += shakeOffset.x;
        camera.current.y += shakeOffset.y;
      } else {
        const cw = canvasRef.current?.width ?? 900;
        const ch = canvasRef.current?.height ?? 520;
        clampCameraToMap(cw, ch);
        camera.current.x += shakeOffset.x;
        camera.current.y += shakeOffset.y;
      }

      draw();
    },
    {
      enabled: running,
      maxDt: 0.05,
      pauseOnHidden: true,
    }
  );

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const cam = camera.current;

    ctx.clearRect(0, 0, cw, ch);

    // BG
    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, cw, ch);

    // Map
    for (let y = 0; y < MAP.length; y++) {
      for (let x = 0; x < MAP[0].length; x++) {
        const cell = MAP[y][x];
        const px = x * TILE - cam.x;
        const py = y * TILE - cam.y;
        if (px < -TILE || py < -TILE || px > cw + TILE || py > ch + TILE) continue;

        if (cell === '1') {
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(px, py, TILE, TILE);
          ctx.fillStyle = '#111827';
          ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
        } else {
          const zone = floorTypeAt(x, y);
          const base =
            zone === 'A' ? '#0b1b3a' :
            zone === 'B' ? '#0b2a22' :
            zone === 'C' ? '#2a1b2a' :
            zone === 'D' ? '#2a240b' : '#0b1220';

          const inner =
            zone === 'A' ? '#102a55' :
            zone === 'B' ? '#123d33' :
            zone === 'C' ? '#3b2240' :
            zone === 'D' ? '#3a3212' : '#0f1a33';

          ctx.fillStyle = base;
          ctx.fillRect(px, py, TILE, TILE);
          ctx.fillStyle = inner;
          ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 2);
        }
      }
    }

    // Gate
    const gx = gate.tx * TILE - cam.x;
    const gy = gate.ty * TILE - cam.y;
    ctx.fillStyle = gateOpen ? '#16a34a' : '#ef4444';
    ctx.fillRect(gx + 4, gy + 4, TILE - 8, TILE - 8);
    ctx.fillStyle = '#fff';
    ctx.font = '12px system-ui';
    ctx.fillText(gateOpen ? 'OPEN' : 'LOCK', gx + 6, gy - 6);

    // Challenges
    for (const chItem of challenges) {
      const cx = (chItem.tx + 0.5) * TILE - cam.x;
      const cy = (chItem.ty + 0.5) * TILE - cam.y;

      ctx.beginPath();
      ctx.fillStyle = chItem.done ? '#22c55e' : (chItem.type === 'MATH' ? '#60a5fa' : '#fb7185');
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '11px system-ui';
      ctx.fillText(chItem.done ? '✓' : chItem.label, cx - 6, cy - 14);
    }

    // NPC
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(npc.x - cam.x, npc.y - cam.y, npc.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e5e7eb';
    ctx.fillText('NPC', npc.x - cam.x - 12, npc.y - cam.y - 18);

    // Player
    const p = player.current.pos;
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.arc(p.x - cam.x, p.y - cam.y, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '12px system-ui';
    ctx.fillText('YOU', p.x - cam.x - 12, p.y - cam.y - 16);

    // particles
    particles.current.draw(ctx, cam);

    // Toast
    if (toast) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(10, ch - 56, cw - 20, 44);
      ctx.fillStyle = '#fff';
      ctx.fillText(toast, 18, ch - 28);
    }
  }

  // Quiz callbacks
  const handleCorrect = (q: QuizQuestion) => {
    if (q.type === 'MATH') mathBank.markDone(q.id);
    else socialBank.markDone(q.id);

    if (activeChallengeId) {
      setChallenges((prev) =>
        prev.map((c) => (c.id === activeChallengeId ? { ...c, done: true } : c))
      );
    }

    const delta = applyReward(player.current, q.reward as Reward);
    if (delta.coinDelta) setCoin((c) => c + delta.coinDelta);

    shake.current.shake(3, 0.12);
    particles.current.spawnConfetti({
      x: player.current.pos.x,
      y: player.current.pos.y,
    });

    showToast('✅ Đúng rồi! Bạn mạnh hơn rồi!', 2);

    setQuizOpen(false);
    setActiveChallengeId(null);

    setTimeout(() => {
      checkGateAndBossSpawn();
    }, 0);
  };

  const handleWrong = () => {
    showToast('❌ Chưa đúng, thử lại nhé!', 2);
    shake.current.shake(2, 0.08);
  };

  useEffect(() => {
    checkGateAndBossSpawn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challengesDone, gateOpen]);

  // Boss UI info
  const bossPhase = !boss.current.alive
    ? 'idle'
    : boss.current.hp <= 0
    ? 'defeated'
    : boss.current.hp < boss.current.maxHp * 0.35
    ? 'angry'
    : boss.current.hitCooldown > 0
    ? 'hurt'
    : 'idle';

  const bossFacing = boss.current.pos.x < player.current.pos.x ? 'right' : 'left';

  return (
    <div className='w-full flex flex-col items-center gap-3'>
      <div className='w-full flex items-center justify-between'>
        <div className='text-lg font-bold'>Adventure 2D • Story Trials → Gate → Boss</div>

        <div className='flex items-center gap-2 text-sm'>
          <span
            className={`px-3 py-1 rounded-md border ${
              status === 'WIN'
                ? 'bg-green-500/20 border-green-500/40'
                : status === 'LOSE'
                ? 'bg-red-500/20 border-red-500/40'
                : 'bg-white/5 border-white/20'
            }`}
          >
            {status}
          </span>

          <button
            className='px-3 py-1 rounded-md border'
            onClick={() => setRunning((s) => !s)}
            disabled={status !== 'PLAYING'}
          >
            {running ? 'Pause' : 'Resume'} (Space)
          </button>

          <button
            className='px-3 py-1 rounded-md border'
            onClick={() =>
              showToast(
                'Tip: Đi tới các chấm M/S và nhấn E để làm thử thách. Xong hết → cổng mở → boss xuất hiện.',
                5
              )
            }
          >
            Help
          </button>
        </div>
      </div>

      <StatusBar
        status={status}
        hp={Math.round(player.current.hp)}
        maxHp={player.current.maxHp}
        atk={player.current.atk}
        iq={player.current.iq}
        empathy={player.current.empathy}
        coin={coin}
        challengesDone={challengesDone}
        challengesTotal={challengesTotal}
        gateOpen={gateOpen}
      />

      <div className='w-full rounded-xl overflow-hidden border relative'>
        <canvas
          ref={canvasRef}
          width={900}
          height={520}
          tabIndex={0}
          onClick={(e) => (e.currentTarget as HTMLCanvasElement).focus()}
          className='block w-full h-auto bg-black outline-none'
        />

        {/* ✅ BOSS REACT OVERLAY */}
        {boss.current.alive && (
          <div className='absolute inset-0 pointer-events-none'>
            <div
              style={{
                position: 'absolute',
                left: -camera.current.x,
                top: -camera.current.y,
              }}
            >
              <Boss
                x={boss.current.pos.x / TILE - 0.5}
                y={boss.current.pos.y / TILE - 0.5}
                tileSize={TILE}
                name='BOSS'
                hp={boss.current.hp}
                maxHp={boss.current.maxHp}
                phase={bossPhase as any}
                showHpBar={true}
                speech={bossSpeech}
                speechVisible={true}
                facing={bossFacing as any}
              />
            </div>
          </div>
        )}

        <QuizModal
          open={quizOpen && status === 'PLAYING'}
          questions={quizPool}
          contextLabel={quizContext}
          onClose={() => {
            setQuizOpen(false);
            setActiveChallengeId(null);
          }}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          mode='RANDOM'
        />

        {status !== 'PLAYING' && (
          <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
            <div className='bg-white/95 rounded-2xl p-6 text-center w-[360px] shadow'>
              <div className='text-3xl font-bold mb-2'>
                {status === 'WIN' ? '🎉 YOU WIN!' : '💀 YOU LOSE!'}
              </div>
              <div className='text-sm mb-4 opacity-80'>
                {status === 'WIN'
                  ? 'Bạn đã hạ boss và hoàn thành hành trình!'
                  : 'HP về 0 rồi. Bạn có thể reload để chơi lại.'}
              </div>
              <div className='text-sm mb-2'>Coin: {coin}</div>
              <div className='text-xs opacity-70'>Tip: nhấn Refresh (F5) để chơi lại.</div>
            </div>
          </div>
        )}
      </div>

      <div className='text-sm opacity-80'>
        Điều khiển: <b>WASD / Arrow</b> đi, <b>E</b> tương tác (thử thách), <b>J</b> đánh boss,{' '}
        <b>Space</b> pause, <b>ESC</b> đóng quiz.
      </div>
    </div>
  );
}
