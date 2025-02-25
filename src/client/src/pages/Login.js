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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, loading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setFormError('Alla fält måste fyllas i');
      return;
    }
    
    try {
      setFormError('');
      setIsSubmitting(true);
      
      const { success, error } = await signIn(email, password);
      
      if (!success) {
        throw new Error(error || 'Det gick inte att logga in. Kontrollera dina uppgifter.');
      }
      
      // No need to redirect as the protected route component will handle this
    } catch (error) {
      console.error('Login error:', error);
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
            AffärsRadar
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Logga in för att fortsätta
          </Typography>
        </Box>
        
        {formError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formError}
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
          
          <TextField
            label="Lösenord"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {(isSubmitting || loading) ? <CircularProgress size={24} /> : 'Logga in'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link 
              component={RouterLink} 
              to="/reset-password" 
              variant="body2"
              sx={{ display: 'block', mb: 1 }}
            >
              Glömt lösenord?
            </Link>
            
            <Typography variant="body2">
              Har du inget konto?{' '}
              <Link component={RouterLink} to="/register">
                Registrera dig
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
