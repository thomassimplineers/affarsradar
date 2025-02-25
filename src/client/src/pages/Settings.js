import React, { useState } from 'react';
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
} from '@mui/material';

const Settings = () => {
  const [settings, setSettings] = useState({
    email: 'user@example.com',
    notifications: true,
    weeklyDigest: true,
    claudeApiKey: '',
    industry: 'IT & Tech',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setSettings({
      ...settings,
      [name]: e.target.type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {
    // In a real app, this would call an API to save the settings
    console.log('Saving settings:', settings);
    setSaved(true);
  };

  const handleSnackbarClose = () => {
    setSaved(false);
  };

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

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Användarprofil" />
            <Divider />
            <CardContent>
              <TextField
                fullWidth
                label="E-post"
                name="email"
                value={settings.email}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Bransch"
                name="industry"
                value={settings.industry}
                onChange={handleChange}
                margin="normal"
              />
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
                      onChange={handleChange}
                      name="notifications"
                    />
                  }
                  label="Aktivera notifikationer"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.weeklyDigest}
                      onChange={handleChange}
                      name="weeklyDigest"
                    />
                  }
                  label="Skicka veckovis sammanfattning via e-post"
                />
              </FormGroup>
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
                onChange={handleChange}
                margin="normal"
                type="password"
                helperText="Din API-nyckel sparas säkert och används endast för att generera insikter och rekommendationer."
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mt: 2 }}
              >
                Spara inställningar
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
