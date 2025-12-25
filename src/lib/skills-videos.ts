export type SkillVideo = {
  id: string;
  title: string;
  description: string;
  category: 'Giao tiếp' | 'Tự lập' | 'Kỷ luật' | 'Cảm xúc' | 'Học tập';
  level: 'Dễ' | 'Vừa' | 'Khó';
  durationMin: number;
  // Bạn có thể dùng youtube hoặc mp4
  type: 'youtube' | 'mp4';
  url: string;
  thumbnail?: string;
};

export const SKILL_VIDEOS: SkillVideo[] = [
  {
    id: 'sv-communication-1',
    title: 'Kỹ năng chào hỏi lịch sự',
    description: 'Học cách chào hỏi, giới thiệu bản thân và nói lời cảm ơn.',
    category: 'Giao tiếp',
    level: 'Dễ',
    durationMin: 4,
    type: 'youtube',
    url: 'https://www.youtube.com/embed/zm-zrqDtCtE',
  },
  {
    id: 'sv-emotion-1',
    title: 'Quản lý cảm xúc khi tức giận',
    description: '3 bước hít thở + nói ra cảm xúc đúng cách.',
    category: 'Cảm xúc',
    level: 'Vừa',
    durationMin: 6,
    type: 'youtube',
    url: 'https://www.youtube.com/embed/mClBkFwKcZs',
  },
  {
    id: 'sv-discipline-1',
    title: 'Kỷ luật: hoàn thành việc nhỏ mỗi ngày',
    description: 'Tạo thói quen tốt bằng checklist 5 phút.',
    category: 'Kỷ luật',
    level: 'Vừa',
    durationMin: 5,
    type: 'youtube',
    url: 'https://www.youtube.com/embed/TeP6FKb7Brc',
  },
];
