import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {  useState } from 'react';
import SetPasswordComponent from './PasswordFormComponent';
import OtpComponent from './OtpFormComponent';
import { LockIcon, SignUpFlowIcon } from '@/assets/svg';
import { useIsMobileScreen } from '@/Utils/CommonBaseClass';


/**
 * ui component of set password page
 * @returns
 */

const SetPassword = () => {
  const [isOtpVerified, setIsOtpVerified] = useState(true);

  const isMobileScreen = useIsMobileScreen();

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
          size={{ xs: 12, sm:7 }}
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
        {!isMobileScreen && (
          <Grid container size={{ xs: 0, md: 5 }} className="grid-right">
          <SignUpFlowIcon />
        </Grid>
        )}

      </Grid>
    </Box>
  );
};

export default SetPassword;
