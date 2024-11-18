/**
 * security ui component for appbar in user dashboard to reset password
 * @author Nevin
 * used to reset the password for the user
 */
import React from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import "./accountsetting.scss";
import CustomButton from "@/components/CustomButton/CustomButton";
import { useNavigate,useLocation } from "react-router-dom";
import routes from "@/router/routes";
import useStore from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import { purposeTypes } from "@/Utils/CommonBaseClass";

export const userType = {
  PARTICIPANT: 'PARTICIPANT',
  ORGANISATION: 'ORGANIZATION'
}

const Security:React.FC = React.memo(() => {
  const POST = useStore((state: any) => state.POST);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
/**
 *  Initiates the password reset process by sending the user's email to the forgotPassword
 * @param email
*/
  const handlePasswordReset = async () => {
    const body = { username: email, };
    const successCB = (context: any) => {  
        navigate(routes.userOtp(), { state: { email, purpose: purposeTypes.RESET_PASSWORD, token: context?.data?.token?.token, userId: context?.data?.token?.userId  } });          
    };

    POST({
      url: 'user/forgotPassword', body: body,
      id: 'forgotPassword',
      successCB: successCB,
      errorCB: (error: any) => Logger.error("error", error)
    })
    
  };

  return (
    <Grid container>
      <Grid size={12}>
        <Typography className="security-title account-title account-margin">Security</Typography>
      </Grid>
<Grid size={12} className="security-bottom-border">
      <Grid
        container
        size={10}
        className="security-text-border account-margin"
      >
        <Grid>
          <Typography className="security-text">
            Email Address
          </Typography>
          <Typography className="security-subtext">
            The email associated with your Account
          </Typography>
        </Grid>
        <Grid display="flex" alignItems="center">
          <Typography className="security-text">
            {email}
          </Typography>
          
        </Grid>
      </Grid>
      </Grid>
  <Grid size={12} className="security-bottom-border">
      <Grid
        container
        size={10}
         className="security-text-border account-margin"
      >
        <Grid>
          <Typography className="security-text">
            Password
          </Typography>
          <Typography  className="security-subtext">
            Set a unique password to protect your account
          </Typography>
        </Grid>
        <Grid display="flex" alignItems="center">
          <CustomButton
            className="security-password-reset-btn"
            label="Reset Password"
            variant="contained"
            onClick={handlePasswordReset}
          />
        </Grid>
      </Grid>
      </Grid>
    </Grid>
  );
});

export default Security;
