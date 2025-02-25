const { Anthropic } = require('anthropic');

/**
 * Service for interacting with Anthropic's Claude API
 */
class ClaudeService {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.model = process.env.CLAUDE_MODEL || 'claude-3-7-sonnet-20250219';
    
    if (!this.apiKey) {
      console.warn('Warning: CLAUDE_API_KEY is not set in environment variables');
    }
    
    this.client = new Anthropic({
      apiKey: this.apiKey,
    });
  }

  /**
   * Generate text using Claude API
   * @param {string} prompt - The prompt to send to Claude
   * @param {object} options - Additional options for the API request
   * @returns {Promise<object>} - The response from Claude API
   */
  async generateText(prompt, options = {}) {
    try {
      const defaultOptions = {
        temperature: 0.7,
        max_tokens: 1024,
      };
      
      const requestOptions = { ...defaultOptions, ...options };
      
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: requestOptions.max_tokens,
        temperature: requestOptions.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      });
      
      return response;
    } catch (error) {
      console.error('Error calling Claude API:', error.message);
      throw new Error(`Failed to generate text with Claude: ${error.message}`);
    }
  }

  /**
   * Generate business insights based on industry trends
   * @param {string} industry - The industry to generate insights for
   * @returns {Promise<object>} - Business insights
   */
  async generateBusinessInsights(industry) {
    const prompt = `
      Generera affärsinsikter för branschen ${industry}. Inkludera:
      1. Aktuella trender inom branschen
      2. Potentiella affärsmöjligheter
      3. Risker att vara medveten om
      4. En rekommenderad mikro-utmaning för veckan
      
      Formatera svaret som JSON med följande struktur:
      {
        "trends": [{"title": "Trend titel", "description": "Beskrivning", "sentiment": "positive/neutral/negative"}],
        "opportunities": [{"title": "Möjlighet titel", "description": "Beskrivning"}],
        "risks": [{"title": "Risk titel", "description": "Beskrivning"}],
        "weeklyChallenge": {"title": "Utmaningens titel", "description": "Beskrivning"}
      }
      
      Svara enbart med JSON-data, ingen annan text.
    `;
    
    const response = await this.generateText(prompt, { temperature: 0.2 });
    
    // Extract the JSON content from the response
    try {
      const textContent = response.content[0].text;
      return JSON.parse(textContent);
    } catch (error) {
      console.error('Error parsing JSON from Claude response:', error);
      throw new Error('Failed to parse Claude response as JSON');
    }
  }

  /**
   * Generate personalized contact recommendations
   * @param {Array} contacts - List of user's contacts
   * @param {Array} interactions - Previous interactions with contacts
   * @returns {Promise<object>} - Personalized recommendations
   */
  async generateContactRecommendations(contacts, interactions) {
    // Convert inputs to text for the prompt
    const contactsText = JSON.stringify(contacts);
    const interactionsText = JSON.stringify(interactions);
    
    const prompt = `
      Som en AI-assistent för affärsinsikter, analysera följande kontakter och tidigare interaktioner för att ge personliga rekommendationer.
      
      KONTAKTER:
      ${contactsText}
      
      TIDIGARE INTERAKTIONER:
      ${interactionsText}
      
      Baserat på denna information, identifiera:
      1. De 3 kontakter som bör prioriteras för uppföljning, med orsak och prioritetsnivå
      2. 2-3 rekommenderade åtgärder för att förbättra affärsrelationerna
      3. Ett lärandetips relaterat till säljarbete eller affärsutveckling
      
      Formatera svaret som JSON med följande struktur:
      {
        "priorityContacts": [
          {"name": "Namn", "company": "Företag", "reason": "Anledning till uppföljning", "priority": "high/medium/low"}
        ],
        "recommendedActions": [
          {"title": "Åtgärd", "description": "Beskrivning", "deadline": "YYYY-MM-DD"}
        ],
        "learningTip": {"title": "Titel", "resource": "Resurs"}
      }
      
      Svara enbart med JSON-data, ingen annan text.
    `;
    
    const response = await this.generateText(prompt, { temperature: 0.3 });
    
    // Extract the JSON content from the response
    try {
      const textContent = response.content[0].text;
      return JSON.parse(textContent);
    } catch (error) {
      console.error('Error parsing JSON from Claude response:', error);
      throw new Error('Failed to parse Claude response as JSON');
    }
  }
}

module.exports = new ClaudeService();
