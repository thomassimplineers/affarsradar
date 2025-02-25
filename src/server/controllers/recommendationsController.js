const claudeService = require('../services/claudeService');

// Generate business recommendations based on user data and current trends
const getRecommendations = async (req, res) => {
  try {
    // In a production environment, we would call Claude API via claudeService
    // For now, returning mock data as a placeholder
    const recommendations = {
      contacts: [
        {
          name: 'Anna Andersson',
          company: 'Tech Innovations AB',
          reason: 'Har inte haft kontakt på 3 månader, visade intresse för er nya produkt.',
          priority: 'high'
        },
        {
          name: 'Erik Svensson',
          company: 'Framtidens Bygg',
          reason: 'Följ upp efter ert senaste möte om potentiellt samarbete.',
          priority: 'medium'
        }
      ],
      actions: [
        {
          title: 'Skicka ut information om den nya tjänsten',
          description: 'Rikta specifikt mot kunder inom tillverkningsindustrin.',
          deadline: '2025-03-01'
        },
        {
          title: 'Boka in demonstrationer',
          description: 'Visa upp den senaste versionen för intresserade kunder.',
          deadline: '2025-03-15'
        }
      ],
      learningTip: {
        title: 'Förbättra dina förhandlingstekniker',
        resource: 'Kursen "Effektiv Förhandling i B2B-sammanhang" på LinkedIn Learning'
      }
    };
    
    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Failed to generate recommendations', error: error.message });
  }
};

// Create a custom recommendation
const createRecommendation = async (req, res) => {
  try {
    const { title, description, type, priority } = req.body;
    
    if (!title || !description || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // In a production environment, we would save to a database
    // For now, just return the created object
    const newRecommendation = {
      id: Date.now().toString(),
      title,
      description,
      type,
      priority: priority || 'medium',
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json(newRecommendation);
  } catch (error) {
    console.error('Error creating recommendation:', error);
    res.status(500).json({ message: 'Failed to create recommendation', error: error.message });
  }
};

module.exports = {
  getRecommendations,
  createRecommendation
};
