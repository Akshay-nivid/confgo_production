import CustomButton from "@/components/CustomButton/CustomButton";
import { Alert, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import WarningIcon from "../../assets/svg/warning.svg";
import useStore from "@/Libs/store";
import routes from "@/router/routes";
import { useNavigate } from "react-router-dom";
/**
 * PayPal alert banner component
 */
export const PayPalAlertBanner = () => {
  const setDataById = useStore((state) => state.setDataById);
  const navigate = useNavigate();

  /**
   * Handles the click event on the "Upgrade Plan" button.
   * Sets the mode to "upgrade" in the global state and navigates the user to the plan upgrade page.
   */
  const handleViewPlanDetails = () => {
    // setDataById("planMode", { mode: "upgrade" });
    navigate(routes.organizationUserProfile());
    setDataById("settings", { tabIndex: 2 });
  };

  return (
    <Grid container size={{ xs: 12, sm: 12 }} p={3} pb={0} className="payment-alert-banner">
      <Alert severity="warning" icon={<WarningIcon/>}>
        <Grid>
          <Typography className="payment-alert-banner-title">
            PayPal Client ID Missing
          </Typography>
        </Grid>
        <Grid>
          <Typography className="payment-alert-banner-sub-title">
            It looks like your PayPal Client ID is missing. Please add it to proceed with payments and start publishing your events.
          </Typography>
        </Grid>
        <Grid pt={2} pb={1}>
          <CustomButton className="payment-alert-banner-btn" label={"Add Client Id"} onClick={handleViewPlanDetails} />
        </Grid>
      </Alert>
    </Grid>
  );
};
