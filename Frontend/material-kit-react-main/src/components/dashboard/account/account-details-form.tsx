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
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';

import { useUser } from '@/hooks/use-user';

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
] as const;

export function AccountDetailsForm(): React.JSX.Element {
  const { user } = useUser();

  const [formData, setFormData] = React.useState({
    firstName: user?.name?.split(' ')[0] || 'Sofia',
    lastName: user?.name?.split(' ')[1] || 'Rivers',
    email: user?.email || 'sofia.rivers@devias.io',
    phone: '+1 (555) 123-4567',
    country: 'US',
    city: 'New York',
    state: 'NY',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    // Show success message
    alert('Profile updated successfully!');
  };

  const cardSurfaceSx = {
    bgcolor: 'rgba(19,47,76,0.92)',
    border: '1px solid var(--market-border, rgba(255,255,255,0.12))',
    borderRadius: 3,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 20px 60px rgba(1,12,28,0.45)',
  } as const;

  const formFieldSx = {
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
  } as const;

  return (
    <form onSubmit={handleSubmit}>
      <Card sx={cardSurfaceSx}>
        <CardHeader
          subheader="Update your personal information"
          title="Profile"
          titleTypographyProps={{ sx: { color: '#ffffff', fontWeight: 600 } }}
          subheaderTypographyProps={{ sx: { color: 'var(--market-textSecondary, rgba(255,255,255,0.7))' } }}
        />
        <Divider sx={{ borderColor: 'var(--market-border, rgba(255,255,255,0.12))' }} />
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required sx={formFieldSx}>
                <InputLabel>First name</InputLabel>
                <OutlinedInput
                  label="First name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required sx={formFieldSx}>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput
                  label="Last name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required sx={formFieldSx}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput
                  label="Email address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth sx={formFieldSx}>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput
                  label="Phone number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth sx={formFieldSx}>
                <InputLabel>Country</InputLabel>
                <Select
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={(e) => handleChange({ target: { name: 'country', value: e.target.value } })}
                >
                  {countries.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ color: '#ffffff' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth sx={formFieldSx}>
                <InputLabel>State/Region</InputLabel>
                <OutlinedInput
                  label="State/Region"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth sx={formFieldSx}>
                <InputLabel>City</InputLabel>
                <OutlinedInput
                  label="City"
                  name="city"
                  value={formData.city}
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
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
