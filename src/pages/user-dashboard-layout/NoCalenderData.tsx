import {  ViewEventButtonBlue } from '@/assets/svg';
import CustomButton from '@/components/CustomButton/CustomButton';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from "react";
import { useNavigate } from 'react-router-dom';

/**
 * No calendar data 
 * @author Neethu
 */
const NoCalenderData: React.FC = React.memo(() => {
  const navigate = useNavigate();

  return (
    <Grid size={{ xs: 12 }} className="dashboard-nocalendar" >
      <Typography className="dashboard-nocalendar-title">
        Your Dashboard is <br/> Ready and Waiting <br/> to Display<br/> Upcoming Events <br/>and Details
      </Typography>
      <Grid size={12} >
        <Typography className="dashboard-nocalendar-subtitle">
        Check back soon for the latest<br/> updates right here
        </Typography>
      </Grid>
      <Grid size={12}>
        <CustomButton
          svgIcon={ViewEventButtonBlue}
          className="nocalendar-card-view-event-button"
          label="View Events"
          onClick={() => navigate('/user/my-event')}
        />
      </Grid>

    </Grid>

  )
});

export default NoCalenderData;