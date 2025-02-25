import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  TrendingUp, 
  BusinessCenter, 
  Timeline, 
  Security 
} from '@mui/icons-material';

// Funktioner som AffärsRadar erbjuder
const features = [
  {
    title: 'AI-drivna affärsinsikter',
    description: 'Få djupgående insikter om din bransch baserade på de senaste trenderna och data.',
    icon: <TrendingUp fontSize="large" color="primary" />
  },
  {
    title: 'Personliga rekommendationer',
    description: 'Anpassade affärsrekommendationer baserade på din specifika situation och mål.',
    icon: <BusinessCenter fontSize="large" color="primary" />
  },
  {
    title: 'Trendanalys och prognoser',
    description: 'Förstå vart marknaden är på väg och identifiera möjligheter före dina konkurrenter.',
    icon: <Timeline fontSize="large" color="primary" />
  },
  {
    title: 'Säker och konfidentiell',
    description: 'All din data behandlas med högsta säkerhet och konfidentialitet.',
    icon: <Security fontSize="large" color="primary" />
  }
];

const Landing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.default',
    }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          py: 8, 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          minHeight: '70vh'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                AffärsRadar
              </Typography>
              <Typography variant="h4" gutterBottom>
                AI-driven affärsintelligens för ditt företag
              </Typography>
              <Typography variant="h6" paragraph sx={{ mt: 2, mb: 4 }}>
                Ta ditt företag till nästa nivå med smarta insikter, personliga rekommendationer och branschanalys.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button 
                  component={RouterLink} 
                  to="/register" 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  sx={{ 
                    mr: 2, 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Kom igång - Gratis
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/login" 
                  variant="outlined" 
                  color="inherit" 
                  size="large"
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Logga in
                </Button>
              </Box>
            </Grid>
            {!isMobile && (
              <Grid item xs={12} md={6}>
                <Box 
                  component="img" 
                  src="/dashboard-preview.png" 
                  alt="AffärsRadar Dashboard" 
                  sx={{ 
                    width: '100%', 
                    maxWidth: 600,
                    borderRadius: 2,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=AffärsRadar+Dashboard';
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 6 }}
        >
          Varför välja AffärsRadar?
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 4, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Redo att förbättra ditt beslutsfattande?
          </Typography>
          <Typography variant="body1" paragraph>
            Skapa ett konto idag och få tillgång till alla funktioner.
          </Typography>
          <Button 
            component={RouterLink} 
            to="/register" 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ mt: 2, px: 4, py: 1.5 }}
          >
            Skapa konto
          </Button>
        </Box>
      </Container>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          bgcolor: 'background.paper', 
          mt: 'auto' 
        }}
      >
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} AffärsRadar. Alla rättigheter förbehållna.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 