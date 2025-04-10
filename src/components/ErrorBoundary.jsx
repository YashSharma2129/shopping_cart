import React from 'react';
import { Alert, Button, Box } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                REFRESH
              </Button>
            }
          >
            Something went wrong. Please try refreshing the page.
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
