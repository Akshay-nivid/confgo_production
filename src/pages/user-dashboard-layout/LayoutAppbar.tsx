import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Badge, Divider, Menu, MenuItem } from '@mui/material';
import { ArrowDropDownOutlined } from '@mui/icons-material';
import { SettingsIcon, LogoutIcon, CalendarEventIcon } from '@/assets/svg';
import Grid from '@mui/material/Grid2';

/**
 * ui component for appbar in user dashboard
 * @author Neethu
 */
const LayoutAppbar: React.FC = React.memo(() => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  /**
   * handle appbar open
   */
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * handle appbar close
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container className="appbar">
      <Grid size={2} className="appbar-logo-container">
        LOGO
      </Grid>
      <Grid container size={10} justifyContent="flex-end" >
        <Grid container className="appbar-notification">
          {/* Calendar Icon */}
          <CalendarEventIcon className='appbar-notification-icon' />
          {/* Notification Badge */}
          <Badge
            badgeContent={4}
            color="primary"
            className='appbar-notification-badge'
          />
        </Grid>
        <Grid container className="appbar-group" onClick={handleMenuOpen}>
          {/*Image */}
          <Grid size={2} className="appbar-group-img" >
            <img src="https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" alt="User" />
          </Grid>
          {/* Name and Role */}
          <Grid size={8}>
            <Grid size={12}>
              <Typography className="appbar-group-text">Andrew Class</Typography>
            </Grid>
            <Grid size={12}>
              <Typography className="appbar-group-subheader-text">Admin</Typography>
            </Grid>
          </Grid>
          {/* Arrow Dropdown Icon */}
          <Grid size={2}>
            <ArrowDropDownOutlined className="appbar-group-arrow-down" />
          </Grid>
        </Grid>
        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          className="user-profile-menu"
        >
          <MenuItem className="">
            <SettingsIcon />
            <span className="menu-item-text">Account Settings</span>
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
});

export default LayoutAppbar;