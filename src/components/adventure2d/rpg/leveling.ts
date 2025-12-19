export function createLevelSystem() {
  return {
    level: 1,
    exp: 0,
    next: 50,
    gain(x: number) {
      this.exp += x;
      if (this.exp >= this.next) {
        this.exp -= this.next;
        this.level++;
        this.next += 30;
        return true;
      }
      return false;
    },
  };
}
