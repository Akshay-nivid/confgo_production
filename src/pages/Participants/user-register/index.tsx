import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import routes from '@/router/routes';
import { Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {  SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';



/**
 * participant user register component
 */
const UserRegister = () => {
  const formData = {
    email: '',
    firstName: '',
    password: '',
    confirmPassword: '',
  };

  /**
   * react hook form instance
   */
  const { control, handleSubmit, watch } = useForm({
    defaultValues: formData,
  });

  /**
   * function used to handle form submission
   */
  const onSubmit: SubmitHandler<typeof formData> = (data) => {
    console.log(data);
  };

  const password = watch('password');

  return (
    <Grid className="user-register layout h-screen" container>
      <Grid size={6} className="grid-left"></Grid>
      <Grid
        container
        size={6}
        className="grid-right  flex justify-center items-center"
      >
        <Grid size={12} className=" right-content-wrapper">
          <Box className=" header-content-wrapper">
            <Typography
              textAlign={'center'}
              className="header-title"
              variant="h4"
            >
              Get Started with Us!
            </Typography>
            <Typography
              textAlign={'center'}
              className="header-description"
              variant="subtitle1"
            >
              Create your account and take the first step towards seamless event
              management.
            </Typography>
          </Box>
          <Grid size={12} className="form-wrapper">
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="form">
              <CustomTextField
                rules={{
                  required: {
                    value: true,
                    message: 'First Name is required',
                  },
                }}
                control={control}
                name="firstName"
                label="First Name"
              />
              <CustomTextField
                rules={{
                  required: {
                    value: true,
                    message: 'Email is required',
                  },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                }}
                control={control}
                name="email"
                label="Email Address"
              />
              <CustomTextField
                rules={{
                  required: {
                    value: true,
                    message: 'Password is required',
                  },
                  pattern: {
                    value: /[!@#$%^&*(),.?":{}|<>]/,
                    message:
                      'Password must contain at least 8 characters and 1 special character',
                  },
                }}
                control={control}
                name="password"
                label="Password"
                type="password"
              />
              <CustomTextField
                rules={{
                  required: {
                    value: true,
                    message: 'Confirm Password is required',
                  },
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                }}
                control={control}
                name="confirmPassword"
                type="password"
                label="Confirm Password"
              />
              <CustomButton
                type="submit"
                className="login-button"
                size="large"
                label="Create Account"
              />
            </form>
          </Grid>

          <Box>
            <Typography
              className="already-have-account-text"
              textAlign={'center'}
            >
              Already have an account?{' '}
              <span>
                <Link to={routes.userLogin()}>Sign In Now</Link>
              </span>{' '}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserRegister;
