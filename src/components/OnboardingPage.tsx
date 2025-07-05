import React, { useState } from 'react';
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
  ChevronLeft,
  X,
  Wallet,
  Coins,
  Gift,
  Activity,
  Moon,
  Sun,
  Smile,
  CheckCircle,
  ArrowRight,
  SkipForward
} from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingPageProps {
  onComplete: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const slides = [
    {
      title: "Welcome to MindfulChain",
      subtitle: "Your AI-Powered Mental Wellness Companion",
      description: "Transform your mental health journey with cutting-edge AI technology, gamified experiences, and blockchain-verified achievements.",
      icon: Brain,
      gradient: "from-purple-600 via-blue-600 to-teal-500",
      features: [
        { icon: Brain, title: "Smart Assessment", description: "AI-powered emotional intelligence evaluation", color: "text-blue-500" },
        { icon: Heart, title: "Wellness Tracking", description: "Monitor mood, sleep, stress, and energy levels", color: "text-red-500" },
        { icon: Gamepad2, title: "Interactive Games", description: "Memory, reaction time, and breathing exercises", color: "text-green-500" },
        { icon: Shield, title: "Privacy First", description: "Your data is encrypted and secure", color: "text-teal-500" }
      ]
    },
    {
      title: "Gamified Wellness & AI Insights",
      subtitle: "Make Mental Health Fun & Personalized",
      description: "Engage with interactive games and get personalized insights from our Google Gemini AI that analyzes your emotional patterns and provides tailored guidance.",
      icon: Sparkles,
      gradient: "from-pink-500 via-purple-500 to-indigo-600",
      features: [
        { icon: Gamepad2, title: "Memory Games", description: "Enhance cognitive function with fun challenges", color: "text-purple-500" },
        { icon: Activity, title: "Breathing Exercises", description: "Guided meditation and stress relief", color: "text-green-500" },
        { icon: MessageSquare, title: "AI Therapist", description: "24/7 multilingual mental health support", color: "text-blue-500" },
        { icon: TrendingUp, title: "Progress Analytics", description: "Detailed insights and trend analysis", color: "text-indigo-500" }
      ]
    },
    {
      title: "NFT Rewards & Community",
      subtitle: "Earn Digital Achievements & Connect",
      description: "Mint unique NFTs on Base Sepolia blockchain for completing assessments, maintaining streaks, and achieving wellness milestones. Join our global wellness community.",
      icon: Trophy,
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      achievements: [
        { name: "First Steps", description: "Complete your first assessment", icon: CheckCircle },
        { name: "Wellness Warrior", description: "Maintain a 7-day streak", icon: Target },
        { name: "Mind Master", description: "Perfect score in memory game", icon: Brain },
        { name: "Zen Achiever", description: "Complete 10 breathing exercises", icon: Moon }
      ],
      stats: [
        { value: "10K+", label: "Active Users" },
        { value: "50K+", label: "Assessments Completed" },
        { value: "5K+", label: "NFTs Minted" }
      ]
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const CurrentSlideIcon = slides[currentSlide].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex flex-col">
      {/* Header */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">MindfulChain</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-600" />
                )}
              </button>

              {/* Skip Button */}
              <Button
                onClick={onComplete}
                variant="ghost"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-purple-600 w-8' : 'bg-gray-300 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className={`w-24 h-24 mx-auto mb-8 bg-gradient-to-r ${slides[currentSlide].gradient} rounded-3xl flex items-center justify-center shadow-2xl`}>
              <CurrentSlideIcon className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {slides[currentSlide].title}
            </h1>
            
            <h2 className="text-xl md:text-2xl font-semibold mb-6 gradient-text">
              {slides[currentSlide].subtitle}
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </motion.div>

          {/* Features Grid */}
          {slides[currentSlide].features && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            >
              {slides[currentSlide].features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
                  >
                    <FeatureIcon className={`w-8 h-8 mx-auto mb-3 ${feature.color}`} />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Achievement Showcase */}
          {slides[currentSlide].achievements && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                Unlock Amazing NFT Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {slides[currentSlide].achievements.map((achievement, index) => {
                  const AchievementIcon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                        <AchievementIcon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{achievement.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Stats */}
          {slides[currentSlide].stats && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            >
              {slides[currentSlide].stats.map((stat, index) => (
                <div key={index} className="glass-card rounded-2xl p-8 text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation - Fixed at bottom with proper spacing */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-white/10">
            <Button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              variant="outline"
              className="px-6 py-3 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {currentSlide === slides.length - 1 ? (
                <>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-teal-200 dark:bg-teal-800 rounded-full opacity-20 animate-float" style={{ animationDelay: '6s' }} />
      </div>
    </div>
  );
};

export default OnboardingPage;
