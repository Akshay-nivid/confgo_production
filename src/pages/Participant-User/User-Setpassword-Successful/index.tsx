import { SetPasswordSuccessfulIcon } from '@/assets/svg';
import CustomButton from '@/components/CustomButton/CustomButton';
import routes from '@/router/routes';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';

/**
 * User Setpassword Successful page component
 *
 */
const UserSetpasswordSuccessful = () => {
  const navigate = useNavigate();
  /**
   * function to handle navigate to login page
   */
  const handleLogin = () => {
    navigate(routes.userLogin());
  };

  return (
    <Grid
      justifyContent={'center'}
      alignItems={'center'}
      container
      className="user-login"
    >
          <Grid size={12} className="content-container">
          <Box display={'flex'} justifyContent={'center'}>
              <SetPasswordSuccessfulIcon className="set-password-successful-icon" />
              
              </Box>
        <Box className="header-container">
          <Typography textAlign={'center'} className="header-title">
            Password Created
            <br />
            Successfully!
          </Typography>
          <Typography textAlign={'center'} className="header-subtitle">
            You can now log in with your new password.
          </Typography>
        </Box>
        <Box className="button-container">
          <CustomButton
            className="got-to-login-button"
            fullWidth
            size="large"
            label="Go To Login"
            onClick={handleLogin}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserSetpasswordSuccessful;
