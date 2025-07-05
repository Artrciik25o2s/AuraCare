
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Play, RotateCcw, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useMindfulStore } from '../../stores/mindfulStore';

interface Question {
  num1: number;
  num2: number;
  operator: '+' | '-' | '*' | '/';
  correctAnswer: number;
  options: number[];
}

const MathLightningGame: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed'>('idle');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const { updateGameScore } = useMindfulStore();

  const generateQuestion = useCallback((): Question => {
    const operators: ('+' | '-' | '*' | '/')[] = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let num1: number, num2: number, correctAnswer: number;
    
    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        correctAnswer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * 20) + 1;
        correctAnswer = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        correctAnswer = num1 * num2;
        break;
      case '/':
        num2 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = Math.floor(Math.random() * 20) + 1;
        num1 = num2 * correctAnswer;
        break;
      default:
        num1 = 1;
        num2 = 1;
        correctAnswer = 2;
    }

    // Generate wrong options
    const options: number[] = [correctAnswer];
    while (options.length < 4) {
      let wrongAnswer: number;
      if (operator === '/') {
        wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
      } else {
        const variance = Math.max(1, Math.floor(correctAnswer * 0.3));
        wrongAnswer = correctAnswer + Math.floor(Math.random() * variance * 2) - variance;
      }
      
      if (wrongAnswer !== correctAnswer && wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return { num1, num2, operator, correctAnswer, options };
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setQuestionsAnswered(0);
    setTimeLeft(60);
    setSelectedAnswer(null);
    setFeedback(null);
    setCurrentQuestion(generateQuestion());
  };

  const handleAnswerSelect = (answer: number) => {
    if (selectedAnswer !== null || gameState !== 'playing') return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion?.correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
    
    setQuestionsAnswered(prev => prev + 1);
    
    // Move to next question after a short delay
    setTimeout(() => {
      setSelectedAnswer(null);
      setFeedback(null);
      setCurrentQuestion(generateQuestion());
    }, 1000);
  };

  const resetGame = () => {
    setGameState('idle');
    setScore(0);
    setQuestionsAnswered(0);
    setTimeLeft(60);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('completed');
            updateGameScore('focus', score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft, score, updateGameScore]);

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <Calculator className="w-5 h-5 text-blue-500" />
          <span>Math Lightning</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Score: <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{score}</span>
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span className="text-lg font-bold text-red-600 dark:text-red-400">{timeLeft}s</span>
          </div>
        </div>

        {gameState === 'idle' ? (
          <div className="text-center py-8">
            <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Solve as many math problems as you can in 60 seconds!</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:scale-105 transition-transform flex items-center space-x-2 mx-auto"
            >
              <Play className="w-4 h-4" />
              <span>Start Game</span>
            </button>
          </div>
        ) : gameState === 'playing' && currentQuestion ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {currentQuestion.num1} {currentQuestion.operator} {currentQuestion.num2} = ?
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Question {questionsAnswered + 1}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-lg font-bold text-lg transition-all ${
                    selectedAnswer === option
                      ? feedback === 'correct'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : selectedAnswer !== null && option === currentQuestion.correctAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                  whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {feedback && (
              <div className={`text-center py-2 px-4 rounded-lg ${
                feedback === 'correct' 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                  : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}>
                {feedback === 'correct' ? '✓ Correct!' : '✗ Incorrect'}
              </div>
            )}
          </div>
        ) : gameState === 'completed' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
          >
            <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">🎉 Time's Up!</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-2">
              Final Score: <span className="font-bold text-xl">{score}</span>
            </p>
            <p className="text-blue-600 dark:text-blue-400">
              Questions Answered: {questionsAnswered}
            </p>
          </motion.div>
        ) : null}

        <div className="flex justify-center">
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-medium hover:scale-105 transition-transform flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          {gameState === 'idle' ? 'Choose the correct answer as quickly as possible!' : 
           gameState === 'playing' ? 'Select the correct answer from the options below.' :
           'Great job! Your reflexes and math skills are improving!'}
        </p>
      </CardContent>
    </Card>
  );
};

export default MathLightningGame;
