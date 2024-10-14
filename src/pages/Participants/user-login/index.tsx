import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import routes from '@/router/routes';
import { Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import CustomStepper from '@/components/CustomStepper/CustomStepper';

/**
 * participant user login component
 */
const UserLogin = () => {
  const formData = {
    email: '',
    password: '',
    rememberMe: false,
  };

  /**
   * react hook form instance
   */
  const { control, handleSubmit } = useForm({
    defaultValues: formData,
  });

  /**
   * function used to handle form submission
   */
  const onSubmit: SubmitHandler<typeof formData> = (data) => {
    console.log(data);
  };

  return (
    <Grid className="user-login layout" container>
      <Grid size={6} className="grid-left">
        <CustomStepper  steps={[{label:'Login', description:''},{label:'Register', description:''},{label:'Forgot Password', description:''}]} activeStep={0} onStepChange={() => {}} />
      </Grid>
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
            >
              Welcome Back
            </Typography>
            <Typography
              textAlign={'center'}
              className="header-description"
              variant="subtitle1"
            >
              Log in to manage your events and access your dashboard.
            </Typography>
          </Box>
          <Grid size={12} className="form-wrapper">
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="form">
              <CustomTextField rules={{
                required: {
                  value: true,
                  message: 'Email is required',
                },
                pattern:{
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                }
              }} control={control} name="email" label="Email" />
              <CustomTextField
                rules={{
                  required: {
                    value: true,
                    message: 'Password is required',
                  },
                }}
                control={control}
                name="password"
                label="Password"
              />
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    className="checkbox-wrapper"
                    control={<Checkbox {...field} checked={field.value} />}
                    label={
                      <Typography className="remember-me-text">
                        Remember me
                      </Typography>
                    }
                  />
                )}
              />
              <CustomButton
                type="submit"
                className="login-button"
                size="large"
                label="Login"
              />
            </form>
          </Grid>
          <Box>
            <Typography className="dont-have-account-text" textAlign={'center'}>
              Don't have an account?{' '}
              <span>
                <Link to={routes.userRegister()}>Sign Up Now</Link>
              </span>{' '}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserLogin;
