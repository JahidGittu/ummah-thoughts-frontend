import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, XCircle, CheckCircle, ArrowRight, 
  RotateCcw, Sparkles, Medal, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Battle {
  id: string;
  nameEn: string;
  nameBn: string;
  year: number;
  hijriYear: string;
  period: string;
  outcome: string;
  muslimForce: number;
  enemyForce: number;
  keyFigures: string[];
  significance: string;
  location: { name: string };
  casualties?: {
    muslimMartyrs: number;
    enemyDeaths: number;
  };
}

interface Question {
  question: string;
  questionBn: string;
  options: string[];
  optionsBn: string[];
  correctIndex: number;
}

interface BattleQuizProps {
  battle: Battle | null;
  isOpen: boolean;
  onClose: () => void;
  isBn: boolean;
}

const generateQuestions = (battle: Battle): Question[] => {
  const questions: Question[] = [
    {
      question: `In which year did the ${battle.nameEn} take place?`,
      questionBn: `${battle.nameBn} কোন সালে সংঘটিত হয়েছিল?`,
      options: [
        `${battle.year} CE`,
        `${battle.year + 5} CE`,
        `${battle.year - 10} CE`,
        `${battle.year + 20} CE`,
      ],
      optionsBn: [
        `${battle.year} খ্রিস্টাব্দ`,
        `${battle.year + 5} খ্রিস্টাব্দ`,
        `${battle.year - 10} খ্রিস্টাব্দ`,
        `${battle.year + 20} খ্রিস্টাব্দ`,
      ],
      correctIndex: 0,
    },
    {
      question: `What was the outcome of the ${battle.nameEn}?`,
      questionBn: `${battle.nameBn}-এর ফলাফল কী ছিল?`,
      options: ['Victory', 'Defeat', 'Stalemate', 'Strategic'],
      optionsBn: ['বিজয়', 'পরাজয়', 'অচলাবস্থা', 'কৌশলগত'],
      correctIndex: battle.outcome === 'victory' ? 0 : 
                    battle.outcome === 'defeat' ? 1 : 
                    battle.outcome === 'stalemate' ? 2 : 3,
    },
    {
      question: `How many Muslim soldiers participated in the ${battle.nameEn}?`,
      questionBn: `${battle.nameBn}-এ কতজন মুসলিম সৈন্য অংশগ্রহণ করেছিল?`,
      options: [
        battle.muslimForce.toLocaleString(),
        (battle.muslimForce * 2).toLocaleString(),
        Math.round(battle.muslimForce / 2).toLocaleString(),
        (battle.muslimForce + 5000).toLocaleString(),
      ],
      optionsBn: [
        battle.muslimForce.toLocaleString(),
        (battle.muslimForce * 2).toLocaleString(),
        Math.round(battle.muslimForce / 2).toLocaleString(),
        (battle.muslimForce + 5000).toLocaleString(),
      ],
      correctIndex: 0,
    },
    {
      question: `Where did the ${battle.nameEn} take place?`,
      questionBn: `${battle.nameBn} কোথায় সংঘটিত হয়েছিল?`,
      options: [
        battle.location.name,
        'Damascus',
        'Baghdad',
        'Cairo',
      ],
      optionsBn: [
        battle.location.name,
        'দামেস্ক',
        'বাগদাদ',
        'কায়রো',
      ],
      correctIndex: 0,
    },
  ];

  if (battle.keyFigures.length > 0) {
    questions.push({
      question: `Who was one of the key figures in the ${battle.nameEn}?`,
      questionBn: `${battle.nameBn}-এর অন্যতম প্রধান ব্যক্তিত্ব কে ছিলেন?`,
      options: [
        battle.keyFigures[0],
        'Abu Lahab',
        'Firaun',
        'Namrud',
      ],
      optionsBn: [
        battle.keyFigures[0],
        'আবু লাহাব',
        'ফিরআউন',
        'নমরুদ',
      ],
      correctIndex: 0,
    });
  }

  // Shuffle options for each question (except the correct answer tracking)
  return questions.map(q => {
    const shuffledIndices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffledIndices.indexOf(0);
    return {
      ...q,
      options: shuffledIndices.map(i => q.options[i]),
      optionsBn: shuffledIndices.map(i => q.optionsBn[i]),
      correctIndex: newCorrectIndex,
    };
  });
};

