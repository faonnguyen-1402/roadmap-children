'use client';

export type BossPhase = 'idle' | 'angry' | 'hurt' | 'defeated';

type Props = {
  x: number;
  y: number;
  tileSize: number;
  name?: string;
  hp: number;
  maxHp: number;
  phase?: BossPhase;
  showHpBar?: boolean;
  speech?: string;
  facing?: 'left' | 'right';
};

export default function Boss({
  x,
  y,
  tileSize,
  name = 'BOSS',
  hp,
  maxHp,
  phase = 'idle',
  showHpBar = true,
  speech,
  facing = 'left',
}: Props) {
  const px = x * tileSize;
  const py = y * tileSize;

  const pct = maxHp <= 0 ? 0 : Math.max(0, Math.min(1, hp / maxHp));

  let glow = 'shadow-[0_0_22px_rgba(236,72,153,0.6)]';
  if (phase === 'angry') glow = 'shadow-[0_0_32px_rgba(239,68,68,0.9)]';
  if (phase === 'hurt') glow = 'shadow-[0_0_28px_rgba(250,204,21,0.9)]';
  if (phase === 'defeated') glow = 'opacity-40';

  return (
    <div
      className='absolute pointer-events-none select-none'
      style={{
        left: px,
        top: py,
        width: tileSize,
        height: tileSize,
        zIndex: 9999,
      }}
    >
      {/* SPEECH */}
      {speech && phase !== 'defeated' && (
        <div className='absolute -top-14 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-xl whitespace-nowrap border border-white/20'>
          {speech}
          <div className='absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-black/80' />
        </div>
      )}

      {/* NAME */}
      <div className='absolute -top-6 left-0 text-[11px] font-bold text-white'>
        {name}
      </div>

      {/* HP BAR */}
      {showHpBar && (
        <div className='absolute -top-2 left-0 w-[96px] h-[8px] bg-white/20 rounded overflow-hidden'>
          <div
            className='h-full bg-red-500 transition-[width] duration-150'
            style={{ width: `${pct * 100}%` }}
          />
        </div>
      )}

      {/* BODY */}
      <div
        className={`relative mx-auto rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-700 ${glow}`}
        style={{
          width: tileSize * 0.9,
          height: tileSize * 0.9,
          marginTop: tileSize * 0.05,
          transform:
            phase !== 'defeated'
              ? facing === 'right'
                ? 'scaleX(-1)'
                : 'scaleX(1)'
              : 'scale(0.95)',
          animation:
            phase !== 'defeated'
              ? 'bossPulse 1s ease-in-out infinite'
              : undefined,
        }}
      >
        <div className='absolute inset-1 rounded-full bg-white/10' />
        <div className='absolute inset-0 grid place-items-center text-[18px]'>
          👹
        </div>
      </div>

      <style jsx>{`
        @keyframes bossPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
