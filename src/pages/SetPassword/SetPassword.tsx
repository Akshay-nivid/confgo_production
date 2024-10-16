import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {  useState } from 'react';
import SetPasswordComponent from './PasswordFormComponent';
import OtpComponent from './OtpFormComponent';
import { LockIcon } from '@/assets/svg';

/**
 * ui component of set password page
 * @returns
 */

const SetPassword = () => {
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  /**
   * Callback function to update the OTP verification status
   * @param {boolean} status - The status of OTP verification
   */
  const handleOtpVerification = (status: boolean) => {
    setIsOtpVerified(status);
  };


  return (
    <Box className=" setpassword__container">
      <Grid container className="grid-layout ">
        <Grid
          container
          size={{ xs: 12, sm:6 }}
          className="grid-left "
          display={'flex'}
          justifyContent={'center'}
        >
          <Grid
            size={12}
            height={'max-content'}
            container
            marginInline={'auto'}
            className="setpassword__content"
          >
            <Grid
              height={'max-content'}
              size={12}
              justifyContent={'center'}
              display={'flex'}
              className="icon-wrapper"
            >
              <LockIcon className="lock-icon " />
            </Grid>
           {!isOtpVerified && (
            <OtpComponent onOtpVerify={handleOtpVerification}  />
          )}

          {isOtpVerified && <SetPasswordComponent />}

          </Grid>
        </Grid>
        <Grid size={{ xs: 0, md: 6 }}  className="grid-right">
          <Box className="right-image-container ">
            <Box className="image-content-text ">
              <Typography className="paragraph text-h2 font-700 ">
                Unlock the Future of Conference
              </Typography>
              <Typography className="paragraph text-h2 font-700 ">
                Management – Join Us Today!
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SetPassword;
