import { Button, Typography } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import routes from "@/router/routes";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import { useEffect } from "react";
import Grid from "@mui/material/Grid2";

/**
 * Component use to set password
 * @returns
 */

const SetPasswordComponent = () => {
  type FormData = {
    isLengthCheck: boolean;
    isSpecialChar: boolean;
    confirmPassword: string;
    password: string;
  };

  const { handleSubmit, control, watch, setValue } = useForm<FormData>({
    defaultValues: {
      isLengthCheck: false,
      isSpecialChar: false,
      password: '',
      confirmPassword: '',
    },
  });

  // Watch password and confirmPassword fields
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Regex for special character validation
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  useEffect(() => {
    // Check if password meets the length requirement
    setValue("isLengthCheck",password.length >= 8);

    // Check if password contains a special character
    setValue("isSpecialChar", specialCharRegex.test(password));

  }, [password, confirmPassword, setValue]);

  /**
   * function used to handle form submission
   */
  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Handle password submission logic here
    console.log("Form Submitted", data);
  };

  return (
          <Grid height={"100%"} className="left-content-wrapper">
            <Grid className="left-header-wrapper">
              <Typography className="header-title">Set Password</Typography>
              <Typography className="header-description">Your new password must be different to</Typography>
              <Typography className="header-description">previously used passwords.</Typography>
            </Grid>
            <Grid className="form-wrapper">
              <form noValidate onSubmit={handleSubmit(onSubmit)} className="form">
                <CustomTextField
                  control={control}
                  name="password"
                  label={"Password"}
                  type="password"
                />
                <CustomTextField
                  name="confirmPassword"
                  label={"Confirm Password"}
                  type="password"
                  control={control}
                  rules={{
                    required: 'Confirm Password is required',
                    validate: (value) => value === password || 'Passwords do not match',
                  }}
                />
                <CustomCheckbox
                    control={control}
                    name="isLengthCheck"
                    label="Must be at least 8 characters"
                    disabled
                />
                <CustomCheckbox
                    control={control}
                    name="isSpecialChar"
                    label="Must contain one special character"
                    disabled
                />
                <Button type="submit" variant="contained" className="w-full custom-button">
                  Set Password
                </Button>
              </form>
            </Grid>
            <Grid>
              <Typography className="already-have-account-link">
                <span className="signup-now-text">
                  <Link to={routes.LoginOrg()}> Back to Login </Link>
                </span>
              </Typography>
            </Grid>
          </Grid>
       
  );
};

export default SetPasswordComponent;
