import React from 'react';
import { Button, TextField, Container, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Handle login logic
    onLogin();
    navigate('/pages/form1');
  };

  return (
    <Container component="main" maxWidth="xs" className="login-container">
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <form>
            <TextField
              label="Username"
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              style={{ marginTop: '16px' }}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
