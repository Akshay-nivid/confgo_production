import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import routes from '@/router/routes';
import { validateEmail, validateRequiredField } from '@/Utils/Validation';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import apiClient from '@/Libs/Https/API-client';
import { Logger } from '@/Utils/Logger';
import useStore from '@/Libs/store';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
interface IUserLogin {
  username: string;
  password: string;
}

interface GoogleUserData {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  hd: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  jti: string;
  name: string;
  nbf: number;
  picture: string;
  phone_number: string;
}


/**
 * User Login page component
 *
 */
const UserLogin = () => {
  const { control, handleSubmit } = useForm<IUserLogin>();
  const { setDataById }: any = useStore();
  /**
   * function to handle login
   */
  const handleLogin = async (obj: IUserLogin) => {
    const response = await apiClient.post('auth/login', obj);
    const { status, message } = processAPIResponse(response, "authLogin");
    if (status) {
      sessionStorage.setItem("token", response.data.data.token);
      setDataById('participantLogin', true)
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: "Login Successfully" });
    }
    else {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: message });
    }
  };

  /**
   * function to handle google login
   * @param {any} data - The data to be sent to the server
   */
  const googleSsoLogin = async (obj: GoogleUserData) => {
    const requestBody = {
      provider: "google",
      providerUserId: obj.sub ?? '',
      firstName: obj.given_name ?? '',
      lastName: obj.family_name ?? '',
      email: obj.email ?? '',
      ...(obj.phone_number ? { phone: obj.phone_number } : {})
    };
    const response = await apiClient.post('auth/ssoLogin', requestBody)
    const { status, message } = processAPIResponse(response, "authLogin");
    if (status) {
      setDataById('participantLogin', true)
      sessionStorage.setItem("token", response.data.data.token);
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: "Login Successfully" });
    }
    else {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: message });
    }
  }

  return (
    <Grid
      justifyContent={'center'}
      alignItems={'center'}
      container
      className="user-login"
    >
      <Grid size={12} className="content-container">
        <Box className="header-container">
          <Typography textAlign={'center'} className="header-title">
            Welcome Back
          </Typography>
          <Typography textAlign={'center'} className="header-subtitle">
            Access your dashboard and stay on top of <br />
            your conferences.
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
                name="username"
                placeholder="Email Address"
                label={'Email Address'}
                rules={{
                  required: validateRequiredField({ fieldName: 'Email' }),
                  pattern: validateEmail({}),
                }}
              />
              <CustomTextField
                control={control}
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
                rules={{
                  required: validateRequiredField({ fieldName: 'Password' }),
                }}
              />
            </Box>
            <CustomButton
              className="login-button"
              fullWidth
              size="large"
              label="Login"
              type="submit"
            />
          </form>
          <Box className="navigation-text-container">
            <Typography className="signup-text">
              Don’t have an account?{' '}
              <Link
                to={routes.userRegister()}
                className="signup-text-highlight"
              >
                Sign Up now.
              </Link>
            </Typography>
            <Link to={'/user/forgot-password'} className="forgot-password-text">
              Forgot Password?
            </Link>
          </Box>
          <Box className="sso-header-container ">
            <Box className="sso-header-line  "></Box>
            <Typography className="sso-header-text">Or Login With</Typography>
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
            onSuccess={(credentialResponse: CredentialResponse) => {
              const credential = credentialResponse.credential;
              if (credential) {
                try {
                  const decodedToken: GoogleUserData = jwtDecode(credential);
                  googleSsoLogin(decodedToken)
                } catch (error) {
                  Logger.error('Failed to decode token', error);
                }
              } else {
                Logger.error('No credential received');
              }
            }}
            onError={() => { }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserLogin;
