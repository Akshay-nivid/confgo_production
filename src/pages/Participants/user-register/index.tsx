import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import routes from '@/router/routes';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateRequiredField,
} from '@/Utils/validation-schema';
import { Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { SubmitHandler, useForm } from 'react-hook-form';
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
      <Grid size={12} className=" content-wrapper">
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
                required:validateRequiredField({})
              }}
              control={control}
              name="firstName"
              label="First Name"
              placeholder=" First Name"
            />
            <CustomTextField
              placeholder="Email Address"
              rules={{
                required: validateRequiredField({}),
                pattern: validateEmail({}),
              }}
              control={control}
              name="email"
              label="Email Address"
            />
            <CustomTextField
              placeholder="Password"
              rules={{
                required: validateRequiredField({}),
                pattern: validatePassword({}),
              }}
              control={control}
              name="password"
              label="Password"
              type="password"
            />
            <CustomTextField
              placeholder="Confirm Password"
              rules={{
                required: validateRequiredField({}),
                validate: (value) =>
                  validateConfirmPassword({ confirmPassword: value, password }),
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
  );
};

export default UserRegister;
