import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { SentimentDissatisfied } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: 'center', maxWidth: 500 }}>
        <SentimentDissatisfied fontSize="large" color="primary" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Sidan hittades inte
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Sidan du letar efter finns inte eller har flyttats.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/"
          sx={{ mt: 2 }}
        >
          Gå till Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
