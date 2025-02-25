import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Person, Assignment, School } from '@mui/icons-material';
import apiService from '../services/apiService';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await apiService.getRecommendations();
      setRecommendations(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Det gick inte att hämta rekommendationer. Försök igen senare.');
    } finally {
      setLoading(false);
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
      <Box sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={fetchRecommendations}>
          Försök igen
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Rekommendationer
      </Typography>

      <Grid container spacing={3}>
        {/* Kontakter att följa upp */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Kontakter att följa upp" 
              avatar={<Person color="primary" />}
            />
            <Divider />
            <CardContent>
              {recommendations && recommendations.contacts && recommendations.contacts.length > 0 ? (
                <List>
                  {recommendations.contacts.map((contact, index) => (
                    <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">{contact.name}</Typography>
                        <Chip
                          size="small"
                          label={contact.priority}
                          color={contact.priority === 'high' ? 'error' : 'primary'}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {contact.company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {contact.reason}
                      </Typography>
                      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', mt: 1 }}>
                        <Button size="small" variant="outlined">
                          Schemallägg kontakt
                        </Button>
                      </Box>
                      <Divider sx={{ width: '100%', mt: 2 }} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Inga kontakter att följa upp just nu.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Rekommenderade åtgärder */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Rekommenderade åtgärder" 
              avatar={<Assignment color="primary" />}
            />
            <Divider />
            <CardContent>
              {recommendations && recommendations.actions && recommendations.actions.length > 0 ? (
                <List>
                  {recommendations.actions.map((action, index) => (
                    <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography variant="h6">{action.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                        {action.description}
                      </Typography>
                      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={`Deadline: ${action.deadline}`} 
                          variant="outlined" 
                          size="small" 
                        />
                        <Button size="small" variant="outlined">
                          Markera som klar
                        </Button>
                      </Box>
                      <Divider sx={{ width: '100%', mt: 2 }} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Inga rekommenderade åtgärder just nu.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Lärande tips */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Lärande fokus" 
              avatar={<School color="primary" />}
            />
            <Divider />
            <CardContent>
              {recommendations && recommendations.learningTip ? (
                <Box>
                  <Typography variant="h6">{recommendations.learningTip.title}</Typography>
                  <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                    {recommendations.learningTip.resource}
                  </Typography>
                  <Button variant="contained" color="primary">
                    Utforska resurs
                  </Button>
                </Box>
              ) : (
                <Typography>Inget lärande tips tillgängligt.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Recommendations;
