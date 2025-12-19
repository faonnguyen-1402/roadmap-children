import { useState } from 'react';

export function useGameState() {
  const [player, setPlayer] = useState({
    hp: 100,
    atk: 10,
    iq: 0,
    empathy: 0,
  });

  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(false);

  return {
    player,
    setPlayer,
    gateUnlocked,
    setGateUnlocked,
    bossDefeated,
    setBossDefeated,
  };
}
