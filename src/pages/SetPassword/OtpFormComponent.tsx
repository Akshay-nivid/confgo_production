import { Button, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import OtpInput from 'react-otp-input';
import Grid from '@mui/material/Grid2';
import { Controller } from 'react-hook-form';
import { validateMinLength, validateRequiredField } from '@/Utils/Validation';

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

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { otp: '' },
  });

  /**
   * otp form submit handler
   */

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    onOtpVerify(true);
  };

  return (
    <Grid size={12} container className="otpcomponent__content-wrapper">
      <Grid size={12} className="otpcomponent__header-wrapper">
        <Typography textAlign={'center'} className="otpcomponent__header-title">
          Verify Your Account
        </Typography>
        <Typography
          textAlign={'center'}
          className="otpcomponent__header-description "
        >
          Enter the OTP sent to +91 9876543210 <br /> abcd@gmail.com to complete
          the process.
        </Typography>
      </Grid>
      <Grid size={12} className="otpcomponent__form-wrapper">
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="form">
          <Grid className="otpcomponent__otp-input-container">
            <Controller
              name="otp"
              control={control}
              rules={{
                required: validateRequiredField({ fieldName: 'OTP' }),
                minLength: validateMinLength({
                  message: 'Invalid OTP',
                  minLength: 6,
                }),
              }}
              render={({ field }) => (
                <OtpInput
                  value={field.value}
                  onChange={field.onChange}
                  numInputs={6}
                  shouldAutoFocus
                  renderInput={(props) => (
                    <input
                      {...field}
                      {...props}
                      className="otpcomponent__otp-input-container-otp-input"
                      onKeyDown={(e) => {
                        if (e.key !== 'Backspace' && isNaN(Number(e.key))) {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}
                  containerStyle={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                />
              )}
            />

            {errors.otp?.message && (
              <Typography className="otpcomponent__error-text">
                {errors.otp.message}
              </Typography>
            )}
          </Grid>

          <Button
            type="submit"
            variant="contained"
            className="w-full custom-button"
          >
            Verify
          </Button>
        </form>
      </Grid>
      <Grid
        display={'flex'}
        justifyContent={'center'}
        size={12}
        className="otpcomponent__already-have-account-link-wrapper"
      >
        <Typography
          textAlign={'center'}
          className="otpcomponent__already-have-account-text"
        >
          Didn't receive the code?
          <span onClick={() => {}} className="otpcomponent__signup-now-text">
             Resend OTP 
          </span>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default OtpComponent;
