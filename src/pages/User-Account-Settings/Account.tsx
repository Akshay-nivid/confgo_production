import React, { useEffect, useState } from 'react';
import { Typography, Tabs, Tab, Box } from '@mui/material';
import AccountSetting from "./AccountSettings"
import Security from './Security';
import Grid from "@mui/material/Grid2";
import useStore from "@/Libs/store";
import { useLocation } from 'react-router-dom';


const Account: React.FC = React.memo(() => {
  const [email, setEmail] = useState('');
  const setDataById = useStore((state: any) => state.setDataById);
  const tabInfo = useStore((state: any) => state?.compData?.["settings"])
  const location = useLocation();

/**
 * Handles the correct tab index while navigation 
 */
   useEffect(() => {
    if (location.state?.tabIndex !== undefined) {
      setDataById("settings", { tabIndex: location.state.tabIndex });
    }
  }, [location.state, setDataById]);
  
/**
 * Handles the tab change event by updating the active tab index btw account-settings and security 
 */
const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
  setDataById("settings", { tabIndex: newIndex }); 
};

  return (
    <Grid className="account-grid">
      <Typography className='account-settings-main-title account-padding' gutterBottom>
        Account Settings
      </Typography>
      <Grid container direction={"column"} size={{ xs: 12, sm: 12 }}  className='account-tabs-container'>
      <Tabs value={tabInfo?.tabIndex} className='account-tabs' onChange={handleTabChange} >
        <Tab label="Personal Information" className='account-tab-title account-tabs'/>
        <Tab label="Security" className="account-tab-title account-tabs"/>
      </Tabs>
      </Grid>
      {tabInfo?.tabIndex === 0 ? (
        <Grid container className="account-tab-details">
          <Grid size={12}>
            {/* profile edit and view for enduser */}
            <AccountSetting setEmail={setEmail}/>  
          </Grid>
        </Grid>
      ) : (
        <Box >
          {/* profile reset password for enduser */}
         <Security passEmail={email}/>
        </Box>
      )}
    </Grid>
  );
});

export default Account;
