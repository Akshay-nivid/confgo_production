/**
 * Component displays the welcome card in the dashboard
 */
import Grid from "@mui/material/Grid2";
import WelcomeIcon from '@/assets/svg/welcome-icon.svg';
import CustomButton from "@/components/CustomButton/CustomButton";


export const WelcomeCard = () => {

    return(
        <Grid container size={{ xs: 12, sm: 12 }}>
            <Grid size={{ xs: 2, sm: 2 }}><WelcomeIcon /></Grid>
            <Grid size={{ xs: 10, sm: 10 }} container>
                <Grid size={{ xs: 12, sm: 12 }} className="dashboard-welcome-card-title">Welcome, Richard Wood!</Grid>
                <Grid size={{ xs: 12, sm: 12 }} className="dashboard-welcome-card-sub-title">Ready to manage your events? Let's get started.</Grid>
                <Grid size={{ xs: 12, sm: 12 }} container>
                    <Grid><CustomButton
                        className="dashboard-welcome-card-create-button"
                        label="Create New Event"
                    /></Grid>
                    <Grid><CustomButton
                        className="dashboard-welcome-card-manage-button"
                        label="Manage Events"
                    /></Grid>
                </Grid>
            </Grid>

        </Grid>
    )
}