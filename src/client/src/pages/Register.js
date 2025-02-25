import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Link, 
  Alert, 
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const industries = [
  { value: 'it', label: 'IT & Teknologi' },
  { value: 'retail', label: 'Detaljhandel' },
  { value: 'manufacturing', label: 'Tillverkning' },
  { value: 'finance', label: 'Finans & Bank' },
  { value: 'healthcare', label: 'Sjukvård' },
  { value: 'construction', label: 'Bygg & Konstruktion' },
  { value: 'consulting', label: 'Konsulttjänster' },
  { value: 'education', label: 'Utbildning' },
  { value: 'stockmarket', label: 'Aktiemarknaden' },
  { value: 'other', label: 'Annat' }
];

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signUp, loading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setFormError('');
    setSuccessMessage('');
    
    // Basic validation
    if (!email || !password || !confirmPassword || !name || !industry) {
      setFormError('Alla fält måste fyllas i');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Lösenorden matchar inte');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Lösenordet måste vara minst 6 tecken');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { success, error } = await signUp(
        email, 
        password, 
        { 
          name, 
          industry 
        }
      );
      
      if (!success) {
        throw new Error(error || 'Det gick inte att registrera kontot. Försök igen senare.');
      }
      
      setSuccessMessage('Konto har skapats framgångsrikt! Du är nu inloggad.');
      
      // No need to redirect as the protected route component will handle this
    } catch (error) {
      console.error('Registration error:', error);
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
          maxWidth: 500,
          borderRadius: 2
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Registrera konto
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Skapa ett konto för att använda AffärsRadar
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
            label="Namn"
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting || loading}
          />
          
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
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="industry-label">Bransch</InputLabel>
            <Select
              labelId="industry-label"
              id="industry"
              value={industry}
              label="Bransch"
              onChange={(e) => setIndustry(e.target.value)}
              disabled={isSubmitting || loading}
            >
              {industries.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Lösenord"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting || loading}
            helperText="Minst 6 tecken"
          />
          
          <TextField
            label="Bekräfta lösenord"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isSubmitting || loading}
            error={confirmPassword && password !== confirmPassword}
            helperText={confirmPassword && password !== confirmPassword ? "Lösenorden matchar inte" : ""}
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
            {(isSubmitting || loading) ? <CircularProgress size={24} /> : 'Registrera'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Har du redan ett konto?{' '}
              <Link component={RouterLink} to="/login">
                Logga in
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;
