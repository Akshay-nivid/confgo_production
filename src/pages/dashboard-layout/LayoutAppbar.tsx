import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Avatar, Divider, Menu, MenuItem } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { SettingsIcon, LogoutIcon, AppLogo } from '@/assets/svg';
import Grid from '@mui/material/Grid2';

/**
 * ui component for appbar in dashboard
 * @returns
 */
export default function LayoutAppbar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container className="appbar">
      <Grid size={2} className="appbar-logo-container">
        <AppLogo className="appbar-logo-container-svg" />
      </Grid>
      <Grid size={10}>
        <div className="avatar-group" onClick={handleMenuOpen}>
          <div className="flex flex-col">
            <Typography className="avatar-header-text">Richard Wood</Typography>
            <Typography className="avatar-subheader-text">Admin</Typography>
          </div>
          <div className="flex items-center gap-x-[2px]">
            <Avatar
              alt="user-image"
              src="https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
            />
            <ArrowDropDown className="avatar-arrow-down" />
          </div>
        </div>
        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          className="user-profile-menu"
        >
          <MenuItem className="">
            <SettingsIcon />
            <span className="menu-item-text">Settings</span>
          </MenuItem>
          <Divider />
          <MenuItem className="">
            <LogoutIcon />
            <span className="menu-item-text text-danger">Logout</span>
          </MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
}
