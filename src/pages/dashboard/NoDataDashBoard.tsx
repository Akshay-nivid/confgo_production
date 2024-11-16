import { DashBoardEmpty } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
const NoDataDashBoard = () => {
    const navigate = useNavigate();
    const companyUserName = sessionStorage.getItem("companyUserName");
    return (
        <Grid className="dashboard-empty" container spacing={2} justifyContent={"center"} alignContent={"center"} alignItems={"center"} >
            <Grid container>
                <Typography className="dashboard-empty-header"> Welcome {companyUserName}</Typography>
            </Grid>
            <Grid container size={12} justifyContent={"center"}>
                <Typography textAlign={"center"} className="dashboard-empty-sub-header">Ready to manage your events? Let’s get started.</Typography>
            </Grid>
            <Grid size={12} container justifyContent={"center"}>
                <DashBoardEmpty width={500} height={300} />
            </Grid>
            <Grid container size={12} justifyContent={"center"}>
                <Typography className="dashboard-empty-header"> No Events Found </Typography>
            </Grid>
            <Grid container size={6} justifyContent={"center"}>
                <Typography textAlign={"center"} className="dashboard-empty-sub-header">  It looks like you haven't created any events yet.Start by setting up your first conference or meeting.</Typography>
            </Grid>
            <Grid container size={12} justifyContent={"center"}>
                <CustomButton
                    className="dashboard-empty-btn"
                    startIcon={<AddIcon />}
                    label="Create New Event" 
                    onClick={()=>navigate(routes.createEvent())}
                    />
            </Grid>

        </Grid>
    )


}

export default NoDataDashBoard;