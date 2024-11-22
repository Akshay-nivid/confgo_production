
import React from "react";
import Grid from '@mui/material/Grid2';
import { Typography } from "@mui/material";
import noimg from "./../../assets/png/Group.png";
import CustomButton from "@/components/CustomButton/CustomButton";
import { useNavigate } from 'react-router-dom';

/**
 * Reusable no events card
 * @author Neethu
 */
const NoDataCard: React.FC = React.memo(() => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      className="no-records-container"
      size={12}
    >
      <Grid container>
      <Grid container size={7}>
        <Grid size={12}>
          <Typography className="dashboard-left-profile-accounttitle" variant="body1">No Attended Events</Typography>
          <Typography  className="no-records-subtitle">
            It looks like you haven’t registered for any upcoming events. Don’t miss out on exciting opportunities!
          </Typography>
        </Grid>
        <Grid size={12}>
        <CustomButton
          className="dashboard-left-profile-viewbutton"
          label="View Events"
          onClick={() => navigate('/user/my-event')}
        />
      </Grid>
      </Grid>
      <Grid size={2} >
        <img src={noimg} className="no-records-image" alt="No records found" />
      </Grid>
      </Grid>
    
    </Grid>
  );

});

export default NoDataCard;
