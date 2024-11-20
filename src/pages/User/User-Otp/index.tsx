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
import { useEffect, useState } from 'react';
import useStore from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import { purposeTypes } from '@/Utils/CommonBaseClass';

interface IFormData {
  otp: string;
}
/**
 * User Otp page component
 *
 */
const UserOtp = () => {

  const { email, token, userId, purpose, phoneNumber } = useLocation().state || {};
  const setDataById = useStore((state: any) => state.setDataById);
  const eventData = useStore((state: any) => state?.compData?.["userDetails"]?.[`user/details`]) ?? [];
  const ResendOtpToken=  useStore((state: any) => state?.compData.resendOtp?.token);
  const navigate = useNavigate();
  const POST = useStore((state: any) => state.POST);
  const [isResendDisabled, setIsResendDisabled] = useState(true); 
  const [timer, setTimer] = useState(20);
  /*
   * if email and phone number are not present in the state, redirect to the register page
   */
  useEffect(() => {
    if (!email) {
      navigate(routes.userRegister());
    }
  }, []);
  /**
   * function for set resend otp timer
   */
  useEffect(() => {
    if (isResendDisabled) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isResendDisabled]);

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
   
    if (purpose === purposeTypes.SET_PASSWORD){
      const body = { 
        token:ResendOtpToken,
        userId: userId,
        otp: data?.otp,
        type: "USER_REGISTRATION_OTP",
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
        errorCB: (error: any) => Logger.error("error in validate otp", error)
      })
    };
    /**
     * if purpose is forgot password
     * reset password api call
     */
    if (purpose == purposeTypes.RESET_PASSWORD) {
       const body = {
        otp: data.otp,  
        token: ResendOtpToken,
        type: 'RESET_PASSWORD_OTP',
        userId: userId,
      };
      function successCB(_context: any) {
        navigate(routes.userSetPassword(),{state:{email,userId,purpose }});
      }
      POST({
        id: 'reset-password'
        ,url: 'token/validateotp',
        body: body,
        successCB: successCB,
        errorCB: (error:any) => {
          Logger.error("error", error)
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "error",
            message: error?.message,
          });
        }
      })
    }
  };

/**
 * function to handle resend otp
 * @returns 
 */
  const handleResendOtp = async () => {
    /**
     * Disable the resend button
     */
    setIsResendDisabled(true); 
    /**
     * Restart the timer for 30 seconds
     */
    setTimer(20); 
  if(purpose===purposeTypes.SET_PASSWORD){
   const setOtp={
       phone:phoneNumber,
       type:"USER_REGISTRATION_OTP"
    }
    POST({
      id: 'resendOtp',
      url: 'token/otp',
      body:setOtp,
      successCB:successCB,
      errorCB: (error: any) => Logger.error("error", error)
    });
    function successCB(success:any){
      setDataById("resendOtp",{token: success?.data?.token});
    }
  }
  if(purpose===purposeTypes.RESET_PASSWORD){
    const body={
      token:token,
      userId:userId,
      type: 'RESET_PASSWORD_OTP',
    }
     await POST({
        id: 'userDetails',
        url: 'user/details',
        body:body,
        successCB:successCB,
        errorCB: (error: any) => Logger.error("error", error)
      });
      function  successCB (_context: any) {
        const  resendOtp={
        type: 'RESET_PASSWORD_OTP',
        phone: eventData?.data?.phone,
      }
        POST({
        id: 'resendOtpToken',
        url: 'token/otp',
        body:resendOtp,
        successCB:successCB,
        errorCB: (error: any) => Logger.error("error", error)
      });
      function successCB(success: any) {
         setDataById("resendOtp",{token: success?.data?.token});
         setDataById('snackBarInfo',
           { open: true, autoHideDuration: 2000, severity: 'success',
             message: "Resend Otp successfully" });
      }
      }
      }
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
                 <span
                       onClick={!isResendDisabled ? handleResendOtp : undefined}
                       className={isResendDisabled ? "plan-disabled-choose-btn" : "resend-text-highlight"} >
                       {isResendDisabled ? `Resend OTP (${timer}s)` : "Resend OTP"}
                      </span>
                  </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserOtp;
