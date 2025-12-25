export type ExerciseType = 'mcq' | 'scenario';

export type ExerciseTopic =
  | 'social'
  | 'emotion'
  | 'teamwork'
  | 'safety'
  | 'math'
  | 'language'
  | 'logic'
  | 'habits';

export type Exercise = {
  id: string;
  title: string;
  prompt: string;
  type: ExerciseType;

  // ✅ đa dạng chủ đề + độ khó + độ tuổi
  topic: ExerciseTopic;
  difficulty: 1 | 2 | 3 | 4 | 5;
  minAge?: number;
  maxAge?: number;

  // ✅ điểm
  points: number;

  // ✅ options cho mcq/scenario
  options: {
    id: string;
    text: string;
    correct?: boolean;
    feedback?: string;
  }[];

  // ✅ dùng để lọc/ghi nhớ/đổi theo mùa
  tags?: string[];

  // ✅ nếu muốn “hôm nay ra đề khác hôm qua”
  seedKey?: string; // ví dụ: "daily"
};

// ===================== QUESTION BANK =====================
// Bạn chỉ việc thêm câu mới vào đây (mỗi câu 1 object)
export const EXERCISES: Exercise[] = [
  // ---------- SOCIAL (Giao tiếp / lịch sự) ----------
  {
    id: 'social_please_01',
    title: 'Ứng xử lịch sự',
    prompt: 'Khi bạn muốn mượn bút của bạn, bạn nên nói gì?',
    type: 'mcq',
    topic: 'social',
    difficulty: 1,
    minAge: 5,
    maxAge: 12,
    points: 10,
    options: [
      { id: 'a', text: 'Đưa đây!', feedback: 'Câu này hơi thô quá 😅' },
      {
        id: 'b',
        text: 'Cho mình mượn bút với nhé, cảm ơn bạn!',
        correct: true,
        feedback: 'Chuẩn rồi! Lịch sự + biết cảm ơn ❤️',
      },
      {
        id: 'c',
        text: 'Không cho thì thôi!',
        feedback: 'Mình nên nói nhẹ nhàng hơn.',
      },
    ],
    tags: ['polite', 'sharing'],
  },
  {
    id: 'social_apology_01',
    title: 'Xin lỗi đúng cách',
    prompt: 'Nếu bạn vô ý làm bạn buồn, bạn nên làm gì?',
    type: 'scenario',
    topic: 'social',
    difficulty: 2,
    minAge: 6,
    maxAge: 12,
    points: 12,
    options: [
      {
        id: 'a',
        text: 'Bỏ đi và giả vờ không biết',
        feedback: 'Bạn có thể làm bạn buồn hơn.',
      },
      {
        id: 'b',
        text: 'Nói “Mình xin lỗi, mình không cố ý. Mình sẽ cẩn thận hơn.”',
        correct: true,
        feedback: 'Rất tốt! Xin lỗi + sửa sai 💚',
      },
      {
        id: 'c',
        text: 'Đổ lỗi cho bạn ấy',
        feedback: 'Đổ lỗi dễ làm mọi chuyện tệ hơn.',
      },
    ],
    tags: ['apology'],
  },
  {
    id: 'social_turn_01',
    title: 'Chờ đến lượt',
    prompt: 'Khi mọi người đang xếp hàng, bạn nên làm gì?',
    type: 'mcq',
    topic: 'social',
    difficulty: 1,
    minAge: 5,
    points: 10,
    options: [
      {
        id: 'a',
        text: 'Chen lên trước',
        feedback: 'Chen hàng khiến người khác khó chịu.',
      },
      {
        id: 'b',
        text: 'Đứng đúng hàng và chờ đến lượt',
        correct: true,
        feedback: 'Đúng rồi! Chờ đến lượt rất văn minh ⭐',
      },
      {
        id: 'c',
        text: 'Kêu to để được ưu tiên',
        feedback: 'Mình có thể nói nhỏ nhẹ lịch sự.',
      },
    ],
  },

  // ---------- EMOTION (Cảm xúc / bình tĩnh) ----------
  {
    id: 'emotion_lose_01',
    title: 'Quản lý cảm xúc',
    prompt: 'Khi bị thua trò chơi, cách nào tốt nhất?',
    type: 'scenario',
    topic: 'emotion',
    difficulty: 1,
    minAge: 5,
    maxAge: 12,
    points: 10,
    options: [
      {
        id: 'a',
        text: 'Ném đồ và la hét',
        feedback: 'Dễ nguy hiểm và làm mọi người buồn.',
      },
      {
        id: 'b',
        text: 'Hít thở sâu, nói “Lần sau mình sẽ cố gắng hơn”',
        correct: true,
        feedback: 'Tuyệt vời! Bình tĩnh và tích cực 💪',
      },
      {
        id: 'c',
        text: 'Giận và không nói chuyện với ai',
        feedback: 'Bạn có thể chia sẻ cảm xúc với người tin tưởng.',
      },
    ],
    tags: ['calm', 'mindset'],
  },
  {
    id: 'emotion_angry_01',
    title: 'Khi tức giận',
    prompt: 'Khi bạn tức giận, việc nào giúp bạn bình tĩnh nhanh hơn?',
    type: 'mcq',
    topic: 'emotion',
    difficulty: 2,
    minAge: 6,
    points: 12,
    options: [
      {
        id: 'a',
        text: 'Đập bàn ghế',
        feedback: 'Có thể làm đau người khác hoặc hư đồ.',
      },
      {
        id: 'b',
        text: 'Đếm 1–10 và hít thở sâu',
        correct: true,
        feedback: 'Đúng rồi! Đây là mẹo rất hiệu quả 🌿',
      },
      {
        id: 'c',
        text: 'La vào mặt bạn',
        feedback: 'La mắng khiến mâu thuẫn tăng lên.',
      },
    ],
  },
  {
    id: 'emotion_help_01',
    title: 'Tìm sự giúp đỡ',
    prompt: 'Nếu bạn lo lắng và không biết làm sao, bạn có thể làm gì?',
    type: 'scenario',
    topic: 'emotion',
    difficulty: 2,
    minAge: 6,
    points: 12,
    options: [
      {
        id: 'a',
        text: 'Giữ một mình, không nói với ai',
        feedback: 'Giữ lâu dễ mệt hơn.',
      },
      {
        id: 'b',
        text: 'Nói với bố/mẹ/giáo viên hoặc người bạn tin tưởng',
        correct: true,
        feedback: 'Chuẩn! Chia sẻ giúp mình nhẹ lòng hơn 💛',
      },
      {
        id: 'c',
        text: 'Bỏ học/bỏ chơi luôn',
        feedback: 'Mình có thể nghỉ chút rồi quay lại.',
      },
    ],
  },

  // ---------- TEAMWORK (Làm việc nhóm) ----------
  {
    id: 'teamwork_share_01',
    title: 'Hợp tác nhóm',
    prompt: 'Khi làm việc nhóm, điều nào quan trọng nhất?',
    type: 'mcq',
    topic: 'teamwork',
    difficulty: 1,
    minAge: 6,
    points: 10,
    options: [
      {
        id: 'a',
        text: 'Chỉ làm theo ý mình',
        feedback: 'Nhóm cần lắng nghe nhau.',
      },
      {
        id: 'b',
        text: 'Lắng nghe ý kiến và chia việc phù hợp',
        correct: true,
        feedback: 'Đúng rồi! Lắng nghe + chia việc giúp nhóm mạnh hơn 🤝',
      },
      {
        id: 'c',
        text: 'Để một bạn làm hết',
        feedback: 'Nhóm nên cùng nhau cố gắng.',
      },
    ],
  },
  {
    id: 'teamwork_conflict_01',
    title: 'Giải quyết bất đồng',
    prompt: 'Nếu bạn và bạn khác ý kiến, bạn nên làm gì?',
    type: 'scenario',
    topic: 'teamwork',
    difficulty: 2,
    minAge: 7,
    points: 12,
    options: [
      {
        id: 'a',
        text: 'Cãi nhau cho đến khi thắng',
        feedback: 'Cãi nhau khiến nhóm mệt và chậm.',
      },
      {
        id: 'b',
        text: 'Bình tĩnh nói lý do và cùng chọn giải pháp tốt nhất',
        correct: true,
        feedback: 'Tuyệt! Thảo luận bình tĩnh là kỹ năng mạnh ⭐',
      },
      {
        id: 'c',
        text: 'Bỏ nhóm',
        feedback: 'Nếu khó, mình có thể nhờ người lớn hỗ trợ.',
      },
    ],
  },

  // ---------- SAFETY (An toàn) ----------
  {
    id: 'safety_stranger_01',
    title: 'An toàn với người lạ',
    prompt: 'Nếu người lạ rủ bạn đi chơi và cho kẹo, bạn nên làm gì?',
    type: 'scenario',
    topic: 'safety',
    difficulty: 2,
    minAge: 6,
    points: 15,
    options: [
      {
        id: 'a',
        text: 'Đi theo vì có kẹo',
        feedback: 'Nguy hiểm. Không nên đi theo người lạ.',
      },
      {
        id: 'b',
        text: 'Nói “Không”, chạy về chỗ đông người và báo người lớn',
        correct: true,
        feedback: 'Chính xác! An toàn là số 1 🛡️',
      },
      {
        id: 'c',
        text: 'Đứng lại nói chuyện lâu',
        feedback: 'Tốt nhất là rời đi và báo người lớn.',
      },
    ],
  },
  {
    id: 'safety_road_01',
    title: 'Qua đường',
    prompt: 'Khi qua đường, bạn nên làm gì?',
    type: 'mcq',
    topic: 'safety',
    difficulty: 1,
    minAge: 5,
    points: 10,
    options: [
      { id: 'a', text: 'Chạy thật nhanh', feedback: 'Chạy vội dễ nguy hiểm.' },
      {
        id: 'b',
        text: 'Nhìn trái–phải–trái, đi đúng vạch qua đường',
        correct: true,
        feedback: 'Đúng rồi! Cẩn thận giúp an toàn 🚦',
      },
      {
        id: 'c',
        text: 'Vừa đi vừa xem điện thoại',
        feedback: 'Rất nguy hiểm khi mất tập trung.',
      },
    ],
  },

  // ---------- MATH (Toán) ----------
  {
    id: 'math_add_01',
    title: 'Toán nhanh',
    prompt: '3 + 5 = ?',
    type: 'mcq',
    topic: 'math',
    difficulty: 1,
    minAge: 5,
    points: 10,
    options: [
      { id: 'a', text: '7', feedback: 'Gần đúng rồi!' },
      { id: 'b', text: '8', correct: true, feedback: 'Đúng rồi! 🎉' },
      { id: 'c', text: '9', feedback: 'Thử tính lại nha.' },
    ],
  },
  {
    id: 'math_sub_01',
    title: 'Trừ vui',
    prompt: '12 - 4 = ?',
    type: 'mcq',
    topic: 'math',
    difficulty: 1,
    minAge: 6,
    points: 10,
    options: [
      { id: 'a', text: '6', feedback: 'Chưa đúng rồi.' },
      { id: 'b', text: '8', correct: true, feedback: 'Chuẩn luôn! ✅' },
      { id: 'c', text: '9', feedback: 'Thử lại nha.' },
    ],
  },
  {
    id: 'math_word_01',
    title: 'Bài toán tình huống',
    prompt: 'Bạn có 5 cái kẹo, cho bạn 2 cái. Bạn còn mấy cái?',
    type: 'scenario',
    topic: 'math',
    difficulty: 2,
    minAge: 6,
    points: 12,
    options: [
      { id: 'a', text: '2', feedback: 'Bạn đã cho 2, không phải còn 2.' },
      { id: 'b', text: '3', correct: true, feedback: 'Đúng rồi! 5 - 2 = 3 🍬' },
      { id: 'c', text: '7', feedback: 'Không thể tăng lên được.' },
    ],
  },

  // ---------- LANGUAGE (Tiếng Việt / từ vựng) ----------
  {
    id: 'lang_syn_01',
    title: 'Từ đồng nghĩa',
    prompt: 'Từ nào gần nghĩa với “vui vẻ”?',
    type: 'mcq',
    topic: 'language',
    difficulty: 2,
    minAge: 7,
    points: 12,
    options: [
      { id: 'a', text: 'Buồn bã', feedback: 'Ngược nghĩa rồi.' },
      {
        id: 'b',
        text: 'Hân hoan',
        correct: true,
        feedback: 'Đúng! Hân hoan = vui vẻ 🎈',
      },
      { id: 'c', text: 'Giận dữ', feedback: 'Không đúng nha.' },
    ],
  },
  {
    id: 'lang_polite_01',
    title: 'Câu nói lịch sự',
    prompt: 'Câu nào lịch sự nhất khi muốn nhờ giúp?',
    type: 'mcq',
    topic: 'language',
    difficulty: 1,
    minAge: 6,
    points: 10,
    options: [
      { id: 'a', text: 'Làm giùm đi!', feedback: 'Câu này hơi ra lệnh.' },
      {
        id: 'b',
        text: 'Bạn giúp mình được không? Cảm ơn bạn nhé!',
        correct: true,
        feedback: 'Chuẩn! Nhờ lịch sự + cảm ơn 🌟',
      },
      {
        id: 'c',
        text: 'Không giúp thì thôi!',
        feedback: 'Mình nên nhẹ nhàng hơn.',
      },
    ],
  },

  // ---------- LOGIC (Tư duy) ----------
  {
    id: 'logic_pattern_01',
    title: 'Tìm quy luật',
    prompt: 'Dãy số: 2, 4, 6, 8, … số tiếp theo là?',
    type: 'mcq',
    topic: 'logic',
    difficulty: 2,
    minAge: 7,
    points: 12,
    options: [
      { id: 'a', text: '9', feedback: 'Chưa đúng. Đây là số chẵn tăng dần.' },
      { id: 'b', text: '10', correct: true, feedback: 'Đúng! +2 mỗi lần ✅' },
      { id: 'c', text: '12', feedback: 'Bạn tăng hơi nhiều rồi.' },
    ],
  },

  // ---------- HABITS (Thói quen tốt) ----------
  {
    id: 'habits_sleep_01',
    title: 'Thói quen ngủ',
    prompt: 'Để khỏe mạnh, bạn nên làm gì trước khi ngủ?',
    type: 'scenario',
    topic: 'habits',
    difficulty: 1,
    minAge: 6,
    points: 10,
    options: [
      {
        id: 'a',
        text: 'Chơi điện thoại đến khuya',
        feedback: 'Dễ mỏi mắt và khó ngủ.',
      },
      {
        id: 'b',
        text: 'Rửa mặt, đánh răng, đi ngủ đúng giờ',
        correct: true,
        feedback: 'Đúng rồi! Ngủ đúng giờ giúp lớn nhanh 🌙',
      },
      {
        id: 'c',
        text: 'Ăn thật nhiều đồ ngọt',
        feedback: 'Ăn ngọt nhiều dễ sâu răng.',
      },
    ],
  },
];

