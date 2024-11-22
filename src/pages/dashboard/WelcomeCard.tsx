/**
 * Component displays the welcome card in the dashboard
 */
import Grid from "@mui/material/Grid2";
import WelcomeIcon from '@/assets/svg/welcome-icon.svg';
import CustomButton from "@/components/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";


export const WelcomeCard = () => {

    const companyUserName = sessionStorage.getItem("companyUserName");
    const navigate = useNavigate();

    return(
        <Grid container size={{ xs: 12, sm: 12 }}>
            <Grid size={{ xs: 2, sm: 2 }}><WelcomeIcon /></Grid>
            <Grid size={{ xs: 10, sm: 10 }} container>
                <Grid size={{ xs: 12, sm: 12 }} className="dashboard-welcome-card-title">{`Welcome, ${companyUserName || ''}!`}</Grid>
                <Grid size={{ xs: 12, sm: 12 }} className="dashboard-welcome-card-sub-title">Ready to manage your events? Let's get started.</Grid>
                <Grid size={{ xs: 12, sm: 12 }} container>
                    <Grid size={6}><CustomButton
                        className="dashboard-welcome-card-create-button"
                        label="Create New Event"
                        onClick={() => navigate('/events/create')}
                    /></Grid>
                    <Grid size={6}><CustomButton
                        className="dashboard-welcome-card-manage-button"
                        label="Manage Events"
                        onClick={() => navigate('/events')}
                    /></Grid>
                </Grid>
            </Grid>

        </Grid>
    )
}