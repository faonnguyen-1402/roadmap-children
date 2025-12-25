'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PuzzleGame from '@/components/games/puzzle/PuzzleGame';
import FindDifferenceGame from '@/components/games/find-difference/FindDifferenceGame';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SkillsVideoHub from '@/components/skills/SkillsVideoHub';
import NotificationsBell from '@/components/notifications/NotificationsBell';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Map,
  Gamepad2,
  Brain,
  Users,
  Star,
  Trophy,
  Target,
  Settings,
  BookOpen,
} from 'lucide-react';

import { AuthForm, LogoutButton } from '@/components/auth-form/auth-form';
import { QuizManager } from '@/components/quiz/quiz-manager';
import { questionsData } from '@/lib/questions-data';

// ✅ Roleplay
import RoleplayGame from '@/components/roleplay/RoleplayGame';

// ✅ Matching
import MatchingColorGame from './games/matching/MatchingColorGame';

// ✅ Screen Time + Settings + Exercises + Progress
import { ScreenTimeProvider } from '@/components/screen-time/ScreenTimeProvider';
import ScreenTimeTopBar from '@/components/screen-time/ScreenTimeTopBar';
import ScreenTimeWarningModal from '@/components/screen-time/ScreenTimeWarningModal';
import ScreenTimeLockScreen from '@/components/screen-time/ScreenTimeLockScreen';

import ScreenTimeSettingsCard from '@/components/settings/ScreenTimeSettingsCard';
import InteractiveExerciseModule from '@/components/exercises/InteractiveExerciseModule';
import ProgressPanel from '@/components/progress/ProgressPanel';

import {
  addExerciseResult,
  loadProgress,
  type ChildProgress,
} from '@/lib/progress';

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  totalScore: number;
  level: number;
  streak: number;
  badges: string[];
  completedTopics: string[];
}

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: number;
  questions: any[];
}

