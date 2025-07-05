import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Globe, Award, Brain, Calendar, TrendingUp, Wallet, Edit2, Save, X, MessageSquare, Shield, Heart, Target, Bell, Palette, Accessibility, Star, Sparkles, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useMindfulStore } from '../stores/mindfulStore';
import { nftService } from '../services/nftService';
import NFTGallery from './NFTGallery';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { userProfile, setUserProfile, feedbackHistory, userResponses, gameScores } = useMindfulStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'nfts' | 'settings'>('overview');
  const [editData, setEditData] = useState({
    language: userProfile.language,
    name: userProfile.name || 'Wellness Explorer',
    goals: userProfile.goals || [],
    notifications: userProfile.notifications !== false,
    theme: userProfile.theme || 'auto',
    accessibility: userProfile.accessibility || false
  });

  // Calculate real statistics from actual data
  const [stats, setStats] = useState({
    totalAssessments: 0,
    tokensEarned: 0,
    streakDays: 0,
    aiInsights: 0,
    avgMoodScore: 0,
    improvementRate: 0,
    nftCount: 0,
    gamesPlayed: 0
  });

  // Calculate recent activities from multiple sources
  const [recentActivities, setRecentActivities] = useState<Array<{
    type: 'assessment' | 'game' | 'nft' | 'streak';
    title: string;
    description: string;
    timestamp: number;
    icon: any;
    color: string;
  }>>([]);

  useEffect(() => {
    // Calculate real statistics
    const calculateStats = () => {
      const totalAssessments = userProfile.totalQuizzes;
      const tokensEarned = userProfile.tokensEarned;
      const streakDays = userProfile.streakDays;
      const aiInsights = feedbackHistory.length;
      const nftCount = userProfile.mintedNFTs?.length || 0;
      const gamesPlayed = Object.keys(gameScores).length;
      
      // Calculate average mood score from quiz responses
      let avgMoodScore = 0;
      if (userResponses) {
        const totalCards = userResponses.often.length + userResponses.sometimes.length + userResponses.rarely.length;
        if (totalCards > 0) {
          const moodPoints = (userResponses.often.length * 3) + (userResponses.sometimes.length * 2) + (userResponses.rarely.length * 1);
          avgMoodScore = Math.round((moodPoints / (totalCards * 3)) * 100);
        }
      }
      
      const improvementRate = Math.min(95, Math.max(0, (aiInsights * 10) + (streakDays * 2)));
      
      setStats({
        totalAssessments,
        tokensEarned,
        streakDays,
        aiInsights,
        avgMoodScore,
        improvementRate,
        nftCount,
        gamesPlayed
      });
    };

    // Generate recent activities
    const generateRecentActivities = () => {
      const activities = [];

      // Add assessment activities from feedback history
      feedbackHistory.slice(-3).forEach(feedback => {
        activities.push({
          type: 'assessment' as const,
          title: 'Wellness Assessment Completed',
          description: 'Received personalized AI insights',
          timestamp: feedback.timestamp,
          icon: Brain,
          color: 'text-blue-500'
        });
      });

      // Add game activities
      Object.entries(gameScores).slice(-2).forEach(([gameId, score]) => {
        const gameNames: { [key: string]: string } = {
          'memory': 'Memory Game',
          'reaction': 'Reaction Time Test',
          'math': 'Math Lightning',
          'breathing': 'Breathing Exercise'
        };
        
        activities.push({
          type: 'game' as const,
          title: `${gameNames[gameId] || 'Game'} Completed`,
          description: `Scored ${score} points`,
          timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Random time within last week
          icon: Activity,
          color: 'text-green-500'
        });
      });

      // Add NFT activities
      if (userProfile.mintedNFTs && userProfile.mintedNFTs.length > 0) {
        userProfile.mintedNFTs.slice(-2).forEach(nft => {
          activities.push({
            type: 'nft' as const,
            title: 'Achievement NFT Earned',
            description: nft.name || 'Wellness milestone achieved',
            timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Random time within last month
            icon: Award,
            color: 'text-yellow-500'
          });
        });
      }

      // Add streak activity if user has a streak
      if (userProfile.streakDays > 0) {
        activities.push({
          type: 'streak' as const,
          title: 'Streak Milestone',
          description: `${userProfile.streakDays} consecutive days`,
          timestamp: userProfile.lastQuizDate || Date.now(),
          icon: Target,
          color: 'text-purple-500'
        });
      }

      // Sort by timestamp and take the most recent 5
      activities.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivities(activities.slice(0, 5));
    };

    calculateStats();
    generateRecentActivities();
  }, [userProfile, feedbackHistory, userResponses, gameScores]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  ];

  const wellnessGoals = [
    { id: 'stress', label: 'Reduce Stress', icon: '🧘' },
    { id: 'sleep', label: 'Better Sleep', icon: '😴' },
    { id: 'focus', label: 'Improve Focus', icon: '🎯' },
    { id: 'mood', label: 'Mood Balance', icon: '😊' },
    { id: 'anxiety', label: 'Manage Anxiety', icon: '🕊️' },
    { id: 'energy', label: 'Boost Energy', icon: '⚡' },
  ];

  const themes = [
    { id: 'auto', label: 'Auto', icon: '🌓' },
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' },
  ];

  const handleSave = () => {
    setUserProfile(editData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditData({ 
      language: userProfile.language,
      name: userProfile.name || 'Wellness Explorer',
      goals: userProfile.goals || [],
      notifications: userProfile.notifications !== false,
      theme: userProfile.theme || 'auto',
      accessibility: userProfile.accessibility || false
    });
    setIsEditing(false);
  };

  const toggleGoal = (goalId: string) => {
    setEditData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId) 
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const connectWallet = async () => {
    try {
      const address = await nftService.connectWallet();
      if (address) {
        setUserProfile({ address });
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  const tabButtons = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'nfts', label: 'NFT Collection', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const statsCards = [
    {
      title: 'Total Assessments',
      value: stats.totalAssessments,
      icon: Brain,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      description: 'Wellness evaluations completed'
    },
    {
      title: 'NFTs Collected',
      value: stats.nftCount,
      icon: Award,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      description: 'Achievement NFTs minted'
    },
    {
      title: 'Current Streak',
      value: `${stats.streakDays} days`,
      icon: Calendar,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      description: 'Consecutive active days'
    },
    {
      title: 'Games Played',
      value: stats.gamesPlayed,
      icon: Activity,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      description: 'Cognitive training sessions'
    }
  ];

  const wellnessMetrics = [
    {
      label: 'Mood Score',
      value: `${stats.avgMoodScore}%`,
      icon: Heart,
      color: 'text-red-500 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      label: 'Progress Rate',
      value: `${stats.improvementRate}%`,
      icon: TrendingUp,
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      label: 'Consistency',
      value: `${Math.min(100, (stats.streakDays / 30) * 100).toFixed(0)}%`,
      icon: Target,
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 mb-2">
                {userProfile.name || 'Wellness Explorer'}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">Your digital wellness journey</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm rounded-full font-medium">
                Level {Math.floor(stats.totalAssessments / 5) + 1}
              </div>
              {userProfile.mintedNFTs && userProfile.mintedNFTs.length > 0 && (
                <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm rounded-full font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  NFT Collector
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white/50 dark:bg-gray-800/50 p-1 rounded-xl backdrop-blur-lg border border-white/20 dark:border-white/10">
            {tabButtons.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Metrics and Activity */}
              <div className="xl:col-span-1 space-y-6">
                {/* Wellness Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-gray-900 dark:text-white">Wellness Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {wellnessMetrics.map((metric, index) => (
                        <div key={metric.label} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                              <metric.icon className={`w-4 h-4 ${metric.color}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                          </div>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recentActivities.length > 0 ? (
                        <div className="space-y-3">
                          {recentActivities.map((activity, index) => {
                            const ActivityIcon = activity.icon;
                            return (
                              <div key={`${activity.type}-${index}`} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <ActivityIcon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.title}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(activity.timestamp).toLocaleDateString()}</p>
                                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 truncate">{activity.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500">Take an assessment to get started!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Stats Grid */}
              <div className="xl:col-span-2">
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {statsCards.map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                              <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                          </div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{stat.title}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{stat.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === 'nfts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <NFTGallery />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Settings className="w-5 h-5" />
                    <span>Profile Settings</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-medium hover:scale-105 transition-transform flex items-center space-x-2"
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                    </button>
                    
                    {!userProfile.address && (
                      <button
                        onClick={connectWallet}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-medium hover:scale-105 transition-transform flex items-center space-x-2"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Connect Wallet</span>
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your name"
                      />
                    ) : (
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                        {userProfile.name || 'Wellness Explorer'}
                      </div>
                    )}
                  </div>

                  {/* Language Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Preferred Language
                    </label>
                    {isEditing ? (
                      <select
                        value={editData.language}
                        onChange={(e) => setEditData({ ...editData, language: e.target.value })}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                        {languages.find(l => l.code === userProfile.language)?.flag} {' '}
                        {languages.find(l => l.code === userProfile.language)?.name}
                      </div>
                    )}
                  </div>

                  {/* Wellness Goals */}
                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Target className="w-4 h-4 inline mr-2" />
                        Wellness Goals
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {wellnessGoals.map((goal) => (
                          <button
                            key={goal.id}
                            onClick={() => toggleGoal(goal.id)}
                            className={`p-2 rounded-lg text-xs transition-all ${
                              editData.goals.includes(goal.id)
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <span className="mr-1">{goal.icon}</span>
                            {goal.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Theme Selection */}
                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Palette className="w-4 h-4 inline mr-2" />
                        Theme Preference
                      </label>
                      <div className="flex space-x-2">
                        {themes.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setEditData({ ...editData, theme: theme.id })}
                            className={`px-3 py-2 rounded-lg text-sm transition-all ${
                              editData.theme === theme.id
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <span className="mr-1">{theme.icon}</span>
                            {theme.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notifications */}
                  {isEditing && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Bell className="w-4 h-4 mr-2" />
                        Daily Reminders
                      </label>
                      <button
                        onClick={() => setEditData({ ...editData, notifications: !editData.notifications })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          editData.notifications ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          editData.notifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  )}

                  {/* Accessibility */}
                  {isEditing && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Accessibility className="w-4 h-4 mr-2" />
                        High Contrast Mode
                      </label>
                      <button
                        onClick={() => setEditData({ ...editData, accessibility: !editData.accessibility })}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          editData.accessibility ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          editData.accessibility ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  )}

                  {/* Wallet Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Wallet className="w-4 h-4 inline mr-2" />
                      Wallet Address
                    </label>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      {userProfile.address ? (
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm text-gray-900 dark:text-white">
                            {userProfile.address.slice(0, 6)}...{userProfile.address.slice(-4)}
                          </span>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded-full">
                            Connected
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Not connected</span>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-2 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-medium hover:scale-105 transition-transform flex items-center justify-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-xl font-medium hover:scale-105 transition-transform flex items-center justify-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
