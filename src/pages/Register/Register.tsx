import { Box, Typography } from "@mui/material";
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
/*
 * Component used to register company for scheduling meting,metups etc
 */
const Register = () => {
  const pageSwitch =
    useStore((state: any) => state?.compData?.["register"]) ?? [];
    const navigate = useNavigate();
    const { setDataById }: any = useStore();
    
/*
 *function  handle all registration compoents back button
 */  
  const handleBack = () => {
    switch (pageSwitch.data) {
      case 'PLAN_PAGE':
        navigate(routes.home());
        break;

      case 'CREATE_ACCOUNT_PAGE':
        setDataById('register', { data: 'PLAN_PAGE' });
        break;

      case 'ADD_ORGANIZATION_PAGE':
        setDataById('register', { data: 'CREATE_ACCOUNT_PAGE' });
        break;

      case 'PAYMENT_METHOD_PAGE':
        setDataById('register', { data: 'ADD_ORGANIZATION_PAGE' });
        break;

      default:
        setDataById('register', { data: 'PLAN_PAGE' });
        break;
    }
  };
        
  return (
    <Box className="register-main-container">
      <Grid container className="grid-layout">
        
        <Grid size={{ xs: 12, sm: 6 }} >
        <Grid justifyContent={"center"} alignItems={"center"} display={"flex"} className="cursor-container back-button" size={{ xs: 2 }} onClick={handleBack} >
          <ArrowBackIcon />
          <Typography variant="h6">Back</Typography>
        </Grid>
        <Grid className="grid-left">
        {pageSwitch == "" && <AddPlan />}
          {pageSwitch.data == "PLAN_PAGE" && <AddPlan />}
          {pageSwitch.data == "CREATE_ACCOUNT_PAGE" && <CreateAccount />}
          {pageSwitch.data == "ADD_ORGANIZATION_PAGE" && <AddOrganization />}
          {pageSwitch.data === "PAYMENT_METHOD_PAGE" && <PaymentMethod />}
          {pageSwitch.data === "REGISTRATION_SUCCESS_PAGE" && <RegistrationSuccess />}
        </Grid>
          
        </Grid>

        <Grid size={{ xs: 0,md:6 }} className="grid-right">
          <Box height={"100%"} className="right-content-wrapper"></Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
