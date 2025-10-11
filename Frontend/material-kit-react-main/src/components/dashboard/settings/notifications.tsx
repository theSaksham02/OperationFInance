'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function Notifications(): React.JSX.Element {
  return (
    <Card>
      <CardHeader subheader="Manage your notification preferences" title="Notifications" />
      <Divider />
      <CardContent>
        <Stack spacing={3}>
          <FormGroup>
            <Typography gutterBottom variant="subtitle2">
              Email notifications
            </Typography>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Trade execution alerts" />
            <FormControlLabel control={<Checkbox defaultChecked />} label="Market news updates" />
            <FormControlLabel control={<Checkbox />} label="Weekly portfolio summary" />
            <FormControlLabel control={<Checkbox defaultChecked />} label="Account security alerts" />
          </FormGroup>
          <FormGroup>
            <Typography gutterBottom variant="subtitle2">
              Push notifications
            </Typography>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Price alerts" />
            <FormControlLabel control={<Checkbox />} label="Economic calendar events" />
            <FormControlLabel control={<Checkbox defaultChecked />} label="Margin call warnings" />
          </FormGroup>
        </Stack>
      </CardContent>
    </Card>
  );
}
