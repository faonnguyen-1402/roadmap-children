'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
} from 'lucide-react';

import { AuthForm, LogoutButton } from '@/components/auth-form/auth-form';
import { QuizManager } from '@/components/quiz/quiz-manager';
import { questionsData } from '@/lib/questions-data';

// ✅ Import RoleplayGame để hiển thị ngay trong Home khi bấm "Nhập vai"
import RoleplayGame from '@/components/roleplay/RoleplayGame';

import MatchingColorGame from './games/matching/MatchingColorGame';

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
  >('home');
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

  // Personality quiz state
  const [personalityQuizActive, setPersonalityQuizActive] = useState(false);
  const [personalityAnswers, setPersonalityAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [personalityResults, setPersonalityResults] = useState<any>(null);
  const [currentPersonalityQuestion, setCurrentPersonalityQuestion] = useState(
    0
  );
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

  const handleLogin = (user: User) => setCurrentUser(user);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentSection('home');
    setShowRoleplay(false);
  };

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
      traits[a[0] as keyof typeof traits] > traits[b[0] as keyof typeof traits]
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
        strengths: [
          'Tư duy logic',
          'Giải quyết vấn đề',
          'Có hệ thống',
          'Phân tích tốt',
        ],
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
    <div className='bg-card/95 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-primary mb-2'>
            🌟 Khám Phá Bản Thân 🌟
          </h1>
          <p className='text-muted-foreground'>
            Chào {currentUser.name}! Hãy cùng học tập nhé!
          </p>
        </div>
        <div className='flex gap-4 items-center'>
          <Badge variant='secondary' className='px-4 py-2'>
            <Star className='w-4 h-4 mr-1' />
            Điểm: {currentUser.totalScore}
          </Badge>
          <Badge variant='secondary' className='px-4 py-2'>
            <Trophy className='w-4 h-4 mr-1' />
            Cấp độ: {currentUser.level}
          </Badge>
          <Badge variant='secondary' className='px-4 py-2'>
            <Target className='w-4 h-4 mr-1' />
            Streak: {currentUser.streak} 🔥
          </Badge>
          <LogoutButton onLogout={handleLogout} />
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className='bg-card/90 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-md'>
      <div className='flex justify-center gap-2 flex-wrap'>
        {[
          { id: 'home', label: 'Trang chủ', icon: Home },
          { id: 'journey', label: 'Hành trình', icon: Map },
          { id: 'games', label: 'Trò chơi', icon: Gamepad2 },
          { id: 'personality', label: 'Tính cách', icon: Brain },
          { id: 'parent', label: 'Phụ huynh', icon: Users },
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={currentSection === id ? 'default' : 'ghost'}
            onClick={() => {
              setCurrentSection(id as any);
              setShowRoleplay(false);
            }}
            className='flex items-center gap-2'
          >
            <Icon className='w-4 h-4' />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderHomeSection = () => (
    <div className='space-y-6'>
      <div className='bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-6 text-center'>
        <h2 className='text-2xl font-bold text-orange-600 mb-2'>
          Chào mừng đến với thế giới khám phá! 🚀
        </h2>
        <p className='text-gray-600'>
          Hãy chọn chủ đề bạn muốn khám phá hôm nay
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {questionsData.map((topic) => (
          <Card
            key={topic.id}
            className='cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-green-50 to-blue-50'
            onClick={() => startTopic(topic.id)}
          >
            <CardHeader className='text-center'>
              <div className='text-4xl mb-2 animate-bounce-gentle'>
                {topic.icon}
              </div>
              <CardTitle className='text-xl'>{topic.title}</CardTitle>
              <CardDescription>{topic.description}</CardDescription>
            </CardHeader>
            <CardContent className='text-center'>
              <div className='flex justify-center mb-2'>
                {Array.from({ length: topic.difficulty }).map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 fill-yellow-400 text-yellow-400'
                  />
                ))}
              </div>
              <Badge variant='outline' className='text-xs'>
                {topic.questions.length} câu hỏi
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ✅ Phiêu lưu 2D */}
      <Card
        className='cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-yellow-100 to-orange-100'
        onClick={() => router.push('/adventure')}
      >
        <CardHeader className='text-center'>
          <CardTitle>Phiêu Lưu 2D</CardTitle>
          <CardDescription>Chạy và vượt chướng ngại vật</CardDescription>
        </CardHeader>
      </Card>

      {/* ✅ Nhập vai: bấm sẽ hiện RoleplayGame ngay trong trang */}
      <Card
        className='cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-emerald-100 to-teal-100'
        onClick={() => setShowRoleplay(true)}
      >
        <CardHeader className='text-center'>
          <CardTitle>Nhập vai</CardTitle>
          <CardDescription>
            Hoàng tử giải cứu công chúa và học cách ứng xử
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ✅ Khi bấm Nhập vai thì render game + nút đóng */}
      {showRoleplay && (
        <div className='space-y-3'>
          <div className='flex justify-end'>
            <Button variant='outline' onClick={() => setShowRoleplay(false)}>
              ← Quay lại
            </Button>
          </div>
          <RoleplayGame />
        </div>
      )}

      <Card className='bg-gradient-to-r from-pink-100 to-purple-100'>
        <CardHeader>
          <CardTitle className='text-center text-pink-600'>
            🎯 Thử thách hôm nay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4 bg-white/80 rounded-xl p-4'>
            <div className='text-4xl bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center'>
              🌟
            </div>
            <div className='flex-1'>
              <h4 className='font-bold text-lg'>Thử thách trí nhớ siêu tốc</h4>
              <p className='text-gray-600'>
                Hoàn thành trò chơi trí nhớ trong 2 phút!
              </p>
            </div>
            <Button
              onClick={initializeMemoryGame}
              className='animate-pulse-glow'
            >
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

  // ✅ Matching game thay cho memory-game
  const renderMemoryGame = () => (
    <MatchingColorGame onBack={() => setCurrentSection('games')} />
  );

  const renderGamesSection = () => (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-center'>
        🎮 Trò Chơi Phát Triển Tư Duy
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card
          className='cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50'
          onClick={initializeMemoryGame}
        >
          <CardHeader className='text-center'>
            <div className='text-4xl mb-2'>🧠</div>
            <CardTitle>Trò chơi trí nhớ</CardTitle>
            <CardDescription>
              Lật thẻ và tìm cặp giống nhau (màu sắc)
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className='cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 opacity-75'>
          <CardHeader className='text-center'>
            <div className='text-4xl mb-2'>🧩</div>
            <CardTitle>Xếp hình</CardTitle>
            <CardDescription>
              Ghép các mảnh để tạo thành hình hoàn chỉnh
            </CardDescription>
            <Badge variant='secondary' className='mt-2'>
              Sắp ra mắt
            </Badge>
          </CardHeader>
        </Card>

        <Card className='cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 opacity-75'>
          <CardHeader className='text-center'>
            <div className='text-4xl mb-2'>🔍</div>
            <CardTitle>Tìm khác biệt</CardTitle>
            <CardDescription>
              Tìm những điểm khác nhau giữa hai hình
            </CardDescription>
            <Badge variant='secondary' className='mt-2'>
              Sắp ra mắt
            </Badge>
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  const renderJourneySection = () => (
    <div className='space-y-6'>
      <div className='bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 text-center'>
        <h2 className='text-2xl font-bold text-blue-600 mb-2'>
          🗺️ Hành Trình Phát Triển
        </h2>
        <p className='text-gray-600'>
          Theo dõi tiến trình học tập và phát triển của bạn
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='bg-gradient-to-br from-green-50 to-emerald-50'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Trophy className='w-5 h-5 text-yellow-500' />
              Thành tích của bạn
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex justify-between items-center p-3 bg-white/80 rounded-lg'>
              <span>Tổng điểm số</span>
              <Badge variant='secondary'>{currentUser.totalScore}</Badge>
            </div>
            <div className='flex justify-between items-center p-3 bg-white/80 rounded-lg'>
              <span>Cấp độ hiện tại</span>
              <Badge variant='secondary'>Cấp {currentUser.level}</Badge>
            </div>
            <div className='flex justify-between items-center p-3 bg-white/80 rounded-lg'>
              <span>Chủ đề đã hoàn thành</span>
              <Badge variant='secondary'>
                {currentUser.completedTopics.length}/5
              </Badge>
            </div>
            <div className='flex justify-between items-center p-3 bg-white/80 rounded-lg'>
              <span>Streak hiện tại</span>
              <Badge variant='secondary'>{currentUser.streak} ngày 🔥</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-orange-50 to-red-50'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='w-5 h-5 text-orange-500' />
              Mục tiêu tuần này
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-4 bg-white/80 rounded-lg'>
              <h4 className='font-semibold mb-2'>🎯 Hoàn thành 3 chủ đề mới</h4>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-orange-500 h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${(currentUser.completedTopics.length / 3) * 100}%`,
                  }}
                />
              </div>
              <p className='text-sm text-gray-600 mt-1'>
                {currentUser.completedTopics.length}/3 hoàn thành
              </p>
            </div>

            <div className='p-4 bg-white/80 rounded-lg'>
              <h4 className='font-semibold mb-2'>⭐ Đạt 500 điểm</h4>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-yellow-500 h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${Math.min(
                      (currentUser.totalScore / 500) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className='text-sm text-gray-600 mt-1'>
                {currentUser.totalScore}/500 điểm
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='bg-gradient-to-r from-purple-50 to-pink-50'>
        <CardHeader>
          <CardTitle className='text-center'>🌟 Lộ trình học tập</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {questionsData.map((topic, index) => (
              <div
                key={topic.id}
                className='flex items-center gap-4 p-4 bg-white/80 rounded-lg'
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
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
                  {currentUser.completedTopics.includes(topic.id)
                    ? '✓'
                    : index + 1}
                </div>
                <div className='flex-1'>
                  <h4 className='font-semibold'>{topic.title}</h4>
                  <p className='text-sm text-gray-600'>{topic.description}</p>
                </div>
                <div className='text-2xl'>{topic.icon}</div>
                {currentUser.completedTopics.includes(topic.id) && (
                  <Badge
                    variant='secondary'
                    className='bg-green-100 text-green-700'
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

  const renderPersonalitySection = () => {
    if (personalityQuizActive) {
      const currentQ = selectedQuestions[currentPersonalityQuestion];
      return (
        <div className='max-w-2xl mx-auto'>
          <Card className='bg-gradient-to-br from-purple-50 to-pink-50'>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <Button
                  variant='outline'
                  onClick={() => setPersonalityQuizActive(false)}
                >
                  ← Quay lại
                </Button>
                <Badge variant='secondary'>
                  Câu {currentPersonalityQuestion + 1}/
                  {selectedQuestions.length}
                </Badge>
              </div>
              <CardTitle className='text-center text-xl mt-4'>
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {currentQ.options.map((option: any, index: number) => (
                <Button
                  key={index}
                  variant='outline'
                  className='w-full p-4 h-auto text-left justify-start bg-white/80 hover:bg-purple-100'
                  onClick={() => answerPersonalityQuestion(option.value)}
                >
                  <div className='text-sm'>{option.text}</div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (personalityResults) {
      return (
        <div className='max-w-2xl mx-auto space-y-6'>
          <Button variant='outline' onClick={() => setPersonalityResults(null)}>
            ← Quay lại
          </Button>

          <Card className='bg-gradient-to-br from-purple-50 to-pink-50'>
            <CardHeader className='text-center'>
              <div className='text-6xl mb-4'>{personalityResults.icon}</div>
              <CardTitle className='text-2xl'>
                {personalityResults.title}
              </CardTitle>
              <CardDescription className='text-lg'>
                {personalityResults.description}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-4 bg-white/80 rounded-lg'>
                  <h4 className='font-semibold mb-3 text-green-700'>
                    🌟 Điểm mạnh của bạn
                  </h4>
                  <div className='space-y-2'>
                    {personalityResults.strengths.map(
                      (strength: string, index: number) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='w-full justify-center py-2 bg-green-100 text-green-800'
                        >
                          {strength}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
                <div className='p-4 bg-white/80 rounded-lg'>
                  <h4 className='font-semibold mb-3 text-blue-700'>
                    💡 Gợi ý phát triển
                  </h4>
                  <div className='space-y-2'>
                    {personalityResults.tips.map(
                      (tip: string, index: number) => (
                        <div
                          key={index}
                          className='text-sm p-2 bg-blue-50 rounded'
                        >
                          • {tip}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              <Button
                className='w-full'
                onClick={() => {
                  setPersonalityResults(null);
                  startPersonalityQuiz();
                }}
              >
                Làm lại bài kiểm tra
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className='space-y-6'>
        <div className='bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 text-center'>
          <h2 className='text-2xl font-bold text-purple-600 mb-2'>
            🧠 Khám Phá Tính Cách
          </h2>
          <p className='text-gray-600'>
            Tìm hiểu về bản thân và phát triển tính cách tích cực
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Card
            className='cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-br from-purple-50 to-pink-50'
            onClick={startPersonalityQuiz}
          >
            <CardHeader className='text-center'>
              <div className='text-4xl mb-2'>🎯</div>
              <CardTitle>Bài kiểm tra tính cách</CardTitle>
              <CardDescription>
                Trả lời 10 câu hỏi để khám phá tính cách của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center'>
              <Button className='w-full'>Bắt đầu kiểm tra</Button>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-blue-50 to-cyan-50'>
            <CardHeader className='text-center'>
              <div className='text-4xl mb-2'>📝</div>
              <CardTitle>Câu hỏi tự luận</CardTitle>
              <CardDescription>
                Suy nghĩ và trả lời những câu hỏi về bản thân
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {reflectionQuestions.slice(0, 2).map((question, index) => (
                  <div key={index} className='p-3 bg-white/80 rounded-lg'>
                    <p className='text-sm font-medium mb-2'>{question}</p>
                    <textarea
                      className='w-full p-2 text-xs border rounded resize-none'
                      rows={2}
                      placeholder='Viết suy nghĩ của bạn...'
                      value={reflectionAnswers[index] || ''}
                      onChange={(e) =>
                        saveReflectionAnswer(index, e.target.value)
                      }
                    />
                  </div>
                ))}
                <Button
                  variant='outline'
                  className='w-full text-sm bg-transparent'
                >
                  Xem thêm câu hỏi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderParentSection = () => (
    <div className='space-y-6'>
      <div className='bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-6 text-center'>
        <h2 className='text-2xl font-bold text-rose-600 mb-2'>
          👨‍👩‍👧‍👦 Góc Phụ Huynh
        </h2>
        <p className='text-gray-600'>
          Hướng dẫn và theo dõi sự phát triển của con bạn
        </p>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-4'>
      <div className='max-w-6xl mx-auto'>
        {renderHeader()}
        {currentSection !== 'quiz' &&
          currentSection !== 'memory-game' &&
          renderNavigation()}

        {currentSection === 'home' && renderHomeSection()}
        {currentSection === 'quiz' && renderQuizSection()}
        {currentSection === 'memory-game' && renderMemoryGame()}
        {currentSection === 'games' && renderGamesSection()}
        {currentSection === 'journey' && renderJourneySection()}
        {currentSection === 'personality' && renderPersonalitySection()}
        {currentSection === 'parent' && renderParentSection()}
      </div>
    </div>
  );
}
