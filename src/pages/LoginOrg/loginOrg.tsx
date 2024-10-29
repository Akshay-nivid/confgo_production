import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import routes from "@/router/routes";
import apiClient from "@/Libs/Https/API-client";
import useStore from "@/Libs/store";
import { processAPIResponse } from "@/Utils/CommonBaseClass";

/**
 * Component used to login an org
 *
 */
const LoginOrg = () => {
  type FormData = {
    isRemember: boolean;
    email: string;
    password: string;
  };
  const { setDataById }: any = useStore();
  const { handleSubmit, control } = useForm<FormData>();
  const navigate = useNavigate();
  /**
   * function used to handle form submission
   */

  const onSubmit: SubmitHandler<FormData> = (data) => {
    LoginOrg(data);
  };
  /**
   * function used to login an organization
   */
  const LoginOrg = async (loginFields: FormData) => {
    try {
      const requestBody = {
        username: loginFields.email,
        password: loginFields.password,
      };
      const response = await apiClient.post("auth/login", requestBody);
      const { status, data, message } = await processAPIResponse(
        response,
        "orgLogin"
      );
      if (status) {
        sessionStorage.setItem("token", data?.token);
        apiClient.setToken(data?.token);
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "success",
          message: message,
        });
        navigate(routes.dashboard());
      } else {
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "error",
          message: message,
        });
      }
    } catch (error: any) {
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: error.toString(),
      });
    }
  };
  return (
    <Box className="login-org-main-container">
      <Grid container className="grid-layout">
        <Grid size={{ xs: 12, sm: 6 }} className="grid-left">
          <Grid className="left-content-wrapper">
            <Grid className="left-inner-content">
              <Grid className="left-header-wrapper">
                <Typography className="header-title">Welcome Back!</Typography>
                <Typography className="header-description">
                  Access your dashboard and stay on top of your conferences.
                </Typography>
              </Grid>
              <Grid className="form-wrapper">
                <form
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                  className="form"
                >
                  <CustomTextField
                    control={control}
                    name="email"
                    label={"Email Address"}
                    type="email"
                  />
                  <CustomTextField
                    name="password"
                    label={"Password"}
                    type="password"
                    control={control}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    className="w-full custom-button"
                    style={{ textTransform: "none" }}
                  >
                    Log In
                  </Button>
                </form>
              </Grid>

              <Grid className="account-link">
                <Typography className="already-have-account-link">
                  Don’t have an account?
                  <span className="signup-now-text">
                    {""}
                    <Link to={routes.register()}> Sign Up </Link>{" "}
                  </span>
                  Now
                </Typography>
                <Link className="" to={routes.login()}>
                  <div className="forgot-password-link">Forgot Password?</div>{" "}
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} className="grid-right">
          <Box className="right-image-container">
            <Typography className="image-content-text">
              <Typography className="paragraph">
                {" "}
                Unlock the Future of Conference{" "}
              </Typography>
              <Typography className="paragraph">
                {" "}
                Management – Join Us Today!{" "}
              </Typography>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginOrg;
