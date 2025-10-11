import PropTypes from 'prop-types';
// @mui
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import { LinearProgressType } from '@/enum';

/***************************  CARD - PROGRESS  ***************************/

export default function ProgressCard({ title, value, progress }) {
  return (
    <Stack sx={{ gap: 0.5 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2">{title}</Typography>
        <Typography variant="subtitle1">{value}</Typography>
      </Stack>
      <LinearProgress variant="determinate" type={LinearProgressType.LIGHT} {...progress} aria-label="progress" />
    </Stack>
  );
}

ProgressCard.propTypes = { title: PropTypes.string, value: PropTypes.string, progress: PropTypes.any };
