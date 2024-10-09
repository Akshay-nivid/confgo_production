import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import SetPasswordComponent from "./SetPasswordComponent";
import OtpComponent from "./Otpcomponent";

const SetPassword = () => {
  // State to track if OTP is verified
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Callback function to update the OTP verification status
  const handleOtpVerification = (status: boolean) => {
    setIsOtpVerified(status);
  };

  return (
    <Box className="setpassword-main-container">
      <Grid container className="grid-layout">
        <Grid size={{ xs: 12, sm: 6 }} className="grid-left">
          {!isOtpVerified && (
            <OtpComponent onOtpVerify={handleOtpVerification} />
          )}

          {isOtpVerified && <SetPasswordComponent />}
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} className="grid-right">
          <Box className="right-image-container">
            <Typography className="image-content-text">
              <Typography className="paragraph">Unlock the Future of Conference</Typography>
              <Typography className="paragraph">Management – Join Us Today!</Typography>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SetPassword;
