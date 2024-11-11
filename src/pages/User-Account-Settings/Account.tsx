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
    <Box sx={{ p: 4 }}>
      <Typography variant="h5"  className='account-settings-main-title' gutterBottom>
        Account Settings
      </Typography>
      <Tabs value={tabIndex} className='account-tabs' onChange={handleTabChange} TabIndicatorProps={{
         style: {
          borderBottom: '2px solid #3A5AFE',
        },
        }}>
        <Tab label="Personal Information" className='account-tab-title'  sx={{ color: tabIndex === 0 ? "#000000" : "#808A98" }}/>
        <Tab label="Security" className="account-tab-title"  sx={{ color: tabIndex === 1 ? "#000000" : "#808A98" }}/>
      </Tabs>
      {tabIndex === 0 ? (
        <Grid container spacing={2} sx={{ mt:1 }}>
          <Grid size={12}>
            <AccountSetting setEmail={setEmail} />
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ mt: 2 }}>
         <Security email={email}/>
        </Box>
      )}
    </Box>
  );
}

export default Account;
