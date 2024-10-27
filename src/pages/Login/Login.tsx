import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import routes from "@/router/routes";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";

/**
 * Component used to login company
 *
 */
const Login = () => {
  type FormData = {
    isRemember: boolean;
    email: string;
    password: string;
  };

  const { handleSubmit, control } = useForm<FormData>();

  /**
   * function used to handle form submission
   */

  const onSubmit: SubmitHandler<FormData> = () => {};

  return (
    <Box className="login-main-container">
      <Grid container className="grid-layout">
        <Grid size={{ xs: 12, sm: 6 }} className="grid-left">
          <Box className="left-image-container"></Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} className="grid-right">
          <Box height={"100%"} className="right-content-wrapper">
            <Box className="right-header-wrapper">
              <Typography className="header-title">Welcome Back!</Typography>
              <Typography className="header-description">
                Log in to manage your events and access your dashboard.
              </Typography>
            </Box>
            <Box className="form-wrapper">
              <form
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className="form"
              >
                <CustomTextField
                  control={control}
                  name="email"
                  label={"Email Address"}
                  placeholder={"Email Address"}
                  type="email"
                />
                <CustomTextField
                  name="password"
                  label={"Password"}
                  type="password"
                  control={control}
                  placeholder={"Password"}
                />

                <CustomCheckbox
                  control={control}
                  name="isRemember"
                  label="Remember Me"
                />
                <Button type="submit" variant="contained" className="w-full ">
                  Submit
                </Button>
              </form>
              <Link className="" to={routes.login()}>
                <div className=" forgot-password-link">Forgot Password?</div>{" "}
              </Link>
            </Box>

            <Box>
              <Typography className="already-have-account-link">
                Don’t have an account?
                <span className="signup-now-text">
                  {" "}
                  <Link to={routes.register()}>Sign Up Now</Link>{" "}
                </span>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
