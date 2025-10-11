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
import Stack from '@mui/material/Stack';

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
      <Card>
        <CardHeader subheader="Update your account password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth required>
              <InputLabel>Current password</InputLabel>
              <OutlinedInput
                label="Current password"
                name="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>New password</InputLabel>
              <OutlinedInput
                label="New password"
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Confirm new password</InputLabel>
              <OutlinedInput
                label="Confirm new password"
                name="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={handleChange}
              />
            </FormControl>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Update password
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