const BattleQuiz = ({ battle, isOpen, onClose, isBn }: BattleQuizProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    if (battle && isOpen) {
      setQuestions(generateQuestions(battle));
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setScore(0);
      setQuizComplete(false);
    }
  }, [battle, isOpen]);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    if (index === questions[currentQuestion]?.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    if (battle) {
      setQuestions(generateQuestions(battle));
    }
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return isBn ? 'অসাধারণ! পারফেক্ট স্কোর! 🎉' : 'Excellent! Perfect Score! 🎉';
    if (percentage >= 80) return isBn ? 'চমৎকার! আপনি ইতিহাস ভালো জানেন!' : 'Great! You know your history well!';
    if (percentage >= 60) return isBn ? 'ভালো চেষ্টা! আরও পড়ুন।' : 'Good effort! Keep learning.';
    return isBn ? 'আরও অধ্যয়ন প্রয়োজন।' : 'More study needed.';
  };

  const getScoreIcon = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return <Trophy className="w-16 h-16 text-yellow-500" />;
    if (percentage >= 80) return <Medal className="w-16 h-16 text-amber-500" />;
    if (percentage >= 60) return <Star className="w-16 h-16 text-blue-500" />;
    return <Target className="w-16 h-16 text-muted-foreground" />;
  };

  if (!battle) return null;

  const currentQ = questions[currentQuestion];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            {isBn ? 'যুদ্ধ কুইজ' : 'Battle Quiz'}: {isBn ? battle.nameBn : battle.nameEn}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!quizComplete ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 mt-4"
            >
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{isBn ? 'প্রশ্ন' : 'Question'} {currentQuestion + 1}/{questions.length}</span>
                  <span>{isBn ? 'স্কোর' : 'Score'}: {score}/{currentQuestion}</span>
                </div>
                <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
              </div>

              {/* Question */}
              {currentQ && (
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      {isBn ? currentQ.questionBn : currentQ.question}
                    </h3>
                  </CardContent>
                </Card>
              )}

              {/* Options */}
              <div className="grid gap-3">
                {currentQ && (isBn ? currentQ.optionsBn : currentQ.options).map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQ.correctIndex;
                  const showResult = isAnswered;

                  return (
                    <motion.button
                      key={index}
                      whileHover={!isAnswered ? { scale: 1.02 } : {}}
                      whileTap={!isAnswered ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswer(index)}
                      disabled={isAnswered}
                      className={`
                        w-full p-4 rounded-xl border-2 text-left transition-all
                        flex items-center justify-between
                        ${!showResult && !isSelected ? 'border-border hover:border-primary/50 hover:bg-primary/5' : ''}
                        ${!showResult && isSelected ? 'border-primary bg-primary/10' : ''}
                        ${showResult && isCorrect ? 'border-green-500 bg-green-500/10' : ''}
                        ${showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-500/10' : ''}
                        ${showResult && !isCorrect && !isSelected ? 'opacity-50' : ''}
                        disabled:cursor-not-allowed
                      `}
                    >
                      <span className="font-medium">{option}</span>
                      {showResult && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Next Button */}
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <Button onClick={nextQuestion} className="gap-2">
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        {isBn ? 'পরবর্তী প্রশ্ন' : 'Next Question'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        {isBn ? 'ফলাফল দেখুন' : 'See Results'}
                        <Trophy className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6"
            >
              {/* Score Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                {getScoreIcon()}
              </motion.div>

              {/* Score */}
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {score}/{questions.length}
                </h2>
                <p className="text-lg text-muted-foreground mt-2">{getScoreMessage()}</p>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{score}</div>
                  <div className="text-sm text-muted-foreground">{isBn ? 'সঠিক' : 'Correct'}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{questions.length - score}</div>
                  <div className="text-sm text-muted-foreground">{isBn ? 'ভুল' : 'Wrong'}</div>
                </div>
              </div>

              {/* Badges */}
              {score === questions.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-2">
                    🏆 {isBn ? `${battle.nameBn} বিশেষজ্ঞ` : `${battle.nameEn} Expert`}
                  </Badge>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex justify-center gap-4 pt-4">
                <Button variant="outline" onClick={restartQuiz} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  {isBn ? 'পুনরায় চেষ্টা' : 'Try Again'}
                </Button>
                <Button onClick={onClose} className="gap-2">
                  {isBn ? 'বন্ধ করুন' : 'Close'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default BattleQuiz;