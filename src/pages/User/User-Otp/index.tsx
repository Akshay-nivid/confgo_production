import CustomButton from '@/components/CustomButton/CustomButton';
import routes from '@/router/routes';
import { validateMinLength, validateRequiredField } from '@/Utils/Validation';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { LockIcon } from '@/assets/svg';
import { useEffect } from 'react';
import apiClient from '@/Libs/Https/API-client';
import useStore from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import { purposeTypes } from '@/Utils/CommonBaseClass';

/**
 * User Otp page component
 *
 */
interface IFormData {
  otp: string;
}
const UserOtp = () => {

  const { email, token, userId, purpose, phoneNumber } = useLocation().state || {};
  const navigate = useNavigate();
  const POST = useStore((state: any) => state.POST);
  /*
   * if email and phone number are not present in the state, redirect to the register page
   */
  useEffect(() => {
    if (!email) {
      navigate(routes.userRegister());
    }
  }, []);
  /**
   * useForm hook
   */
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: { otp: "" },
    reValidateMode: "onSubmit",
  });
  /**
   * function to handle login
   */
  const handleVerifyOtp = async (data: IFormData) => {
    /*
     * set password api call
     */
    if (purpose === purposeTypes.SET_PASSWORD) {
      const body = {
        userId: userId,
        otp: data.otp,
        type: "USER_REGISTRATION_OTP",
        token: token,
    
      };

      /**
       * success callback function
       */
      function successCB(_context: any) {
        navigate(routes.userSetPassword(),
          { state: { userId: userId, email: email,purpose} });
      }

      /**
       * if purpose is new user registration set password
       * function to make api call
       */
      POST({
        id: 'setPassword', url: 'token/validateotp',
        body: body
        , successCB: successCB,
        errorCB: (error: any) => Logger.error("error", error)
      })
    };
    /**
     * if purpose is forgot password
     * reset password api call
     */
    if (purpose == purposeTypes.RESET_PASSWORD) {
      
      const body = {
        otp: data.otp,
        token: token,
        type: 'RESET_PASSWORD_OTP',
        userId: userId,
      };
      function successCB(_context: any) {
        navigate(routes.userSetPassword(), { state: { email,userId,purpose } });
      }
      POST({
        id: 'reset-password'
        , url: 'token/validateotp',
        body: body,
        successCB: successCB,
        errorCB: (error:any) => Logger.error("error", error)
      })
    }
  };
/**
 * function to handle resend otp
 * @returns 
 */
  const handleResendOtp = async () => {
    const response = await apiClient.post('token/otp', {
      phone: phoneNumber,
      type: 'RESET_PASSWORD_OTP',
    });
    return response;
  };

  return (
    <Grid
      justifyContent={"center"}
      alignItems={"center"}
      container
      className="user-otp"
    >
      <Grid size={12} className="content-container">
        <Box display={"flex"} justifyContent={"center"}>
          <LockIcon className="lock-icon" />
        </Box>
        <Box className="header-container">
          <Typography textAlign={"center"} className="header-title">
            Verify Your Account
          </Typography>
          <Typography textAlign={'center'} className="header-subtitle">
            {`Enter the OTP sent ${email} `}
            <br />
            {`   to complete the process.`}
          </Typography>
        </Box>
        <Box className="form-container">
          <form
            onSubmit={handleSubmit(handleVerifyOtp)}
            noValidate
            className="form"
          >
            <Box
              className="otp-container"
              display={"flex"}
              flexDirection={"column"}
            >
              <Controller
                name="otp"
                control={control}
                rules={{
                  required: validateRequiredField({ fieldName: "OTP" }),
                  minLength: validateMinLength({
                    message: "Invalid OTP",
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
                          if (e.key !== "Backspace" && isNaN(Number(e.key))) {
                            e.preventDefault();
                          }
                        }}
                      />
                    )}
                    containerStyle={{
                      display: "flex",
                      justifyContent: "space-between",
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
              Didn't receive the OTP?{" "}
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
