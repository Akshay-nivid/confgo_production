import {  Box, Button, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import Grid from '@mui/material/Grid2';
import CheckIcon from '@mui/icons-material/Check';
import clsx from 'clsx';
/**
 * Component use to set password
 * @returns
 */

const SetPasswordComponent = () => {
  type FormData = {
    confirmPassword: string;
    password: string;
  };

  const { handleSubmit,control,watch } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');


  // Regex for special character validation
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;


  /**
   * function used to handle form submission
   */
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('Form Submitted', data);
  };

  return (
    <Grid container size={12} className="setpassword">
      <Grid size={12} className="setpassword__header-wrapper">
        <Typography textAlign={'center'} className="setpassword__header-title text-h4 font-600">
          Set Password
        </Typography>
        <Typography
          textAlign={'center'}
          className="setpassword__header-description text-p2 font-400"
        >
          Your new password must be different to <br /> previously used
          passwords.
        </Typography>
      </Grid>
      <Grid size={12} className="setpassword__form-wrapper">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="setpassword__form"
        >
          <Box className="setpassword__input-container">
            <Typography className="setpassword__input-label text-p2 font-500">
              Password
            </Typography>
            <CustomTextField
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: specialCharRegex,
                  message: 'Password must contain one special character',
                },
              }}
              type="password"
              placeholder="Password"
              className="setpassword__input"
            />
          </Box>
          <Box className="setpassword__input-container">
            <Typography className="setpassword__input-label text-p2 font-500">
              Confirm Password
            </Typography>
            <CustomTextField
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              control={control}
              rules={{
                required: 'Confirm Password is required',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              }}
              className="setpassword__input"
            />
          </Box>

          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={'1rem'}
            marginBottom={'1rem'}
            className="setpassword__requirements"
          >
            <Box display={'flex'} gap={1} alignItems={'center'} className="setpassword__requirement">
              <CheckIcon className={clsx("setpassword__check-icon", {
                'active': password.length >= 8,
              })} />
              <Typography className="setpassword__requirement-text text-p2 font-400">Must be at least 8 characters long</Typography>
            </Box>
            <Box display={'flex'} gap={1} alignItems={'center'} className="setpassword__requirement">
              <CheckIcon className={clsx("setpassword__check-icon ", {
                'active': specialCharRegex.test(password),
              })} />
              <Typography className="setpassword__requirement-text text-p2 font-400">Must contain one special character</Typography>
            </Box>
          </Box>
          <Button
            type="submit"
            variant="contained"
            className="setpassword__submit-button w-full custom-button text-p1 font-600"
          >
            Set Password
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default SetPasswordComponent;
