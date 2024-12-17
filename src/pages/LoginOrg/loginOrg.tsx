import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import routes from "@/router/routes";
import useStore, { POST } from "@/Libs/store";
import apiClient from "@/Libs/Https/API-client";
import { SignUpFlowIcon } from "@/assets/svg";
import { useIsMobileScreen } from "@/Utils/CommonBaseClass";


/**
 * ApiResponse from
 * url: 'auth/login'
 */
export interface ApiResponse {
  status: string;
  data: {
    token: string;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    lastLogin: string;
    userRole: {
      id: number;
      roleName: string;
    };
    subscriptionStatus: string;
    acceptedTerms:number;
    companyId: any;
    phone: string;
  };
}

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
  const setDataById = useStore((state: any) => state.setDataById);
  const { handleSubmit, control } = useForm<FormData>();
  const navigate = useNavigate();

  const isMobileScreen = useIsMobileScreen()

  /**
   * function used to handle form submission
   */
    const handleClickForgetPassword=()=>{
      navigate(routes.organisationForgotPassword())
      }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    LoginOrg(data);
  };

  /**
 * Handles the login functionality for the organization.
 * @param loginFields - Form data containing the username (email) and password.
 */
  const LoginOrg = async (loginFields: FormData) => {
    const { email: username, password } = loginFields;

    // Prepare the request body
    const body = { username, password };

    try {
      // Send the login request
       POST({
        url: 'auth/login',
        body,
        id: 'orgLogin',
        successCB: (response) => {
          handleLoginSuccess(response?.data);
        },
        errorCB: (error) => {
          handleLoginError(error);
        }
      });
      // Handle success response
    } catch (error: any) {
      // Handle error response
      handleLoginError(error);
    }
  };

  /**
   * Processes the successful login response.
   * @param data - The response data from the API.
   */
  const handleLoginSuccess = async (data: ApiResponse['data']) => {
    const { userRole, token, firstName, lastName, subscriptionStatus, companyId, email, phone,acceptedTerms,id } = data;

    // Clear previous session data
    sessionStorage.clear();

    // Store common session information
    sessionStorage.setItem('isUserLoggedIn', 'true');
    sessionStorage.setItem('userLoggedInType', userRole?.roleName);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('ssoUser', 'false');
    // Set organization-specific details in global state
    setDataById('orgDetails', { loggedIn: true });

    // Set the authentication token for API client
    apiClient.setToken(token);



    // Check if the user is of type "COMPANY"
    if (userRole?.roleName === "COMPANY") {
      // Store specific session details for company users'
      sessionStorage.setItem('companyUserName', `${firstName} ${lastName || ''}`);
      sessionStorage.setItem('subscriptionStatus', subscriptionStatus);
      sessionStorage.setItem('userId',id?.toString());
      sessionStorage.setItem('acceptedTerms',acceptedTerms.toString());
      sessionStorage.setItem('companyId', companyId);
      sessionStorage.setItem('companyEmail', email);
      sessionStorage.setItem('companyPhone', phone);
          // Show success notification
    setDataById("snackBarInfo", {
      open: true,
      autoHideDuration: 2000,
      severity: "success",
      message: "Login successful",
    });
      // Redirect to the company dashboard
      navigate(routes.dashboard());
    } else if(userRole?.roleName === "USER"){
      sessionStorage.setItem('isUserLoggedIn', 'false'); 
      //Redirect to user login
      navigate(routes.userLogin());
    } else {
      sessionStorage.setItem('isUserLoggedIn', 'false'); 
    setDataById("snackBarInfo", {
      open: true,
      autoHideDuration: 2000,
      severity: "error",
      message: "Invalid username or password",
    });
    }
  };

  /**
   * Processes the login error and displays an appropriate notification.
   * @param error - The error object returned from the API.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLoginError = (error: any) => {
    // Extract the error message or use a fallback message
    const errorMessage = error?.message || "An error occurred during login";

    // Display error notification
    setDataById("snackBarInfo", {
      open: true,
      autoHideDuration: 2000,
      severity: "error",
      message: errorMessage,
    });
  };

  return (
    <Box className="login-org-main-container">
      <Grid container className="grid-layout">
        <Grid size={{ xs: 12, sm: 7 }} className="grid-left">
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
                    placeholder="Email Address"
                  />
                  <CustomTextField
                    name="password"
                    label={"Password"}
                    type="password"
                    placeholder="Password"
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
                  now
                </Typography>
                <Box className="" onClick={handleClickForgetPassword}>
                  <Grid container size={12} className="forgot-password-link">Forgot Password?</Grid>{" "}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
       {isMobileScreen ? <></>: <Grid container size={{ xs: 12, md: 5 }} className="grid-right">
          <SignUpFlowIcon />
        </Grid>}
      </Grid>
    </Box>
  );
};

export default LoginOrg;
