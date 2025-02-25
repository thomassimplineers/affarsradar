const claudeService = require('../services/claudeService');

// Get insights based on current trends and news
const getInsights = async (req, res) => {
  try {
    // In a production environment, we would call Claude API via claudeService
    // For now, returning mock data as a placeholder
    const insights = {
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
    
    res.status(200).json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ message: 'Failed to generate insights', error: error.message });
  }
};

// Create a custom insight
const createInsight = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    
    if (!title || !description || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // In a production environment, we would save to a database
    // For now, just return the created object
    const newInsight = {
      id: Date.now().toString(),
      title,
      description,
      type,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json(newInsight);
  } catch (error) {
    console.error('Error creating insight:', error);
    res.status(500).json({ message: 'Failed to create insight', error: error.message });
  }
};

module.exports = {
  getInsights,
  createInsight
};
