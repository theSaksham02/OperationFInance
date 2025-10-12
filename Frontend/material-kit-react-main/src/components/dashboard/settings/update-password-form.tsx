'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';

export function UpdatePasswordForm(): React.JSX.Element {
  const [passwords, setPasswords] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    if (passwords.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    
    // Here you would typically send the data to your backend
    console.log('Password update requested');
    alert('Password updated successfully!');
    
    // Reset form
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card
        sx={{
          bgcolor: 'rgba(19,47,76,0.92)',
          border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
          borderRadius: 3,
          backdropFilter: 'blur(18px)',
          boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
        }}
      >
        <CardHeader
          subheader="Update your account password"
          title="Password"
          titleTypographyProps={{ sx: { color: '#ffffff', fontWeight: 600 } }}
          subheaderTypographyProps={{ sx: { color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' } }}
        />
        <Divider sx={{ borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
        <CardContent>
          <Grid container spacing={3} sx={{ maxWidth: 520 }}>
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                required
                sx={{
                  '& .MuiInputBase-root': {
                    color: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderRadius: 2,
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.65)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.12)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(11,110,253,0.6)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--market-accent, #0B6EFD)',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#ffffff',
                  },
                }}
              >
                <InputLabel>Current password</InputLabel>
                <OutlinedInput
                  label="Current password"
                  name="currentPassword"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                required
                sx={{
                  '& .MuiInputBase-root': {
                    color: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderRadius: 2,
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.65)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.12)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(11,110,253,0.6)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--market-accent, #0B6EFD)',
                  },
                }}
              >
                <InputLabel>New password</InputLabel>
                <OutlinedInput
                  label="New password"
                  name="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                required
                sx={{
                  '& .MuiInputBase-root': {
                    color: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderRadius: 2,
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255,255,255,0.65)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.12)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(11,110,253,0.6)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--market-accent, #0B6EFD)',
                  },
                }}
              >
                <InputLabel>Confirm new password</InputLabel>
                <OutlinedInput
                  label="Confirm new password"
                  name="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
        <CardActions sx={{ justifyContent: 'flex-end', px: 3, py: 2 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: 'var(--market-accent, #0B6EFD)',
              borderRadius: 2,
              px: 3,
              py: 1.25,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { bgcolor: 'var(--market-accentHover, #0958d9)' },
            }}
          >
            Update password
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
