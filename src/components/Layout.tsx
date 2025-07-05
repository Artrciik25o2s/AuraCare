import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Wallet, Globe, Home, BarChart3, User, Gamepad2, Moon, Sun, MessageCircle } from 'lucide-react';
import { useMindfulStore } from '../stores/mindfulStore';
import { blockchainService } from '../services/blockchainService';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'quiz' | 'dashboard' | 'profile' | 'games';
  onPageChange: (page: 'home' | 'quiz' | 'dashboard' | 'profile' | 'games' | 'chat') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { userProfile, setUserProfile } = useMindfulStore();
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true; // Default to true (dark mode)
  });

  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Set dark mode on initial load
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const connectWallet = async () => {
    const address = await blockchainService.connectWallet();
    if (address) {
      setUserProfile({ address });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', gradient: 'from-blue-500 to-purple-600' },
    { id: 'quiz', icon: Brain, label: 'Assessment', gradient: 'from-purple-500 to-pink-600' },
    { id: 'chat', icon: MessageCircle, label: 'AI Therapist', gradient: 'from-teal-500 to-cyan-600' },
    { id: 'games', icon: Gamepad2, label: 'Games', gradient: 'from-indigo-500 to-blue-600' },
    { id: 'dashboard', icon: BarChart3, label: 'Progress', gradient: 'from-green-500 to-teal-600' },
    { id: 'profile', icon: User, label: 'Profile', gradient: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-300/20 to-purple-300/20 dark:from-blue-600/20 dark:to-purple-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-pink-300/20 to-yellow-300/20 dark:from-pink-600/20 dark:to-yellow-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-300/10 to-blue-300/10 dark:from-green-600/10 dark:to-blue-600/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      {/* Header */}
      <header className="relative z-50 backdrop-blur-lg bg-white/30 dark:bg-black/30 border-b border-white/20 dark:border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-mindful-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">MindfulChain</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Mental Wellness Gamified</p>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-3">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => onPageChange(item.id as any)}
                  className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === item.id
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-4 h-4 inline mr-2" />
                  {item.label}
                </motion.button>
              ))}
            </nav>

            {/* Right Side Controls */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              
             <a
  href="https://www.who.int/health-topics/mental-health"
  target="_blank"
  rel="noopener noreferrer"
  className="hidden md:flex items-center space-x-3 text-sm px-4 py-2 rounded-xl bg-white/20 dark:bg-white/10"
>
  <Globe className="w-4 h-4 text-mindful-500" />
  <span className="text-gray-600 dark:text-gray-300">Global Wellness</span>
</a>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-600" />
                )}
              </button>
              
              <button
                onClick={connectWallet}
                className={`flex items-center space-x-3 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                  userProfile.address
                    ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
                    : 'bg-gradient-to-r from-mindful-500 to-purple-600 text-white hover:shadow-lg'
                } hover:scale-105`}
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {userProfile.address 
                    ? `${userProfile.address.slice(0, 6)}...${userProfile.address.slice(-4)}`
                    : 'Connect Wallet'
                  }
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <motion.div 
          className="flex items-center justify-around bg-white/80 dark:bg-black/80 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20 dark:border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id as any)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                currentPage === item.id
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-110`
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Layout;
