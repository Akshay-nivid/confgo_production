import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import useStore from "@/Libs/store";
import AddPlan from "./AddPlan";
import CreateAccount from "./CreateAccount";
import AddOrganization from "./AddOrganization";
import PaymentMethod from "./PaymentMethod";
import RegistrationSuccess from "./RegistrationSuccess";

/*
 * Component used to register company for scheduling meting,metups etc
 */
const Register = () => {
  const pageSwitch =
    useStore((state: any) => state?.compData?.["register"]) ?? [];
  return (
    <Box className="register-main-container">
      <Grid container className="grid-layout">
        <Grid size={{ xs: 12, sm: 6 }} className="grid-left">
          {pageSwitch == "" && <AddPlan />}
          {pageSwitch.data == "one" && <AddPlan />}
          {pageSwitch.data == "two" && <CreateAccount />}
          {pageSwitch.data == "three" && <AddOrganization />}
          {pageSwitch.data === "four" && <PaymentMethod />}
          {pageSwitch.data === "five" && <RegistrationSuccess />}
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }} className="grid-right">
          <Box height={"100%"} className="right-content-wrapper"></Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
