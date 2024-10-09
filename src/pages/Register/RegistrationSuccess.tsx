import Grid from "@mui/material/Grid2";
import React from 'react';
import {
  Divider,
  Typography,
} from "@mui/material";
import CustomButton from "@/components/CustomButton/CustomButton";
import SuccessTickImage from '@/assets/png/sucess-tick.png'
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
/*
 * functional compoent to render Registration success page
 */
const RegistrationSuccess = React.memo(() => {
  const navigate = useNavigate();
  /*
 * function to handle navigate to login page
 */
  const handleLogin = () => {
    navigate(routes.login())
  }
  return (
    <Grid>
      <Grid className="left-content-wrapper">
        <Grid className="left-inner-content">
          <Grid container spacing={4}>
            <Grid container justifyContent={'center'}>
              <img src={SuccessTickImage}></img>
              <Grid alignSelf={"center"}>
                <Typography fontWeight={800} textAlign={"center"} variant="h4" lineHeight={2} >Login and Payment Successful</Typography>
                <Typography className="checkbox-text-grey" textAlign={"center"} variant="h6">Check your email to set your password and access your dashboard.</Typography>
              </Grid>
            </Grid>
            <Grid className="form-wrapper success-container">
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Typography variant="h5">What’s Next?</Typography>
                </Grid>
                <Grid >
                  <Typography className="subheader-text" variant="h6" component="span" fontWeight="bold">
                    Check Your Email:
                  </Typography>
                  <Typography variant="h6" component="span">
                  Look for the password setup link in your inbox.
                  </Typography>
                </Grid>
                <Divider className="divider-box" />
                <Grid >
                  <Typography className="subheader-text" variant="h6" component="span" fontWeight="bold">
                    Set Your Password:
                  </Typography>
                  <Typography variant="h6" component="span">
                  Click on the link to create a secure password and complete your account setup.
                  </Typography>
                </Grid>
                <Divider className="divider-box" />
                <Grid >
                  <Typography className="subheader-text" variant="h6" component="span" fontWeight="bold">
                  Access Your Dashboard: 
                  </Typography>
                  <Typography variant="h6" component="span">
                  Once your password is set, log in to your dashboard to start managing your events/purchases [or specify relevant activities].
                  </Typography>
                </Grid>
                <Grid container mb={2} className="w-full" >
                  <CustomButton
                    className="plan-choose-btn"
                    label="Set Password"
                    variant="contained"
                    color="primary"
                    size="large"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={6} justifyContent={"center"} >
            <Grid container spacing={1} display={"flex"}  >
              <Typography variant="h6">Already have an account?</Typography>
              <Grid onClick={handleLogin}>
                <Typography variant="h6" className="login-label cursor-container" alignContent="flex-end"> Log In</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>

  )
});

export default RegistrationSuccess;