export default function ChildrenDevelopmentApp() {
  const router = useRouter();

  // ✅ dùng để bật/tắt nhập vai
  const [showRoleplay, setShowRoleplay] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [currentSection, setCurrentSection] = useState<
    | 'home'
    | 'journey'
    | 'games'
    | 'personality'
    | 'parent'
    | 'quiz'
    | 'memory-game'
    | 'puzzle'
    | 'find-diff'
    | 'settings'
    | 'exercises'
    | 'skills'
  >('home');

  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

  // ✅ screen time warning modal
  const [warnOpen, setWarnOpen] = useState(false);
  const [warnRemaining, setWarnRemaining] = useState(0);

  // ✅ progress
  const [progress, setProgress] = useState<ChildProgress | null>(null);

  // Personality quiz state
  const [personalityQuizActive, setPersonalityQuizActive] = useState(false);
  const [personalityAnswers, setPersonalityAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [personalityResults, setPersonalityResults] = useState<any>(null);
  const [currentPersonalityQuestion, setCurrentPersonalityQuestion] =
    useState(0);
  const [reflectionAnswers, setReflectionAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  // Save user data to localStorage
  useEffect(() => {
    if (currentUser)
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  // Load progress when user available
  useEffect(() => {
    if (currentUser) setProgress(loadProgress(currentUser.id));
  }, [currentUser]);

  const handleLogin = (user: User) => setCurrentUser(user);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentSection('home');
    setShowRoleplay(false);
    setProgress(null);
  };
const renderSkillsSection = () => (
  <SkillsVideoHub
    userId={currentUser.id}
    onBack={() => setCurrentSection('home')}
  />
);
  const startTopic = (topicId: string) => {
    const topic = questionsData.find((t) => t.id === topicId);
    if (topic) {
      setCurrentTopic(topic);
      setCurrentSection('quiz');
      setShowRoleplay(false);
    }
  };

  // ✅ mở matching (thử thách 2 phút)
  const initializeMemoryGame = () => {
    setCurrentSection('memory-game');
    setShowRoleplay(false);
  };

  // ---------------- Personality Quiz ----------------

  const personalityQuestions = [
    {
      id: 1,
      question: 'Khi bạn gặp bạn mới, bạn thường làm gì?',
      options: [
        { value: 'extrovert', text: 'Chủ động chào hỏi và làm quen ngay' },
        { value: 'introvert', text: 'Chờ bạn ấy nói chuyện trước' },
        { value: 'ambivert', text: 'Mỉm cười và chờ cơ hội phù hợp' },
      ],
    },
    {
      id: 2,
      question: 'Bạn thích làm việc như thế nào?',
      options: [
        { value: 'team', text: 'Làm việc nhóm, cùng bạn bè' },
        { value: 'individual', text: 'Làm một mình, tập trung cao' },
        { value: 'flexible', text: 'Tùy vào công việc mà quyết định' },
      ],
    },
    {
      id: 3,
      question: 'Khi gặp khó khăn, bạn thường làm gì?',
      options: [
        { value: 'persistent', text: 'Cố gắng giải quyết đến cùng' },
        { value: 'help-seeking', text: 'Nhờ người khác giúp đỡ' },
        { value: 'strategic', text: 'Nghỉ ngơi rồi tìm cách khác' },
      ],
    },
    {
      id: 4,
      question: 'Điều gì khiến bạn hạnh phúc nhất?',
      options: [
        { value: 'social', text: 'Chơi với bạn bè' },
        { value: 'creative', text: 'Tạo ra điều gì đó mới' },
        { value: 'achievement', text: 'Hoàn thành mục tiêu' },
      ],
    },
    {
      id: 5,
      question: 'Bạn thích học môn gì nhất?',
      options: [
        { value: 'artistic', text: 'Vẽ, nhạc, văn học' },
        { value: 'logical', text: 'Toán, khoa học' },
        { value: 'social', text: 'Lịch sử, địa lý' },
      ],
    },
    {
      id: 6,
      question: 'Bạn thường làm gì vào thời gian rảnh?',
      options: [
        { value: 'active', text: 'Chơi thể thao, vận động' },
        { value: 'relaxing', text: 'Nghe nhạc, đọc sách' },
        { value: 'social', text: 'Đi chơi với bạn bè' },
      ],
    },
    {
      id: 7,
      question: 'Khi phải thuyết trình trước lớp, bạn cảm thấy thế nào?',
      options: [
        { value: 'confident', text: 'Hào hứng và tự tin' },
        { value: 'nervous', text: 'Lo lắng và hồi hộp' },
        { value: 'neutral', text: 'Bình thường, không quá lo' },
      ],
    },
    {
      id: 8,
      question: 'Bạn muốn tham gia hoạt động nào nhất?',
      options: [
        { value: 'creative', text: 'Câu lạc bộ nghệ thuật' },
        { value: 'logical', text: 'Câu lạc bộ khoa học' },
        { value: 'social', text: 'Câu lạc bộ thiện nguyện' },
      ],
    },
    {
      id: 9,
      question: 'Khi chơi trò chơi, bạn thường chọn vai gì?',
      options: [
        { value: 'leader', text: 'Người lãnh đạo, chỉ huy' },
        { value: 'support', text: 'Người hỗ trợ, giúp đỡ' },
        { value: 'independent', text: 'Người tự làm theo cách riêng' },
      ],
    },
    {
      id: 10,
      question: 'Bạn cảm thấy thế nào khi có nhiều người chú ý đến mình?',
      options: [
        { value: 'happy', text: 'Thích thú và vui vẻ' },
        { value: 'uncomfortable', text: 'Ngại ngùng, không thoải mái' },
        { value: 'neutral', text: 'Không quan tâm lắm' },
      ],
    },
    {
      id: 11,
      question: 'Bạn thường phản ứng thế nào khi có thử thách mới?',
      options: [
        { value: 'excited', text: 'Hào hứng chấp nhận thử thách' },
        { value: 'cautious', text: 'Suy nghĩ kỹ trước khi tham gia' },
        { value: 'avoid', text: 'Tránh né nếu thấy khó' },
      ],
    },
    {
      id: 12,
      question: 'Bạn muốn kỳ nghỉ của mình như thế nào?',
      options: [
        { value: 'adventure', text: 'Khám phá, đi du lịch' },
        { value: 'rest', text: 'Ở nhà nghỉ ngơi' },
        { value: 'family', text: 'Dành thời gian cho gia đình' },
      ],
    },
    {
      id: 13,
      question: 'Bạn nghĩ mình là người như thế nào trong nhóm bạn?',
      options: [
        { value: 'leader', text: 'Người dẫn dắt, quyết định' },
        { value: 'mediator', text: 'Người hòa giải, kết nối' },
        { value: 'observer', text: 'Người lặng lẽ, theo dõi' },
      ],
    },
    {
      id: 14,
      question: 'Bạn thường chọn cách nào để giải trí?',
      options: [
        { value: 'digital', text: 'Chơi game, xem phim' },
        { value: 'creative', text: 'Vẽ, viết, sáng tạo' },
        { value: 'outdoor', text: 'Đi dạo, chơi thể thao' },
      ],
    },
    {
      id: 15,
      question: 'Bạn thấy mình giống với con vật nào nhất?',
      options: [
        { value: 'lion', text: 'Sư tử - mạnh mẽ, lãnh đạo' },
        { value: 'cat', text: 'Mèo - yên tĩnh, độc lập' },
        { value: 'dog', text: 'Chó - thân thiện, trung thành' },
      ],
    },
    {
      id: 16,
      question: 'Khi làm bài tập, bạn thường...',
      options: [
        { value: 'planner', text: 'Lập kế hoạch chi tiết rồi làm' },
        { value: 'improviser', text: 'Làm ngay và chỉnh sửa sau' },
        { value: 'mixed', text: 'Kết hợp cả hai cách' },
      ],
    },
    {
      id: 17,
      question: 'Bạn thích không gian học tập như thế nào?',
      options: [
        { value: 'quiet', text: 'Yên tĩnh, tập trung' },
        { value: 'dynamic', text: 'Có nhạc nền hoặc bạn bè' },
        { value: 'flexible', text: 'Thay đổi tùy lúc' },
      ],
    },
    {
      id: 18,
      question: 'Khi bạn bè có chuyện buồn, bạn thường...',
      options: [
        { value: 'listener', text: 'Lắng nghe và an ủi' },
        { value: 'advisor', text: 'Đưa lời khuyên, giải pháp' },
        { value: 'silent', text: 'Ở bên cạnh nhưng không nói nhiều' },
      ],
    },
    {
      id: 19,
      question: 'Điều gì quan trọng nhất đối với bạn?',
      options: [
        { value: 'freedom', text: 'Sự tự do và độc lập' },
        { value: 'relationships', text: 'Gia đình và bạn bè' },
        { value: 'success', text: 'Thành công trong học tập/công việc' },
      ],
    },
    {
      id: 20,
      question: 'Bạn phản ứng thế nào khi có sự thay đổi bất ngờ?',
      options: [
        { value: 'adaptable', text: 'Nhanh chóng thích nghi' },
        { value: 'stressed', text: 'Căng thẳng và lo lắng' },
        { value: 'neutral', text: 'Thích nghi từ từ' },
      ],
    },
    {
      id: 21,
      question: 'Bạn muốn được ghi nhận như thế nào?',
      options: [
        { value: 'public', text: 'Được khen ngợi trước mọi người' },
        { value: 'private', text: 'Được khen riêng' },
        { value: 'result', text: 'Kết quả tốt là đủ, không cần lời khen' },
      ],
    },
    {
      id: 22,
      question: 'Trong giờ giải lao, bạn thường...',
      options: [
        { value: 'chat', text: 'Nói chuyện với bạn bè' },
        { value: 'relax', text: 'Ngồi yên nghỉ ngơi' },
        { value: 'play', text: 'Chơi trò chơi, vận động' },
      ],
    },
    {
      id: 23,
      question: 'Bạn học tốt nhất khi nào?',
      options: [
        { value: 'morning', text: 'Buổi sáng, đầu ngày' },
        { value: 'night', text: 'Buổi tối, yên tĩnh' },
        { value: 'anytime', text: 'Bất cứ lúc nào có hứng thú' },
      ],
    },
    {
      id: 24,
      question: 'Bạn thường quyết định dựa trên...',
      options: [
        { value: 'logic', text: 'Lý trí, phân tích' },
        { value: 'feelings', text: 'Cảm xúc, trực giác' },
        { value: 'balance', text: 'Kết hợp cả hai' },
      ],
    },
    {
      id: 25,
      question: 'Nếu được chọn một siêu năng lực, bạn muốn...',
      options: [
        { value: 'invisible', text: 'Tàng hình để quan sát' },
        { value: 'fly', text: 'Bay đi khắp nơi' },
        { value: 'strong', text: 'Sức mạnh phi thường' },
      ],
    },
  ];

  const reflectionQuestions = [
    'Điều gì làm bạn cảm thấy tự hào về bản thân?',
    'Khi buồn, bạn thường làm gì để cảm thấy tốt hơn?',
    'Bạn muốn trở thành người như thế nào khi lớn lên?',
    'Điều gì khiến bạn cảm thấy lo lắng và làm sao để vượt qua?',
    'Bạn thích giúp đỡ người khác bằng cách nào?',
  ];

  const startPersonalityQuiz = () => {
    const shuffled = [...personalityQuestions].sort(() => Math.random() - 0.5);
    const random10 = shuffled.slice(0, 10);

    setSelectedQuestions(random10);
    setPersonalityQuizActive(true);
    setCurrentPersonalityQuestion(0);
    setPersonalityAnswers({});
    setPersonalityResults(null);
    setShowRoleplay(false);
  };

  const answerPersonalityQuestion = (answer: string) => {
    const newAnswers = {
      ...personalityAnswers,
      [currentPersonalityQuestion]: answer,
    };
    setPersonalityAnswers(newAnswers);

    if (currentPersonalityQuestion < selectedQuestions.length - 1) {
      setCurrentPersonalityQuestion(currentPersonalityQuestion + 1);
    } else {
      calculatePersonalityResults(newAnswers);
    }
  };

  const calculatePersonalityResults = (answers: { [key: string]: string }) => {
    const traits = {
      extrovert: 0,
      introvert: 0,
      creative: 0,
      logical: 0,
      social: 0,
      persistent: 0,
      team: 0,
      individual: 0,
    };

    Object.values(answers).forEach((answer) => {
      if (Object.prototype.hasOwnProperty.call(traits, answer)) {
        traits[answer as keyof typeof traits]++;
      }
    });

    const primaryTrait = Object.entries(traits).reduce((a, b) =>
      traits[a[0] as keyof typeof traits] >
      traits[b[0] as keyof typeof traits]
        ? a
        : b
    )[0];

    const personalityType = getPersonalityType(primaryTrait);
    setPersonalityResults(personalityType);
    setPersonalityQuizActive(false);
  };

  const getPersonalityType = (primaryTrait: string) => {
    const types: any = {
      extrovert: {
        title: 'Người hướng ngoại',
        description:
          'Bạn là người năng động, thích giao tiếp và làm việc với nhiều người!',
        icon: '😊',
        strengths: ['Giao tiếp tốt', 'Năng động', 'Lạc quan', 'Dễ kết bạn'],
        tips: [
          'Thử thách bản thân với các hoạt động yên tĩnh',
          'Lắng nghe nhiều hơn',
          'Phát triển kỹ năng tập trung',
        ],
      },
      introvert: {
        title: 'Người hướng nội',
        description:
          'Bạn là người suy nghĩ sâu sắc, thích không gian riêng và tập trung cao!',
        icon: '🤔',
        strengths: [
          'Tập trung tốt',
          'Suy nghĩ sâu sắc',
          'Quan sát tinh tế',
          'Độc lập',
        ],
        tips: [
          'Thử tham gia hoạt động nhóm nhỏ',
          'Chia sẻ ý kiến nhiều hơn',
          'Mở rộng vòng bạn bè',
        ],
      },
      creative: {
        title: 'Người sáng tạo',
        description:
          'Bạn có trí tưởng tượng phong phú và thích tạo ra những điều mới mẻ!',
        icon: '🎨',
        strengths: [
          'Tưởng tượng phong phú',
          'Nghĩ khác biệt',
          'Linh hoạt',
          'Đam mê nghệ thuật',
        ],
        tips: [
          'Kết hợp sáng tạo với logic',
          'Hoàn thành những ý tưởng',
          'Học cách tổ chức',
        ],
      },
      logical: {
        title: 'Người logic',
        description:
          'Bạn thích suy nghĩ có hệ thống và giải quyết vấn đề một cách khoa học!',
        icon: '🧠',
        strengths: ['Tư duy logic', 'Giải quyết vấn đề', 'Có hệ thống', 'Phân tích tốt'],
        tips: [
          'Phát triển khía cạnh cảm xúc',
          'Thử các hoạt động nghệ thuật',
          'Học cách linh hoạt',
        ],
      },
      social: {
        title: 'Người xã hội',
        description:
          'Bạn quan tâm đến người khác và thích giúp đỡ mọi người xung quanh!',
        icon: '🤝',
        strengths: [
          'Đồng cảm cao',
          'Giúp đỡ người khác',
          'Giao tiếp tốt',
          'Hiểu biết xã hội',
        ],
        tips: [
          'Chăm sóc bản thân',
          'Đặt ranh giới cá nhân',
          'Phát triển sở thích riêng',
        ],
      },
    };

    return types[primaryTrait] || types.social;
  };

  const saveReflectionAnswer = (questionIndex: number, answer: string) => {
    setReflectionAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  // ---------------- UI render ----------------

  if (!currentUser) return <AuthForm onLogin={handleLogin} />;

  const renderHeader = () => (
    <div className='bg-card/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div className='min-w-0'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2 leading-tight'>
            🌟 Khám Phá Bản Thân 🌟
          </h1>
          <p className='text-sm sm:text-base text-muted-foreground'>
            Chào <span className='font-semibold'>{currentUser.name}</span>! Hãy
            cùng học tập nhé!
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-2 sm:gap-3 justify-start lg:justify-end'>
          <Badge variant='secondary' className='px-3 py-1.5 text-xs sm:text-sm'>
            <Star className='w-4 h-4 mr-1' />
            Điểm: {currentUser.totalScore}
          </Badge>
          <Badge variant='secondary' className='px-3 py-1.5 text-xs sm:text-sm'>
            <Trophy className='w-4 h-4 mr-1' />
            Cấp: {currentUser.level}
          </Badge>
          <Badge variant='secondary' className='px-3 py-1.5 text-xs sm:text-sm'>
            <Target className='w-4 h-4 mr-1' />
            <span className='hidden sm:inline'>Streak:</span>{' '}
            {currentUser.streak} 🔥
          </Badge>

          <div className='ml-auto lg:ml-0'>
             <NotificationsBell userId={currentUser.id} />
            <LogoutButton onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className='sticky top-2 z-20 bg-card/90 backdrop-blur-sm rounded-xl p-2 sm:p-4 mb-4 sm:mb-6 shadow-md'>
      <div className='flex gap-2 overflow-x-auto whitespace-nowrap sm:flex-wrap sm:justify-center pb-1'>
        {[
          { id: 'home', label: 'Trang chủ', icon: Home },
          { id: 'journey', label: 'Hành trình', icon: Map },
          { id: 'games', label: 'Trò chơi', icon: Gamepad2 },
          { id: 'exercises', label: 'Bài tập', icon: BookOpen },
          { id: 'personality', label: 'Tính cách', icon: Brain },
          { id: 'skills', label: 'Video kỹ năng', icon: BookOpen },
          { id: 'settings', label: 'Cài đặt', icon: Settings },
          { id: 'parent', label: 'Phụ huynh', icon: Users },
        ].map(({ id, label, icon: Icon }) => {
          const active = currentSection === id;
          return (
            <Button
              key={id}
              variant={active ? 'default' : 'ghost'}
              onClick={() => {
                setCurrentSection(id as any);
                setShowRoleplay(false);
              }}
              className={[
                'flex items-center gap-2 shrink-0',
                'h-9 sm:h-10 px-3 sm:px-4',
                'cursor-pointer',
                'text-xs sm:text-sm',
                active ? '' : 'hover:bg-muted/60',
              ].join(' ')}
            >
              <Icon className='w-4 h-4' />
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );

  const renderHomeSection = () => (
    <div className='space-y-4 sm:space-y-6'>
      <div className='bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-4 sm:p-6 text-center'>
        <h2 className='text-lg sm:text-2xl font-bold text-orange-600 mb-1 sm:mb-2'>
          Chào mừng đến với thế giới khám phá! 🚀
        </h2>
        <p className='text-sm sm:text-base text-gray-600'>
          Hãy chọn chủ đề bạn muốn khám phá hôm nay
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
        {questionsData.map((topic) => (
          <Card
            key={topic.id}
            className='cursor-pointer transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg bg-gradient-to-br from-green-50 to-blue-50'
            onClick={() => startTopic(topic.id)}
          >
            <CardHeader className='text-center p-4 sm:p-6'>
              <div className='text-4xl mb-2 animate-bounce-gentle'>
                {topic.icon}
              </div>
              <CardTitle className='text-base sm:text-xl'>
                {topic.title}
              </CardTitle>
              <CardDescription className='text-xs sm:text-sm'>
                {topic.description}
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center p-4 pt-0 sm:p-6 sm:pt-0'>
              <div className='flex justify-center mb-2'>
                {Array.from({ length: topic.difficulty }).map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 fill-yellow-400 text-yellow-400'
                  />
                ))}
              </div>
              <Badge variant='outline' className='text-[10px] sm:text-xs'>
                {topic.questions.length} câu hỏi
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ✅ Phiêu lưu 2D */}
      <Card
        className='cursor-pointer transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg bg-gradient-to-br from-yellow-100 to-orange-100'
        onClick={() => router.push('/adventure')}
      >
        <CardHeader className='text-center p-4 sm:p-6'>
          <CardTitle className='text-base sm:text-xl'>Phiêu Lưu 2D</CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            Chạy và vượt chướng ngại vật
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ✅ Nhập vai */}
      <Card
        className='cursor-pointer transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg bg-gradient-to-br from-emerald-100 to-teal-100'
        onClick={() => setShowRoleplay(true)}
      >
        <CardHeader className='text-center p-4 sm:p-6'>
          <CardTitle className='text-base sm:text-xl'>Nhập vai</CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            Hoàng tử giải cứu công chúa và học cách ứng xử
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ✅ Roleplay full-width */}
      {showRoleplay && (
        <div className='space-y-3'>
          <div className='flex justify-end'>
            <Button
              variant='outline'
              onClick={() => setShowRoleplay(false)}
              className='h-9'
            >
              ← Quay lại
            </Button>
          </div>
          <div className='rounded-2xl overflow-hidden shadow-lg'>
            <RoleplayGame />
          </div>
        </div>
      )}

      {/* ✅ Bài tập tương tác */}
      <Card
        className='cursor-pointer transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg bg-gradient-to-br from-emerald-50 to-cyan-50'
        onClick={() => setCurrentSection('exercises')}
      >
        <CardHeader className='text-center p-4 sm:p-6'>
          <CardTitle className='text-base sm:text-xl'>
            🧩 Bài tập tương tác
          </CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            Tình huống + trắc nghiệm, có điểm và huy hiệu
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ✅ Cài đặt */}
      <Card
        className='cursor-pointer transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg bg-gradient-to-br from-slate-50 to-indigo-50'
        onClick={() => setCurrentSection('settings')}
      >
        <CardHeader className='text-center p-4 sm:p-6'>
          <CardTitle className='text-base sm:text-xl'>⚙️ Cài đặt</CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            Giới hạn thời gian/ngày, PIN phụ huynh, xem thành tích
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ✅ Challenge */}
      <Card className='bg-gradient-to-r from-pink-100 to-purple-100'>
        <CardHeader className='p-4 sm:p-6'>
          <CardTitle className='text-center text-pink-600 text-base sm:text-xl'>
            🎯 Thử thách hôm nay
          </CardTitle>
        </CardHeader>
        <CardContent className='p-4 pt-0 sm:p-6 sm:pt-0'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 bg-white/80 rounded-xl p-3 sm:p-4'>
            <div className='text-3xl sm:text-4xl bg-gradient-to-r from-blue-500 to-purple-500 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center'>
              🌟
            </div>
            <div className='flex-1'>
              <h4 className='font-bold text-sm sm:text-lg'>
                Thử thách trí nhớ siêu tốc
              </h4>
              <p className='text-xs sm:text-sm text-gray-600'>
                Hoàn thành trò chơi trí nhớ trong 2 phút!
              </p>
            </div>
            <Button onClick={initializeMemoryGame} className='w-full sm:w-auto'>
              Bắt đầu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuizSection = () => {
    if (!currentTopic) return null;

    return (
      <QuizManager
        topic={currentTopic}
        onComplete={(score, correctAnswers) => {
          const finalScore = Math.round((correctAnswers / 10) * 100);
          const updatedUser = {
            ...currentUser,
            totalScore: currentUser.totalScore + finalScore,
            completedTopics: [
              ...new Set([...currentUser.completedTopics, currentTopic.id]),
            ],
          };
          setCurrentUser(updatedUser);
        }}
        onBack={() => setCurrentSection('home')}
      />
    );
  };

  const renderMemoryGame = () => (
    <MatchingColorGame onBack={() => setCurrentSection('games')} />
  );

  // ✅ NEW: Puzzle
  const renderPuzzleGame = () => (
    <div className='space-y-3'>
      <div className='flex justify-end'>
        <Button
          variant='outline'
          onClick={() => setCurrentSection('games')}
          className='h-9'
        >
          ← Quay lại
        </Button>
      </div>

      <div className='rounded-2xl overflow-hidden shadow-lg bg-white/70'>
        <PuzzleGame />
        {/* Nếu PuzzleGame có onBack:
            <PuzzleGame onBack={() => setCurrentSection('games')} />
        */}
      </div>
    </div>
  );

  // ✅ NEW: Find difference
  const renderFindDiffGame = () => (
    <div className='space-y-3'>
      <div className='flex justify-end'>
        <Button
          variant='outline'
          onClick={() => setCurrentSection('games')}
          className='h-9'
        >
          ← Quay lại
        </Button>
      </div>

      <div className='rounded-2xl overflow-hidden shadow-lg bg-white/70'>
        <FindDifferenceGame />
        {/* Nếu FindDifferenceGame có onBack:
            <FindDifferenceGame onBack={() => setCurrentSection('games')} />
        */}
      </div>
    </div>
  );

  const renderGamesSection = () => (
    <div className='space-y-4 sm:space-y-6'>
      <h2 className='text-lg sm:text-2xl font-bold text-center'>
        🎮 Trò Chơi Phát Triển Tư Duy
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
        <Card
          className='cursor-pointer transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50'
          onClick={initializeMemoryGame}
        >
          <CardHeader className='text-center p-4 sm:p-6'>
            <div className='text-4xl mb-2'>🧠</div>
            <CardTitle className='text-base sm:text-xl'>
              Trò chơi trí nhớ
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              Lật thẻ và tìm cặp giống nhau (màu sắc)
            </CardDescription>
          </CardHeader>
        </Card>

        {/* ✅ Puzzle - READY */}
        <Card
          onClick={() => setCurrentSection('puzzle')}
          className='cursor-pointer transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg bg-gradient-to-br from-purple-50 to-pink-50'
        >
          <CardHeader className='text-center p-4 sm:p-6'>
            <div className='text-4xl mb-2'>🧩</div>
            <CardTitle className='text-base sm:text-xl'>Xếp hình</CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              Ghép các mảnh để tạo thành hình hoàn chỉnh
            </CardDescription>
          </CardHeader>
        </Card>

        {/* ✅ Find Diff - READY */}
        <Card
          onClick={() => setCurrentSection('find-diff')}
          className='cursor-pointer transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50'
        >
          <CardHeader className='text-center p-4 sm:p-6'>
            <div className='text-4xl mb-2'>🔍</div>
            <CardTitle className='text-base sm:text-xl'>Tìm khác biệt</CardTitle>
            <CardDescription className='text-xs sm:text-sm'>
              Tìm những điểm khác nhau giữa hai hình
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  const renderJourneySection = () => (
    <div className='space-y-4 sm:space-y-6'>
      <div className='bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 sm:p-6 text-center'>
        <h2 className='text-lg sm:text-2xl font-bold text-blue-600 mb-1 sm:mb-2'>
          🗺️ Hành Trình Phát Triển
        </h2>
        <p className='text-sm sm:text-base text-gray-600'>
          Theo dõi tiến trình học tập và phát triển của bạn
        </p>
      </div>

      {/* ✅ progress panel */}
      {progress && <ProgressPanel progress={progress} />}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
        <Card className='bg-gradient-to-br from-green-50 to-emerald-50'>
          <CardHeader className='p-4 sm:p-6'>
            <CardTitle className='flex items-center gap-2 text-base sm:text-xl'>
              <Trophy className='w-5 h-5 text-yellow-500' />
              Thành tích của bạn
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 sm:space-y-4 p-4 pt-0 sm:p-6 sm:pt-0'>
            <div className='flex justify-between items-center p-3 bg-white/80 rounded-lg text-sm'>
              <span>Tổng điểm số</span>
              <Badge variant='secondary'>{currentUser.totalScore}</Badge>
            </div>
            <div className='flex justify-between items-center p-3 bg-white/80 rounded-lg text-sm'>
              <span>Cấp độ hiện tại</span>
              <Badge variant='secondary'>Cấp {currentUser.level}</Badge>
            </div>
            <div className='flex justify-between items-center p-3 bg-white/80 rounded-lg text-sm'>
              <span>Chủ đề đã hoàn thành</span>
              <Badge variant='secondary'>
                {currentUser.completedTopics.length}/5
              </Badge>
            </div>
            <div className='flex justify-between items-center p-3 bg-white/80 rounded-lg text-sm'>
              <span>Streak hiện tại</span>
              <Badge variant='secondary'>{currentUser.streak} ngày 🔥</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-orange-50 to-red-50'>
          <CardHeader className='p-4 sm:p-6'>
            <CardTitle className='flex items-center gap-2 text-base sm:text-xl'>
              <Target className='w-5 h-5 text-orange-500' />
              Mục tiêu tuần này
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 sm:space-y-4 p-4 pt-0 sm:p-6 sm:pt-0'>
            <div className='p-4 bg-white/80 rounded-lg'>
              <h4 className='font-semibold mb-2 text-sm sm:text-base'>
                🎯 Hoàn thành 3 chủ đề mới
              </h4>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-orange-500 h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${(currentUser.completedTopics.length / 3) * 100}%`,
                  }}
                />
              </div>
              <p className='text-xs sm:text-sm text-gray-600 mt-1'>
                {currentUser.completedTopics.length}/3 hoàn thành
              </p>
            </div>

            <div className='p-4 bg-white/80 rounded-lg'>
              <h4 className='font-semibold mb-2 text-sm sm:text-base'>
                ⭐ Đạt 500 điểm
              </h4>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-yellow-500 h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${Math.min((currentUser.totalScore / 500) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className='text-xs sm:text-sm text-gray-600 mt-1'>
                {currentUser.totalScore}/500 điểm
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='bg-gradient-to-r from-purple-50 to-pink-50'>
        <CardHeader className='p-4 sm:p-6'>
          <CardTitle className='text-center text-base sm:text-xl'>
            🌟 Lộ trình học tập
          </CardTitle>
        </CardHeader>
        <CardContent className='p-4 pt-0 sm:p-6 sm:pt-0'>
          <div className='space-y-3 sm:space-y-4'>
            {questionsData.map((topic, index) => (
              <div
                key={topic.id}
                className='flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/80 rounded-lg'
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    currentUser.completedTopics.includes(topic.id)
                      ? 'bg-green-500'
                      : index === 0 ||
                        currentUser.completedTopics.includes(
                          questionsData[index - 1]?.id
                        )
                      ? 'bg-blue-500'
                      : 'bg-gray-400'
                  }`}
                >
                  {currentUser.completedTopics.includes(topic.id) ? '✓' : index + 1}
                </div>
                <div className='flex-1 min-w-0'>
                  <h4 className='font-semibold text-sm sm:text-base truncate'>
                    {topic.title}
                  </h4>
                  <p className='text-xs sm:text-sm text-gray-600 line-clamp-2'>
                    {topic.description}
                  </p>
                </div>
                <div className='text-2xl'>{topic.icon}</div>
                {currentUser.completedTopics.includes(topic.id) && (
                  <Badge
                    variant='secondary'
                    className='bg-green-100 text-green-700 text-[10px] sm:text-xs'
                  >
                    Hoàn thành
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ===== Personality / Parent / Settings / Exercises =====
  // (Mình giữ nguyên phần này của bạn — bạn cứ để như cũ trong file gốc.)
  // Vì bạn gửi quá dài, phần còn lại bạn giữ nguyên 100%,
  // chỉ cần thay 2 chỗ dưới đây trong phần return.

  const renderParentSection = () => (
    <div className='space-y-4 sm:space-y-6'>
      <div className='bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-4 sm:p-6 text-center'>
        <h2 className='text-lg sm:text-2xl font-bold text-rose-600 mb-1 sm:mb-2'>
          👨‍👩‍👧‍👦 Góc Phụ Huynh
        </h2>
        <p className='text-sm sm:text-base text-gray-600'>
          Hướng dẫn và theo dõi sự phát triển của con bạn
        </p>
      </div>
    </div>
  );

  const renderSettingsSection = () => (
    <div className='space-y-4 sm:space-y-6'>
      <div className='bg-gradient-to-r from-slate-100 to-indigo-100 rounded-2xl p-4 sm:p-6 text-center'>
        <h2 className='text-lg sm:text-2xl font-bold text-indigo-700 mb-1 sm:mb-2'>
          ⚙️ Cài đặt & An toàn
        </h2>
        <p className='text-sm sm:text-base text-gray-600'>
          Phụ huynh thiết lập giới hạn thời gian, PIN và mở thêm thời gian.
        </p>
      </div>

      <ScreenTimeSettingsCard />

      {progress && <ProgressPanel progress={progress} />}
    </div>
  );

  const renderExercisesSection = () => (
    <div className='space-y-4 sm:space-y-6'>
      <div className='bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-4 sm:p-6 text-center'>
        <h2 className='text-lg sm:text-2xl font-bold text-emerald-700 mb-1 sm:mb-2'>
          🧩 Bài tập tương tác
        </h2>
        <p className='text-sm sm:text-base text-gray-600'>
          Làm bài tập để nhận điểm và huy hiệu!
        </p>
      </div>

      <InteractiveExerciseModule
        onBack={() => setCurrentSection('home')}
        onFinish={(r) => {
          if (!currentUser) return;

          const updated = addExerciseResult(currentUser.id, {
            id: r.id,
            title: r.title,
            score: r.score,
            maxScore: r.maxScore,
            createdAt: new Date().toISOString(),
          });

          setProgress(updated);

          setCurrentUser((u) => {
            if (!u) return u;
            return {
              ...u,
              totalScore: u.totalScore + r.score,
              streak: updated.streakDays,
            };
          });

          setCurrentSection('journey');
        }}
      />
    </div>
  );

  // ===================== WRAP WITH ScreenTimeProvider =====================
  return (
    <ScreenTimeProvider
      userId={currentUser.id}
      onWarn={(remain) => {
        setWarnRemaining(remain);
        setWarnOpen(true);
      }}
      onLocked={() => {
        setCurrentSection('home');
      }}
    >
      <ScreenTimeWarningModal
        open={warnOpen}
        remainingSeconds={warnRemaining}
        onClose={() => setWarnOpen(false)}
      />

      <ScreenTimeLockScreen />

      <div className='min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100'>
        <div className='px-3 py-4 sm:px-6 sm:py-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            {renderHeader()}

            {/* ✅ Thanh thời gian mỗi ngày */}
            <div className='mb-4 sm:mb-6'>
              <ScreenTimeTopBar />
            </div>

            {/* ✅ Hide nav on game full screens */}
            {currentSection !== 'quiz' &&
              currentSection !== 'memory-game' &&
              currentSection !== 'puzzle' &&
              currentSection !== 'find-diff' &&
              renderNavigation()}

            <div className='pb-10'>
              {currentSection === 'home' && renderHomeSection()}
              {currentSection === 'quiz' && renderQuizSection()}
              {currentSection === 'memory-game' && renderMemoryGame()}
              {currentSection === 'puzzle' && renderPuzzleGame()}
              {currentSection === 'find-diff' && renderFindDiffGame()}
              {currentSection === 'games' && renderGamesSection()}
              {currentSection === 'journey' && renderJourneySection()}
              {currentSection === 'skills' && renderSkillsSection()}
              {/* ===== giữ nguyên các section còn lại của bạn ===== */}
              {/* {currentSection === 'personality' && renderPersonalitySection()} */}
              {currentSection === 'settings' && renderSettingsSection()}
              {currentSection === 'exercises' && renderExercisesSection()}
              {currentSection === 'parent' && renderParentSection()}
            </div>
          </div>
        </div>
      </div>
    </ScreenTimeProvider>
  );
}
