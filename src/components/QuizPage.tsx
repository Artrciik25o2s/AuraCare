
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Brain, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { useMindfulStore } from '../stores/mindfulStore';
import { emotionCards } from '../data/emotionCards';
import { geminiService } from '../services/geminiService';
import toast from 'react-hot-toast';

interface QuizPageProps {
  onComplete: () => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ onComplete }) => {
  const {
    userResponses,
    setUserResponse,
    currentQuizStep,
    setCurrentStep,
    isLoading,
    setLoading,
    setAIFeedback,
    userProfile,
    setUserProfile,
    addToHistory,
    resetQuiz
  } = useMindfulStore();

  const [availableCards, setAvailableCards] = useState(emotionCards);
  const [currentCategory, setCurrentCategory] = useState<'mood' | 'sleep' | 'stress' | 'focus' | 'energy'>('mood');

  const categories = [
    { id: 'mood', label: 'How is your mood?', icon: '😊', color: 'from-blue-400 to-purple-500' },
    { id: 'sleep', label: 'How is your sleep?', icon: '😴', color: 'from-indigo-400 to-blue-500' },
    { id: 'stress', label: 'How is your stress level?', icon: '😰', color: 'from-red-400 to-pink-500' },
    { id: 'focus', label: 'How is your focus?', icon: '🎯', color: 'from-green-400 to-teal-500' },
    { id: 'energy', label: 'How is your energy?', icon: '⚡', color: 'from-yellow-400 to-orange-500' }
  ];

  const currentCategoryData = categories[currentQuizStep];
  const categoryCards = availableCards.filter(card => card.category === currentCategory);

  useEffect(() => {
    if (currentCategoryData) {
      setCurrentCategory(currentCategoryData.id as any);
    }
  }, [currentQuizStep, currentCategoryData]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destId = result.destination.droppableId;
    const cardId = result.draggableId;

    const card = availableCards.find(c => c.id === cardId);
    if (!card) return;

    // Remove from source
    if (sourceId !== 'available') {
      const sourceCategory = sourceId as 'often' | 'sometimes' | 'rarely';
      const updatedSource = userResponses[sourceCategory].filter(c => c.id !== cardId);
      setUserResponse(sourceCategory, updatedSource);
    }

    // Add to destination
    if (destId !== 'available') {
      const destCategory = destId as 'often' | 'sometimes' | 'rarely';
      const updatedDest = [...userResponses[destCategory], card];
      setUserResponse(destCategory, updatedDest);
    }
  };

  const handleNext = () => {
    if (currentQuizStep < categories.length - 1) {
      setCurrentStep(currentQuizStep + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    try {
      const feedback = await geminiService.generateFeedback(userResponses);
      setAIFeedback(feedback);
      addToHistory(feedback);

      // Update user profile
      const newTokens = userProfile.tokensEarned + 10;
      const newTotalQuizzes = userProfile.totalQuizzes + 1;
      const today = Date.now();
      const lastQuiz = userProfile.lastQuizDate;
      const isConsecutiveDay = lastQuiz && (today - lastQuiz) < 24 * 60 * 60 * 1000 * 2;
      const newStreak = isConsecutiveDay ? userProfile.streakDays + 1 : 1;

      setUserProfile({
        tokensEarned: newTokens,
        totalQuizzes: newTotalQuizzes,
        streakDays: newStreak,
        lastQuizDate: today
      });

      toast.success(`Quiz completed! Earned 10 tokens. Streak: ${newStreak} days!`);
      onComplete();
    } catch (error) {
      toast.error('Failed to generate AI feedback');
      console.error('Quiz submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Use the store's resetQuiz function which properly resets everything
    resetQuiz();
    toast.success('Assessment reset successfully!');
  };

  const buckets = [
    { id: 'often', label: 'Often', color: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-600', textColor: 'text-red-700 dark:text-red-300' },
    { id: 'sometimes', label: 'Sometimes', color: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600', textColor: 'text-yellow-700 dark:text-yellow-300' },
    { id: 'rarely', label: 'Rarely', color: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600', textColor: 'text-green-700 dark:text-green-300' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentCategoryData?.color} flex items-center justify-center text-2xl`}>
              {currentCategoryData?.icon}
            </div>
            <h1 className="text-3xl font-bold gradient-text">{currentCategoryData?.label}</h1>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-mindful-500 to-purple-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuizStep + 1) / categories.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Step {currentQuizStep + 1} of {categories.length}
          </p>
        </motion.div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Available Cards */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card rounded-2xl p-6 bg-white/60 dark:bg-white/10 backdrop-blur-lg border border-white/20 dark:border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Available Feelings</h3>
                <Droppable droppableId="available">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 max-h-96 overflow-y-auto">
                      {categoryCards.map((card, index) => {
                        const isUsed = Object.values(userResponses).some(bucket => 
                          bucket.some(usedCard => usedCard.id === card.id)
                        );
                        
                        if (isUsed) return null;

                        return (
                          <Draggable key={card.id} draggableId={card.id} index={index}>
                            {(provided, snapshot) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 cursor-grab ${
                                  snapshot.isDragging ? 'shadow-lg scale-105 border-mindful-300' : 'hover:border-mindful-200 dark:hover:border-mindful-400'
                                } transition-all`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">{card.emoji}</span>
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{card.text}</span>
                                </div>
                              </motion.div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </motion.div>

            {/* Drop Buckets */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {buckets.map((bucket, index) => (
                <motion.div
                  key={bucket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className={`glass-card rounded-2xl p-6 min-h-[300px] border-2 ${bucket.color} bg-white/60 dark:bg-white/10 backdrop-blur-lg`}>
                    <h3 className={`text-lg font-semibold mb-4 ${bucket.textColor}`}>{bucket.label}</h3>
                    
                    <Droppable droppableId={bucket.id}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`space-y-3 min-h-[200px] p-4 rounded-xl border-2 border-dashed transition-all ${
                            snapshot.isDraggingOver 
                              ? 'border-mindful-400 bg-mindful-50 dark:bg-mindful-900/30' 
                              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
                          }`}
                        >
                          {userResponses[bucket.id as keyof typeof userResponses].map((card, index) => (
                            <Draggable key={card.id} draggableId={card.id} index={index}>
                              {(provided, snapshot) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 cursor-grab ${
                                    snapshot.isDragging ? 'shadow-lg scale-105' : ''
                                  } transition-all`}
                                  layout
                                >
                                  <div className="flex items-center space-x-3">
                                    <span className="text-xl">{card.emoji}</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{card.text}</span>
                                  </div>
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </DragDropContext>

        {/* Action Buttons */}
        <motion.div 
          className="flex justify-center space-x-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-500 dark:bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-mindful-500 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Generating Insights...</span>
              </>
            ) : (
              <>
                <span>{currentQuizStep === categories.length - 1 ? 'Complete Quiz' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizPage;