// ===================== HELPERS (để random không chán) =====================

export type ExercisePickOptions = {
  topic?: ExerciseTopic | 'mixed';
  count?: number; // default 6
  minDifficulty?: 1 | 2 | 3 | 4 | 5;
  maxDifficulty?: 1 | 2 | 3 | 4 | 5;
  age?: number; // lọc theo tuổi
  excludeIds?: string[]; // tránh lặp
  shuffle?: boolean; // default true
};

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function withinAge(x: Exercise, age?: number) {
  if (!age) return true;
  if (typeof x.minAge === 'number' && age < x.minAge) return false;
  if (typeof x.maxAge === 'number' && age > x.maxAge) return false;
  return true;
}

function withinDifficulty(x: Exercise, minD?: number, maxD?: number) {
  if (minD && x.difficulty < minD) return false;
  if (maxD && x.difficulty > maxD) return false;
  return true;
}

/**
 * ✅ Lấy bộ câu hỏi để chơi (random, tránh lặp)
 * - topic="mixed": trộn nhiều chủ đề để đỡ chán
 */
export function pickExercises(opts: ExercisePickOptions = {}) {
  const {
    topic = 'mixed',
    count = 6,
    minDifficulty,
    maxDifficulty,
    age,
    excludeIds = [],
    shuffle: doShuffle = true,
  } = opts;

  const base = EXERCISES.filter((x) => {
    if (excludeIds.includes(x.id)) return false;
    if (!withinAge(x, age)) return false;
    if (!withinDifficulty(x, minDifficulty, maxDifficulty)) return false;
    if (topic === 'mixed') return true;
    return x.topic === topic;
  });

  // ✅ nếu mixed: ưu tiên trộn đều nhiều topic
  if (topic === 'mixed') {
    const byTopic = new Map<ExerciseTopic, Exercise[]>();
    base.forEach((x) => {
      const list = byTopic.get(x.topic) ?? [];
      list.push(x);
      byTopic.set(x.topic, list);
    });

    // round-robin lấy đều mỗi chủ đề 1 câu
    const topics = Array.from(byTopic.keys());
    const bag: Exercise[] = [];
    const pools = topics.map((t) =>
      doShuffle ? shuffle(byTopic.get(t)!) : byTopic.get(t)!
    );

    let idx = 0;
    while (bag.length < count && topics.length > 0) {
      const tIndex = idx % topics.length;
      const pool = pools[tIndex];
      const next = pool.shift();
      if (next) bag.push(next);
      idx++;

      // nếu pool rỗng, bỏ topic đó
      if (pool.length === 0) {
        topics.splice(tIndex, 1);
        pools.splice(tIndex, 1);
      }
    }

    return bag.length
      ? bag
      : doShuffle
      ? shuffle(base).slice(0, count)
      : base.slice(0, count);
  }

  return doShuffle ? shuffle(base).slice(0, count) : base.slice(0, count);
}

/**
 * ✅ Lấy danh sách topics để render filter UI
 */
export const EXERCISE_TOPICS: {
  id: ExerciseTopic;
  label: string;
  icon: string;
}[] = [
  { id: 'social', label: 'Giao tiếp', icon: '💬' },
  { id: 'emotion', label: 'Cảm xúc', icon: '😊' },
  { id: 'teamwork', label: 'Làm việc nhóm', icon: '🤝' },
  { id: 'safety', label: 'An toàn', icon: '🛡️' },
  { id: 'math', label: 'Toán', icon: '➕' },
  { id: 'language', label: 'Ngôn ngữ', icon: '📚' },
  { id: 'logic', label: 'Logic', icon: '🧩' },
  { id: 'habits', label: 'Thói quen', icon: '🌱' },
];
