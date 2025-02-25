import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Assessment, TrendingUp, TrendingDown, DateRange } from '@mui/icons-material';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  // Get current date in Swedish format
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('sv-SE', options);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Använd dummy-data istället för att hämta från API:et
        const insightsData = {
          industryTrends: [
            { title: 'Ökad digitalisering', description: 'Företag investerar i digitala lösningar.', sentiment: 'positive' },
            { title: 'Hållbarhetsfokus', description: 'Konsumenter efterfrågar hållbara produkter.', sentiment: 'positive' }
          ],
          marketOpportunities: [
            { title: 'Nya marknader', description: 'Expandera till nya geografiska områden.' }
          ],
          weeklyChallenge: { title: 'Kundintervjuer', description: 'Genomför djupintervjuer med nyckelkunder.' }
        };
        const recommendationsData = {
          contacts: [
            { name: 'Anna Andersson', company: 'Tech Innovations AB', reason: 'Visade intresse för er nya produkt.', priority: 'high' }
          ],
          actions: [
            { title: 'Uppföljningsmöte', description: 'Boka möte med Anna Andersson.', deadline: '2025-03-10' }
          ],
          learningTip: { title: 'Förbättra din säljpitch', resource: 'https://example.com/sales-pitch-techniques' }
        };

        setInsights(insightsData);
        setRecommendations(recommendationsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Det gick inte att hämta data. Försök igen senare.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get sentiment icon
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp color="success" />;
      case 'negative':
        return <TrendingDown color="error" />;
      default:
        return <Assessment color="info" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
          Försök igen
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Måndagsinsikt
        </Typography>
        <Chip
          icon={<DateRange />}
          label={formattedDate}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Typography variant="h6" sx={{ mb: 3 }}>
        Starta veckan med AffärsRadar - Din Vecka i Fokus
      </Typography>

      <Grid container spacing={3}>
        {/* Omvärldsöversikt */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Omvärldsöversikt" />
            <Divider />
            <CardContent>
              {insights && insights.industryTrends ? (
                <List>
                  {insights.industryTrends.map((trend, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getSentimentIcon(trend.sentiment)}
                            <Typography sx={{ ml: 1 }}>{trend.title}</Typography>
                          </Box>
                        }
                        secondary={trend.description}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Inga aktuella trender tillgängliga.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Veckans Affärsmöjligheter */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Veckans Affärsmöjligheter" />
            <Divider />
            <CardContent>
              {insights && insights.marketOpportunities ? (
                <List>
                  {insights.marketOpportunities.map((opportunity, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={opportunity.title}
                        secondary={opportunity.description}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Inga aktuella affärsmöjligheter tillgängliga.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Kontakter att följa upp */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Kontakter att följa upp" />
            <Divider />
            <CardContent>
              {recommendations && recommendations.contacts ? (
                <List>
                  {recommendations.contacts.map((contact, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography>{contact.name}</Typography>
                            <Chip 
                              size="small" 
                              label={contact.priority} 
                              color={contact.priority === 'high' ? 'error' : 'primary'}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2">{contact.company}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {contact.reason}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Inga kontakter att följa upp just nu.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Veckans Mikro-utmaning */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Veckans Mikro-utmaning" />
            <Divider />
            <CardContent>
              {insights && insights.weeklyChallenge ? (
                <Box>
                  <Typography variant="h6">{insights.weeklyChallenge.title}</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    {insights.weeklyChallenge.description}
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Markera som genomförd
                  </Button>
                </Box>
              ) : (
                <Typography>Ingen utmaning tillgänglig denna vecka.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
