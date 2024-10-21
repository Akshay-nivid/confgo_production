import Grid from "@mui/material/Grid2";
import React from 'react';
import {
  Divider,
  Typography,
} from "@mui/material";
import CustomButton from "@/components/CustomButton/CustomButton";
import { SuccessTickImage } from "@/assets/svg";
import routes from "@/router/routes";
import { useNavigate } from "react-router-dom";
/*
 * functional compoent to render Registration success page
 */
const RegistrationSuccess = React.memo(() => {
  const navigate=useNavigate();
  const handleHome=()=>{
    navigate(routes.home());
  }
  return (
      <Grid container className="left-content-wrapper" >
        <Grid container className="left-inner-content" spacing={4}>
            <Grid container justifyContent={'center'} className="success-icon">
              <SuccessTickImage />
              <Grid alignSelf={"center"}>
                <Typography  className="left-plan-text"textAlign={"center"} variant="h4" lineHeight={2} >Login and Payment Successful</Typography>
                <Typography className="left-description-text" textAlign={"center"} variant="h6">Check your email to set your password and access your dashboard.</Typography>
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
                    label="Home"
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleHome}
                  />
                </Grid>
              </Grid>
            </Grid>
        </Grid>
      </Grid>
  )
});

export default RegistrationSuccess;