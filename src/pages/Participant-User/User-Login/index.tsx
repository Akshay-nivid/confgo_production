import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import routes from '@/router/routes';
import { validateEmail, validateRequiredField } from '@/Utils/Validation';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Logger } from '@/Utils/Logger';
import useStore, { clearDataById } from '@/Libs/store';
import { registerComponent } from '@/Libs/DataHandler/dataHandler';
import { ApiResponse } from '@/pages/LoginOrg/loginOrg';
import apiClient from '@/Libs/Https/API-client';

interface IUserLogin {
  username: string;
  password: string;
}

type UserProps = {
  id: string;
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

export const roleToRouteMapper: any = {
  COMPANYADMIN: routes.dashboard(),
  USER: routes.userHome(),
  REVIEWER: routes.reviewerHome(),
  SPEAKER: routes.speakerHome(),
};

/**
 * User Login page component
 */
const UserLogin = (props: UserProps) => {
  ({ props } = registerComponent(props));

  const { control, handleSubmit } = useForm<IUserLogin>();
  const setDataById = useStore((state: any) => state.setDataById);
  const previousRoute = useStore((state: any) => state.compData?.previousRoute?.url) ?? '';

  const POST = useStore((state: any) => state.POST);
  const navigate = useNavigate();
  /**
  * function for set userTpype
  */
  function handleClickForgetPassword() {
    navigate(routes.userForgotPassword());
  }

  /**
   *method to store login details
   */
  const storeDetails = (data: any) => {
    sessionStorage.clear();
    sessionStorage.setItem("token", data?.token);
    sessionStorage.setItem("userToken", data?.token);
    sessionStorage.setItem("userId", data?.id?.toString());
    sessionStorage.setItem('userLoggedInType', data?.userRole?.roleName);
    sessionStorage.setItem('isUserLoggedIn', 'true');
    sessionStorage.setItem('userRole', data?.userRole?.roleName);
    sessionStorage.setItem('name', `${data?.firstName} ${data?.lastName}`);
    setDataById('participantUserData', data);
    setDataById('participantLogin', true);
    setDataById('participantUserData', data);
    apiClient.setToken(data.token);
    setDataById('userDetails', data);
    setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: "Login Successfully" });
    navigate(data?.userRole?.roleName === "USER" && previousRoute ? previousRoute : roleToRouteMapper[data?.userRole?.roleName],{replace: true});
    clearDataById('previousRoute');
  };


  /**
   * Method used to handle login
   * @param obj 
   */
  const handleLogin = async (obj: IUserLogin) => {
    await POST({
      url: 'auth/login',
      body: obj,
      id: props?.id,
      successCB: (context: ApiResponse) => {
        storeDetails(context?.data);
        sessionStorage.setItem('ssoUser', 'false');

      },
      errorCB: (error: any) => {
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: error?.message });
      },
    });
  };

  /**
   * Method used to handle google login
   * @param obj 
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
    await POST({
      url: 'auth/ssoLogin',
      body: requestBody,
      id: props?.id,
      successCB: (context: ApiResponse) => {
        storeDetails(context?.data);
        sessionStorage.setItem('ssoUser', 'true');
      },
      errorCB: (context: any) => {
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
      }
    });
  }

  return (
    <Grid
      justifyContent={'center'}
      alignItems={'center'}
      container
      className="enduser-login"
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
                className='user-textfield'
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
                className='user-textfield'
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
              label="Log In"
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
                Sign Up.
              </Link>
            </Typography>

            <Box onClick={handleClickForgetPassword} className="forgot-password-text">
              Forgot Password?
            </Box>
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
