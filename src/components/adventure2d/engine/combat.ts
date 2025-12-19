export type BossRef = {
  hp: number;
  maxHp: number;
  alive: boolean;
  hitCooldown: number;
};

export function dealDamageToBoss(boss: BossRef, dmg: number) {
  if (!boss.alive) return { killed: false };
  boss.hp -= dmg;
  if (boss.hp <= 0) {
    boss.hp = 0;
    boss.alive = false;
    return { killed: true };
  }
  return { killed: false };
}
