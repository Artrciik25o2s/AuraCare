
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Brain, TrendingUp, Award, Calendar, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useMindfulStore } from '../stores/mindfulStore';

const DashboardPage: React.FC = () => {
  const { userProfile, feedbackHistory } = useMindfulStore();

  // Generate mock progress data for demonstration
  const progressData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      day,
      mood: Math.floor(Math.random() * 40) + 60,
      stress: Math.floor(Math.random() * 30) + 20,
      energy: Math.floor(Math.random() * 50) + 50,
      focus: Math.floor(Math.random() * 45) + 55,
    }));
  }, []);

  const emotionDistribution = [
    { name: 'Happy', value: 35, color: '#10B981' },
    { name: 'Calm', value: 25, color: '#3B82F6' },
    { name: 'Anxious', value: 20, color: '#F59E0B' },
    { name: 'Stressed', value: 15, color: '#EF4444' },
    { name: 'Excited', value: 5, color: '#8B5CF6' },
  ];

  const weeklyStats = [
    { metric: 'Mood Score', value: 78, change: '+12%', color: 'text-green-600 dark:text-green-400' },
    { metric: 'Sleep Quality', value: 85, change: '+5%', color: 'text-blue-600 dark:text-blue-400' },
    { metric: 'Stress Level', value: 32, change: '-8%', color: 'text-red-600 dark:text-red-400' },
    { metric: 'Focus Score', value: 72, change: '+15%', color: 'text-purple-600 dark:text-purple-400' },
  ];

  const achievements = [
    { title: '7-Day Streak', icon: '🔥', unlocked: userProfile.streakDays >= 7, progress: userProfile.streakDays },
    { title: 'First Quiz', icon: '🎯', unlocked: userProfile.totalQuizzes >= 1, progress: userProfile.totalQuizzes },
    { title: 'Token Collector', icon: '💰', unlocked: userProfile.tokensEarned >= 50, progress: userProfile.tokensEarned },
    { title: 'Wellness Warrior', icon: '⚔️', unlocked: userProfile.totalQuizzes >= 10, progress: userProfile.totalQuizzes },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 mb-2">
            Wellness Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Track your mental health journey</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Quizzes</CardTitle>
              <Brain className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.totalQuizzes}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Mental health assessments</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Tokens Earned</CardTitle>
              <Award className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.tokensEarned}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Wellness rewards</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Streak Days</CardTitle>
              <Calendar className="h-4 w-4 text-green-500 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.streakDays}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Consecutive days</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Wellness Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">78</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Overall progress</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Weekly Progress</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Your emotional wellness trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" className="text-gray-600 dark:text-gray-400" />
                    <YAxis className="text-gray-600 dark:text-gray-400" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Area type="monotone" dataKey="mood" stroke="#3B82F6" fillOpacity={1} fill="url(#colorMood)" />
                    <Area type="monotone" dataKey="stress" stroke="#EF4444" fillOpacity={1} fill="url(#colorStress)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Emotion Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Emotion Distribution</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Your emotional patterns this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={emotionDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {emotionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Weekly Stats & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Weekly Statistics</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Key metrics from this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyStats.map((stat, index) => (
                    <div key={stat.metric} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{stat.metric}</p>
                        <p className={`text-sm ${stat.color}`}>{stat.change} from last week</p>
                      </div>
                      <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stat.value}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Achievements</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Your wellness milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={achievement.title} className={`p-4 rounded-xl border-2 ${
                      achievement.unlocked 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div>
                            <p className={`font-medium ${achievement.unlocked ? 'text-green-800 dark:text-green-200' : 'text-gray-600 dark:text-gray-400'}`}>
                              {achievement.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Progress: {achievement.progress}
                            </p>
                          </div>
                        </div>
                        {achievement.unlocked && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Target className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
