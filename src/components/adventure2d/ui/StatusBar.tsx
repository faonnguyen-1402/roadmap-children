'use client';

export default function StatusBar({
  status,
  hp,
  maxHp,
  atk,
  iq,
  empathy,
  challengesDone,
  challengesTotal,
  gateOpen,
}: {
  status: string;
  hp: number;
  maxHp: number;
  atk: number;
  iq: number;
  empathy: number;
  challengesDone: number;
  challengesTotal: number;
  gateOpen: boolean;
}) {
  return (
    <div className='w-full flex flex-wrap gap-2 text-xs'>
      <span className='px-2 py-1 rounded bg-white/5 border border-white/10'>
        STATUS: <b>{status}</b>
      </span>

      <span className='px-2 py-1 rounded bg-white/5 border border-white/10'>
        HP: <b>{hp}</b>/<b>{maxHp}</b>
      </span>

      <span className='px-2 py-1 rounded bg-white/5 border border-white/10'>
        ATK: <b>{atk}</b>
      </span>

      <span className='px-2 py-1 rounded bg-white/5 border border-white/10'>
        IQ: <b>{iq}</b> • Empathy: <b>{empathy}</b>
      </span>

      <span className='px-2 py-1 rounded bg-white/5 border border-white/10'>
        Thử thách: <b>{challengesDone}</b>/<b>{challengesTotal}</b>
      </span>

      <span className='px-2 py-1 rounded bg-white/5 border border-white/10'>
        Gate: <b>{gateOpen ? 'OPEN ✅' : 'LOCK 🔒'}</b>
      </span>
    </div>
  );
}
