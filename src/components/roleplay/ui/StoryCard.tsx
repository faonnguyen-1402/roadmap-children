'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type BubbleType = 'speech' | 'thought' | 'narration' | 'letter';

type Props = {
  // data text
  title: string;
  narrator: string;
  bubbleType?: BubbleType;
  speaker?: string;
  line?: string;

  // assets
  background: string;
  character?: string;
  npc?: string;

  panelKey?: string;

  // ✅ ratio: 0.4 = 40% chiều cao scene
  spriteRatio?: number;
};

const FALLBACK_BG = '/comic/bg/castle-morning.png';
const FALLBACK_CHAR = '/comic/chars/prince/idle.png';
const FALLBACK_NPC = '/comic/chars/princess/idle.png';

function useImageSrc(src?: string, fallback?: string) {
  const [img, setImg] = useState(src || fallback || '');
  useEffect(() => setImg(src || fallback || ''), [src, fallback]);
  return { img, setImg };
}

function bubbleStyle(type: BubbleType) {
  switch (type) {
    case 'speech':
      return { icon: '💬', cls: 'bg-white/95 border-slate-200' };
    case 'thought':
      return { icon: '💭', cls: 'bg-white/90 border-slate-200' };
    case 'narration':
      return { icon: '📖', cls: 'bg-white/90 border-slate-200' };
    case 'letter':
      return { icon: '✉️', cls: 'bg-amber-50/95 border-amber-200' };
    default:
      return { icon: '💬', cls: 'bg-white/95 border-slate-200' };
  }
}

function Sprite({
  src,
  fallback,
  ratio = 0.4, // ✅ FIX cứng 0.4
  side,
  animateKey,
  maxWidth = 260, // ✅ chặn ảnh phình theo chiều ngang
}: {
  src?: string;
  fallback: string;
  ratio?: number;
  side: 'left' | 'right';
  animateKey: string;
  maxWidth?: number;
}) {
  const { img, setImg } = useImageSrc(src, fallback);

  const [enter, setEnter] = useState(false);
  useEffect(() => {
    setEnter(false);
    const t = setTimeout(() => setEnter(true), 30);
    return () => clearTimeout(t);
  }, [animateKey]);

  return (
    // ✅ wrapper KHÓA height theo ratio => ảnh không thể cao hơn
    <div
      className={[
        'relative w-full',
        'flex items-end',
        side === 'left' ? 'justify-start' : 'justify-end',
      ].join(' ')}
      style={{
        height: `${ratio * 100}%`, // 0.4 => 40% của scene (420px)
        maxWidth,
      }}
    >
      {/* shadow base */}
      <div
        className={[
          'absolute bottom-1',
          side === 'left' ? 'left-10' : 'right-10',
          'h-6 w-28 rounded-full',
          'bg-black/15 blur-[10px]',
          enter ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-500',
        ].join(' ')}
      />

      <img
        src={img}
        onError={() => setImg(fallback)}
        draggable={false}
        alt={side}
        className={[
          // ✅ quan trọng: h-full + w-auto => luôn fit wrapper
          'h-full w-auto object-contain select-none',
          'drop-shadow-[0_14px_18px_rgba(0,0,0,0.18)]',
          'animate-[spriteBreath_3.8s_ease-in-out_infinite]',
          enter
            ? 'opacity-100 translate-x-0'
            : side === 'left'
            ? 'opacity-0 -translate-x-6'
            : 'opacity-0 translate-x-6',
          'transition-all duration-500',
        ].join(' ')}
      />
    </div>
  );
}

export function StoryCard({
  title,
  narrator,
  bubbleType = 'speech',
  speaker,
  line,
  background,
  character,
  npc,
  panelKey,
  spriteRatio = 0.4, // ✅ default 0.4
}: Props) {
  const { img: bgImg, setImg: setBgImg } = useImageSrc(background, FALLBACK_BG);

  const animKey = useMemo(() => panelKey || `${title}-${narrator}`, [
    panelKey,
    title,
    narrator,
  ]);

  const b = bubbleStyle(bubbleType);

  const [pop, setPop] = useState(false);
  useEffect(() => {
    setPop(false);
    const t = setTimeout(() => setPop(true), 30);
    return () => clearTimeout(t);
  }, [animKey]);

  return (
    <>
      <style jsx global>{`
        @keyframes spriteBreath {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-3px) scale(1.01);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }
        @keyframes bubblePop {
          0% {
            transform: translateY(-6px) scale(0.98);
            opacity: 0;
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <Card className='rounded-2xl overflow-hidden shadow-sm'>
        {/* TITLE */}
        <div className='p-4 border-b'>
          <h2 className='text-xl font-semibold'>{title}</h2>
        </div>

        {/* SCENE */}
        <div className='relative h-[420px] w-full'>
          {/* BG */}
          <img
            src={bgImg}
            onError={() => setBgImg(FALLBACK_BG)}
            className='absolute inset-0 h-full w-full object-cover'
            alt='bg'
            draggable={false}
          />

          {/* overlay */}
          <div className='absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20' />

          {/* Bubble */}
          {(speaker || line) && (
            <div className='absolute left-4 right-4 top-4 z-20'>
              <div
                className={[
                  'rounded-2xl border px-4 py-3 shadow-sm backdrop-blur',
                  b.cls,
                  pop ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
                style={{
                  animation: pop ? 'bubblePop 360ms ease-out both' : undefined,
                }}
              >
                <div className='flex items-start gap-3'>
                  <div className='mt-[2px] text-lg'>{b.icon}</div>
                  <div className='min-w-0'>
                    {speaker && (
                      <div className='mb-1 text-sm font-semibold text-slate-700'>
                        {speaker}
                      </div>
                    )}
                    {line && (
                      <div className='text-base leading-relaxed text-slate-900'>
                        {line}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Characters layer */}
          <div className='relative z-10 grid h-full w-full grid-cols-2 px-8 pb-6 pt-20'>
            {/* LEFT */}
            <div className='flex items-end'>
              {character ? (
                <Sprite
                  src={character}
                  fallback={FALLBACK_CHAR}
                  ratio={spriteRatio} // ✅ 0.4
                  side='left'
                  animateKey={animKey}
                  maxWidth={260}
                />
              ) : null}
            </div>

            {/* RIGHT */}
            <div className='flex items-end justify-end'>
              {npc ? (
                <Sprite
                  src={npc}
                  fallback={FALLBACK_NPC}
                  ratio={spriteRatio} // ✅ 0.4
                  side='right'
                  animateKey={animKey}
                  maxWidth={260}
                />
              ) : null}
            </div>
          </div>
        </div>

        {/* TEXT */}
        <div className='p-4 space-y-3'>
          <p className='text-base leading-relaxed'>{narrator}</p>

          {speaker && line && (
            <div className='rounded-xl border p-3 bg-background'>
              <div className='flex items-center gap-2 mb-2'>
                <Badge>{speaker}</Badge>
              </div>
              <p className='text-sm leading-relaxed'>{line}</p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

export default StoryCard;
