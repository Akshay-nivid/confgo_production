/**
 * profile ui component for appbar in user dashboard
 * @author Nevin
 * used to edit and view details of user
 */

import React from "react";
import Grid from "@mui/material/Grid2";
import { Avatar, IconButton, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import "./accountsetting.scss";
import { useCallback, useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton/CustomButton";
import EditIcon from "@/assets/svg/event-edit.svg";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { CloseOutlined } from "@mui/icons-material";
import apiClient from "@/Libs/Https/API-client"; 
import useStore from "@/Libs/store";
import { Logger } from "@/Utils/Logger";


interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

const AccountSetting:React.FC = React.memo(() => {
  const { handleSubmit, control, setValue } = useForm<Profile>();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const setDataById = useStore((state: any) => state.setDataById)
  const userDetails = useStore((state) => state?.compData?.["userDetails"]) ?? {};
  useEffect(() => {
    AccountProfile();
  }, []);

/**
 * Fetch profile data of the user
 */
  const AccountProfile = useCallback(async () => {
    try {
      const response = await apiClient.get(`/user`, {

      });
      if (response.data.status === "success") {
        const data = response.data.data;
        const AccountData = {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          avatarUrl: data.avatarUrl || "",
        };
        setProfileData(AccountData);
     
       
  
        /***
         * Sets form field values
         */
        setValue("firstName", data.firstName);
        setValue("lastName", data.lastName);
        setValue("email", data.email);
        setValue("phone", data.phone); 
      }
    } catch (error) {
      Logger.error("Error fetching participant data:", error);
    }
  }, []);

/**
 * Submit form to update profile data from drawer
 * @param data
 */
  const onSubmit = async (data: Profile) => {
    try {
      
      
      const response = await apiClient.put(`/user`, data, {
     
      });
     
      
      if (response.data.status === "success") {
        
     /**
      * Update local state with the new data that is updated
      */
        setProfileData((prevProfileData) => ({
          ...prevProfileData,
          ...data,
        }));
        /**
         * header section user deatils update
         */
        setDataById('userDetails', {
          ...userDetails,
          firstName: response.data?.data?.firstName,
          lastName: response.data?.data?.lastName,
        });
        closeDrawer();
      }
    } catch (error) {
      Logger.error("Error updating profile data:", error);
    }
  };

  return (
    <Grid container>
      <Grid size={8} className="account-profile-grid">
        <Grid size={12} className="account-title-grid">
          <Typography className="account-title">Personal Information</Typography>
          <IconButton onClick={openDrawer} className="event-detail-event-info-card-edit-btn">
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid className="account-profile-image connected">
          <Avatar
          className="user-profile"
            src={profileData?.avatarUrl}
            alt="User Profile"
            variant="square"
          />
        </Grid>
        <Grid container className="account-detail-grid connected">
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography className="account-user-detail1">
              First Name
            </Typography>
            <Typography variant="body1" className="account-user-detail2">
              {profileData?.firstName || ""}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography  className="account-user-detail1">
              Last Name
            </Typography>
            <Typography variant="body1" className="account-user-detail2">
              {profileData?.lastName || "N/A"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography  className="account-user-detail1">
              Email
            </Typography>
            <Typography variant="body1" className="account-user-detail2">
              {profileData?.email || "N/A"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography  className="account-user-detail1">
              Phone Number
            </Typography>
            <Typography variant="body1" className="account-user-detail2">
              {profileData?.phone || "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={8} className="account-profile-grid connected">
      <Typography className="account-title">Connected accounts</Typography>
      <Grid display="flex" alignItems="center" className="connected">
          <Grid className="account-connected-grid">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google"
              className="account-connected-img"
            />
          </Grid>
        </Grid>
      </Grid>

      <CustomDrawer open={isDrawerOpen} type="right">
        <Grid container className="account-drawer">
          <Grid size={12} container className="account-drawer-text">
            <Typography className="account-title">Personal Information</Typography>
            <IconButton onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Grid>
          <Grid size={12} className="connected">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container direction="column">
                <Grid size={12}>
                  <CustomTextField name="firstName" placeholder="First Name" control={control} requiredField className="account-drawer-textfield" />
                </Grid>
                <Grid size={12}>
                  <CustomTextField name="lastName" placeholder="Last Name" control={control} requiredField className="account-drawer-textfield"/>
                </Grid>
                <Grid size={12} container className="account-drawer-btn">
                  <CustomButton label="Change" variant="contained" type="submit" className="account-submit-btn"/>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </CustomDrawer>
    </Grid>
  );
});

export default AccountSetting;
