import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import routes from '@/router/routes';
import {
  validateEmail,
  validateMaxLength,
  validateMinLength,
  validatePhoneNumber,
  validateRequiredField,
} from '@/Utils/Validation';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '@/Libs/Https/API-client';
import { Logger } from '@/Utils/Logger';
import { jwtDecode } from 'jwt-decode';
import useStore from '@/Libs/store';
import { purposeTypes } from '@/Utils/CommonBaseClass';


interface IUserRegister {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

type UserProps = {
  id?: string;
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
 * User Register page component
 *
 */
const UserRegister = (props: UserProps) => {
  const { control, handleSubmit } = useForm<IUserRegister>();
  const navigate = useNavigate();
  const POST = useStore((state: any) => state.POST);
  const setDataById = useStore((state: any) => state.setDataById);
  /**
   * function to handle google login
   * @param {any} data - The data to be sent to the server
   */
  const googleSsoLogin = async (data: GoogleUserData) => {
    try {
      const requestBody = {
        provider: "google",
        providerUserId: data.sub ?? '',
        firstName: data.given_name ?? '',
        lastName: data.family_name ?? '',
        email: data.email ?? '',
        ...(data.phone_number ? { phone: data.phone_number } : {})
      };
      /**
       * function to make api call
       */
      const response = await apiClient.post('auth/ssoLogin', requestBody)
      if (response.data.status === 'success') {
        setDataById('participantLogin', true)
        sessionStorage.setItem("token", response.data.data.token);
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: "Login Successfully" });
      }
    } catch (error: unknown) {
      Logger.error('Error in google login', error);
      return error;
    }
  }
  /**
   * function to handle login
   */
  const handleLogin = async (data: IUserRegister) => {
    await POST({
      url: 'user',
      body: data,
      id: props?.id,
      successCB: (context: any) => {
        console.log(context,'context')
        if (context?.success) {
         navigate(routes.userOtp(),{
          state: {
            email: data.email,
            phoneNumber: data.phone,
            token: context?.data?.token?.token,
            userId: context?.data?.token?.userId,
            purpose:purposeTypes.SET_PASSWORD
          },
        });
        }
      },
      errorCB: (context: any) => {
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
      }
    });
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
                  minLength: validateMinLength({ minLength: 3, fieldName: 'First Name' })
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

export default UserRegister;
