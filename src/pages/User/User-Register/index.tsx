import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import routes from '@/router/routes';
import {
  validateEmail,
  validateMaxLength,
  validatePhoneNumber,
  validateRequiredField,
} from '@/Utils/Validation';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '@/Libs/Https/API-client';
import { Logger } from '@/Utils/Logger';

interface IUserRegister {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * User Register page component
 *
 */
const UserRegister = () => {
  const { control, handleSubmit } = useForm<IUserRegister>();
  const navigate = useNavigate();
  /**
   * function to handle login
   */
  const handleLogin = async (data: IUserRegister) => {
    const response = await apiClient.post('user', data);
  
    try {
      if (response.data.status === 'success') {
        const token = response?.data?.data?.token;
        navigate(routes.userOtp(), {
          state: {
            email: data.email,
            phoneNumber: data.phone,
            token: token.token,
            userId: token.userId, 
          },
        });
        return response;
      } 
    } catch (error) {
      Logger.error('Error in register', error);
      return error;
    }
  };

  return (
    <Grid
      justifyContent={'center'}
      alignItems={'center'}
      container
      className="user-register"
    >
      <Grid size={12} className="content-container">
        <Box className="header-container">
          <Typography textAlign={'center'} className="header-title">
            Create Your Account
          </Typography>
          <Typography textAlign={'center'} className="header-subtitle">
            Join us and streamline your conference <br /> management today.
          </Typography>
        </Box>
        <Box className="form-container">
          <form
            onSubmit={handleSubmit(handleLogin)}
            noValidate
            className="form"
          >
            <Box
              className="textfield-container"
              display={'flex'}
              flexDirection={'column'}
            >
              <CustomTextField
                control={control}
                name="firstName"
                placeholder="First Name"
                label={'First Name'}
                rules={{
                  required: validateRequiredField({ fieldName: 'First Name' }),
                }}
              />
              <CustomTextField
                control={control}
                name="lastName"
                placeholder="Last Name"
                label={'Last Name'}
                rules={{
                  required: validateRequiredField({ fieldName: 'Last Name' }),
                }}
              />
              <CustomTextField
                control={control}
                name="email"
                placeholder="Email Address"
                label={'Email Address'}
                rules={{
                  required: validateRequiredField({ fieldName: 'Email' }),
                  pattern: validateEmail({}),
                }}
              />

              <CustomTextField
                control={control}
                name="phone"
                placeholder="Phone Number"
                label="Phone Number"
                type="phone"
                rules={{
                  required: validateRequiredField({
                    fieldName: 'Phone Number',
                  }),
                  pattern: validatePhoneNumber({}),
                  maxLength: validateMaxLength({
                    maxLength: 10,
                    fieldName: 'Phone Number',
                  }),
                }}
              />
            </Box>
            <CustomButton
              className="next-button"
              fullWidth
              size="large"
              label="Next"
              type="submit"
            />
          </form>
          <Box className="navigation-text-container">
            <Typography className="signup-text">
              Already have an account?{' '}
              <Link to={routes.userLogin()} className="signup-text-highlight">
                Sign In Now.
              </Link>
            </Typography>
          </Box>
          <Box className="sso-header-container ">
            <Box className="sso-header-line  "></Box>
            <Typography className="sso-header-text">Or Sign Up With</Typography>
            <Box className="sso-header-line  "></Box>
          </Box>
        </Box>
        <Box className="sso-container">
          <GoogleLogin
            width="100%"
            type="standard"
            size="large"
            shape="square"
            useOneTap
            onSuccess={() => {}}
            onError={() => {}}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserRegister;
