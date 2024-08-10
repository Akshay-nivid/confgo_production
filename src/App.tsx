import React from 'react';
import { Button } from '@mui/material';

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Button variant="contained" color="primary">
        Hello, Material UI!
      </Button>
    </div>
  );
};

export default App;
