import CustomButton from '@/components/CustomButton/CustomButton';
import routes from '@/router/routes';
import { validateMinLength, validateRequiredField } from '@/Utils/Validation';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { LockIcon } from '@/assets/svg';
import { useEffect } from 'react';
import apiClient from '@/Libs/Https/API-client';

/**
 * User Otp page component
 *
 */
interface IFormData {
  otp: string;
}
const UserOtp = () => {
  const { email, phoneNumber, token, userId } = useLocation().state || {};

  const navigate = useNavigate();

  /*
   * if email and phone number are not present in the state, redirect to the register page
   */

  useEffect(() => {
    if (!email || !phoneNumber) {
      navigate(routes.userRegister());
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: { otp: '' },
    reValidateMode: 'onSubmit',
  });

  /**
   * function to handle login
   */
  const handleLogin = async (data: IFormData) => {
    console.log(token, userId);
    const body = {
      userId: userId,
      otp: data.otp,
      type: 'REGISTRATION_OTP',
      token: token,
      email: email,
    };
    try{
    const response = await apiClient.post('token/validateotp', body);
    console.log(response, 'response');
    if(response.data.status === 'success'){
      navigate(routes.userSetPassword());
    }else{
        console.log(response, 'response');
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

const handleResendOtp = async () => {
  const response = await apiClient.post('token/otp', {
    phone: phoneNumber,
    type: 'RESET_PASSWORD_OTP',
  });
  console.log(response, 'response');
};

  return (
    <Grid
      justifyContent={'center'}
      alignItems={'center'}
      container
      className="user-otp"
    >
      <Grid size={12} className="content-container">
        <Box display={'flex'} justifyContent={'center'}>
          <LockIcon className="lock-icon" />
        </Box>
        <Box className="header-container">
          <Typography textAlign={'center'} className="header-title">
            Verify Your Account
          </Typography>
          <Typography textAlign={'center'} className="header-subtitle">
            {`Enter the OTP sent to +91 ${phoneNumber} /`}
            <br /> {`${email} to complete the process.`}
          </Typography>
        </Box>
        <Box className="form-container">
          <form
            onSubmit={handleSubmit(handleLogin)}
            noValidate
            className="form"
          >
            <Box
              className="otp-container"
              display={'flex'}
              flexDirection={'column'}
            >
              <Controller
                name="otp"
                control={control}
                rules={{
                  required: validateRequiredField({ fieldName: 'OTP' }),
                  minLength: validateMinLength({
                    message: 'Invalid OTP',
                    minLength: 6,
                  }),
                }}
                render={({ field }) => (
                  <OtpInput
                    value={field.value}
                    onChange={field.onChange}
                    numInputs={6}
                    shouldAutoFocus
                    renderInput={(props) => (
                      <input
                        {...field}
                        {...props}
                        className="otpcomponent__otp-input-container-otp-input"
                        onKeyDown={(e) => {
                          if (e.key !== 'Backspace' && isNaN(Number(e.key))) {
                            e.preventDefault();
                          }
                        }}
                      />
                    )}
                    containerStyle={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  />
                )}
              />

              {errors.otp?.message && (
                <Typography className="otpcomponent__error-text">
                  {errors?.otp.message}
                </Typography>
              )}
            </Box>
            <CustomButton
              className="verify-button"
              fullWidth
              size="large"
              label="Verify"
              type="submit"
            />
          </form>
          <Box className="navigation-text-container">
            <Typography className="resend-text">
              Didn't receive the OTP?{' '}
              <span onClick={handleResendOtp} className="resend-text-highlight">
                Resend OTP.
              </span>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserOtp;
