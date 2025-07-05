
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { localStorageService } from '../services/localStorageService';
import { NFTMetadata } from '../services/nftService';

export interface EmotionCard {
  id: string;
  text: string;
  emoji: string;
  category: 'mood' | 'sleep' | 'stress' | 'focus' | 'energy';
}

export interface UserResponse {
  often: EmotionCard[];
  sometimes: EmotionCard[];
  rarely: EmotionCard[];
}

export interface AIFeedback {
  insight: string;
  tip: string;
  encouragement: string;
  timestamp: number;
}

export interface UserProfile {
  address?: string;
  totalQuizzes: number;
  tokensEarned: number;
  streakDays: number;
  lastQuizDate?: number;
  language: string;
  name?: string;
  goals?: string[];
  notifications?: boolean;
  theme?: string;
  accessibility?: boolean;
  mintedNFTs: NFTMetadata[];
}

interface MindfulStore {
  // User data
  userProfile: UserProfile;
  userResponses: UserResponse;
  currentQuizStep: number;
  isLoading: boolean;
  
  // AI feedback
  aiFeedback: AIFeedback | null;
  feedbackHistory: AIFeedback[];
  
  // UI state
  showWelcome: boolean;
  showRewards: boolean;
  
  // Actions
  setUserResponse: (category: 'often' | 'sometimes' | 'rarely', cards: EmotionCard[]) => void;
  setCurrentStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setAIFeedback: (feedback: AIFeedback) => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  resetQuiz: () => void;
  toggleWelcome: () => void;
  toggleRewards: () => void;
  addToHistory: (feedback: AIFeedback) => void;
  loadFromStorage: () => void;
  addMintedNFT: (nft: NFTMetadata) => void;
  
  // Game scores
  gameScores: { [gameId: string]: number };
  updateGameScore: (gameId: string, score: number) => void;
}

export const useMindfulStore = create<MindfulStore>()(
  persist(
    (set, get) => ({
      // Initial state
      userProfile: {
        totalQuizzes: 0,
        tokensEarned: 0,
        streakDays: 0,
        language: 'en',
        name: 'Wellness Explorer',
        goals: [],
        notifications: true,
        theme: 'auto',
        accessibility: false,
        mintedNFTs: []
      },
      userResponses: {
        often: [],
        sometimes: [],
        rarely: []
      },
      currentQuizStep: 0,
      isLoading: false,
      aiFeedback: null,
      feedbackHistory: [],
      showWelcome: true,
      showRewards: false,
      
      // Game scores
      gameScores: {},
      
      // Actions
      setUserResponse: (category, cards) => {
        const newResponses = {
          ...get().userResponses,
          [category]: cards
        };
        set({ userResponses: newResponses });
        localStorageService.saveUserResponses(newResponses);
      },
      
      setCurrentStep: (step) => {
        set({ currentQuizStep: step });
        localStorageService.saveQuizState(step);
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setAIFeedback: (feedback) => set({ aiFeedback: feedback }),
      
      setUserProfile: (profile) => {
        const newProfile = { ...get().userProfile, ...profile };
        set({ userProfile: newProfile });
        localStorageService.saveUserProfile(newProfile);
      },
      
      resetQuiz: () => {
        const resetResponses = { often: [], sometimes: [], rarely: [] };
        set({
          userResponses: resetResponses,
          currentQuizStep: 0,
          aiFeedback: null
        });
        localStorageService.saveUserResponses(resetResponses);
        localStorageService.saveQuizState(0);
      },
      
      toggleWelcome: () => set((state) => ({ showWelcome: !state.showWelcome })),
      
      toggleRewards: () => set((state) => ({ showRewards: !state.showRewards })),
      
      addToHistory: (feedback) => {
        const newHistory = [feedback, ...get().feedbackHistory].slice(0, 10);
        set({ feedbackHistory: newHistory });
        localStorageService.saveFeedbackHistory(newHistory);
      },
      
      loadFromStorage: () => {
        const savedProfile = localStorageService.getUserProfile();
        const savedHistory = localStorageService.getFeedbackHistory();
        const savedResponses = localStorageService.getUserResponses();
        const savedQuizStep = localStorageService.getQuizState();
        
        set({
          userProfile: savedProfile || get().userProfile,
          feedbackHistory: savedHistory,
          userResponses: savedResponses || get().userResponses,
          currentQuizStep: savedQuizStep
        });
      },
      
      updateGameScore: (gameId: string, score: number) => {
        set((state) => ({
          gameScores: {
            ...state.gameScores,
            [gameId]: Math.max(state.gameScores[gameId] || 0, score)
          }
        }));
      },
      
      addMintedNFT: (nft: NFTMetadata) => {
        const currentNFTs = get().userProfile.mintedNFTs || [];
        const newProfile = {
          ...get().userProfile,
          mintedNFTs: [...currentNFTs, nft]
        };
        set({ userProfile: newProfile });
        localStorageService.saveUserProfile(newProfile);
      }
    }),
    {
      name: 'mindful-storage',
    }
  )
);
