
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Sparkles, 
  Trophy, 
  Users, 
  TrendingUp, 
  Play, 
  Star,
  Zap,
  Shield,
  Gamepad2,
  MessageSquare,
  Award,
  Target,
  ChevronRight,
  Activity,
  Moon,
  Sun,
  Smile,
  CheckCircle,
  ArrowRight,
  Rocket,
  Gift
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useMindfulStore } from '../stores/mindfulStore';

interface HomePageProps {
  onStartQuiz: () => void;
  onNavigate?: (page: 'quiz' | 'games' | 'chat' | 'profile') => void;
  onShowOnboarding?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartQuiz, onNavigate, onShowOnboarding }) => {
  const { userProfile, feedbackHistory } = useMindfulStore();

  const features = [
    {
      icon: Brain,
      title: "AI Assessment",
      description: "Get personalized mental health insights powered by Google Gemini AI",
      color: "from-blue-500 to-purple-600",
      action: "Take Assessment",
      onClick: () => onStartQuiz()
    },
    {
      icon: Gamepad2,
      title: "Wellness Games",
      description: "Play interactive games designed to improve your cognitive abilities",
      color: "from-green-500 to-teal-600",
      action: "Play Games",
      onClick: () => onNavigate?.('games')
    },
    {
      icon: MessageSquare,
      title: "AI Therapist",
      description: "Chat with our AI therapist for 24/7 mental health support",
      color: "from-teal-500 to-cyan-600",
      action: "Start Chat",
      onClick: () => onNavigate?.('chat')
    },
    {
      icon: Trophy,
      title: "NFT Rewards",
      description: "Earn unique NFTs by completing wellness milestones and challenges",
      color: "from-yellow-500 to-orange-600",
      action: "View Gallery",
      onClick: () => onNavigate?.('profile')
    }
  ];

  const stats = [
    { icon: CheckCircle, value: feedbackHistory.length, label: "Assessments Completed", color: "text-green-500" },
    { icon: Trophy, value: userProfile.mintedNFTs?.length || 0, label: "NFTs Earned", color: "text-yellow-500" },
    { icon: Target, value: userProfile.streakDays || 0, label: "Day Streak", color: "text-blue-500" },
    { icon: Star, value: userProfile.tokensEarned || 0, label: "Total Score", color: "text-purple-500" }
  ];

  return (
    <div className="min-h-screen pt-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
            <Brain className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            Welcome to{' '}
            <span className="gradient-text">MindfulChain</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Your journey to mental wellness starts here. Powered by AI, gamified for engagement, and rewarded with blockchain technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onStartQuiz}
              size="lg"
              className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Your Assessment
            </Button>
            
            <Button
              onClick={onShowOnboarding}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg rounded-xl border-2 hover:bg-white/50 dark:hover:bg-white/10"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <StatIcon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Discover Your Wellness Journey
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-xl bg-white/70 dark:bg-black/70 backdrop-blur-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <FeatureIcon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-gray-600 dark:text-gray-300 mb-6 text-base">
                        {feature.description}
                      </CardDescription>
                      <Button 
                        onClick={feature.onClick}
                        variant="ghost" 
                        className="w-full justify-between group-hover:bg-white/20 dark:group-hover:bg-white/10"
                      >
                        {feature.action}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-200/20 dark:border-purple-700/20">
            <Gift className="w-16 h-16 mx-auto mb-6 text-purple-600" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to Transform Your Mental Health?
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already improving their mental wellness with our AI-powered platform. Start your journey today and earn amazing NFT rewards!
            </p>
            <Button
              onClick={onStartQuiz}
              size="lg"
              className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg"
            >
              Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
