/**
 * Component displays the warning banner in the top bar
 */
import CustomButton from "@/components/CustomButton/CustomButton";
import { Alert, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import WarningIcon from "../../assets/svg/warning.svg"
import useStore from "@/Libs/store";
import routes from "@/router/routes";
import { useNavigate } from "react-router-dom";


export const PaymentAlertBanner = () => {

  const setDataById = useStore((state) => state.setDataById);
  const navigate = useNavigate();

    /**
   * Handles the click event on the "Upgrade Plan" button.
   * Sets the mode to "upgrade" in the global state and navigates the user to the plan upgrade page.
   */
    const handleViewPlanDetails=()=>{
      setDataById("planMode", { mode: "upgrade" });
      navigate(routes.planUpgrade())
    }   
    return(
        <Grid container size={{ xs: 12, sm: 12 }} p={3} pb={0} className="payment-alert-banner">
            <Alert severity="warning" icon={<WarningIcon style={{ width: 22, height: 22, marginTop:4 }} />} >
                <Grid>
                
                <Typography className="payment-alert-banner-title">
                    No payment done yet
                </Typography>
                </Grid>
                <Grid>
                <Typography className="payment-alert-banner-sub-title">
                    Your account is almost ready!. Complete payment to start publishing your events.
                </Typography>
                </Grid>
                <Grid pt={2} pb={1}><CustomButton className="payment-alert-banner-btn" label={"Upgrade Plan"} onClick={handleViewPlanDetails}/></Grid>            </Alert>
        </Grid>
    )
}