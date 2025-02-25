import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Link, 
  Alert, 
  CircularProgress 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { resetPassword, loading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setFormError('E-post måste anges');
      return;
    }
    
    try {
      setFormError('');
      setSuccessMessage('');
      setIsSubmitting(true);
      
      const { success, error } = await resetPassword(email);
      
      if (!success) {
        throw new Error(error || 'Det gick inte att skicka instruktioner för återställning. Försök igen senare.');
      }
      
      setSuccessMessage('Instruktioner för att återställa lösenordet har skickats till din e-post.');
      setEmail(''); // Clear form
    } catch (error) {
      console.error('Reset password error:', error);
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: 400,
          borderRadius: 2
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Återställ lösenord
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Ange din e-postadress för att få instruktioner
          </Typography>
        </Box>
        
        {formError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formError}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="E-post"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting || loading}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting || loading}
          >
            {(isSubmitting || loading) ? <CircularProgress size={24} /> : 'Skicka instruktioner'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              <Link component={RouterLink} to="/login">
                Tillbaka till inloggning
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
