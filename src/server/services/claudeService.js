const { Anthropic } = require('@anthropic-ai/sdk');

/**
 * Service for interacting with Anthropic's Claude API
 */
class ClaudeService {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.model = process.env.CLAUDE_MODEL || 'claude-3-7-sonnet-20250219';
    this.isTestMode = this.apiKey === 'dummy_api_key_for_testing';
    
    if (!this.apiKey) {
      console.warn('Warning: CLAUDE_API_KEY is not set in environment variables');
    }
    
    if (!this.isTestMode) {
      this.client = new Anthropic({
        apiKey: this.apiKey,
      });
    } else {
      console.log('Running in test mode with mock Claude responses');
    }
  }

  /**
   * Generate text using Claude API
   * @param {string} prompt - The prompt to send to Claude
   * @param {object} options - Additional options for the API request
   * @returns {Promise<object>} - The response from Claude API
   */
  async generateText(prompt, options = {}) {
    try {
      // If in test mode, return mock response
      if (this.isTestMode) {
        console.log('Returning mock response for prompt:', prompt.substring(0, 100) + '...');
        return {
          content: [
            {
              text: JSON.stringify({
                mockResponse: true,
                prompt: prompt.substring(0, 50) + '...',
                message: 'This is a mock response for testing purposes'
              })
            }
          ]
        };
      }
      
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
    // If in test mode, return mock insights
    if (this.isTestMode) {
      console.log(`Returning mock insights for industry: ${industry}`);
      
      // Specialhantering för aktiemarknaden
      if (industry === 'stockmarket') {
        return {
          trends: [
            {
              title: "Ökad volatilitet",
              description: "Geopolitiska spänningar och inflationstryck orsakar ökad volatilitet på aktiemarknaden.",
              sentiment: "negative"
            },
            {
              title: "ESG-investeringar i fokus",
              description: "Allt fler investerare prioriterar bolag med stark miljö-, social- och bolagsstyrningsprofil.",
              sentiment: "positive"
            },
            {
              title: "Nya investeringsplattformar",
              description: "Digitala plattformar demokratiserar aktiemarknaden och attraherar nya investerare.",
              sentiment: "positive"
            }
          ],
          opportunities: [
            {
              title: "Utdelningsaktier",
              description: "Företag med stabil direktavkastning erbjuder skydd i osäkra tider."
            },
            {
              title: "Innovation inom fintechsektorn",
              description: "Investeringar i företag som utvecklar nya finansiella teknologier visar stark potential."
            }
          ],
          risks: [
            {
              title: "Regulatoriska förändringar",
              description: "Nya regelverk för marknadsaktörer kan påverka investeringsstrategier."
            },
            {
              title: "Likviditetsrisker",
              description: "Olika marknadssegment kan drabbas av likviditetsutmaningar vid marknadsstress."
            }
          ],
          weeklyChallenge: {
            title: "Portföljöversyn",
            description: "Genomför en analys av din portföljallokering och identifiera områden med obalans."
          }
        };
      }
      
      return {
        trends: [
          {
            title: "Ökad digitalisering",
            description: "Företag inom " + industry + " investerar allt mer i digitala lösningar för att effektivisera verksamheten.",
            sentiment: "positive"
          },
          {
            title: "Hållbarhetsfokus",
            description: "Konsumenter efterfrågar mer hållbara produkter och tjänster inom " + industry + ".",
            sentiment: "positive"
          },
          {
            title: "Kompetensbrist",
            description: "Branschen har svårt att hitta rätt kompetens för specialiserade roller.",
            sentiment: "negative"
          }
        ],
        opportunities: [
          {
            title: "Nya marknader",
            description: "Expandera till nya geografiska områden där efterfrågan ökar."
          },
          {
            title: "Strategiska partnerskap",
            description: "Samarbeta med kompletterande företag för att erbjuda helhetslösningar."
          }
        ],
        risks: [
          {
            title: "Ökad konkurrens",
            description: "Nya aktörer med innovativa affärsmodeller utmanar etablerade företag."
          },
          {
            title: "Regulatoriska förändringar",
            description: "Nya lagar och regler kan påverka verksamheten."
          }
        ],
        weeklyChallenge: {
          title: "Kundintervjuer",
          description: "Genomför minst tre djupintervjuer med nyckelkunder för att identifiera förbättringsområden."
        }
      };
    }
    
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
    // If in test mode, return mock recommendations
    if (this.isTestMode) {
      console.log('Returning mock contact recommendations');
      return {
        priorityContacts: [
          {
            name: "Anna Andersson",
            company: "Tech Innovations AB",
            reason: "Visade intresse för er nya produkt vid senaste mötet",
            priority: "high"
          },
          {
            name: "Erik Eriksson",
            company: "Stora Företaget AB",
            reason: "Har inte haft kontakt på över 3 månader",
            priority: "medium"
          },
          {
            name: "Maria Svensson",
            company: "Digital Solutions",
            reason: "Nämnde budgetökning för nästa kvartal",
            priority: "high"
          }
        ],
        recommendedActions: [
          {
            title: "Uppföljningsmöte",
            description: "Boka uppföljningsmöte med Anna Andersson för att presentera produktdetaljer",
            deadline: "2025-03-10"
          },
          {
            title: "Nätverksevent",
            description: "Delta i branscheventet nästa månad för att utöka kontaktnätet",
            deadline: "2025-03-15"
          }
        ],
        learningTip: {
          title: "Förbättra din säljpitch",
          resource: "https://example.com/sales-pitch-techniques"
        }
      };
    }
    
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
