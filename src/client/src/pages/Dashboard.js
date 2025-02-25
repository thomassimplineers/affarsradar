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
import { Assessment, TrendingUp, TrendingDown, DateRange, Business, Public, ShowChart, Group } from '@mui/icons-material';

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
        // Utökad dummy-data med mer omfattande information
        const insightsData = {
          // Bransch- och marknadstrender
          industryTrends: [
            { title: 'Ökad digitalisering', description: 'Företag investerar i digitala lösningar och AI-teknologi.', sentiment: 'positive' },
            { title: 'Hållbarhetsfokus', description: 'Konsumenter efterfrågar hållbara produkter och tjänster.', sentiment: 'positive' },
            { title: 'Kompetensbrist i IT-sektorn', description: 'Svårigheter att rekrytera specialister inom cybersäkerhet och AI.', sentiment: 'negative' }
          ],
          
          // Omvärldsnyheter
          worldNews: [
            { title: 'Nya EU-regler för datahantering', description: 'EU inför striktare regler för hantering av kunddata från 2025.', impact: 'medium', date: '2025-02-15' },
            { title: 'Ökade energipriser', description: 'Energipriserna förväntas stiga med 15% under kommande kvartal.', impact: 'high', date: '2025-02-10' },
            { title: 'Nya handelsavtal med Asien', description: 'Sverige tecknar nya handelsavtal som öppnar möjligheter i Sydostasien.', impact: 'positive', date: '2025-02-05' }
          ],
          
          // Aktiekurser och finansiell information
          stockMarket: [
            { company: 'Tech Innovations AB', ticker: 'TECH', change: '+2.5%', value: '245.50 SEK' },
            { company: 'Sustainable Energy', ticker: 'SUST', change: '+4.2%', value: '178.75 SEK' },
            { company: 'Nordic Retail Group', ticker: 'NRG', change: '-1.3%', value: '89.25 SEK' },
            { company: 'Digital Solutions', ticker: 'DIGI', change: '+0.8%', value: '322.00 SEK' }
          ],
          
          // Kundnyheter
          customerNews: [
            { customer: 'Volvo AB', news: 'Lanserar ny elektrisk lastbilsmodell', date: '2025-02-12', relevance: 'high' },
            { customer: 'ICA Gruppen', news: 'Expanderar e-handelslösningar till mindre orter', date: '2025-02-08', relevance: 'medium' },
            { customer: 'Scania', news: 'Söker nya leverantörer för hållbara komponenter', date: '2025-02-14', relevance: 'high' }
          ],
          
          // Affärsnätverkshändelser
          networkEvents: [
            { title: 'Tech Summit Stockholm', description: 'Årlig tech-konferens med fokus på AI och hållbarhet', date: '2025-03-15', location: 'Stockholm' },
            { title: 'Branschnätverkslunch', description: 'Informell nätverkslunch för IT-konsulter', date: '2025-02-28', location: 'Göteborg' },
            { title: 'Exportrådets seminarium', description: 'Seminarium om export till tillväxtmarknader', date: '2025-03-05', location: 'Online' }
          ],
          
          // Befintliga affärsmöjligheter
          marketOpportunities: [
            { title: 'Nya marknader', description: 'Expandera till nya geografiska områden i Norden.' },
            { title: 'Hållbara produktlinjer', description: 'Utveckla miljövänliga alternativ till befintliga produkter.' },
            { title: 'Digitala tjänster', description: 'Lansera prenumerationsbaserade digitala tjänster för befintliga kunder.' }
          ],
          
          // Veckans utmaning
          weeklyChallenge: { 
            title: 'Kundintervjuer', 
            description: 'Genomför djupintervjuer med tre nyckelkunder för att identifiera förbättringsområden.',
            deadline: '2025-02-21'
          }
        };
        
        const recommendationsData = {
          contacts: [
            { name: 'Anna Andersson', company: 'Tech Innovations AB', reason: 'Visade intresse för er nya produkt. Potentiell stor order.', priority: 'high' },
            { name: 'Erik Johansson', company: 'Sustainable Energy', reason: 'Har inte haft kontakt på 3 månader. Dags för uppföljning.', priority: 'medium' },
            { name: 'Maria Lindberg', company: 'Nordic Retail Group', reason: 'Ny inköpschef. Boka introduktionsmöte.', priority: 'high' }
          ],
          actions: [
            { title: 'Uppföljningsmöte', description: 'Boka möte med Anna Andersson för produktdemonstration.', deadline: '2025-02-25' },
            { title: 'Skicka offert', description: 'Färdigställ och skicka offert till Sustainable Energy.', deadline: '2025-02-20' },
            { title: 'Förbered presentation', description: 'Ta fram presentation för Nordic Retail Group.', deadline: '2025-03-01' }
          ],
          learningTip: { 
            title: 'Förbättra din säljpitch', 
            resource: 'https://example.com/sales-pitch-techniques',
            description: 'Lär dig tekniker för att anpassa din säljpitch till olika kundtyper.'
          }
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

  // Helper function to get impact icon
  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'high':
        return <TrendingUp color="error" />;
      case 'medium':
        return <TrendingUp color="warning" />;
      case 'positive':
        return <TrendingUp color="success" />;
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

        {/* Omvärldsnyheter */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Omvärldsnyheter" 
              avatar={<Public color="primary" />}
            />
            <Divider />
            <CardContent>
              {insights && insights.worldNews ? (
                <List>
                  {insights.worldNews.map((news, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getImpactIcon(news.impact)}
                              <Typography sx={{ ml: 1 }}>{news.title}</Typography>
                            </Box>
                            <Chip size="small" label={news.date} variant="outlined" />
                          </Box>
                        }
                        secondary={news.description}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Inga omvärldsnyheter tillgängliga.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Aktiekurser */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Aktiekurser" 
              avatar={<ShowChart color="primary" />}
            />
            <Divider />
            <CardContent>
              {insights && insights.stockMarket ? (
                <List dense>
                  {insights.stockMarket.map((stock, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1">{stock.company} ({stock.ticker})</Typography>
                            <Typography 
                              variant="subtitle1" 
                              color={stock.change.startsWith('+') ? 'success.main' : 'error.main'}
                            >
                              {stock.change}
                            </Typography>
                          </Box>
                        }
                        secondary={`Aktuellt värde: ${stock.value}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Inga aktiekurser tillgängliga.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Kundnyheter */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Kundnyheter" 
              avatar={<Business color="primary" />}
            />
            <Divider />
            <CardContent>
              {insights && insights.customerNews ? (
                <List>
                  {insights.customerNews.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1">{item.customer}</Typography>
                            <Chip 
                              size="small" 
                              label={item.relevance === 'high' ? 'Hög relevans' : 'Medium relevans'} 
                              color={item.relevance === 'high' ? 'error' : 'primary'}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2">{item.news}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Publicerad: {item.date}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Inga kundnyheter tillgängliga.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Affärsnätverkshändelser */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Nätverkshändelser" 
              avatar={<Group color="primary" />}
            />
            <Divider />
            <CardContent>
              {insights && insights.networkEvents ? (
                <List>
                  {insights.networkEvents.map((event, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1">{event.title}</Typography>
                            <Chip size="small" label={event.date} variant="outlined" />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2">{event.description}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Plats: {event.location}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Inga nätverkshändelser tillgängliga.</Typography>
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip 
                      label={`Deadline: ${insights.weeklyChallenge.deadline}`} 
                      variant="outlined" 
                      size="small" 
                    />
                    <Button variant="contained" color="primary">
                      Markera som genomförd
                    </Button>
                  </Box>
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
