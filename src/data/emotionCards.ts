
export interface EmotionCard {
  id: string;
  emoji: string;
  text: string;
  category: 'mood' | 'sleep' | 'stress' | 'focus' | 'energy';
}

export const emotionCards: EmotionCard[] = [
  // Mood emotions (expanded)
  { id: 'happy', emoji: '😊', text: 'Happy', category: 'mood' },
  { id: 'sad', emoji: '😢', text: 'Sad', category: 'mood' },
  { id: 'anxious', emoji: '😰', text: 'Anxious', category: 'mood' },
  { id: 'excited', emoji: '🤩', text: 'Excited', category: 'mood' },
  { id: 'calm', emoji: '😌', text: 'Calm', category: 'mood' },
  { id: 'angry', emoji: '😠', text: 'Angry', category: 'mood' },
  { id: 'overwhelmed', emoji: '😵', text: 'Overwhelmed', category: 'mood' },
  { id: 'grateful', emoji: '🙏', text: 'Grateful', category: 'mood' },
  { id: 'confused', emoji: '😕', text: 'Confused', category: 'mood' },
  { id: 'hopeful', emoji: '🌟', text: 'Hopeful', category: 'mood' },
  { id: 'lonely', emoji: '😔', text: 'Lonely', category: 'mood' },
  { id: 'content', emoji: '😌', text: 'Content', category: 'mood' },
  { id: 'frustrated', emoji: '😤', text: 'Frustrated', category: 'mood' },
  { id: 'peaceful', emoji: '☮️', text: 'Peaceful', category: 'mood' },
  { id: 'worried', emoji: '😟', text: 'Worried', category: 'mood' },
  { id: 'motivated', emoji: '💪', text: 'Motivated', category: 'mood' },
  
  // Sleep emotions (expanded)
  { id: 'rested', emoji: '😴', text: 'Well Rested', category: 'sleep' },
  { id: 'tired', emoji: '😪', text: 'Tired', category: 'sleep' },
  { id: 'groggy', emoji: '🥱', text: 'Groggy', category: 'sleep' },
  { id: 'refreshed', emoji: '✨', text: 'Refreshed', category: 'sleep' },
  { id: 'sleepy', emoji: '😴', text: 'Sleepy', category: 'sleep' },
  { id: 'alert', emoji: '👁️', text: 'Alert', category: 'sleep' },
  { id: 'drowsy', emoji: '😵‍💫', text: 'Drowsy', category: 'sleep' },
  { id: 'insomniac', emoji: '🌙', text: 'Unable to Sleep', category: 'sleep' },
  { id: 'restless', emoji: '😣', text: 'Restless Sleep', category: 'sleep' },
  { id: 'energized', emoji: '⚡', text: 'Energized', category: 'sleep' },
  { id: 'nightmare', emoji: '👻', text: 'Had Nightmares', category: 'sleep' },
  { id: 'dreamy', emoji: '💭', text: 'Pleasant Dreams', category: 'sleep' },
  
  // Stress emotions (expanded)
  { id: 'stressed', emoji: '😫', text: 'Stressed', category: 'stress' },
  { id: 'relaxed', emoji: '😌', text: 'Relaxed', category: 'stress' },
  { id: 'tense', emoji: '😬', text: 'Tense', category: 'stress' },
  { id: 'pressured', emoji: '🤯', text: 'Under Pressure', category: 'stress' },
  { id: 'burnout', emoji: '🔥', text: 'Burned Out', category: 'stress' },
  { id: 'zen', emoji: '🧘', text: 'Zen-like', category: 'stress' },
  { id: 'panicked', emoji: '😱', text: 'Panicked', category: 'stress' },
  { id: 'composed', emoji: '😎', text: 'Composed', category: 'stress' },
  { id: 'frazzled', emoji: '🤪', text: 'Frazzled', category: 'stress' },
  { id: 'balanced', emoji: '⚖️', text: 'Balanced', category: 'stress' },
  { id: 'overwhelmed-stress', emoji: '🌊', text: 'Drowning in Tasks', category: 'stress' },
  { id: 'serene', emoji: '🕊️', text: 'Serene', category: 'stress' },
  
  // Focus emotions (expanded)
  { id: 'focused', emoji: '🎯', text: 'Focused', category: 'focus' },
  { id: 'distracted', emoji: '🤷', text: 'Distracted', category: 'focus' },
  { id: 'sharp', emoji: '🧠', text: 'Sharp', category: 'focus' },
  { id: 'scattered', emoji: '🌪️', text: 'Scattered', category: 'focus' },
  { id: 'clear', emoji: '💎', text: 'Clear-minded', category: 'focus' },
  { id: 'foggy', emoji: '🌫️', text: 'Brain Fog', category: 'focus' },
  { id: 'determined', emoji: '💪', text: 'Determined', category: 'focus' },
  { id: 'procrastinating', emoji: '⏰', text: 'Procrastinating', category: 'focus' },
  { id: 'flow-state', emoji: '🌊', text: 'In Flow State', category: 'focus' },
  { id: 'absent-minded', emoji: '🤔', text: 'Absent-minded', category: 'focus' },
  { id: 'laser-focused', emoji: '🔥', text: 'Laser Focused', category: 'focus' },
  { id: 'mind-wandering', emoji: '🎈', text: 'Mind Wandering', category: 'focus' },
  
  // Energy emotions (expanded)
  { id: 'energetic', emoji: '⚡', text: 'Energetic', category: 'energy' },
  { id: 'drained', emoji: '🔋', text: 'Drained', category: 'energy' },
  { id: 'vibrant', emoji: '🌟', text: 'Vibrant', category: 'energy' },
  { id: 'lethargic', emoji: '🐌', text: 'Lethargic', category: 'energy' },
  { id: 'pumped', emoji: '🚀', text: 'Pumped Up', category: 'energy' },
  { id: 'exhausted', emoji: '😴', text: 'Exhausted', category: 'energy' },
  { id: 'hyper', emoji: '🎉', text: 'Hyperactive', category: 'energy' },
  { id: 'sluggish', emoji: '🦥', text: 'Sluggish', category: 'energy' },
  { id: 'revitalized', emoji: '🌱', text: 'Revitalized', category: 'energy' },
  { id: 'depleted', emoji: '📉', text: 'Depleted', category: 'energy' },
  { id: 'dynamic', emoji: '💥', text: 'Dynamic', category: 'energy' },
  { id: 'weary', emoji: '😮‍💨', text: 'Weary', category: 'energy' }
];
