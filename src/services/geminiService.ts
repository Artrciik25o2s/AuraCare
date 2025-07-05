import { EmotionCard, UserResponse, AIFeedback } from '../stores/mindfulStore';

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  constructor() {
    // Read API key from meta tag
    const metaTag = document.querySelector('meta[name="gemini-api-key"]');
    this.apiKey = metaTag?.getAttribute('content') || 'AIzaSyA70cUGlLt7yDp4FQ3_FM1wCzDlsMILf2g';
    
    console.log('Initializing Gemini service with API key:', this.apiKey ? 'Key found: ' + this.apiKey.substring(0, 20) + '...' : 'No key found');
  }

  private async makeGeminiRequest(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not found');
    }

    console.log('Making request to Gemini with key:', this.apiKey.substring(0, 20) + '...');

    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, response.statusText, errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  }

  private formatUserResponses(responses: UserResponse): string {
    const formatSection = (title: string, cards: EmotionCard[]) => {
      if (cards.length === 0) return '';
      return `${title}:\n${cards.map(card => `- ${card.text}`).join('\n')}\n`;
    };

    return `
${formatSection('Often experiencing', responses.often)}
${formatSection('Sometimes experiencing', responses.sometimes)}
${formatSection('Rarely experiencing', responses.rarely)}
    `.trim();
  }

  async generateFeedback(userResponses: UserResponse, language: string = 'en'): Promise<AIFeedback> {
    const userResponseText = this.formatUserResponses(userResponses);
    
    const prompt = `You are a compassionate mental health assistant. Analyze this emotional assessment and provide supportive feedback.

User's current emotional state:
${userResponseText}

Please provide your response in JSON format with exactly these fields:
{
  "insight": "A brief, empathetic observation about their emotional patterns (2-3 sentences)",
  "tip": "One practical, actionable mental health tip or technique they can try today (2-3 sentences)",
  "encouragement": "A warm, uplifting message that validates their feelings and encourages self-care (2-3 sentences)"
}

Guidelines:
- Be warm, non-judgmental, and encouraging
- Focus on strengths and positive coping strategies
- Provide actionable advice, not medical diagnosis
- Keep each response section concise but meaningful
- Use language that feels personal and supportive
${language !== 'en' ? `- Respond in ${language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : language === 'de' ? 'German' : language === 'zh' ? 'Chinese' : language === 'hi' ? 'Hindi' : 'English'}` : ''}

Remember: You're offering support and encouragement, not medical advice.`;

    try {
      console.log('Generating AI feedback...');
      const text = await this.makeGeminiRequest(prompt);
      
      console.log('AI response received:', text);
      
      // Try to parse JSON from the response
      let feedback;
      try {
        // Extract JSON from response if it's wrapped in other text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonText = jsonMatch ? jsonMatch[0] : text;
        feedback = JSON.parse(jsonText);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        console.warn('Failed to parse JSON response, using fallback format');
        feedback = {
          insight: "I can see you're navigating various emotional experiences right now. This awareness itself is a positive step toward better mental wellness.",
          tip: "Try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, and exhale for 8. This can help calm your nervous system in just a few minutes.",
          encouragement: "Remember that emotions are temporary and you have the strength to work through them. Taking this assessment shows you care about your wellbeing, which is wonderful."
        };
      }

      return {
        insight: feedback.insight || "Thank you for sharing your feelings with me.",
        tip: feedback.tip || "Take a few minutes today to practice mindful breathing.",
        encouragement: feedback.encouragement || "You're taking great steps toward better mental health.",
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error generating AI feedback:', error);
      
      // Provide helpful fallback response
      return {
        insight: "I notice you're experiencing a mix of emotions, which is completely normal and human.",
        tip: "Consider starting a simple daily practice like writing down three things you're grateful for each morning.",
        encouragement: "Taking time to check in with your emotions shows real self-awareness and strength. Keep caring for yourself!",
        timestamp: Date.now()
      };
    }
  }

  async translateText(text: string, targetLang: string): Promise<string> {
    if (!this.apiKey || targetLang === 'en') return text;

    const languageNames: { [key: string]: string } = {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'zh': 'Chinese',
      'hi': 'Hindi',
      'ja': 'Japanese',
      'pt': 'Portuguese'
    };

    const targetLanguage = languageNames[targetLang] || targetLang;
    const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text, nothing else: "${text}"`;
    
    try {
      const response = await this.makeGeminiRequest(prompt);
      return response.replace(/"/g, '').trim();
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }

  async generateChatResponse(message: string, language: string = 'en'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('AI service is not available. Please check your configuration.');
    }

    const languageNames: { [key: string]: string } = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'zh': 'Chinese',
      'hi': 'Hindi',
      'ja': 'Japanese',
      'pt': 'Portuguese'
    };

    const responseLanguage = languageNames[language] || 'English';

    const prompt = `You are a compassionate AI wellness companion for MindfulChain, a mental health platform. 
    
User message: "${message}"

Please provide a helpful, empathetic response focused on mental wellness. Guidelines:
- Be warm, supportive, and encouraging
- Provide practical mental health tips when appropriate
- Ask follow-up questions to better understand the user's needs
- Keep responses conversational but informative (2-4 sentences)
- If asked about MindfulChain features, mention the mood assessments, progress tracking, and AI insights
- Always prioritize the user's emotional wellbeing
- If the user seems distressed, gently suggest professional help when appropriate
- Avoid giving medical diagnoses or specific medical advice

Respond in ${responseLanguage}. Be natural and conversational.`;

    try {
      console.log('Generating chat response for message:', message);
      const response = await this.makeGeminiRequest(prompt);
      console.log('Chat response generated successfully');
      return response.trim();
    } catch (error) {
      console.error('Error generating chat response:', error);
      return "I'm here to support you! Could you tell me more about what's on your mind today?";
    }
  }

  isReady(): boolean {
    return !!this.apiKey;
  }
}

export const geminiService = new GeminiService();
