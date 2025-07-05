
import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useMindfulStore } from '../../stores/mindfulStore';

const ReactionTimeGame: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'clicked' | 'early'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { updateGameScore } = useMindfulStore();

  const startGame = useCallback(() => {
    setGameState('waiting');
    setReactionTime(null);
    
    const delay = Math.random() * 4000 + 1000; // 1-5 seconds
    
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = Date.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (gameState === 'waiting') {
      setGameState('early');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    if (gameState === 'ready') {
      const endTime = Date.now();
      const reaction = endTime - startTimeRef.current;
      setReactionTime(reaction);
      setGameState('clicked');
      setAttempts(prev => prev + 1);
      
      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction);
      }

      // Update score (lower reaction time = higher score)
      const score = Math.max(1000 - reaction, 100);
      updateGameScore('reaction', score);
    }
  }, [gameState, bestTime, updateGameScore]);

  const resetGame = () => {
    setGameState('idle');
    setReactionTime(null);
    setAttempts(0);
    setBestTime(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const getStateColor = () => {
    switch (gameState) {
      case 'waiting': return 'from-red-500 to-red-600';
      case 'ready': return 'from-green-500 to-green-600';
      case 'early': return 'from-yellow-500 to-yellow-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getStateText = () => {
    switch (gameState) {
      case 'waiting': return 'Wait for green...';
      case 'ready': return 'CLICK NOW!';
      case 'early': return 'Too early!';
      case 'clicked': return `${reactionTime}ms`;
      default: return 'Click to start';
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span>Reaction Time</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Best: <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {bestTime ? `${bestTime}ms` : 'N/A'}
            </span>
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Attempts: <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{attempts}</span>
          </div>
        </div>

        <motion.div
          className={`w-full h-32 rounded-lg bg-gradient-to-r ${getStateColor()} flex items-center justify-center cursor-pointer select-none`}
          onClick={gameState === 'idle' ? startGame : handleClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-white text-xl font-bold">{getStateText()}</span>
        </motion.div>

        <div className="text-center">
          {reactionTime && (
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{reactionTime}ms</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {reactionTime < 200 ? '🚀 Lightning fast!' :
                 reactionTime < 300 ? '⚡ Very good!' :
                 reactionTime < 400 ? '👍 Good!' :
                 '🐌 Keep practicing!'}
              </p>
            </div>
          )}
          
          <div className="flex justify-center space-x-2">
            {gameState === 'clicked' || gameState === 'early' ? (
              <button
                onClick={startGame}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-medium hover:scale-105 transition-transform flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            ) : null}
            
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-medium hover:scale-105 transition-transform flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-400 text-center space-y-1">
          <p>Wait for the green signal, then click as fast as you can!</p>
          <p>Don't click too early or you'll have to start over.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReactionTimeGame;
