'use client';

import { useState, useEffect } from 'react';
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
  Clock,
  Target,
} from 'lucide-react';
import { AuthForm, LogoutButton } from '@/components/auth-form/auth-form';
import { QuizManager } from '@/components/quiz/quiz-manager';
import { questionsData } from '@/lib/questions-data';

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

const memoryCards = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

export default function ChildrenDevelopmentApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSection, setCurrentSection] = useState('home');
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

  // Memory game state
  const [memoryGameCards, setMemoryGameCards] = useState<string[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [gameAttempts, setGameAttempts] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user data to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Timer for memory game
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStartTime && currentSection === 'memory-game') {
      interval = setInterval(() => {
        setGameTime(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStartTime, currentSection]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentSection('home');
  };

  const startTopic = (topicId: string) => {
    const topic = questionsData.find((t) => t.id === topicId);
    if (topic) {
      setCurrentTopic(topic);
      setCurrentSection('quiz');
    }
  };

  const initializeMemoryGame = () => {
    const gameCards = [...memoryCards, ...memoryCards].sort(
      () => Math.random() - 0.5
    );
    setMemoryGameCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setGameAttempts(0);
    setGameTime(0);
    setGameStartTime(Date.now());
    setCurrentSection('memory-game');
  };

  const flipCard = (index: number) => {
    if (
      flippedCards.length >= 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setGameAttempts((prev) => prev + 1);

      setTimeout(() => {
        const [first, second] = newFlippedCards;
        if (memoryGameCards[first] === memoryGameCards[second]) {
          setMatchedCards((prev) => [...prev, first, second]);
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} />;
  }

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
            onClick={() => setCurrentSection(id)}
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
          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              totalScore: currentUser.totalScore + finalScore,
              completedTopics: [
                ...new Set([...currentUser.completedTopics, currentTopic.id]),
              ],
            };
            setCurrentUser(updatedUser);
          }
        }}
        onBack={() => setCurrentSection('home')}
      />
    );
  };

  const renderMemoryGame = () => (
    <div className='max-w-2xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <Button variant='outline' onClick={() => setCurrentSection('games')}>
          ← Quay lại
        </Button>
        <div className='flex gap-4'>
          <Badge variant='secondary'>
            <Clock className='w-4 h-4 mr-1' />
            Thời gian: {gameTime}s
          </Badge>
          <Badge variant='secondary'>
            <Target className='w-4 h-4 mr-1' />
            Lượt: {gameAttempts}
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-4 gap-4 max-w-md mx-auto'>
        {memoryGameCards.map((card, index) => (
          <Button
            key={index}
            variant='outline'
            className={`aspect-square text-2xl ${
              flippedCards.includes(index) || matchedCards.includes(index)
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary'
            } ${matchedCards.includes(index) ? 'bg-green-500' : ''}`}
            onClick={() => flipCard(index)}
            disabled={matchedCards.includes(index)}
          >
            {flippedCards.includes(index) || matchedCards.includes(index)
              ? card
              : '?'}
          </Button>
        ))}
      </div>

      {matchedCards.length === memoryGameCards.length && (
        <Card className='mt-6 text-center'>
          <CardHeader>
            <CardTitle className='text-2xl'>🎉 Chúc mừng!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Bạn đã hoàn thành trong {gameTime} giây với {gameAttempts} lượt
              thử!
            </p>
            <Button className='mt-4' onClick={initializeMemoryGame}>
              Chơi lại
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
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
            <CardDescription>Lật thẻ và tìm cặp giống nhau</CardDescription>
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
        {currentSection === 'journey' && (
          <div className='text-center py-20'>
            <h2 className='text-2xl font-bold mb-4'>
              🗺️ Hành Trình Phát Triển
            </h2>
            <p className='text-muted-foreground'>
              Tính năng đang được phát triển...
            </p>
          </div>
        )}
        {currentSection === 'personality' && (
          <div className='text-center py-20'>
            <h2 className='text-2xl font-bold mb-4'>🧠 Khám Phá Tính Cách</h2>
            <p className='text-muted-foreground'>
              Tính năng đang được phát triển...
            </p>
          </div>
        )}
        {currentSection === 'parent' && (
          <div className='text-center py-20'>
            <h2 className='text-2xl font-bold mb-4'>👨‍👩‍👧‍👦 Góc Phụ Huynh</h2>
            <p className='text-muted-foreground'>
              Tính năng đang được phát triển...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
