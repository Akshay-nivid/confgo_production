/**
 * security ui component for appbar in user dashboard to reset password
 * @author Nevin
 * used to reset the password for the user
 */
import React, { useState } from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import "./accountsetting.scss";
import CustomButton from "@/components/CustomButton/CustomButton";
import { useLocation } from "react-router-dom";
import ChangePassword from "../changePassword/ChangePassword";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";

export const userType = {
  PARTICIPANT: 'PARTICIPANT',
  ORGANISATION: 'ORGANIZATION'
}
interface SecurityProps {
  passEmail: string; 
}

const Security:React.FC<SecurityProps> = React.memo(({ passEmail }) => {
  const location = useLocation();
  const email = location.state?.email ? location.state?.email :passEmail;
  const isSsoUser = sessionStorage.getItem("ssoUser") === 'true';
  const [showChangePswd,setShowChangePswd] = useState<boolean>(false)

  return (
    <Grid container className="security-container">
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
      {!isSsoUser && <Grid size={12} className="security-bottom-border">
        <Grid
          container
          size={10}
          className="security-text-border account-margin"
        >
          <Grid>
            <Typography className="security-text">
              Password
            </Typography>
            <Typography className="security-subtext">
              Set a unique password to protect your account
            </Typography>
          </Grid>
          <Grid display="flex" alignItems="center">
            <CustomButton
              className="security-password-reset-btn"
              label="Reset Password"
              variant="contained"
              onClick={() => {setShowChangePswd(true)}}
            />
          </Grid>
          <CustomDrawer
            open={showChangePswd}
            type="right"
            children={
                <ChangePassword
                  closeDrawer={() => { setShowChangePswd(false) }}
                  successCB={() => { setShowChangePswd(false) }} 
                  className="change-pswd-blue-btn"
                />
            }
          />
        </Grid>
      </Grid>}
    </Grid>
  );
});

export default Security;
