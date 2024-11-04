import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { ForgotPasswordIcon } from "@/assets/svg";
import routes from "@/router/routes";
import { validateEmail, validateRequiredField } from "@/Utils/Validation";
import { purposeTypes } from '../User/User-Otp'
import useStore from "@/Libs/store";
import CustomButton from "@/components/CustomButton/CustomButton";
import { Logger } from "@/Utils/Logger";
/**
 * 
 */
export const userType = {
  PARTICIPANT: 'PARTICIPANT',
  ORGANISATION: 'ORGANIZATION'
}
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
  const navigate = useNavigate();
  const currentUrl = useLocation().pathname;
  /**
 * compData for get userType
 */
  const  compData = useStore((state: any) => state.compData.userType);
  
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
    const successCB = (context: any) => {
      if (compData.type=== userType.PARTICIPANT) {
        navigate(routes.userOtp(), { state: { email: data.email, purpose: purposeTypes.RESET_PASSWORD, token: context?.data?.token?.token, userId: context?.data?.token?.userId } });
      } else {
        setDataById("thankYouPageTittle", { title: "Email sent successfully", url: currentUrl })
        navigate(routes.thankyou());
      }
    };
    /**
     * function to make /user/forgotPassword api call
     */
    POST({
      url: 'user/forgotPassword', body: body,
      id: 'forgotPassword',
      successCB: successCB,
      errorCB: (error: any) => Logger.error("error", error)
    })
  };
  return (
    <Grid className="forgotpassword__container" container>
      <Grid container className="grid-left" size={{ xs: 12, lg: 6 }} bgcolor="#FFFFFF" justifyContent="center" >
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
            <CustomButton variant="text" className="button-back-to-login" startIcon={<KeyboardBackspaceRoundedIcon />} label="Back to Login" />
          </Grid>
          <Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }} className="grid-right" container>
        <Grid size={{ xs: 12, lg: 6 }} className="grid-right-image">
          <Typography className="image-title" >
            Forget Your Password?
          </Typography>
          <Typography className="image-title2">
            Don't worry, we'll help you reset it!
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
