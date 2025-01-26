/**
 * profile ui component for appbar in user dashboard
 * @author Nevin
 * used to edit and view details of user
 */

import React from "react";
import Grid from "@mui/material/Grid2";
import { Avatar, Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import "./accountsetting.scss";
import { useCallback, useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { CloseOutlined } from "@mui/icons-material";
import apiClient from "@/Libs/Https/API-client"; 
import { EditIconRound, Google } from "@/assets/svg";
import useStore from "@/Libs/store/store";
import { Logger } from "@/Utils/Logger";
import config from "../../../config.json";
import FileUpload from "@/components/FileUpload/FileUpload";
import { processAPIResponse } from "@/Utils/CommonBaseClass";

interface CustomFile {
  id: number;
  name: string;
}

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  isSsoUser:boolean;
  assetId:number;
}
interface AccountSettingProps {
  setEmail: (email: string) => void; 
 }

 const AccountSetting:React.FC<AccountSettingProps> = React.memo(({ setEmail }) => {
  const { handleSubmit, control, setValue } = useForm<Profile>();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const setDataById = useStore((state: any) => state.setDataById)
  const userDetails = useStore((state) => state?.compData?.["userDetails"]) ?? {};
  const [drawerProfileImage, setDrawerProfileImage] = useState<number | null>(profileData?.assetId || null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false); 

  const baseUrl = config.api.url;  
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
          isSsoUser:data?.isSsoUser,
          assetId: data.assetId || null,
        };
        setProfileData(AccountData);
     
       
  
        /***
         * Sets form field values
         */
        setValue("firstName", data.firstName);
        setValue("lastName", data.lastName);
        setValue("email", data.email);
        setValue("phone", data.phone); 
        setEmail(data.email);
      }
    } catch (error) {
      Logger.error("Error fetching participant data:", error);
    }
  }, [setEmail,setValue]);

/**
 * Submit form to update profile data from drawer
 * @param data
 */

const onSubmit = async (data: Profile) => {
  try {
    const payload = {
      ...data,
      assetId: drawerProfileImage || profileData?.assetId || null,
    };
    const response = await apiClient.put(`/user`, payload);
    const { status, message } = processAPIResponse(response, "personalInformation");
    if (status) {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: message });
       setProfileData((prevProfileData:any) => ({
        ...prevProfileData,
        ...payload,
      }));
      setDataById("userDetails", {
        ...userDetails,
        firstName: response.data?.data?.firstName,
        lastName: response.data?.data?.lastName,
        assetId: response.data?.data?.assetId,
      });
     setDataById("profileImage",{item:response?.data?.data?.assetId})
      closeDrawer();
    }
    else{
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: message })
    }
  } 
  catch (error) {
    Logger.error("Error updating profile data:", error);
  }
};

  /** 
* opens the modal for image upload
*/
const openmodal = () =>{
  setUploadModalOpen(true)
}

/** 
 * image upload function for profile image
 */
const handleImageUpload = (uploadedFile: CustomFile) => {
  setDrawerProfileImage(uploadedFile.id); 
  setUploadModalOpen(false);
};

  return (
    <Grid container className="account-main-grid">
      <Grid size={8} className="account-profile-grid account-margin">
        <Grid size={12} className="account-title-grid ">
          <Typography className="account-title accountsettings-margin">Personal Information</Typography>
          <IconButton onClick={openDrawer} className="event-detail-event-info-card-edit-btn">
          <EditIconRound/>
          </IconButton>
        </Grid>
        <Grid className="account-profile-image connected">
          {profileData?.assetId ? (
            <Avatar
              src={`${baseUrl}asset/${profileData?.assetId}`}
              className="main-user-profile"
              alt="User Profile"
              variant="circular"
            />
          ) : (
            <Avatar className="main-user-profile main-user-profile-text">
              {`${profileData?.firstName[0]}${profileData?.lastName[0]}`.toUpperCase()}
            </Avatar>
          )}
        </Grid>
        <Grid container className="account-detail-grid connected" size={12}>
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
              {profileData?.lastName || ""}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography  className="account-user-detail1">
              Email
            </Typography>
            <Typography variant="body1" className="account-user-detail2">
              {profileData?.email || ""}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography  className="account-user-detail1">
              Phone Number
            </Typography>
            <Typography variant="body1" className="account-user-detail2">
              {profileData?.phone || ""}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {profileData?.isSsoUser&&<Grid size={8} className="account-profile-grid connected connected-grid account-margin connected-margin">
      <Typography className="account-title">Connected accounts</Typography>
      <Grid display="flex" alignItems="center" className="connected">
          <Grid className="account-google-grid">
            <Grid className="account-google" container> <Google/></Grid>
          </Grid>
        </Grid>
      </Grid>}

      <CustomDrawer open={isDrawerOpen} type="right">
        <Grid container className="account-drawer">
          <Grid size={6} container className="account-drawer-text">
            <Typography className="account-title account-drawer-textfield">Personal Information</Typography >
            <IconButton onClick={closeDrawer}className="settings-close" >
              <CloseOutlined />
            </IconButton>
          </Grid>
          <Grid size={12} className="connected">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container direction="column" spacing={2}>
              <Grid container direction='row'>
                {profileData?.assetId || drawerProfileImage != null ? (
                    <Avatar
                      src={drawerProfileImage
                        ? `${baseUrl}asset/${drawerProfileImage}`
                        : `${baseUrl}asset/${profileData?.assetId}`
                    }
                      className="main-user-profile"
                      alt="User Profile"
                      variant="circular"
                    />
                  ) : (
                    <Avatar className="main-user-profile main-user-profile-text">
                      {`${profileData?.firstName[0]}${profileData?.lastName[0]}`.toUpperCase()}
                    </Avatar>
                  )}
                <Button className="main-user-profile-upload-btn" onClick={openmodal} >
                  Upload New Photo
                </Button></Grid>
              
                <Grid size={12}>
                  <CustomTextField name="firstName" placeholder="First Name" control={control} requiredField />
                </Grid>
                <Grid size={12}>
                  <CustomTextField name="lastName" placeholder="Last Name" control={control} requiredField />
                </Grid>
                <Grid size={12} container justifyContent={"flex-end"}>
                  <CustomButton label="Change" type="submit" className="account-submit-btn" variant="contained"/>
                </Grid>
              </Grid>
            </form>

            {/* <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container direction="row" alignItems="center">
                
                <Grid size={12}>
                  <CustomTextField
                    name="firstName"
                    placeholder="First Name"
                    control={control}
                    requiredField
                    className="main-account-drawer-textfield"
                  />
                </Grid>
                <Grid size={12}>
                  <CustomTextField
                    name="lastName"
                    placeholder="Last Name"
                    control={control}
                    requiredField
                    className="main-account-drawer-textfield"
                  />
                </Grid>
                <Grid size={12} container className="main-account-drawer-btn">
                  <CustomButton
                    label="Submit"
                    type="submit"
                    className="main-user-submit-btn"
                  />
                </Grid>
              </Grid>
            </form> */}
          </Grid>
        </Grid>
      </CustomDrawer>
      <Modal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
        <Box className="modal-upload-container">
          <FileUpload
            acceptedFiles={["image/jpeg", "image/png"]}
            resolution={{ width: 200, height: 200 }}
            onSubmit={handleImageUpload}
          />
        </Box>
      </Modal>
    </Grid>
  );
});

export default AccountSetting;
