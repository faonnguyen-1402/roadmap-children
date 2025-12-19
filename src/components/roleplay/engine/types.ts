export type StatKey = 'calm' | 'empathy' | 'logic' | 'teamwork';

export type MindStats = Record<StatKey, number>;

export type Choice = {
  id: string;
  text: string;
  // điểm cộng/trừ cho từng chỉ số (có thể âm)
  delta?: Partial<MindStats>;
  // phản hồi sau khi chọn
  feedback: {
    title: string; // ví dụ: "Lựa chọn rất khéo!"
    message: string; // hậu quả + gợi ý
  };
  nextId: string; // node tiếp theo
};

export type StoryNode = {
  id: string;
  sceneTitle: string;
  narrator: string; // đoạn kể chuyện
  npcName?: string;
  npcLine?: string;
  choices: Choice[];
};

export type StoryGraph = {
  startId: string;
  nodes: Record<string, StoryNode>;
};
export type CharPos = 'left' | 'center' | 'right';

export type PanelFX = {
  vignette?: boolean; // tối viền
  blurBg?: number; // blur nền
  shake?: boolean; // rung nhẹ lúc xuất hiện
  glow?: boolean; // glow nhân vật
};

export type Panel = {
  id: string;
  bg: string; // "/comic/bg/....png"
  char?: {
    src: string; // "/comic/chars/....png"
    pos?: CharPos;
    scale?: number; // 1, 1.1, 0.9...
    flip?: boolean; // lật hướng
    emotion?: string; // "happy" | "sad" | ...
  };
  text: string;
  fx?: PanelFX;
};
