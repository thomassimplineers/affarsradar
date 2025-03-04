import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import apiService from '../services/apiService';

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [industry, setIndustry] = useState('');
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const data = await apiService.getInsights();
      setInsights(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError('Det gick inte att hämta insikter. Försök igen senare.');
    } finally {
      setLoading(false);
    }
  };

  const generateNewInsights = async (industry) => {
    setGenerating(true);
    try {
      const data = await apiService.generateInsights(industry);
      setInsights(data);
      setError(null);
      setSuccess(true);
    } catch (err) {
      console.error('Error generating insights:', err);
      setError('Det gick inte att generera nya insikter. Försök igen senare.');
      setSuccess(false);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        AI-drivna Insikter
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Nya insikter har genererats framgångsrikt!
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardHeader title="Generera nya insikter" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="industry-select-label">Bransch</InputLabel>
                <Select
                  labelId="industry-select-label"
                  value={industry}
                  label="Bransch"
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <MenuItem value="">Välj bransch</MenuItem>
                  <MenuItem value="it">IT & Teknologi</MenuItem>
                  <MenuItem value="retail">Detaljhandel</MenuItem>
                  <MenuItem value="manufacturing">Tillverkning</MenuItem>
                  <MenuItem value="finance">Finans & Bank</MenuItem>
                  <MenuItem value="healthcare">Sjukvård</MenuItem>
                  <MenuItem value="construction">Bygg & Konstruktion</MenuItem>
                  <MenuItem value="stockmarket">Aktiemarknaden</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => generateNewInsights(industry)}
                disabled={generating || !industry}
              >
                {generating ? <CircularProgress size={24} /> : 'Generera Insikter'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Trender */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Aktuella trender" />
            <Divider />
            <CardContent>
              {insights && insights.industryTrends ? (
                insights.industryTrends.map((trend, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="h6">{trend.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {trend.description}
                    </Typography>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                  </Box>
                ))
              ) : (
                <Typography>Inga trender tillgängliga.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Affärsmöjligheter */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Affärsmöjligheter" />
            <Divider />
            <CardContent>
              {insights && insights.marketOpportunities ? (
                insights.marketOpportunities.map((opportunity, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="h6">{opportunity.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {opportunity.description}
                    </Typography>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                  </Box>
                ))
              ) : (
                <Typography>Inga affärsmöjligheter tillgängliga.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Veckans utmaning */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Veckans utmaning" />
            <Divider />
            <CardContent>
              {insights && insights.weeklyChallenge ? (
                <Box>
                  <Typography variant="h6">{insights.weeklyChallenge.title}</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {insights.weeklyChallenge.description}
                  </Typography>
                </Box>
              ) : (
                <Typography>Ingen utmaning tillgänglig.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Insights;
