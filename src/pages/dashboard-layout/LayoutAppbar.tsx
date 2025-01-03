import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Avatar, Divider, Menu, MenuItem } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { SettingsIcon, LogoutIcon, AppThemeLogo } from '@/assets/svg';
import {useEffect} from "react";
import Grid from '@mui/material/Grid2';
import useStore, { resetStore, setDataById } from '@/Libs/store';
import routes from '@/router/routes';
import { useNavigate } from 'react-router-dom';
import config from "../../../config.json";
import apiClient from '@/Libs/Https/API-client';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
/**
 * component for appbar in dashboard
 * @returns
 */
export default function LayoutAppbar() {
  const baseUrl = config.api.url;  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const companyUserName = sessionStorage.getItem("companyUserName") || sessionStorage.getItem("name"); 
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

   /**
   * zustand data:For get user Details
   */
  useEffect(()=>{
    userDetails();
  },[])

  /**
   * Fetching user Details
   */
  const userDetails=async()=>{
    const response= await apiClient.get(`/user`);
    const{data}=processAPIResponse(response,'');
    if(data){
      setDataById("profileImage",{item:data?.assetId});
    }
  }
  /**
   * pictureId: from zustand store
   */
  const pictureId=useStore((state: any) => state.compData?.["profileImage"]?.item);
  
  return (
    <Grid container className="appbar">
      <Grid size={2} className="appbar-logo-container">
      <AppThemeLogo className={`appbar-logo-container-svg`} />
      </Grid>
      <Grid size={10}>
        <div className="avatar-group" onClick={handleMenuOpen}>
          <div className="flex flex-col">
            <Typography className="avatar-header-text">{companyUserName}</Typography>
            <Typography className="avatar-subheader-text">Admin</Typography>
          </div>
          <div className="flex items-center gap-x-[2px]">
             {pictureId ? (
                     <Avatar
                       src={`${baseUrl}asset/${pictureId}`}
                       className="appbars-group-avatar"
                       alt="User Profile"
                       variant="circular"
                     />
                   ) : (
                     <Avatar >
                       {companyUserName? (
                                 <Avatar className="appbars-group-avatar">
                                 {companyUserName
                                  .split(' ')
                                    .map(word => word[0].toUpperCase()) 
                                      .join('')} 
                                        </Avatar>
                                            ) : (
                                   <Avatar></Avatar>
                                          )}
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
