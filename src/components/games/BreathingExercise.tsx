
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useMindfulStore } from '../../stores/mindfulStore';

const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(4);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const { updateGameScore } = useMindfulStore();

  const phases = {
    inhale: { duration: 4, next: 'hold' as const, text: 'Breathe In', color: 'from-blue-400 to-blue-600' },
    hold: { duration: 4, next: 'exhale' as const, text: 'Hold', color: 'from-purple-400 to-purple-600' },
    exhale: { duration: 4, next: 'inhale' as const, text: 'Breathe Out', color: 'from-green-400 to-green-600' }
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            const currentPhase = phases[phase];
            const nextPhase = currentPhase.next;
            setPhase(nextPhase);
            
            if (nextPhase === 'inhale') {
              setCycleCount(prev => {
                const newCount = prev + 1;
                if (newCount >= 5) {
                  setIsActive(false);
                  updateGameScore('mindful', newCount);
                }
                return newCount;
              });
            }
            
            return phases[nextPhase].duration;
          }
          return prev - 1;
        });
        
        setTotalTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, phase, updateGameScore]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeRemaining(4);
    setCycleCount(0);
    setTotalTime(0);
  };

  const pauseExercise = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeRemaining(4);
    setCycleCount(0);
    setTotalTime(0);
  };

  const currentPhase = phases[phase];
  const progress = ((currentPhase.duration - timeRemaining) / currentPhase.duration) * 100;

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <Wind className="w-5 h-5 text-blue-500" />
          <span>Breathing Exercise</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Cycles: <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{cycleCount}</span>
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Time: <span className="text-lg font-bold text-green-600 dark:text-green-400">{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <motion.div
            className={`w-32 h-32 rounded-full bg-gradient-to-r ${currentPhase.color} flex items-center justify-center shadow-lg`}
            animate={{
              scale: phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1,
            }}
            transition={{
              duration: currentPhase.duration,
              ease: "easeInOut",
              repeat: 0
            }}
          >
            <div className="text-center text-white">
              <div className="text-xl font-bold">{timeRemaining}</div>
              <div className="text-sm">{currentPhase.text}</div>
            </div>
          </motion.div>

          <div className="w-full max-w-xs">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span className={phase === 'inhale' ? 'font-bold text-blue-600 dark:text-blue-400' : ''}>Inhale</span>
              <span className={phase === 'hold' ? 'font-bold text-purple-600 dark:text-purple-400' : ''}>Hold</span>
              <span className={phase === 'exhale' ? 'font-bold text-green-600 dark:text-green-400' : ''}>Exhale</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${currentPhase.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {cycleCount >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 w-full"
            >
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">🧘‍♀️ Well Done!</h3>
              <p className="text-green-700 dark:text-green-300">
                You completed {cycleCount} breathing cycles in {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
              </p>
            </motion.div>
          )}
        </div>

        <div className="flex justify-center space-x-2">
          {!isActive && cycleCount === 0 ? (
            <button
              onClick={startExercise}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:scale-105 transition-transform flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Start Exercise</span>
            </button>
          ) : (
            <>
              <button
                onClick={pauseExercise}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-medium hover:scale-105 transition-transform flex items-center space-x-2"
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isActive ? 'Pause' : 'Resume'}</span>
              </button>
              <button
                onClick={resetExercise}
                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-medium hover:scale-105 transition-transform flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          Follow the 4-4-4 breathing pattern: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds.
        </p>
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;
