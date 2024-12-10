import {CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import KeyboardBackspaceRoundedIcon from '../../assets/svg/Arrow 2.svg';
import { ForgotPasswordIcon, SignUpFlowIcon } from "@/assets/svg";
import routes from "@/router/routes";
import { validateEmail, validateRequiredField } from "@/Utils/Validation";
import useStore from "@/Libs/store";
import CustomButton from "@/components/CustomButton/CustomButton";
import { Logger } from "@/Utils/Logger";
import { purposeTypes, useIsMobileScreen } from "@/Utils/CommonBaseClass";
import { useState } from "react";

/**
 * Form data interface
 */
interface FormData {
  email: string;
}
/**
 * function forgot password
 */
const ForgotPassword = () => {
  const { handleSubmit, control } = useForm<FormData>();
  const POST = useStore((state: any) => state.POST);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
   const isMobileScreen = useIsMobileScreen();

  /**
   *   A functional  that provides a "Bach to login" button
   */
const  previousPath=()=>{
  navigate(-1)
}
  /**
   * Function to handle submit button
   * checking email is valid or not
   * @param data 
   */
  const setDataById = useStore((state: any) => state.setDataById);
  const handleResetPassword = async (data: FormData) => {
    const body = { username: data.email, };
    /**
     * success callback function for participant
     */
    setLoading(true); // Start loader
    const successCB = (success: any) => {
      if (success?.data?.role?.roleName==="USER") {
      navigate(routes.userOtp(),{state:{email:data.email,purpose:purposeTypes.RESET_PASSWORD,token: success?.data?.token?.token, userId: success?.data?.token?.userId } });
      setDataById("resendOtp",{token: success?.data?.token?.token});
      } else {
        setDataById("thankYouPageInfo", {
          type: "Email sent to you. Please check.",
        });
        navigate(routes.thankyou());
      }
      setLoading(false); 
    };

    /**
     * function to make /user/forgotPassword api call
     */
    POST({
      url: 'user/forgotPassword', body: body,
      id: 'forgotPassword',
      successCB: successCB,
      errorCB: (error: any) => {
        setLoading(false); 
        Logger.error("error", error);
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "error",
          message: error?.message??"Invalid Email Address",
        });
      }
    })
  };
  return (
    <>
    {loading ? (
      <Grid
      className="Loader"
      >
        <CircularProgress />
      </Grid>
    ) : (
    <Grid className="forgotpassword__container" container>
      <Grid container className="grid-left" size={{ xs: 12, lg: 7 }} bgcolor="#FFFFFF" justifyContent="center" >
        <Grid className="grid-left-image" size={{ xs: 12, sm: 6 }} justifyContent={"center"}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className='forgot-password-grid'
            size={12}
          >
            <ForgotPasswordIcon className='forgot-password-icon' />
          </Grid>
          <Grid className="forgot-password-title-grid">
            <Typography className="forgot-password-title">Forget Your Password?</Typography>
            <Typography className="forgot-password-title2">Donl help you reset it!</Typography>
          </Grid>
          <Grid className="forgot-password-form-grid">
            <CustomTextField
              control={control}
              placeholder="Email Address"
              label={"Email Address"}
              type="email"
              name="email"
              rules={
                {
                  required: validateRequiredField({}),
                  pattern: validateEmail({})
                }
              }
            />
            <CustomButton variant="contained" className="button-reset-password" onClick={handleSubmit(handleResetPassword)} label="Reset Password" />
            <CustomButton variant="text" className="button-back-to-login" startIcon={<KeyboardBackspaceRoundedIcon />} label="Back to Login" onClick={previousPath} />
          </Grid>
          <Grid>
          </Grid>
        </Grid>
      </Grid>
    {!isMobileScreen &&(<Grid  container size={{ xs: 12, md: 5 }} className="grid-right">
          <SignUpFlowIcon/>
      </Grid>)}
    </Grid>
  )}
   </>
 );
 };

export default ForgotPassword;
