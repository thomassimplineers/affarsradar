const claudeService = require('../services/claudeService');
const supabaseService = require('../services/supabaseService');

// Generate business recommendations based on user data and current trends
const getRecommendations = async (req, res) => {
  try {
    const { userId, limit } = req.query;
    
    // Get recommendations from database
    let recommendations;
    
    try {
      recommendations = await supabaseService.getRecommendations(userId, limit);
      
      // If there are recommendations in the database, return the most recent one
      if (recommendations && recommendations.length > 0) {
        return res.status(200).json(recommendations[0]);
      }
    } catch (dbError) {
      console.warn('Error getting recommendations from database:', dbError);
      // Continue with fallback if database fetch fails
    }
    
    // If no recommendations found in database or error occurred, generate fallback mock data
    const mockRecommendations = {
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
    
    // Save mock recommendations to database for future use
    try {
      await supabaseService.saveRecommendations(mockRecommendations, userId);
      console.log('Saved mock recommendations to database');
    } catch (saveError) {
      console.warn('Error saving mock recommendations to database:', saveError);
      // Continue even if save fails
    }
    
    res.status(200).json(mockRecommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Failed to generate recommendations', error: error.message });
  }
};

// Generate personalized recommendations based on user contacts and interactions
const generateRecommendations = async (req, res) => {
  try {
    const { contacts, interactions, userId } = req.body;
    
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ message: 'Contacts are required and must be an array' });
    }
    
    let recommendations;
    
    // In production, we would use Claude API
    // For now, generating some personalized mock data based on provided contacts
    try {
      // Later: recommendations = await claudeService.generateContactRecommendations(contacts, interactions);
      
      // Generate mock recommendations based on provided contacts
      const priorityContacts = contacts
        .slice(0, 3)
        .map((contact, index) => ({
          name: contact.name,
          company: contact.company || 'Unknown Company',
          reason: `${index === 0 ? 'Högsta prioritet' : 'Bör följas upp'}: ${contact.note || 'Potentiell möjlighet att utforska.'}`,
          priority: index === 0 ? 'high' : 'medium'
        }));
      
      recommendations = {
        contacts: priorityContacts,
        actions: [
          {
            title: 'Planera uppföljningsmöten',
            description: 'Schemalägg möten med prioriterade kontakter för nästa vecka.',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
          },
          {
            title: 'Förbered presentation av nya erbjudanden',
            description: 'Skapa en skräddarsydd presentation för varje kontakt baserat på deras behov.',
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 5 days from now
          }
        ],
        learningTip: {
          title: 'Förbättra dina försäljningstekniker',
          resource: 'Läs artikeln "Effektiva försäljningssamtal i dagens digitala miljö"'
        }
      };
      
    } catch (aiError) {
      console.error('Error generating recommendations with AI:', aiError);
      return res.status(500).json({ message: 'Failed to generate recommendations with AI', error: aiError.message });
    }
    
    // Save recommendations to database
    try {
      const savedRecommendations = await supabaseService.saveRecommendations(recommendations, userId);
      console.log('Saved new recommendations to database');
      
      // Return saved recommendations with database ID
      return res.status(201).json(savedRecommendations);
    } catch (dbError) {
      console.warn('Error saving recommendations to database:', dbError);
      // Return the generated recommendations even if saving fails
      return res.status(201).json(recommendations);
    }
  } catch (error) {
    console.error('Error in generateRecommendations:', error);
    res.status(500).json({ message: 'Failed to generate recommendations', error: error.message });
  }
};

// Create a custom recommendation
const createRecommendation = async (req, res) => {
  try {
    const { title, description, type, priority, deadline, userId } = req.body;
    
    if (!title || !description || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Format the recommendation to match the structure we use
    let customRecommendation;
    
    if (type === 'contact') {
      customRecommendation = {
        contacts: [
          { 
            name: title, 
            company: description,
            reason: req.body.reason || 'Custom contact recommendation',
            priority: priority || 'medium'
          }
        ],
        actions: [],
        learningTip: null
      };
    } else if (type === 'action') {
      customRecommendation = {
        contacts: [],
        actions: [
          { 
            title, 
            description,
            deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
          }
        ],
        learningTip: null
      };
    } else if (type === 'learning') {
      customRecommendation = {
        contacts: [],
        actions: [],
        learningTip: { 
          title, 
          resource: description 
        }
      };
    } else {
      return res.status(400).json({ message: 'Invalid recommendation type' });
    }
    
    // Save to database
    try {
      const savedRecommendation = await supabaseService.saveRecommendations(customRecommendation, userId);
      return res.status(201).json(savedRecommendation);
    } catch (dbError) {
      console.warn('Error saving custom recommendation to database:', dbError);
      
      // Return a mock response if database save fails
      const mockRecommendation = {
        id: Date.now().toString(),
        ...customRecommendation,
        createdAt: new Date().toISOString()
      };
      
      return res.status(201).json(mockRecommendation);
    }
  } catch (error) {
    console.error('Error creating recommendation:', error);
    res.status(500).json({ message: 'Failed to create recommendation', error: error.message });
  }
};

module.exports = {
  getRecommendations,
  generateRecommendations,
  createRecommendation
};
