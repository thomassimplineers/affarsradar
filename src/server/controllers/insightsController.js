const claudeService = require('../services/claudeService');
const supabaseService = require('../services/supabaseService');

// Get insights based on current trends and news
const getInsights = async (req, res) => {
  try {
    const { userId, limit } = req.query;
    console.log('Getting insights for userId:', userId);
    
    // Get insights from database
    let insights;
    
    try {
      insights = await supabaseService.getInsights(userId, limit);
      console.log('Insights fetched from database:', insights ? insights.length : 0);
      
      // If there are insights in the database, return the most recent one
      if (insights && insights.length > 0) {
        console.log('Returning existing insights from database');
        return res.status(200).json(insights[0]);
      }
    } catch (dbError) {
      console.warn('Error getting insights from database:', dbError);
      // Continue with fallback if database fetch fails
    }
    
    // If no insights found in database or error occurred, generate fallback mock data
    console.log('No insights found, creating fallback mock data');
    const mockInsights = {
      industryTrends: [
        { 
          title: 'Ökad efterfrågan på hållbara produkter', 
          description: 'Konsumenter visar allt större intresse för miljövänliga alternativ.',
          sentiment: 'positive'
        },
        { 
          title: 'Digitalisering påskyndas inom traditionella branscher', 
          description: 'Företag inom tillverkningsindustrin investerar mer i digital omställning.',
          sentiment: 'neutral'
        }
      ],
      marketOpportunities: [
        {
          title: 'Nya regelverk skapar möjligheter inom compliance',
          description: 'Företag söker lösningar för att anpassa sig till nya EU-direktiv.',
          sentiment: 'positive'
        }
      ],
      weeklyChallenge: {
        title: 'Kontakta tre potentiella kunder inom en ny målgrupp',
        description: 'Utforska möjligheter att expandera din kundbas genom att rikta in dig på ett nytt marknadssegment.'
      }
    };
    
    // Save mock insights to database for future use
    try {
      await supabaseService.saveInsights(mockInsights, userId);
      console.log('Saved mock insights to database');
    } catch (saveError) {
      console.warn('Error saving mock insights to database:', saveError);
      // Continue even if save fails
    }
    
    console.log('Returning new mock insights');
    res.status(200).json(mockInsights);
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ message: 'Failed to generate insights', error: error.message });
  }
};

// Generate new insights for a specific industry
const generateInsights = async (req, res) => {
  try {
    const { industry, userId } = req.body;
    
    if (!industry) {
      return res.status(400).json({ message: 'Industry is required' });
    }
    
    // Säkerställ att vi har ett userId att arbeta med
    const userIdentifier = userId || req.user?.id;
    if (!userIdentifier && !supabaseService.isTestMode) {
      return res.status(400).json({ message: 'User ID is required for insights generation' });
    }
    
    let insights;
    
    // In production, we would use Claude API
    // For now, generating some industry-specific mock data
    try {
      // Later: insights = await claudeService.generateBusinessInsights(industry);
      
      // Specialhantering för aktiemarknaden
      if (industry === 'stockmarket') {
        insights = {
          industryTrends: [
            { 
              title: `Ökad volatilitet på aktiemarknaden`, 
              description: `Geopolitiska spänningar och inflationsutvecklingen skapar större svängningar på börserna globalt.`,
              sentiment: 'neutral'
            },
            { 
              title: `Hållbarhetsfokuserade bolag presterar bättre`, 
              description: `Företag med stark ESG-profil visar på genomsnittligt bättre avkastning än sina konkurrenter.`,
              sentiment: 'positive'
            },
            {
              title: `Teknologisektorn under press`,
              description: `Högre ränteläge påverkar värderingen av tillväxtbolag inom teknologisektorn negativt.`,
              sentiment: 'negative'
            }
          ],
          marketOpportunities: [
            {
              title: `Utdelningsaktier i fokus`,
              description: `Stabila bolag med hög direktavkastning blir mer attraktiva i osäkra tider.`,
              sentiment: 'positive'
            },
            {
              title: `Möjligheter inom framväxande marknader`,
              description: `Vissa tillväxtmarknader erbjuder attraktiva värderingar och tillväxtpotential.`,
              sentiment: 'positive'
            }
          ],
          weeklyChallenge: {
            title: `Analysera din portföljrisk`,
            description: 'Genomför en stresstest av din aktieportfölj för att identifiera sektorer med hög exponering.'
          }
        };
      } else {
        insights = {
          industryTrends: [
            { 
              title: `${industry}-trend: Ökade investeringar i innovativa lösningar`, 
              description: `Företag inom ${industry} investerar mer i forskning och utveckling.`,
              sentiment: 'positive'
            },
            { 
              title: `${industry}-trend: Nya regelverk påverkar marknaden`, 
              description: `Förändrad lagstiftning skapar både utmaningar och möjligheter inom ${industry}.`,
              sentiment: 'neutral'
            }
          ],
          marketOpportunities: [
            {
              title: `Nya nischer inom ${industry}`,
              description: `Specialiserade tjänster för specifika segment inom ${industry} visar stark tillväxt.`,
              sentiment: 'positive'
            }
          ],
          weeklyChallenge: {
            title: `Analysera konkurrenternas strategi inom ${industry}`,
            description: 'Identifiera de tre främsta konkurrenterna och kartlägg deras marknadspositionering.'
          }
        };
      }
      
    } catch (aiError) {
      console.error('Error generating insights with AI:', aiError);
      return res.status(500).json({ message: 'Failed to generate insights with AI', error: aiError.message });
    }
    
    // Save insights to database
    try {
      const savedInsights = await supabaseService.saveInsights(insights, userId);
      console.log('Saved new insights to database');
      
      // Return saved insights with database ID
      return res.status(201).json(savedInsights);
    } catch (dbError) {
      console.warn('Error saving insights to database:', dbError);
      // Return the generated insights even if saving fails
      return res.status(201).json(insights);
    }
  } catch (error) {
    console.error('Error in generateInsights:', error);
    res.status(500).json({ message: 'Failed to generate insights', error: error.message });
  }
};

// Create a custom insight
const createInsight = async (req, res) => {
  try {
    const { title, description, type, sentiment, userId } = req.body;
    
    if (!title || !description || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Format the insight to match the structure we use
    let customInsight;
    
    if (type === 'trend') {
      customInsight = {
        industryTrends: [
          { title, description, sentiment: sentiment || 'neutral' }
        ],
        marketOpportunities: [],
        weeklyChallenge: null
      };
    } else if (type === 'opportunity') {
      customInsight = {
        industryTrends: [],
        marketOpportunities: [
          { title, description, sentiment: sentiment || 'positive' }
        ],
        weeklyChallenge: null
      };
    } else if (type === 'challenge') {
      customInsight = {
        industryTrends: [],
        marketOpportunities: [],
        weeklyChallenge: { title, description }
      };
    } else {
      return res.status(400).json({ message: 'Invalid insight type' });
    }
    
    // Save to database
    try {
      const savedInsight = await supabaseService.saveInsights(customInsight, userId);
      return res.status(201).json(savedInsight);
    } catch (dbError) {
      console.warn('Error saving custom insight to database:', dbError);
      
      // Return a mock response if database save fails
      const mockInsight = {
        id: Date.now().toString(),
        ...customInsight,
        createdAt: new Date().toISOString()
      };
      
      return res.status(201).json(mockInsight);
    }
  } catch (error) {
    console.error('Error creating insight:', error);
    res.status(500).json({ message: 'Failed to create insight', error: error.message });
  }
};

module.exports = {
  getInsights,
  generateInsights,
  createInsight
};
