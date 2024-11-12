import React from 'react';
import { Typography, Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';
import AccountSetting from "./AccountSettings"
import Security from './Security';
import Grid from "@mui/material/Grid2";


function Account() {
  const [tabIndex, setTabIndex] = useState(0);
  const [email, setEmail] = useState(''); 

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Grid className="account-grid">
      <Typography className='account-settings-main-title' gutterBottom>
        Account Settings
      </Typography>
      <Tabs value={tabIndex} className='account-tabs' onChange={handleTabChange} >
        <Tab label="Personal Information" className='account-tab-title account-tabs'/>
        <Tab label="Security" className="account-tab-title account-tabs"/>
      </Tabs>
      {tabIndex === 0 ? (
        <Grid container className="account-tab-details">
          <Grid size={12}>
            <AccountSetting setEmail={setEmail} />
          </Grid>
        </Grid>
      ) : (
        <Box >
         <Security email={email}/>
        </Box>
      )}
    </Grid>
  );
}

export default Account;
