import { Button, Typography } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import OtpInput from 'react-otp-input';
import { Link } from "react-router-dom";
import routes from "@/router/routes";
import { useState } from "react";
import Grid from "@mui/material/Grid2";
import { LockIcon } from "@/assets/svg";

/**
 * component used to verify the otp
 */

interface OtpComponentProps {
  onOtpVerify: (status: boolean) => void; 
}

const OtpComponent: React.FC<OtpComponentProps> = ({ onOtpVerify }) => {
  type FormData = {
    otp: string;
  };
  const [otp, setOtp] = useState('');


  const { handleSubmit } = useForm<FormData>({
    defaultValues: { otp: '' }, 
  });

  /**
   * Handle to submit the Otp
   */
  const onSubmit: SubmitHandler<FormData> = () => {
    
    onOtpVerify(true); 
  };

  return (
    <Grid  className="left-content-wrapper">
      <Grid className="left-header-wrapper">
        <Grid justifyContent={'center'} display={'flex'}>
          <LockIcon />
        </Grid>
        <Typography className="header-title">Verify Your Account</Typography>
        <Typography className="header-description">
          Enter the OTP sent to +91 9876543210 <br/> abcd@gmail.com to complete the process.
        </Typography>
      </Grid>

      <Grid className="form-wrapper">
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="form">
          <Grid className="otp-input-container">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6} 
              shouldAutoFocus 
              renderInput={(props) => (
                <input
                  {...props}
                  className="otp-input"
                  onKeyDown={(e) => {
                    if (e.key !== 'Backspace' && isNaN(Number(e.key))) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
              containerStyle={{ display: 'flex', justifyContent: 'space-between' }} 
            />
          </Grid>

          <Button type="submit" variant="contained" className="w-full custom-button">
            Verify
          </Button>
        </form>
      </Grid>

      <Grid>
        <Typography className="already-have-account-link">
          Didn't receive the code?
          <span className="signup-now-text">
            <Link to={routes.LoginOrg()}> Resend OTP </Link>
          </span>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default OtpComponent;
