import { Link as RouterLink } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 12, md: 16 }, textAlign: 'center' }}>
      <Typography variant="overline" sx={{ color: 'secondary.dark', letterSpacing: 3 }}>
        Error 404
      </Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: '2.2rem', md: '2.8rem' }, my: 2 }}>
        This page has stopped ticking
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for does not exist or has moved.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" color="primary" size="large">
        Back to home
      </Button>
    </Container>
  );
}
