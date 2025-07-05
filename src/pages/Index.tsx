
import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';
import HomePage from '../components/HomePage';
import OnboardingPage from '../components/OnboardingPage';
import QuizPage from '../components/QuizPage';
import DashboardPage from '../components/DashboardPage';
import ProfilePage from '../components/ProfilePage';
import ChatBotPage from '../components/ChatBotPage';
import GamesPage from '../components/GamesPage';
import { useMindfulStore } from '../stores/mindfulStore';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'onboarding' | 'home' | 'quiz' | 'dashboard' | 'profile' | 'chat' | 'games'>('onboarding');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { loadFromStorage, userProfile } = useMindfulStore();

  useEffect(() => {
    // Set dark mode by default on app load
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === null) {
      // If no preference saved, default to dark mode
      localStorage.setItem('darkMode', JSON.stringify(true));
      document.documentElement.classList.add('dark');
    } else {
      // Apply saved preference
      const isDarkMode = JSON.parse(savedDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Load data from localStorage on app start
    loadFromStorage();
    
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (hasSeenOnboarding === 'true') {
      setShowOnboarding(false);
      setCurrentPage('home');
    }
  }, [loadFromStorage]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
    setCurrentPage('home');
  };

  const handlePageChange = (page: 'home' | 'quiz' | 'dashboard' | 'profile' | 'chat' | 'games') => {
    setCurrentPage(page);
  };

  const handleStartQuiz = () => {
    setCurrentPage('quiz');
  };

  const handleQuizComplete = () => {
    setCurrentPage('dashboard');
  };

  const handleShowOnboarding = () => {
    setShowOnboarding(true);
    setCurrentPage('onboarding');
  };

  const renderCurrentPage = () => {
    if (showOnboarding) {
      return <OnboardingPage onComplete={handleOnboardingComplete} />;
    }

    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onStartQuiz={handleStartQuiz} 
            onNavigate={handlePageChange}
            onShowOnboarding={handleShowOnboarding}
          />
        );
      case 'quiz':
        return <QuizPage onComplete={handleQuizComplete} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'profile':
        return <ProfilePage />;
      case 'chat':
        return <ChatBotPage />;
      case 'games':
        return <GamesPage />;
      default:
        return (
          <HomePage 
            onStartQuiz={handleStartQuiz} 
            onNavigate={handlePageChange}
            onShowOnboarding={handleShowOnboarding}
          />
        );
    }
  };

  // Don't show layout during onboarding
  if (showOnboarding) {
    return (
      <>
        {renderCurrentPage()}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </>
    );
  }

  return (
    <>
      <Layout currentPage={currentPage as 'home' | 'quiz' | 'dashboard' | 'profile' | 'games'} onPageChange={(page) => handlePageChange(page as 'home' | 'quiz' | 'dashboard' | 'profile' | 'chat' | 'games')}>
        {renderCurrentPage()}
      </Layout>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </>
  );
};

export default Index;
