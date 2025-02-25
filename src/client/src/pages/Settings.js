import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
  Alert,
  Snackbar,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { getUserSettings, updateUserSettings } from '../services/supabaseClient';
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

const Settings = () => {
  const { user, updateProfile, signOut } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    industry: user?.industry || ''
  });
  
  const [settings, setSettings] = useState({
    notifications: true,
    weeklyDigest: true,
    claudeApiKey: '',
    theme: 'light'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Load user settings from Supabase
  useEffect(() => {
    const loadSettings = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const { data: userSettings, error } = await getUserSettings(user.id);
          
          if (error) throw error;
          
          if (userSettings) {
            setSettings(prev => ({
              ...prev,
              ...userSettings
            }));
          }
        } catch (err) {
          console.error('Error loading settings:', err);
          setError('Kunde inte ladda inställningar. Försök igen senare.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadSettings();
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSettingChange = (e) => {
    const { name, value, checked, type } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    try {
      setSaving(true);
      setError('');
      
      // Only update fields that have changed
      const updates = {};
      if (profile.name !== user.name) updates.name = profile.name;
      if (profile.industry !== user.industry) updates.industry = profile.industry;
      
      if (Object.keys(updates).length === 0) {
        setSaved(true);
        return;
      }
      
      const { success, error } = await updateProfile(updates);
      
      if (!success) throw new Error(error || 'Kunde inte uppdatera profil');
      
      setSaved(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user?.id) return;
    
    try {
      setSaving(true);
      setError('');
      
      const { data, error } = await updateUserSettings(user.id, settings);
      
      if (error) throw error;
      
      setSaved(true);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSaved(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect handled by protected route
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
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
        Inställningar
      </Typography>

      <Snackbar open={saved} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Inställningarna har sparats!
        </Alert>
      </Snackbar>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Användarprofil" />
            <Divider />
            <CardContent>
              <TextField
                fullWidth
                label="Namn"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                margin="normal"
                disabled={saving}
              />
              <TextField
                fullWidth
                label="E-post"
                name="email"
                value={profile.email}
                margin="normal"
                disabled={true}
                helperText="E-postadressen kan inte ändras"
              />
              <TextField
                fullWidth
                select
                label="Bransch"
                name="industry"
                value={profile.industry}
                onChange={handleProfileChange}
                margin="normal"
                disabled={saving}
              >
                {industries.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveProfile}
                sx={{ mt: 2 }}
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Spara profil'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Notifikationer" />
            <Divider />
            <CardContent>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications}
                      onChange={handleSettingChange}
                      name="notifications"
                      disabled={saving}
                    />
                  }
                  label="Aktivera notifikationer"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.weeklyDigest}
                      onChange={handleSettingChange}
                      name="weeklyDigest"
                      disabled={saving}
                    />
                  }
                  label="Skicka veckovis sammanfattning via e-post"
                />
              </FormGroup>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveSettings}
                sx={{ mt: 2 }}
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Spara inställningar'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="API Inställningar" />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                För att använda Claude API med AffärsRadar behöver du lägga in din egen API-nyckel.
              </Typography>
              <TextField
                fullWidth
                label="Claude API-nyckel"
                name="claudeApiKey"
                value={settings.claudeApiKey}
                onChange={handleSettingChange}
                margin="normal"
                type="password"
                disabled={saving}
                helperText="Din API-nyckel sparas säkert och används endast för att generera insikter och rekommendationer."
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveSettings}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} /> : 'Spara inställningar'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  disabled={saving}
                >
                  Logga ut
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
