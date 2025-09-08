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
import { Progress } from '@/components/ui/progress';
import { Star, RotateCcw, Home } from 'lucide-react';
import type { Question, Topic } from '@/lib/questions-data';

interface QuizManagerProps {
  topic: Topic;
  onComplete: (score: number, correctAnswers: number) => void;
  onBack: () => void;
}

export function QuizManager({ topic, onComplete, onBack }: QuizManagerProps) {
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const initializeQuiz = () => {
    const shuffledQuestions = [...topic.questions].sort(
      () => Math.random() - 0.5
    );
    const selectedQuestions = shuffledQuestions.slice(
      0,
      Math.min(10, topic.questions.length)
    );
    setQuizQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowFinalResult(false);
    setUserAnswers([]);
  };

  useEffect(() => {
    initializeQuiz();
  }, [topic]);

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !quizQuestions[currentQuestionIndex]) return;

    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1);
    }

    setUserAnswers((prev) => [...prev, selectedAnswer]);
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      setShowFinalResult(true);
      onComplete(score, correctAnswers);
    }
  };

  const restartQuiz = () => {
    initializeQuiz();
  };

  if (quizQuestions.length === 0) {
    return (
      <div className='text-center'>
        <p>Đang tải câu hỏi...</p>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  if (showFinalResult) {
    const finalScore = Math.round((score / quizQuestions.length) * 10); // Thang điểm 10
    const stars = Math.floor(finalScore / 2);

    return (
      <div className='max-w-2xl mx-auto'>
        <Card className='text-center'>
          <CardHeader>
            <div className='text-6xl mb-4 animate-bounce'>🏆</div>
            <CardTitle className='text-2xl'>
              Chúc mừng bạn đã hoàn thành!
            </CardTitle>
            <CardDescription>Chủ đề: {topic.title}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6'>
              <p className='text-3xl font-bold text-orange-600 mb-2'>
                {finalScore}/10 điểm
              </p>
              <p className='text-lg'>
                Trả lời đúng: {correctAnswers}/{quizQuestions.length} câu
              </p>
              <div className='flex justify-center mt-4'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-8 h-8 ${
                      i < stars
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className='bg-blue-50 rounded-xl p-4'>
              <h4 className='font-bold mb-2'>Đánh giá:</h4>
              <p className='text-sm'>
                {finalScore >= 8
                  ? 'Xuất sắc! Bạn đã nắm vững chủ đề này!'
                  : finalScore >= 6
                  ? 'Tốt! Bạn đã hiểu khá tốt về chủ đề này.'
                  : finalScore >= 4
                  ? 'Khá ổn! Hãy ôn lại một số kiến thức.'
                  : 'Cần cố gắng thêm! Hãy học lại chủ đề này.'}
              </p>
            </div>

            <div className='flex gap-4 justify-center flex-wrap'>
              <Button onClick={onBack} variant='outline'>
                <Home className='w-4 h-4 mr-2' />
                Về trang chủ
              </Button>
              <Button onClick={restartQuiz}>
                <RotateCcw className='w-4 h-4 mr-2' />
                Học lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult) {
    const isCorrect = selectedAnswer === currentQuestion.correct;
    return (
      <div className='max-w-2xl mx-auto'>
        <Card>
          <CardHeader className='text-center'>
            <div className='text-5xl mb-4'>{isCorrect ? '🎉' : '🤔'}</div>
            <CardTitle className='text-2xl'>
              {isCorrect ? 'Tuyệt vời!' : 'Chưa đúng rồi!'}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='bg-blue-50 border-l-4 border-blue-400 p-4 rounded'>
              <p className='font-semibold'>Giải thích:</p>
              <p>{currentQuestion.explanation}</p>
            </div>
            <div className='bg-green-50 border-l-4 border-green-400 p-4 rounded'>
              <p className='font-semibold'>Mẹo hay:</p>
              <p>{currentQuestion.tips}</p>
            </div>
            <div className='flex justify-center'>
              <Button onClick={nextQuestion}>
                {currentQuestionIndex < quizQuestions.length - 1
                  ? 'Câu tiếp theo'
                  : 'Xem kết quả'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <Button variant='outline' onClick={onBack}>
          ← Quay lại
        </Button>
        <div className='flex items-center gap-4'>
          <Progress value={progress} className='w-32' />
          <Badge variant='secondary'>
            {currentQuestionIndex + 1}/{quizQuestions.length}
          </Badge>
          <Badge variant='outline'>
            Điểm: {score}/{currentQuestionIndex + 1}
          </Badge>
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        <Card className='bg-gradient-to-br from-blue-50 to-purple-50'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <span className='text-2xl'>{currentQuestion.emoji}</span>
              Tình huống:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='mb-4 text-lg leading-relaxed'>
              {currentQuestion.situation}
            </p>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Badge variant='outline' className='text-xs'>
                Độ khó: {currentQuestion.difficulty}/5
              </Badge>
              <Badge variant='outline' className='text-xs'>
                Tuổi: {currentQuestion.ageGroup}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? 'default' : 'outline'}
                className='w-full text-left justify-start h-auto p-4 text-wrap'
                onClick={() => selectAnswer(index)}
              >
                <span className='font-semibold mr-2'>
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className='text-center mt-6'>
        <Button
          onClick={submitAnswer}
          disabled={selectedAnswer === null}
          size='lg'
          className='px-8'
        >
          Trả lời
        </Button>
      </div>
    </div>
  );
}
