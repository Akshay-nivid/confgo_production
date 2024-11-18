import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import useStore from "@/Libs/store";
import AddPlan from "./AddPlan";
import CreateAccount from "./CreateAccount";
import AddOrganization from "./AddOrganization";
import PaymentMethod from "./PaymentMethod";
import RegistrationSuccess from "./RegistrationSuccess";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
import { StepperBoxes } from "./StepperBox";
import { useEffect } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
/*
 * Component used to register company for scheduling meting,metups etc
 */
const Register = () => {

  const pageSwitch =
    useStore((state: any) => state?.compData?.["register"]) ?? [];
  const navigate = useNavigate();
  const setDataById = useStore((state: any) => state.setDataById)

  /*
  * function to handle navigate to login page
  */
  const handleLogin = () => {
    navigate(routes.loginOrg())
  }
  /*
  * function to skip payment and navigate to success page 
  */    
  const handleSkipNavigation=()=>{
    setDataById('register', { data: 'REGISTRATION_SUCCESS_PAGE',paymentStatus:false });
  }
  useEffect(()=>{
    // clearDataById('register');
    // clearDataById('form1');
    // clearDataById('form2');
    // clearDataById('form3');
  },[])
  /*
  *function  handle all registration compoents back button
  */
  const handleBack = () => {
    switch (pageSwitch.data) {
      case 'PLAN_PAGE':
        navigate(routes.home());
        break;

      case 'CREATE_ACCOUNT_PAGE':
        setDataById('register', { data: 'PLAN_PAGE', step: 1 });
        break;

      case 'ADD_ORGANIZATION_PAGE':
        setDataById('register', { data: 'CREATE_ACCOUNT_PAGE', step: 2 });
        break;

      case 'PAYMENT_METHOD_PAGE':
        setDataById('register', { data: 'ADD_ORGANIZATION_PAGE', step: 3 });
        break;

      default:
        setDataById('register', { data: 'PLAN_PAGE', step: 1 });
        break;
    }
  };
  return (
    <Grid container className="register-main-container">
      <Grid container justifyContent={'space-between'} direction={'column'} className="grid-left" size={{ xs: 12, sm: 6 }} >
        {(pageSwitch.data === "CREATE_ACCOUNT_PAGE" || pageSwitch.data == "ADD_ORGANIZATION_PAGE" || pageSwitch.data === "PLAN_PAGE" )  && <Grid container alignItems={"center"} display={"flex"} className="back-button" onClick={handleBack} >
          <ArrowBackIcon />
          <Typography variant="h6">Back</Typography>
        </Grid>}
        {pageSwitch.data === "PAYMENT_METHOD_PAGE" &&
              <Grid alignItems={"center"} display={"flex"} className="cursor-container skip-button-payment-page" onClick={handleSkipNavigation}>
                    <Typography variant="h6">Skip</Typography>
              <ArrowForwardIcon/>
        </Grid>}
        <Grid container justifyContent={'center'}>
          {pageSwitch == "" && <AddPlan />}
          {pageSwitch.data == "PLAN_PAGE" && <AddPlan />}
          {pageSwitch.data == "CREATE_ACCOUNT_PAGE" && <CreateAccount />}
          {pageSwitch.data == "ADD_ORGANIZATION_PAGE" && <AddOrganization />}
          {pageSwitch.data === "PAYMENT_METHOD_PAGE" && <PaymentMethod />}
          {pageSwitch.data === "REGISTRATION_SUCCESS_PAGE" && <RegistrationSuccess />}
        </Grid>
        {pageSwitch.data !== "REGISTRATION_SUCCESS_PAGE" && <Grid container direction={'column'} className="register-stepper" spacing={3}>
          <Grid container spacing={1} justifyContent={"center"} display={"flex"}>
            <Typography variant="h6">Already have an account?</Typography>
            <Grid onClick={handleLogin}>
              <Typography variant="h6" className="login-label cursor-container" alignContent="flex-end"> Log In</Typography>
            </Grid>
          </Grid>
          <Grid container justifyContent={"center"}>
            <StepperBoxes activeStep={pageSwitch?.step} />
          </Grid>
        </Grid>}
      </Grid>
      <Grid container size={{ xs: 12, md: 6 }} className="grid-right"></Grid>
    </Grid>
  );
};

export default Register;
