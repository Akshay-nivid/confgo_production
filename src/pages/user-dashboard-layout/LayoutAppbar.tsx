import * as React from 'react';
import { Avatar, Divider, Menu, MenuItem } from '@mui/material';
import { SettingsIcon, LogoutIcon, ResetPassword, DownArrowIcon } from '@/assets/svg';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import { getUserType, processAPIResponse, useIsMobileScreen } from '@/Utils/CommonBaseClass';
import { resetStore, setDataById } from '@/Libs/store';
import MenuIcon from "../../assets/svg/Vector.svg"
import { useEffect, useState } from 'react';
import MobileDashboardSideMenu from './MobileDashboardSideMenu';
import apiClient from '@/Libs/Https/API-client';
import config from "../../../config.json";
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
  const baseUrl = config.api.url;
  const [picture, setPicture] = useState('');
  /**
   * get user Details
   */
  useEffect(() => {
    userDetailss();
  },);
  const userDetailss = async () => {
    const response = await apiClient.get(`/user`);
    const { data } = processAPIResponse(response, '');
    if (data) {
      setPicture(data?.assetId);
    }
  }
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const role = getUserType();

  
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
    window.location.href = routes.userLogin();
  };


  /**
   * handle to profile page by passing tabindex as 0 
   */
  const handleProfileClick = () => {
    setAnchorEl(null);
    setDataById('settings', { tabIndex: 0 });

   

    if (role === 'USER') {
      navigate(routes.accountsettings(), { state: { email: userDetails?.email } })
    } else if (role === 'SPEAKER') {
      navigate(routes.sepakerAccountSettings(), { state: { email: userDetails?.email } })
    } else if (role === 'REVIEWER') {
      navigate(routes.reviewerAccountSettings())
    }
    
  };

  /**
   * handle to security page by passing tabindex as 1
   */
  const handleResetPassword = () => {
    setAnchorEl(null);
    navigate(routes.SetPassword());
  };
  const isMobileView = useIsMobileScreen();

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
      ) : (
        <Grid className="appbars-responsive-logo-container" >
          <Grid justifyItems={'center'}>
            <button className='appbars-responsive-logo-container-menu-button' onClick={toggleMenu}>
              <MenuIcon />
            </button>
            <MobileDashboardSideMenu open={isMenuOpen} onClose={closeMenu} />
          </Grid>
          <Grid>LOGO</Grid>
        </Grid>
      )}
      {!isMobileView ? (
        <Grid className="appbars-right" container >
          {/* <Grid size={2} className="appbars-group"  > */}
          <Grid size={1} className="appbars-group-img" mb={0} onClick={handleMenuOpen}>
            {picture ? (
              <Avatar
                src={`${baseUrl}asset/${picture}`}
                className="appbars-group-avatar"
                alt="User Profile"
                variant="circular"
              />
            ) : userDetails?.firstName && userDetails?.lastName ? (
              <Avatar className="appbars-group-avatar">
                {`${userDetails.firstName[0]}${userDetails.lastName[0]}`.toUpperCase()}
              </Avatar>
            ) : (
              <Avatar className="appbars-group-avatar" />
            )}
          </Grid>
          <Grid onClick={handleMenuOpen} alignContent={'center'} className="appbars-group-down-arrow-container">
            <DownArrowIcon className='appbars-group-down-arrow bigger-icon' />
          </Grid>
          {/* Name and Role */}
          {/* <Grid size={7} className="appbars-group-textgroup">
            <Grid size={12}>
              <Typography className="appbars-group-text">{userDetails?.firstName} {userDetails?.lastName}</Typography>
            </Grid>
            <Grid size={12}>
              <Typography className="appbars-group-subheader-text">{toSentenceCase(userDetails?.userRole?.roleName)}</Typography>
            </Grid>
          </Grid> */}
          {/* Arrow Dropdown Icon */}
          {/* <Grid size={2} className="appbars-group-arrow-container">
            <DownArrowSvg className="appbars-group-arrow-down" />
          </Grid> */}
          {/* </Grid> */}
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            className="user-profile-menu"
          >
            <MenuItem className="" >
              <Grid size={1} className="appbars-group-img img-space" mb={0}>
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
            {<>
              <MenuItem className="menu-item-margin" onClick={handleProfileClick} >
                <SettingsIcon className="user-profile-menu-icon" />
                <span className="menu-item-text">Profile</span>
              </MenuItem>
              <MenuItem className="user-dash-space-fix" onClick={handleResetPassword}>
                <ResetPassword className="user-profile-menu-icon" />
                <span className="menu-item-text">Change Password</span>
              </MenuItem></>}
            <MenuItem className="" onClick={handleLogout}>
              <LogoutIcon className="user-profile-menu-icon" />
              <span className="menu-item-text text-danger">Logout</span>
            </MenuItem>
          </Menu>
        </Grid>) : (<>
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