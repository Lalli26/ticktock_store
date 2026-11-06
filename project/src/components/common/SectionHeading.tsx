import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}

export default function SectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
      spacing={2}
      sx={{ mb: { xs: 4, md: 5 } }}
    >
      <Box>
        <Typography variant="overline" sx={{ color: 'secondary.dark', letterSpacing: 2.5 }}>
          {eyebrow}
        </Typography>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.9rem', md: '2.4rem' }, mt: 0.5 }}>
          {title}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}
