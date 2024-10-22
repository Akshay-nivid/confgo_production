// Snackbar.tsx
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarProps {
  open: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  onClose: () => void;
  autoHideDuration?: number;
}
/**
 * Custom Snackbar
 * @author Neethu
 */
const CustomSnackbar: React.FC<SnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 6000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Positioned at the top center
    >
      <Alert onClose={onClose}  className="custom-alert" severity={severity} sx={{ fontWeight: 'bold' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
