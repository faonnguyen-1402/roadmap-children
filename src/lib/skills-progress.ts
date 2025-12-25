export type SkillProgress = {
  completedVideoIds: string[];
};

const key = (userId: string) => `skillsProgress:${userId}`;

export function loadSkillProgress(userId: string): SkillProgress {
  try {
    return JSON.parse(
      localStorage.getItem(key(userId)) || '{"completedVideoIds":[]}'
    );
  } catch {
    return { completedVideoIds: [] };
  }
}

export function saveSkillProgress(userId: string, p: SkillProgress) {
  localStorage.setItem(key(userId), JSON.stringify(p));
}

export function completeVideo(userId: string, videoId: string) {
  const p = loadSkillProgress(userId);
  if (!p.completedVideoIds.includes(videoId)) p.completedVideoIds.push(videoId);
  saveSkillProgress(userId, p);
  return p;
}
