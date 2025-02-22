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
import useStore from "@/Libs/store";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import ChangePassword from "@/pages/changePassword/ChangePassword";

export const userType = {
  PARTICIPANT: 'PARTICIPANT',
  ORGANISATION: 'ORGANIZATION'
}
interface SecurityProps {
  passEmail: string; 
}

const MainSecurity:React.FC<SecurityProps> = React.memo(({ passEmail }) => {
  const detail = useStore((state: any) => state?.compData?.["company-user"]);
  const email = detail?.email ? detail.email :passEmail;
  const [showChangePswd,setShowChangePswd] = useState<boolean>(false)


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
                  className="change-pswd-green-btn"
                />
            }
          />
      </Grid>
      </Grid>
    </Grid>
  );
});

export default MainSecurity;
