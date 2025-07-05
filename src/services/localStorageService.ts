
import { UserProfile, AIFeedback, UserResponse } from '../stores/mindfulStore';

const STORAGE_KEYS = {
  USER_PROFILE: 'mindfulchain_user_profile',
  FEEDBACK_HISTORY: 'mindfulchain_feedback_history',
  USER_RESPONSES: 'mindfulchain_user_responses',
  QUIZ_STATE: 'mindfulchain_quiz_state'
};

export const localStorageService = {
  // User Profile
  saveUserProfile: (profile: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  },

  getUserProfile: (): UserProfile | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  },

  // Feedback History
  saveFeedbackHistory: (history: AIFeedback[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.FEEDBACK_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving feedback history:', error);
    }
  },

  getFeedbackHistory: (): AIFeedback[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading feedback history:', error);
      return [];
    }
  },

  // User Responses
  saveUserResponses: (responses: UserResponse) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_RESPONSES, JSON.stringify(responses));
    } catch (error) {
      console.error('Error saving user responses:', error);
    }
  },

  getUserResponses: (): UserResponse | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_RESPONSES);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading user responses:', error);
      return null;
    }
  },

  // Quiz State
  saveQuizState: (step: number) => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ_STATE, step.toString());
    } catch (error) {
      console.error('Error saving quiz state:', error);
    }
  },

  getQuizState: (): number => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUIZ_STATE);
      return saved ? parseInt(saved, 10) : 0;
    } catch (error) {
      console.error('Error loading quiz state:', error);
      return 0;
    }
  },

  // Clear all data
  clearAllData: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
};
