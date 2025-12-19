export function createCameraShake() {
  let time = 0;
  let strength = 0;

  return {
    shake(s: number, t = 0.25) {
      strength = s;
      time = t;
    },
    update(dt: number) {
      if (time <= 0) return { x: 0, y: 0 };
      time -= dt;

      return {
        x: (Math.random() - 0.5) * strength,
        y: (Math.random() - 0.5) * strength,
      };
    },
  };
}
