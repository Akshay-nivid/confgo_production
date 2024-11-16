import React from 'react';
import { Typography, Tabs, Tab, Box } from '@mui/material';
import AccountSetting from "./AccountSettings"
import Security from './Security';
import Grid from "@mui/material/Grid2";
import useStore from "@/Libs/store";


const Account: React.FC = React.memo(() => {
  const setDataById = useStore((state: any) => state.setDataById);
  const tabInfo = useStore((state: any) => state?.compData?.["settings"])
/**
 * Handles the tab change event by updating the active tab index btw account-settings and security 
 */
const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
  setDataById("settings", { tabIndex: newIndex }); 
};

  return (
    <Grid className="account-grid">
      <Typography className='account-settings-main-title' gutterBottom>
        Account Settings
      </Typography>
      <Tabs value={tabInfo?.tabIndex} className='account-tabs' onChange={handleTabChange} >
        <Tab label="Personal Information" className='account-tab-title account-tabs'/>
        <Tab label="Security" className="account-tab-title account-tabs"/>
      </Tabs>
      {tabInfo?.tabIndex === 0 ? (
        <Grid container className="account-tab-details">
          <Grid size={12}>
            {/* profile edit and view for enduser */}
            <AccountSetting />  
          </Grid>
        </Grid>
      ) : (
        <Box >
          {/* profile reset password for enduser */}
         <Security/>
        </Box>
      )}
    </Grid>
  );
});

export default Account;
