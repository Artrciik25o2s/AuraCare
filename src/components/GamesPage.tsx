
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Target, Brain, Zap, Star, Calendar, Award, Wind, Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useMindfulStore } from '../stores/mindfulStore';
import MathLightningGame from './games/MathLightningGame';
import MemoryGame from './games/MemoryGame';
import ReactionTimeGame from './games/ReactionTimeGame';
import BreathingExercise from './games/BreathingExercise';

// Helper function to get icon component from icon name
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'Calculator': Calculator,
    'Brain': Brain,
    'Zap': Zap,
    'Star': Star
  };
  return iconMap[iconName] || Calculator;
};

const GamesPage: React.FC = () => {
  const { userProfile, gameScores, updateGameScore } = useMindfulStore();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // Daily Challenges with icon names as strings
  const dailyChallenges = [
    {
      id: 'focus',
      title: 'Math Master',
      description: 'Score 50+ points in Math Lightning',
      target: 50,
      iconName: 'Calculator',
      reward: 10,
      difficulty: 'Medium'
    },
    {
      id: 'memory',
      title: 'Memory Champion',
      description: 'Score 800+ points in Memory Game',
      target: 800,
      iconName: 'Brain',
      reward: 15,
      difficulty: 'Hard'
    },
    {
      id: 'reaction',
      title: 'Lightning Reflexes',
      description: 'Score 700+ points in Reaction Time',
      target: 700,
      iconName: 'Zap',
      reward: 8,
      difficulty: 'Easy'
    },
    {
      id: 'mindful',
      title: 'Mindful Moments',
      description: 'Complete 5 breathing cycles',
      target: 5,
      iconName: 'Star',
      reward: 12,
      difficulty: 'Medium'
    }
  ];

  const games = [
    {
      id: 'focus',
      title: 'Math Lightning',
      description: 'Solve math problems as fast as you can',
      icon: Calculator,
      color: 'from-blue-500 to-purple-600',
      component: MathLightningGame
    },
    {
      id: 'memory',
      title: 'Memory Game',
      description: 'Challenge your memory with card matching',
      icon: Brain,
      color: 'from-purple-500 to-pink-600',
      component: MemoryGame
    },
    {
      id: 'reaction',
      title: 'Reaction Time',
      description: 'Test your reflexes and response speed',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      component: ReactionTimeGame
    },
    {
      id: 'mindful',
      title: 'Breathing Exercise',
      description: 'Practice mindful breathing techniques',
      icon: Wind,
      color: 'from-green-500 to-teal-600',
      component: BreathingExercise
    }
  ];

  const achievements = [
    { title: 'First Game', description: 'Play your first game', unlocked: Object.keys(gameScores).length > 0, icon: '🎮' },
    { title: 'Math Expert', description: 'Score 100+ in Math Lightning', unlocked: (gameScores.focus || 0) >= 100, icon: '🧮' },
    { title: 'Memory Master', description: 'Score 900+ in Memory Game', unlocked: (gameScores.memory || 0) >= 900, icon: '🧠' },
    { title: 'Speed Demon', description: 'Score 800+ in Reaction Time', unlocked: (gameScores.reaction || 0) >= 800, icon: '⚡' },
    { title: 'Zen Master', description: 'Complete 10 breathing cycles', unlocked: (gameScores.mindful || 0) >= 10, icon: '🧘‍♀️' },
    { title: 'Daily Challenger', description: 'Complete a daily challenge', unlocked: dailyChallenges.some(challenge => (gameScores[challenge.id] || 0) >= challenge.target), icon: '📅' },
    { title: 'Game Master', description: 'Play all 4 games', unlocked: games.every(game => gameScores[game.id] > 0), icon: '👑' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 mb-2">
            Wellness Games
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Train your mind while having fun
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Games & Daily Challenges */}
          <div className="lg:col-span-2 space-y-8">
            {/* Games Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Games</h2>
              <div className="grid grid-cols-1 gap-6">
                {games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {selectedGame === game.id ? (
                      <div className="space-y-4">
                        <button
                          onClick={() => setSelectedGame(null)}
                          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          ← Back to Games
                        </button>
                        <game.component />
                      </div>
                    ) : (
                      <Card 
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
                        onClick={() => setSelectedGame(game.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className={`w-16 h-16 bg-gradient-to-r ${game.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <game.icon className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{game.title}</h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-2">{game.description}</p>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Best Score: <span className="font-bold text-blue-600 dark:text-blue-400">{gameScores[game.id] || 0}</span>
                                </span>
                                <button className={`px-4 py-2 bg-gradient-to-r ${game.color} text-white rounded-lg font-medium hover:scale-105 transition-transform`}>
                                  Play Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Daily Challenges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Calendar className="w-5 h-5 text-yellow-500" />
                    <span>Daily Challenges</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Complete challenges to earn extra tokens!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dailyChallenges.map((challenge, index) => {
                      const IconComponent = getIconComponent(challenge.iconName);
                      const currentScore = gameScores[challenge.id] || 0;
                      const isCompleted = currentScore >= challenge.target;
                      const progress = Math.min(100, (currentScore / challenge.target) * 100);

                      return (
                        <motion.div
                          key={challenge.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            isCompleted
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 shadow-lg'
                              : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isCompleted ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'
                              }`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className={`font-semibold text-sm ${
                                  isCompleted ? 'text-green-800 dark:text-green-200' : 'text-gray-800 dark:text-gray-200'
                                }`}>
                                  {challenge.title}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{challenge.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                challenge.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
                                challenge.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200' :
                                'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                              }`}>
                                {challenge.difficulty}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600 dark:text-gray-400">Progress: {currentScore}/{challenge.target}</span>
                              <span className={`font-bold ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Reward: +{challenge.reward} tokens
                              </span>
                              {isCompleted && (
                                <span className="text-xs text-green-600 dark:text-green-400 font-bold">✓ Completed</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Stats & Achievements */}
          <div className="space-y-6">
            {/* Game Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span>Your Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{Object.keys(gameScores).length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Games Played</div>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(gameScores).map(([gameId, score]) => {
                      const gameName = games.find(g => g.id === gameId)?.title || gameId;
                      return (
                        <div key={gameId} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{gameName}</span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{score}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      +{dailyChallenges.reduce((total, challenge) => {
                        const isCompleted = (gameScores[challenge.id] || 0) >= challenge.target;
                        return total + (isCompleted ? challenge.reward : 0);
                      }, 0)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tokens from Challenges</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          achievement.unlocked
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <h4 className={`font-semibold text-sm ${
                              achievement.unlocked ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {achievement.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                          </div>
                          {achievement.unlocked && (
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Target className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;
