import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { RotateCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
      <Alert
        severity="error"
        sx={{ maxWidth: 520, width: '100%', alignItems: 'center' }}
        action={
          onRetry ? (
            <Button color="inherit" size="small" startIcon={<RotateCw size={16} />} onClick={onRetry}>
              Retry
            </Button>
          ) : undefined
        }
      >
        <AlertTitle>Something went wrong</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}
