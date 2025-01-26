import React, { useState } from 'react';
import { Typography, Tabs, Tab, Box } from '@mui/material';
import MainSecurity from './profile-components/mainSecurity';
// import Notifications from './profile-components/Notifications'; // Import the Notifications component
import Grid from "@mui/material/Grid2";
import useStore from "@/Libs/store/store";
import "./profile-components/mainProfile.scss"
import PersonalAndOrganisationDetails from './profile-components/PersonalAndOrganisationDetails';

const ProfileSettings: React.FC = React.memo(() => {
  const [email, setEmail] = useState('');
  const setDataById = useStore((state: any) => state.setDataById);
  const tabInfo = useStore((state: any) => state?.compData?.["settings"]);

/**
* Handles the tab change event by updating the active tab index
*/
  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setDataById("settings", { tabIndex: newIndex });
  };

  return (
    <Grid className="main-account-grid">
      <Typography className='main-account-settings-main-title' gutterBottom>
        Edit Profile
      </Typography>
      <Tabs value={tabInfo?.tabIndex} className='main-account-tabs' onChange={handleTabChange}>
        <Tab label="My Profile" className='main-account-tab-title account-tabs' />
        <Tab label="Security" className="main-account-tab-title account-tabs" />
        {/* <Tab label="Notification" className="main-account-tab-title account-tabs" /> */}
      </Tabs>
      {tabInfo?.tabIndex === 0 ? (
        <Grid container className="main-account-tab-details">
          <Grid size={12}>
            {/* Profile edit and view for end user */}
            <PersonalAndOrganisationDetails setEmail={setEmail}/>
          </Grid>
        </Grid>
      ) : tabInfo?.tabIndex === 1 ? (
        <Box>
          {/* Profile reset password for end user */}
          <MainSecurity passEmail={email} />
        </Box>
      //commentted due to api is not there
      // ) : tabInfo?.tabIndex == 2 ? (
      //   <Box>
          
      //     {/* Notifications settings for end user */}
      //     <Notifications />
      //   </Box>
      ) : null}
    </Grid>
  );
});

export default ProfileSettings;
