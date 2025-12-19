export type Reward = Partial<{
  hp: number;
  maxHp: number;
  atk: number;
  iq: number;
  empathy: number;
  coin: number;
}>;

export type PlayerRef = {
  hp: number;
  maxHp: number;
  atk: number;
  iq: number;
  empathy: number;
};

export function applyReward(player: PlayerRef, reward?: Reward) {
  if (!reward) return { coinDelta: 0 };

  player.atk += reward.atk ?? 0;
  player.iq += reward.iq ?? 0;
  player.empathy += reward.empathy ?? 0;

  if (reward.maxHp) player.maxHp += reward.maxHp;
  if (reward.hp) player.hp = Math.min(player.maxHp, player.hp + reward.hp);

  return { coinDelta: reward.coin ?? 0 };
}
