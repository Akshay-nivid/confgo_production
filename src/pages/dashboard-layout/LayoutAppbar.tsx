import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Avatar, Divider, Menu, MenuItem } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { SettingsIcon, LogoutIcon } from '@/assets/svg';
import  AppLogo  from '@/assets/svg/app-logo.svg';
import Grid from '@mui/material/Grid2';
import { resetStore, setDataById } from '@/Libs/store';
import routes from '@/router/routes';
import { useNavigate } from 'react-router-dom';

/**
 * component for appbar in dashboard
 * @returns
 */
export default function LayoutAppbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const companyUserName = sessionStorage.getItem("companyUserName");
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
/**
* account settings functionality
*/
  const handleAccountSettings = () =>{
    setDataById('settings', { tabIndex: 0 });
    setAnchorEl(null); 
    navigate(routes.organizationUserProfile())
   
  }

   /**
   * Logout functionality
   */
   const handleLogout = () => {
    // Clear sessionStorage and localStorage
    sessionStorage.clear();
    localStorage.clear();
    resetStore();
    navigate(routes.home()); 
  };
  
  return (
    <Grid container className="appbar">
      <Grid size={2} className="appbar-logo-container">
        <AppLogo className="appbar-logo-container-svg" />
      </Grid>
      <Grid size={10}>
        <div className="avatar-group" onClick={handleMenuOpen}>
          <div className="flex flex-col">
            <Typography className="avatar-header-text">{companyUserName}</Typography>
            <Typography className="avatar-subheader-text">Admin</Typography>
          </div>
          <div className="flex items-center gap-x-[2px]">
            {companyUserName ? (
            <Avatar className="appbars-group-avatar" >
              {`${companyUserName[0]}${companyUserName[1]}`.toUpperCase()}
              </Avatar>
            ):(
              <Avatar className="appbars-group-avatar">
                U
              </Avatar>
            )}
            <ArrowDropDown className="avatar-arrow-down" />
          </div>
        </div>
        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          className="user-profile-menu"
        >
          <MenuItem className="" onClick={handleAccountSettings}>
            <SettingsIcon />
            <span className="menu-item-text">Settings</span>
          </MenuItem>
          <Divider />
          <MenuItem className="" onClick={handleLogout}>
            <LogoutIcon />
            <span className="menu-item-text text-danger">Logout</span>
          </MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
}
