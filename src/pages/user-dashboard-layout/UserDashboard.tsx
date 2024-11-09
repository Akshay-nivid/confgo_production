
import Grid from '@mui/material/Grid2';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import DashboardCardItem from './DashboardCardItem';
import { CalendarEventIcon, DownloadEventIcon, HeartEventIcon, PaymentDashboardIcon } from '@/assets/svg';
import React from 'react';

/**
 * Used to render user dashboard 
 * @author Neethu 
 */
const UserDashboard: React.FC = React.memo(() => {
  const navigate = useNavigate();

  /**
  * Useeffect hook handles the api call 
  */
  useEffect(() => {

  }, [])



  return (
    <Grid container size={12} className="dashboard" spacing={2}>

      <Grid size={{ xs: 12, md: 7 }} container className="dashboard-left" >
        <Grid size={12}>
          <Typography className="dashboard-title" gutterBottom>
            <span className="dashboard-title-wave-icon"></span>
            <span className="greeting-text">Hey Andrew!</span>
          </Typography>
        </Grid>
        <Grid size={12}>
          <Typography className="dashboard-subtitle" gutterBottom>
            Your hub for all events and registrations
          </Typography>
        </Grid>

        <Grid container className="dashboard-tight-spacing" size={12} spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }} >
            <DashboardCardItem onClick={() => navigate("/coupon")} icon={CalendarEventIcon} title="Upcoming Events" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DashboardCardItem onClick={() => navigate("/coupon")} icon={HeartEventIcon} title="View All My Events" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DashboardCardItem onClick={() => navigate("/coupon")} icon={DownloadEventIcon} title="Download Tickets & Certificates" />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DashboardCardItem onClick={() => navigate("/coupon")} icon={PaymentDashboardIcon} title="View Payment History" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DashboardCardItem onClick={() => navigate("/coupon")} icon={CalendarEventIcon} title="View Coupons" />
          </Grid>
        </Grid>
      </Grid>
      {/* Right Column */}
      <Grid container size={{ xs: 12, md: 4 }} >
        <Grid container size={{ xs: 12 }}>
          Upcoming Events

        </Grid>
      </Grid>



    </Grid>

  )
});

export default UserDashboard;