// src/components/roleplay/data/story.ts
// Truyện tranh tương tác: Hoàng tử giải cứu công chúa bằng tư duy & cách ứng xử
// ✅ Asset paths khớp public/comic/... (bg + chars/*)

export type StatKey = 'calm' | 'empathy' | 'logic' | 'teamwork';
export type ComicStatsDelta = Partial<Record<StatKey, number>>;
export type BubbleType = 'speech' | 'thought' | 'narration' | 'letter';

export type ComicPanel = {
  id: string;
  background: string;
  character?: string;
  npc?: string;
  bubble?: {
    type: BubbleType;
    speaker?: string;
    text: string;
  };
};

export type ComicChoice = {
  id: string;
  text: string;
  next: string;
  delta?: ComicStatsDelta;
  feedback: { title: string; message: string };
};

export type ComicScene = {
  id: string;
  title: string;
  panels: ComicPanel[];
  choices: ComicChoice[];
};

export type ComicStory = {
  startId: string;
  scenes: Record<string, ComicScene>;
};

// ✅ BG đúng file bạn có
const BG = {
  castleMorning: '/comic/bg/castle-morning.png',
  castleNight: '/comic/bg/castle-night.png',
  forestDay: '/comic/bg/forest-day.png',

  // fallback: chưa có ảnh riêng thì dùng ảnh có sẵn
  playground: '/comic/bg/forest-day.png',
  bridge: '/comic/bg/forest-day.png',
  village: '/comic/bg/forest-day.png',
  forest: '/comic/bg/forest-day.png',
  mountain: '/comic/bg/forest-day.png',
  dining: '/comic/bg/castle-night.png',
  crossroads: '/comic/bg/forest-day.png',
  castleGate: '/comic/bg/castle-night.png',
  castleHall: '/comic/bg/castle-morning.png',
};

// ✅ chars đúng folder bạn có
const CH = {
  // Prince
  princeIdle: '/comic/chars/prince/idle.png',
  princeHappy: '/comic/chars/prince/happy.png',
  princeSad: '/comic/chars/prince/sad.png',
  princeSurprised: '/comic/chars/prince/surprised.png',

  // Princess
  princessIdle: '/comic/chars/princess/idle.png',
  princessWorried: '/comic/chars/princess/worried.png',

  // NPC fallback (tạm thời dùng 2 nhân vật có sẵn)
  wizard: '/comic/chars/prince/surprised.png',
  kidSad: '/comic/chars/princess/worried.png',
  kidsArgue: '/comic/chars/prince/surprised.png',
  newKid: '/comic/chars/princess/idle.png',
  bullyGroup: '/comic/chars/prince/sad.png',
  friendHurt: '/comic/chars/princess/worried.png',
  kidsShare: '/comic/chars/princess/idle.png',
  letter: '/comic/chars/princess/idle.png',
};

