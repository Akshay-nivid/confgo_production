/**
 * security ui component for appbar in main dashboard to reset password
 * @author Nevin
 * used to reset the password for the admin user
 */
import React, { useState } from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import "./mainProfile.scss";
import CustomButton from "@/components/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
import useStore, { setDataById } from "@/Libs/store/store";
import { Logger } from "@/Utils/Logger";
import { purposeTypes } from "@/Utils/CommonBaseClass";

export const userType = {
  PARTICIPANT: 'PARTICIPANT',
  ORGANISATION: 'ORGANIZATION'
}
interface SecurityProps {
  passEmail: string; 
}

const MainSecurity:React.FC<SecurityProps> = React.memo(({ passEmail }) => {
  const POST = useStore((state: any) => state.POST);

  const navigate = useNavigate();
  const detail = useStore((state: any) => state?.compData?.["company-user"]);
  const email = detail?.email ? detail.email :passEmail;
  const [isLoading, setIsLoading] = useState(false);
/**
 *  Initiates the password reset process by sending the user's email to the forgotPassword
 * @param email
 */
  const handlePasswordReset = async () => {
    setIsLoading(true);
    const body = { username: email, };
    const successCB = (context: any) => {  
        if (context?.data?.role?.roleName==="USER") {
        navigate(routes.userOtp(), { state: { email, purpose: purposeTypes.RESET_PASSWORD, token: context?.data?.token?.token, userId: context?.data?.token?.userId  } });     
        setDataById("resendOtp",{token: context?.data?.token?.token});  
        }   
        else {
            setDataById("thankYouPageInfo", { type:"A password reset email has been sent to your registered email. Please check your inbox and follow the instructions."});
            navigate(routes.thankyou());
          }
        setIsLoading(false);
    };

    POST({
      url: 'user/forgotPassword', body: body,
      id: 'forgotPassword',
      successCB: successCB,
      errorCB: (error: any) => Logger.error("error", error)
    })
  };

  return (
    <Grid container className="main-security-container">
      <Grid size={12}>
        <Typography className="main-security-title account-title account-margin">Security</Typography>
      </Grid>
     <Grid size={12} className="main-security-bottom-border">
      <Grid
        container
        size={10}
        className="main-security-text-border account-margin"
      >
        <Grid>
          <Typography className="main-security-text">
            Email Address
          </Typography>
          <Typography className="main-security-subtext">
            The email associated with your Account
          </Typography>
        </Grid>
        <Grid display="flex" alignItems="center">
          <Typography className="main-security-text">
            {email}
          </Typography>
          
        </Grid>
      </Grid>
      </Grid>
    <Grid size={12} className="main-security-bottom-border">
      <Grid
        container
        size={10}
         className="main-security-text-border account-margin"
      >
        <Grid>
          <Typography className="main-security-text">
            Password
          </Typography>
          <Typography  className="main-security-subtext">
            Set a unique password to protect your account
          </Typography>
        </Grid>
        <Grid display="flex" alignItems="center">
          <CustomButton
            className="main-security-password-reset-btn"
            label="Change Password"
            variant="contained"
            onClick={handlePasswordReset}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </Grid>
      </Grid>
      </Grid>
    </Grid>
  );
});

export default MainSecurity;
