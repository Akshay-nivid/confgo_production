import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Avatar, Divider, Menu, MenuItem } from '@mui/material';
import { SettingsIcon, LogoutIcon, DownArrowSvg, ResetPassword } from '@/assets/svg';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import { toSentenceCase, useIsMobileScreen } from '@/Utils/CommonBaseClass';
import useStore, { resetStore, setDataById } from '@/Libs/store';
import MenuIcon from "../../assets/svg/Vector.svg"
import { useState } from 'react';
import MobileDashboardSideMenu from './MobileDashboardSideMenu';
interface LayoutAppbarProps {
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    userRole: { roleName: string };
  };
}
/**
 * ui component for appbar in user dashboard
 * @author Neethu
 */
const LayoutAppbar: React.FC<LayoutAppbarProps> = React.memo(({ userDetails }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
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
  /**
   * Logout functionality
   */
  const handleLogout = () => {
    // Clear sessionStorage and localStorage
    sessionStorage.clear();
    localStorage.clear();
    setTimeout(() => {
      resetStore();
    }, 500);
    // Navigate to login
    window.location.href=routes.userLogin();
  };

  /**
   * handle to profile page by passing tabindex as 0 
   */
  const handleProfileClick = () => {
    setAnchorEl(null);
    setDataById('settings', { tabIndex: 0 });
    navigate(routes.accountsettings(), { state: { email: userDetails?.email } })
  };

  /**
   * handle to security page by passing tabindex as 1
   */
  const handleResetPassword = () => {
    setAnchorEl(null);
    useStore.getState().setDataById("settings", { tabIndex: 1, email: userDetails?.email });

    navigate(routes.accountsettings(), { state: { email: userDetails?.email } })
  };
  const isMobileView = useIsMobileScreen();
  /**
 * Account settings
 */
  // const handleAccountSettings = () => {
  // };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

   // Toggle the drawer state
   const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the drawer (e.g., when a link is clicked)
  const closeMenu = () => {
    setIsMenuOpen(false);
  };


  return (
    <Grid container size={12} className="appbars">
      {!isMobileView ? (
      <Grid className="appbars-logo-container">
        LOGO
      </Grid>
      ):(
        <Grid className="appbars-responsive-logo-container" >
        <Grid justifyItems={'center'}>
          <button className='appbars-responsive-logo-container-menu-button'  onClick={toggleMenu}> 
          <MenuIcon/>
           </button> 
           <MobileDashboardSideMenu open={isMenuOpen} onClose={closeMenu} />
          </Grid>
        <Grid>LOGO</Grid>
      </Grid>
      )}
      {!isMobileView ? (
      <Grid  className="appbars-right" container>
        <Grid size={2} className="appbars-group" onClick={handleMenuOpen} >
          {/*Image */}
          <Grid size={1} className="appbars-group-img" mb={0}>
            {userDetails?.firstName && userDetails?.lastName ? (
              <Avatar className="appbars-group-avatar" >
                {`${userDetails.firstName[0]}${userDetails.lastName[0]}`.toUpperCase()}
              </Avatar>
            ) : (
              <Avatar>
              </Avatar>
            )}
          </Grid>
          {/* Name and Role */}
          <Grid size={7} className="appbars-group-textgroup">
            <Grid size={12}>
              <Typography className="appbars-group-text">{userDetails?.firstName} {userDetails?.lastName}</Typography>
            </Grid>
            <Grid size={12}>
              <Typography className="appbars-group-subheader-text">{toSentenceCase(userDetails?.userRole?.roleName)}</Typography>
            </Grid>
          </Grid>
          {/* Arrow Dropdown Icon */}
          <Grid size={2} className="appbars-group-arrow-container">
            <DownArrowSvg className="appbars-group-arrow-down" />
          </Grid>
        </Grid>
        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          className="user-profile-menu"
          >
          <MenuItem className="" >
          <Grid size={1} className="appbars-group-img" mb={0}>
            {userDetails?.firstName && userDetails?.lastName ? (
              <Avatar className="appbars-group-avatar" >
                {`${userDetails.firstName[0]}${userDetails.lastName[0]}`.toUpperCase()}
              </Avatar>
            ) : (
              <Avatar>
              </Avatar>
            )}
          </Grid>
            <span className="menu-item-text">{userDetails?.firstName} {userDetails?.lastName}
              <br />
              <span className="menu-item-text-email">
                  {userDetails?.email}
              </span>
            </span>

          </MenuItem>
          <Divider />
          <MenuItem className="menu-item-margin" onClick={handleProfileClick} >
            <SettingsIcon   className="user-profile-menu-icon"/>
            <span className="menu-item-text">Profile</span>
          </MenuItem>
          <MenuItem className="" onClick={handleResetPassword}>
            <ResetPassword className="user-profile-menu-icon"  />
            <span className="menu-item-text">Change Password</span>
          </MenuItem>
          <MenuItem className="" onClick={handleLogout}>
            <LogoutIcon className="user-profile-menu-icon" />
            <span className="menu-item-text text-danger">Logout</span>
          </MenuItem>
        </Menu>
      </Grid>):(<>
      <Grid container size={12} className="appbars-responsive-right">
      <Grid size={1} className="appbars-group-img" mb={0}>
            {userDetails?.firstName && userDetails?.lastName ? (
              <Avatar className="appbars-group-avatar" >
                {`${userDetails.firstName[0]}${userDetails.lastName[0]}`.toUpperCase()}
              </Avatar>
            ) : (
              <Avatar>
              </Avatar>
            )}
          </Grid>
        </Grid></>)}
    </Grid>
  );
});

export default LayoutAppbar;