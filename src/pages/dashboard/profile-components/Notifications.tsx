/**
 * profile ui component for appbar in user dashboard
 * @author Nevin
 * used to get update notification settings
 */

import React from "react";
import Grid from "@mui/material/Grid2";
import { Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";
// import { useForm } from "react-hook-form";
import "./mainProfile.scss"

 const Notifications:React.FC = React.memo(() => {
//   const { handleSubmit, control, setValue } = useForm<Profile>();

  return (
    <Grid className="main-security-container">
      <Typography className="main-profile-text security-title">Notifications and Preferences</Typography>

      {/* Email Notifications Section */}
      <Grid>
        <Typography className="main-profile-email">Email Notifications</Typography>
        <Typography className="main-profile-email-subtext">
          Receive important updates and reminders via email.
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                // checked={preferences.emailEventNotifications}
                // onChange={handleChange}
                name="emailEventNotifications"
              />
            }
            label="Receive event notifications"
          />
          <FormControlLabel
            control={
              <Checkbox
                // checked={preferences.emailPromotionalUpdates}
                // onChange={handleChange}
                name="emailPromotionalUpdates"
              />
            }
            label="Receive promotional updates"
          />
        </FormGroup>
      </Grid>

      {/* SMS Notifications Section */}
      <Grid>
        <Typography className="main-profile-email">SMS Notifications</Typography>
        <Typography className="main-profile-email-subtext">
          Receive SMS alerts for time-sensitive information.
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                // checked={preferences.smsEventNotifications}
                // onChange={handleChange}
                name="smsEventNotifications"
              />
            }
            label="Receive event notifications"
          />
          <FormControlLabel
            control={
              <Checkbox
                // checked={preferences.smsPromotionalUpdates}
                // onChange={handleChange}
                name="smsPromotionalUpdates"
              />
            }
            label="Receive promotional updates"
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
});

export default Notifications;