export const COMIC_STORY: ComicStory = {
  startId: 'scene_1_intro',
  scenes: {
    scene_1_intro: {
      id: 'scene_1_intro',
      title: 'Cảnh 1: Khởi đầu hành trình',
      panels: [
        {
          id: 's1p1',
          background: BG.castleMorning,
          character: CH.princeIdle,
          bubble: {
            type: 'narration',
            text: 'Ngày xưa, ở Vương quốc Ánh Sáng, có một Hoàng tử tốt bụng…',
          },
        },
        {
          id: 's1p2',
          background: BG.castleMorning,
          character: CH.princeIdle,
          npc: CH.wizard,
          bubble: {
            type: 'speech',
            speaker: 'Pháp sư',
            text:
              'Công chúa bị phong ấn trong Lâu Đài Tâm Trí. Muốn cứu nàng, con phải vượt qua các thử thách ứng xử.',
          },
        },
        {
          id: 's1p3',
          background: BG.castleMorning,
          character: CH.princeHappy,
          npc: CH.wizard,
          bubble: {
            type: 'speech',
            speaker: 'Pháp sư',
            text:
              'Nhớ nhé: sức mạnh không mở được cổng. Trí tuệ và trái tim mới mở được.',
          },
        },
      ],
      choices: [
        {
          id: 's1c1',
          text: 'Con sẽ bình tĩnh và lắng nghe mọi người.',
          next: 'scene_2_playground',
          delta: { calm: 2, logic: 1 },
          feedback: {
            title: 'Tuyệt vời!',
            message:
              'Bình tĩnh giúp con hiểu rõ chuyện gì đang xảy ra trước khi hành động.',
          },
        },
        {
          id: 's1c2',
          text: 'Con sẽ đi thật nhanh, không cần suy nghĩ nhiều.',
          next: 'scene_2_playground',
          delta: { calm: -1, logic: -1 },
          feedback: {
            title: 'Con thử nghĩ lại nhé',
            message:
              'Nhanh chưa chắc đúng. Lắng nghe giúp con tránh hiểu lầm và xử lý tốt hơn.',
          },
        },
      ],
    },

    scene_2_playground: {
      id: 'scene_2_playground',
      title: 'Cảnh 2: Sân chơi buồn bã',
      panels: [
        {
          id: 's2p1',
          background: BG.playground,
          character: CH.princeIdle,
          bubble: {
            type: 'narration',
            text: 'Hoàng tử đi ngang sân chơi và thấy một bạn nhỏ đang khóc…',
          },
        },
        {
          id: 's2p2',
          background: BG.playground,
          character: CH.princeSad,
          npc: CH.kidSad,
          bubble: {
            type: 'speech',
            speaker: 'Bạn nhỏ',
            text: 'Bạn kia lấy đồ chơi của tớ mà không xin lỗi…',
          },
        },
      ],
      choices: [
        {
          id: 's2c1',
          text:
            'Nói chuyện nhẹ nhàng: “Bạn có thể trả lại và xin lỗi được không?”',
          next: 'scene_3_bridge',
          delta: { empathy: 2, calm: 1, logic: 1 },
          feedback: {
            title: 'Khéo léo lắm!',
            message:
              'Lời nói tử tế giúp mọi người bình tĩnh và dễ giải quyết hơn.',
          },
        },
        {
          id: 's2c2',
          text: 'La lên vì tức giận: “Trả ngay! Đồ xấu tính!”',
          next: 'scene_3_bridge',
          delta: { calm: -2, empathy: -1 },
          feedback: {
            title: 'Chưa khéo lắm',
            message:
              'La mắng có thể làm mọi chuyện căng thẳng hơn và bạn kia khó hợp tác.',
          },
        },
        {
          id: 's2c3',
          text: 'Bỏ đi vì “không liên quan”.',
          next: 'scene_3_bridge',
          delta: { empathy: -1, teamwork: -1 },
          feedback: {
            title: 'Con có thể giúp mà!',
            message:
              'Giúp đúng cách là đang xây một cây cầu tình bạn cho mọi người.',
          },
        },
      ],
    },

    scene_3_bridge: {
      id: 'scene_3_bridge',
      title: 'Cảnh 3: Cây cầu tranh cãi',
      panels: [
        {
          id: 's3p1',
          background: BG.bridge,
          character: CH.princeSurprised,
          npc: CH.kidsArgue,
          bubble: {
            type: 'speech',
            speaker: 'Hai bạn',
            text: '“Tớ đi trước!” — “Không, tớ trước!”',
          },
        },
        {
          id: 's3p2',
          background: BG.bridge,
          character: CH.princeIdle,
          bubble: {
            type: 'thought',
            text: 'Mình nên làm gì để hai bạn không cãi nhau nữa?',
          },
        },
      ],
      choices: [
        {
          id: 's3c1',
          text: 'Đề nghị: “Mỗi bạn đi một lượt, lần lượt nhé!”',
          next: 'scene_4_newfriend',
          delta: { logic: 2, teamwork: 1, calm: 1 },
          feedback: {
            title: 'Công bằng và thông minh!',
            message: 'Khi có quy tắc rõ ràng, mọi người dễ đồng ý hơn.',
          },
        },
        {
          id: 's3c2',
          text: 'Đứng xem cho vui.',
          next: 'scene_4_newfriend',
          delta: { teamwork: -1 },
          feedback: {
            title: 'Bỏ lỡ cơ hội tốt',
            message: 'Nếu mình giúp đúng lúc, xung đột sẽ dừng nhanh hơn.',
          },
        },
        {
          id: 's3c3',
          text: 'Đẩy một bạn sang bên để đi nhanh.',
          next: 'scene_4_newfriend',
          delta: { empathy: -2, calm: -1 },
          feedback: {
            title: 'Không nên đâu',
            message:
              'Hành động mạnh tay có thể làm bạn bị đau và khiến mọi người sợ hãi.',
          },
        },
      ],
    },

    scene_4_newfriend: {
      id: 'scene_4_newfriend',
      title: 'Cảnh 4: Bạn mới chuyển trường',
      panels: [
        {
          id: 's4p1',
          background: BG.village,
          character: CH.princeHappy,
          npc: CH.newKid,
          bubble: {
            type: 'narration',
            text: 'Trong làng, Hoàng tử thấy một bạn mới đứng một mình…',
          },
        },
        {
          id: 's4p2',
          background: BG.village,
          npc: CH.newKid,
          bubble: {
            type: 'thought',
            speaker: 'Bạn mới',
            text: 'Mình không quen ai cả…',
          },
        },
      ],
      choices: [
        {
          id: 's4c1',
          text: 'Đến chào và mời bạn chơi cùng.',
          next: 'scene_5_words_hurt',
          delta: { empathy: 2, teamwork: 2 },
          feedback: {
            title: 'Đúng tinh thần Hoàng tử!',
            message:
              'Chủ động kết bạn giúp bạn mới cảm thấy được chào đón và an toàn.',
          },
        },
        {
          id: 's4c2',
          text: 'Nhìn rồi đi chỗ khác.',
          next: 'scene_5_words_hurt',
          delta: { teamwork: -1 },
          feedback: {
            title: 'Con có thể làm tốt hơn',
            message: 'Một lời chào nhỏ cũng có thể khiến bạn ấy vui cả ngày.',
          },
        },
        {
          id: 's4c3',
          text: 'Cười theo nhóm bạn khác để “hòa nhập”.',
          next: 'scene_5_words_hurt',
          delta: { empathy: -2, logic: -1 },
          feedback: {
            title: 'Cẩn thận nhé',
            message:
              'Cười theo có thể làm bạn mới buồn và con sẽ thấy không vui về sau.',
          },
        },
      ],
    },

    scene_5_words_hurt: {
      id: 'scene_5_words_hurt',
      title: 'Cảnh 5: Lời nói làm đau',
      panels: [
        {
          id: 's5p1',
          background: BG.forest,
          character: CH.princeSad,
          npc: CH.bullyGroup,
          bubble: {
            type: 'narration',
            text:
              'Trong rừng, Hoàng tử nghe thấy vài bạn đang trêu chọc một bạn khác…',
          },
        },
        {
          id: 's5p2',
          background: BG.forest,
          npc: CH.friendHurt,
          bubble: {
            type: 'speech',
            speaker: 'Bạn bị trêu',
            text: 'Tại sao các bạn nói vậy với tớ…',
          },
        },
      ],
      choices: [
        {
          id: 's5c1',
          text: 'Nói: “Mình nghĩ nói vậy không hay. Hãy dừng lại nhé.”',
          next: 'scene_6_anger',
          delta: { empathy: 2, calm: 1, teamwork: 1 },
          feedback: {
            title: 'Dũng cảm và tử tế!',
            message:
              'Khi con bảo vệ điều đúng, con đang giúp người khác cảm thấy an toàn.',
          },
        },
        {
          id: 's5c2',
          text: 'Im lặng, coi như không thấy.',
          next: 'scene_6_anger',
          delta: { empathy: -1 },
          feedback: {
            title: 'Con thử giúp một chút nhé',
            message: 'Im lặng đôi khi khiến người bị trêu cảm thấy cô đơn hơn.',
          },
        },
        {
          id: 's5c3',
          text: 'Trêu theo cho “vui”.',
          next: 'scene_6_anger',
          delta: { empathy: -2, logic: -1 },
          feedback: {
            title: 'Không nên đâu',
            message: 'Niềm vui của mình không nên làm người khác buồn.',
          },
        },
      ],
    },

    scene_6_anger: {
      id: 'scene_6_anger',
      title: 'Cảnh 6: Cơn giận của Hoàng tử',
      panels: [
        {
          id: 's6p1',
          background: BG.mountain,
          character: CH.princeSad,
          bubble: {
            type: 'narration',
            text: 'Trên núi đá, Hoàng tử thấy mệt và bắt đầu khó chịu…',
          },
        },
        {
          id: 's6p2',
          background: BG.mountain,
          character: CH.princeSurprised,
          bubble: {
            type: 'thought',
            text: 'Mình đang rất tức giận… nếu mình bùng nổ thì sao?',
          },
        },
      ],
      choices: [
        {
          id: 's6c1',
          text: 'Hít thở sâu 3 lần và nghĩ lại.',
          next: 'scene_7_sharing',
          delta: { calm: 3, logic: 1 },
          feedback: {
            title: 'Bình tĩnh siêu đỉnh!',
            message: 'Hít thở giúp não “nguội” lại để con chọn cách tốt hơn.',
          },
        },
        {
          id: 's6c2',
          text: 'La lớn cho hả giận.',
          next: 'scene_7_sharing',
          delta: { calm: -3 },
          feedback: {
            title: 'Con có thể thử lại',
            message: 'La hét có thể làm người khác sợ và con cũng mệt hơn.',
          },
        },
      ],
    },

    scene_7_sharing: {
      id: 'scene_7_sharing',
      title: 'Cảnh 7: Chia sẻ hay ích kỷ',
      panels: [
        {
          id: 's7p1',
          background: BG.dining,
          character: CH.princeIdle,
          npc: CH.kidsShare,
          bubble: {
            type: 'narration',
            text: 'Buổi tối, mọi người cùng ăn. Chỉ còn một miếng bánh…',
          },
        },
        {
          id: 's7p2',
          background: BG.dining,
          npc: CH.kidsShare,
          bubble: {
            type: 'speech',
            speaker: 'Các bạn nhỏ',
            text: 'Chỉ còn một miếng thôi… làm sao bây giờ?',
          },
        },
      ],
      choices: [
        {
          id: 's7c1',
          text: 'Chia đều cho mọi người (mỗi người một chút).',
          next: 'scene_8_decision',
          delta: { empathy: 2, teamwork: 2 },
          feedback: {
            title: 'Ấm áp quá!',
            message: 'Chia sẻ giúp ai cũng thấy vui và được tôn trọng.',
          },
        },
        {
          id: 's7c2',
          text: 'Giữ cho riêng mình vì mình cũng đói.',
          next: 'scene_8_decision',
          delta: { empathy: -1, teamwork: -1 },
          feedback: {
            title: 'Con thử nghĩ thêm nhé',
            message:
              'Giữ hết có thể khiến người khác buồn và không muốn chơi cùng.',
          },
        },
      ],
    },

    scene_8_decision: {
      id: 'scene_8_decision',
      title: 'Cảnh 8: Quyết định khó khăn',
      panels: [
        {
          id: 's8p1',
          background: BG.crossroads,
          character: CH.princeIdle,
          bubble: {
            type: 'narration',
            text:
              'Hoàng tử đến ngã ba đường. Một đường nhanh nhưng nguy hiểm, một đường an toàn nhưng xa hơn…',
          },
        },
        {
          id: 's8p2',
          background: BG.crossroads,
          character: CH.princeSurprised,
          bubble: {
            type: 'thought',
            text: 'Mình chọn đường nào để vừa đến nơi vừa an toàn?',
          },
        },
      ],
      choices: [
        {
          id: 's8c1',
          text: 'Chọn con đường an toàn.',
          next: 'scene_9_letter',
          delta: { logic: 2, calm: 1 },
          feedback: {
            title: 'Lựa chọn thông minh!',
            message: 'Nghĩ về hậu quả giúp con tránh rủi ro không đáng có.',
          },
        },
        {
          id: 's8c2',
          text: 'Chọn đường nhanh cho xong.',
          next: 'scene_9_letter',
          delta: { logic: -1 },
          feedback: {
            title: 'Cẩn thận nhé',
            message:
              'Nhanh đôi khi đi kèm nguy hiểm. Con thử cân nhắc kỹ hơn lần sau.',
          },
        },
      ],
    },

    scene_9_letter: {
      id: 'scene_9_letter',
      title: 'Cảnh 9: Lá thư Công chúa',
      panels: [
        {
          id: 's9p1',
          background: BG.castleGate,
          character: CH.princeIdle,
          npc: CH.letter,
          bubble: {
            type: 'letter',
            speaker: 'Công chúa (lá thư)',
            text:
              'Hoàng tử ơi… mỗi lần con chọn điều tử tế và bình tĩnh, phong ấn của ta yếu đi một chút…',
          },
        },
        {
          id: 's9p2',
          background: BG.castleGate,
          character: CH.princeHappy,
          bubble: {
            type: 'thought',
            text:
              'Mình nhất định sẽ cứu công chúa. Không phải bằng kiếm… mà bằng trái tim và trí tuệ!',
          },
        },
      ],
      choices: [
        {
          id: 's9c1',
          text: 'Tiến vào Lâu Đài Tâm Trí!',
          next: 'scene_10_rescue',
          delta: { calm: 1, empathy: 1 },
          feedback: {
            title: 'Cổng bắt đầu phát sáng…',
            message: 'Những lựa chọn tốt đẹp đang mở đường cho con.',
          },
        },
      ],
    },

    scene_10_rescue: {
      id: 'scene_10_rescue',
      title: 'Cảnh 10: Giải cứu Công chúa',
      panels: [
        {
          id: 's10p1',
          background: BG.castleHall,
          character: CH.princeSurprised,
          npc: CH.princessWorried,
          bubble: {
            type: 'narration',
            text: 'Trong đại sảnh, phong ấn nứt ra… ánh sáng lan tỏa khắp nơi.',
          },
        },
        {
          id: 's10p2',
          background: BG.castleHall,
          character: CH.princeHappy,
          npc: CH.princessIdle,
          bubble: {
            type: 'speech',
            speaker: 'Công chúa',
            text:
              'Con đã cứu ta bằng trái tim và trí tuệ. Con cũng đã trở thành một người tốt hơn.',
          },
        },
        {
          id: 's10p3',
          background: BG.castleHall,
          character: CH.princeHappy,
          npc: CH.princessIdle,
          bubble: {
            type: 'narration',
            text:
              'Kết thúc chương 1: Hoàng tử chiến thắng không bằng bạo lực, mà bằng cách ứng xử đúng.',
          },
        },
      ],
      choices: [
        {
          id: 's10c1',
          text: 'Chơi lại chương 1 (thử chọn khác để xem câu chuyện thay đổi)',
          next: 'scene_1_intro',
          delta: { logic: 0 },
          feedback: {
            title: 'Tuyệt!',
            message: 'Mỗi lần chơi lại là một lần con học được thêm điều hay.',
          },
        },
      ],
    },
  },
};
