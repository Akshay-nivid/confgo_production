/**
 * Component displays the warning banner in the top bar
 */
import CustomButton from "@/components/CustomButton/CustomButton";
import { Alert, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";


export const PaymentAlertBanner = () => {

    
    return(
        <Grid container size={{ xs: 12, sm: 12 }} p={3} pb={0} className="payment-alert-banner">
            <Alert severity="warning">
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
                <Grid pt={2} pb={1}><CustomButton className="payment-alert-banner-btn" label={"Upgrade Plan"}/></Grid>
            </Alert>
        </Grid>
    )
}