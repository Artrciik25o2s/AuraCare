
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Play, RotateCcw, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useMindfulStore } from '../../stores/mindfulStore';

interface MemoryCard {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'preview' | 'playing' | 'completed'>('idle');
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(4);
  const [isComparing, setIsComparing] = useState(false);
  const { updateGameScore } = useMindfulStore();

  const symbols = ['🌟', '🎯', '🌙', '☀️', '🌸', '🍀', '🔥', '💎'];

  const initializeGame = () => {
    const gameCards = [...symbols, ...symbols].map((symbol, index) => ({
      id: index,
      value: symbol,
      isFlipped: true, // Show all cards initially for preview
      isMatched: false,
    }));
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setTimeElapsed(0);
    setGameStartTime(Date.now());
    setGameState('preview');
    setPreviewTimeLeft(4);
    setIsComparing(false);
  };

  // Preview countdown effect
  useEffect(() => {
    if (gameState === 'preview' && previewTimeLeft > 0) {
      const timer = setTimeout(() => {
        setPreviewTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'preview' && previewTimeLeft === 0) {
      // Hide all cards and start the game
      setCards(prev => prev.map(card => ({ ...card, isFlipped: false })));
      setGameState('playing');
    }
  }, [gameState, previewTimeLeft]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, gameStartTime]);

  // Handle card comparison when 2 cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2 && !isComparing) {
      setIsComparing(true);
      
      // Increment moves counter
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Match found - mark cards as matched
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          ));
          setFlippedCards([]);
          setIsComparing(false);
        }, 500);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
          setIsComparing(false);
        }, 1000);
      }
    }
  }, [flippedCards, cards, isComparing]);

  // Check for game completion
  useEffect(() => {
    if (gameState === 'playing' && cards.length > 0) {
      const allMatched = cards.every(card => card.isMatched);
      if (allMatched) {
        setGameState('completed');
        // Calculate score: base 1000 points, minus 10 per move and 5 per second
        const score = Math.max(1000 - moves * 10 - timeElapsed * 5, 100);
        console.log('Game completed! Score:', score, 'Moves:', moves, 'Time:', timeElapsed);
        updateGameScore('memory', score);
      }
    }
  }, [cards, gameState, moves, timeElapsed, updateGameScore]);

  const handleCardClick = (cardId: number) => {
    // Prevent clicks during preview, when game is completed, or when comparing cards
    if (gameState !== 'playing' || isComparing) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    // Don't allow more than 2 cards to be flipped
    if (flippedCards.length >= 2) return;

    // Flip the card
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    
    // Add to flipped cards
    setFlippedCards(prev => [...prev, cardId]);
  };

  const resetGame = () => {
    setGameState('idle');
    setCards([]);
    setFlippedCards([]);
    setMoves(0);
    setTimeElapsed(0);
    setPreviewTimeLeft(4);
    setIsComparing(false);
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <Brain className="w-5 h-5 text-purple-500" />
          <span>Memory Game</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Moves: <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{moves}</span>
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{timeElapsed}s</span>
          </div>
        </div>

        {gameState === 'preview' && (
          <div className="text-center py-2">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Memorize the cards: {previewTimeLeft}s
            </div>
          </div>
        )}

        {gameState === 'idle' ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Match all pairs to complete the game!</p>
            <button
              onClick={initializeGame}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-medium hover:scale-105 transition-transform flex items-center space-x-2 mx-auto"
            >
              <Play className="w-4 h-4" />
              <span>Start Game</span>
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  className={`aspect-square rounded-lg cursor-pointer flex items-center justify-center text-2xl font-bold transition-all ${
                    card.isFlipped || card.isMatched
                      ? 'bg-white dark:bg-gray-700 shadow-md'
                      : 'bg-gradient-to-br from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600'
                  } ${gameState === 'playing' && !isComparing ? 'hover:scale-105' : ''}`}
                  onClick={() => handleCardClick(card.id)}
                  whileHover={{ scale: gameState === 'playing' && !isComparing ? 1.05 : 1 }}
                  whileTap={{ scale: gameState === 'playing' && !isComparing ? 0.95 : 1 }}
                >
                  {card.isFlipped || card.isMatched ? card.value : '?'}
                </motion.div>
              ))}
            </div>

            {gameState === 'completed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"
              >
                <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">🎉 Congratulations!</h3>
                <p className="text-green-700 dark:text-green-300">
                  Completed in {moves} moves and {timeElapsed} seconds!
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Score: {Math.max(1000 - moves * 10 - timeElapsed * 5, 100)} points
                </p>
              </motion.div>
            )}

            <div className="flex justify-center">
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-medium hover:scale-105 transition-transform flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </>
        )}

        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          {gameState === 'idle' ? 'Flip cards to find matching pairs. Complete faster for higher scores!' : 
           gameState === 'preview' ? 'Study the card positions carefully!' :
           'Find matching pairs by clicking on cards!'}
        </p>
      </CardContent>
    </Card>
  );
};

export default MemoryGame;
