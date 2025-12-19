'use client';

import { useMemo, useState } from 'react';

import { COMIC_STORY } from './data/story';
import { applyDelta, defaultStats } from './engine/state';

import { ChoiceButton } from './ui/ChoiceButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Feedback = { title: string; message: string } | null;

function bubbleStyle(type: string) {
  switch (type) {
    case 'speech':
      return 'bg-white border';
    case 'thought':
      return 'bg-white border border-dashed';
    case 'letter':
      return 'bg-yellow-50 border';
    case 'narration':
    default:
      return 'bg-black/70 text-white border border-white/10';
  }
}

function bubbleLabel(type: string) {
  switch (type) {
    case 'speech':
      return '💬';
    case 'thought':
      return '💭';
    case 'letter':
      return '💌';
    case 'narration':
    default:
      return '📖';
  }
}

function ImgOrFallback({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div
        className={[
          'w-full h-full',
          'bg-gradient-to-br from-slate-100 to-slate-200',
          'flex items-center justify-center text-sm text-slate-500',
          className ?? '',
        ].join(' ')}
      >
        (Thiếu ảnh: {alt})
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
      draggable={false}
    />
  );
}

export default function RoleplayGame() {
  const story = useMemo(() => COMIC_STORY, []);
  const [sceneId, setSceneId] = useState(story.startId);
  const [panelIndex, setPanelIndex] = useState(0);

  const [stats, setStats] = useState(defaultStats);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const scene = story.scenes[sceneId];
  const panel = scene.panels[Math.min(panelIndex, scene.panels.length - 1)];
  const isLastPanel = panelIndex >= scene.panels.length - 1;

  function goNextPanel() {
    setFeedback(null);
    setPanelIndex((i) => Math.min(i + 1, scene.panels.length - 1));
  }

  function goPrevPanel() {
    setFeedback(null);
    setPanelIndex((i) => Math.max(i - 1, 0));
  }

  function jumpScene(nextId: string) {
    setSceneId(nextId);
    setPanelIndex(0);
    setFeedback(null);
  }

  function pick(choiceId: string) {
    const choice = scene.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    setStats((s) => applyDelta(s, choice.delta));
    setFeedback(choice.feedback ?? null);
    jumpScene(choice.next);
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-6 space-y-4'>
      {/* Stats */}
      <Card className='rounded-2xl'>
        <CardHeader>
          <CardTitle className='text-lg'>Chỉ số Hoàng tử</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-wrap gap-2'>
          <Badge>🧘 Bình tĩnh: {stats.calm}</Badge>
          <Badge>💛 Cảm thông: {stats.empathy}</Badge>
          <Badge>🧠 Tư duy: {stats.logic}</Badge>
          <Badge>🤝 Hợp tác: {stats.teamwork}</Badge>
        </CardContent>
      </Card>

      {/* Comic Panel */}
      <Card className='rounded-2xl overflow-hidden shadow-sm'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between gap-3'>
            <CardTitle className='text-xl'>{scene.title}</CardTitle>
            <Badge variant='secondary'>
              Khung {panelIndex + 1}/{scene.panels.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Khung truyện */}
          <div className='relative w-full aspect-[16/9] rounded-2xl overflow-hidden border bg-muted'>
            {/* Background */}
            <div className='absolute inset-0'>
              <ImgOrFallback
                src={panel.background}
                alt='background'
                className='w-full h-full object-cover'
              />
            </div>

            {/* Prince */}
            {panel.character ? (
              <div className='absolute left-3 bottom-0 w-[38%] h-[80%] pointer-events-none'>
                <ImgOrFallback
                  src={panel.character}
                  alt='character'
                  className='w-full h-full object-contain object-bottom drop-shadow'
                />
              </div>
            ) : null}

            {/* NPC */}
            {panel.npc ? (
              <div className='absolute right-3 bottom-0 w-[38%] h-[80%] pointer-events-none'>
                <ImgOrFallback
                  src={panel.npc}
                  alt='npc'
                  className='w-full h-full object-contain object-bottom drop-shadow'
                />
              </div>
            ) : null}

            {/* Bubble */}
            {panel.bubble ? (
              <div className='absolute top-3 left-3 right-3'>
                <div
                  className={[
                    'rounded-2xl p-3 md:p-4 shadow-sm',
                    bubbleStyle(panel.bubble.type),
                  ].join(' ')}
                >
                  <div className='flex items-start gap-2'>
                    <div className='text-lg'>
                      {bubbleLabel(panel.bubble.type)}
                    </div>
                    <div className='flex-1'>
                      {panel.bubble.speaker ? (
                        <div className='text-xs md:text-sm font-semibold opacity-80 mb-1'>
                          {panel.bubble.speaker}
                        </div>
                      ) : null}
                      <div className='text-sm md:text-base leading-relaxed'>
                        {panel.bubble.text}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Điều hướng khung */}
          <div className='flex items-center justify-between gap-2'>
            <Button
              variant='outline'
              onClick={goPrevPanel}
              disabled={panelIndex === 0}
            >
              ← Trước
            </Button>

            {!isLastPanel ? (
              <Button onClick={goNextPanel}>Tiếp theo →</Button>
            ) : (
              <Badge variant='outline'>
                Hết khung — chọn hành động bên dưới
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      {feedback && (
        <Card className='rounded-2xl border-dashed'>
          <CardHeader>
            <CardTitle className='text-base'>{feedback.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm leading-relaxed'>{feedback.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Choices */}
      {isLastPanel && (
        <div className='space-y-2'>
          {scene.choices.map((c) => (
            <ChoiceButton key={c.id} onClick={() => pick(c.id)}>
              {c.text}
            </ChoiceButton>
          ))}
        </div>
      )}
    </div>
  );
}
