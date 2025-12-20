export type Reward = Partial<{
  hp: number;
  maxHp: number;
  atk: number;
  iq: number;
  empathy: number;
  coin: number;
}>;

export type PlayerRef = {
  pos: { x: number; y: number };
  hp: number;
  maxHp: number;
  atk: number;
  iq: number;
  empathy: number;
};
export function applyReward(player: PlayerRef, reward?: Reward) {
  if (!reward) return { coinDelta: 0 };

  if (reward.atk !== undefined) player.atk += reward.atk;
  if (reward.iq !== undefined) player.iq += reward.iq;
  if (reward.empathy !== undefined) player.empathy += reward.empathy;

  if (reward.maxHp !== undefined) player.maxHp += reward.maxHp;
  if (reward.hp !== undefined) {
    player.hp = Math.min(player.maxHp, player.hp + reward.hp);
  }

  return {
    coinDelta: reward.coin ?? 0,
  };
}
