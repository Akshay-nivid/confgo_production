
import React from "react";
import Grid from '@mui/material/Grid2';
import { Typography } from "@mui/material";

import CustomButton from "@/components/CustomButton/CustomButton";
import { useNavigate } from 'react-router-dom';
import { CalendarNoEvent } from "@/assets/svg";
import clsx from "clsx";
import { useIsMobileScreen } from "@/Utils/CommonBaseClass";

/**
 * Reusable no events card
 * @author Neethu
 */
const NoDataCard: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const isMobileView = useIsMobileScreen();
  return (
    <Grid
      container
      className={clsx("no-records-container",isMobileView &&'no-records-responsive')}
      size={12}
    >
      <Grid container>
        <Grid container size={7}>
          <Grid size={12}>
            <Typography className={clsx("dashboard-left-profile-accounttitle",isMobileView &&"dashboard-responsive-left-profile-accountittle")} variant="body1">No Attended Events</Typography>
            <Typography className={clsx("no-records-subtitle", isMobileView && "no-records-responsive-subtitle")}>
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
        <Grid size={4} >
          <CalendarNoEvent className={clsx("no-records-image",isMobileView && "no-records-responsive-image")} />
        </Grid>
      </Grid>

    </Grid>
  );

});

export default NoDataCard;
