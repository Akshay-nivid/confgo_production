/**
 * profile ui component for appbar in main dashboard
 * @author Nevin
 * used to edit and view details of admin user
 */
import React from "react";
import Grid from "@mui/material/Grid2";
import { Avatar, Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import "./mainProfile.scss"
import { useCallback, useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { CloseOutlined } from "@mui/icons-material";
import apiClient from "@/Libs/Https/API-client"; 
import EditIcon from "@/assets/svg/event-edit.svg";
import useStore from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import config from "../../../../config.json";
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
  assetId: any;
  isSsoUser:boolean;
}

interface Company {
  companyName:string;
  companyPhone:string;
  companyAddress:string;
  companyEmail:string;
  assetId:any;
}

interface AccountSettingProps {
    setEmail: (email: string) => void; 
   }

/**
 * to view and edit personal information for admin users 
 */
const PersonalAndOrganisationDetails:React.FC<AccountSettingProps> = React.memo(({ setEmail }) => {
  type FormData = Profile & Company; 
  const { handleSubmit, control, setValue } = useForm<FormData>();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false); 
  const [uploadOrganisationModalOpen, setUploadOrganisationModalOpen] = useState(false); 
  const [drawerProfileImage, setDrawerProfileImage] = useState<number | null>(profileData?.assetId || null);
  const [organsisationDrawer, setorgansisationDrawer] = useState(false);
  const [LogoprofileData, setLogoProfileData] = useState<Company | null>(null);
  const [drawerLogoImage, setDrawerLogoImage] = useState<number | null>(LogoprofileData?.assetId || null);

  const baseUrl = config.api.url;  
  const openOrganisationDrawer =()=> setorgansisationDrawer(true)
  const closeOrganisationDrawer = () => setorgansisationDrawer(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const setDataById = useStore((state: any) => state.setDataById)
  const companyId = sessionStorage.getItem('companyId');
  const userDetails = useStore((state) => state?.compData?.["userDetails"]) ?? {};
  
  useEffect(() => {
    AccountProfile();
  }, []);

/**
 * Fetch profile data of the admin user
 */
  const AccountProfile = useCallback(async () => {
    try {
      // Fetch company and user data
      const response = await apiClient.get(`/company`);
      const { status, data } = processAPIResponse(response, "personalInformation");
      if (status) {
        const AccountData = {     
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
          email: data.user.email,
          assetId: data.user.assetId || "",
          isSsoUser:data?.isSsoUser,       
        };
        setProfileData(AccountData); 

        const OrganisationData = {
          companyName:data.companyName,
          companyPhone:data.phone,
          companyAddress:data.companyAddress,
          companyEmail:data.email,
          assetId:data?.assetId || ""
        }
        setLogoProfileData(OrganisationData); 
  
        /***
         * Sets form field values
         */
        setValue("firstName", data.user.firstName);
        setValue("lastName", data.user.lastName);
        setValue("email", data.user.email,);
        setValue("phone", data.user.phone,); 
        setValue("assetId", data.user.assetId,); 
        
        setEmail(data.user.email);
      }
    } catch (error) {
      Logger.error("Error fetching participant data:", error);
    }
  }, [setEmail,setValue]);

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

/** 
 * image delete function for profile img
 */
const handleDeleteAvatar = () => {
  setDrawerProfileImage(null);
  setProfileData((prevProfileData) => {
    if (!prevProfileData) {
      return null;
    }
    return {
      ...prevProfileData,
      assetId: null,
    };
  });
  setDataById("userDetails", {
    ...userDetails,
    assetId: null,
  });
};

/** open modal for logo upload */
const openLogomodal =()=>{
  setUploadOrganisationModalOpen(true)

}
/** logo upload for company */
const handleOrganisationImageUpload =(uploadedFiles: CustomFile)=>{
  setDrawerLogoImage(uploadedFiles.id)
  setUploadOrganisationModalOpen(false);
}

/** function to submit logo */
const onLogoSubmit = async (newdata: Company) => {
  try {
    const payload = {
      companyName: newdata.companyName || LogoprofileData?.companyName || "", 
      companyPhone: newdata.companyPhone || LogoprofileData?.companyPhone || "",
      companyAddress: newdata.companyAddress || LogoprofileData?.companyAddress || "", 
      companyEmail: newdata.companyEmail || LogoprofileData?.companyEmail || "",
      assetId: drawerLogoImage || LogoprofileData?.assetId
    };

    // Send the payload to the server for updating the company details
    const response = await apiClient.put(`/company/${companyId}`, payload);
    const { status } = processAPIResponse(response, "personalInformation");
    if (status) {
      setLogoProfileData((prevData) => ({
        ...prevData,
        ...payload,
      }));
      setDataById("logo", {
        status: "success",
      });
    }
  } catch (error) {
    console.error("Error during logo submit:", error);
  }
  closeOrganisationDrawer()
};

/**
 * Submit form to update profile data from drawer
 * @param data
 */
const onSubmit = async (data: Profile) => {
  try {
    const payload = {
      ...data,
      assetId: drawerProfileImage || profileData?.assetId,
    };
    const response = await apiClient.put(`/user`, payload);
    const { status } = processAPIResponse(response, "personalInformation");
    if (status) {
      setProfileData((prevProfileData) => ({
        ...prevProfileData,
        ...payload,
      }));
      setDataById("userDetails", {
        ...userDetails,
        firstName: response.data?.data?.firstName,
        lastName: response.data?.data?.lastName,
        assetId: response.data?.data?.assetId,
      });
      closeDrawer();
    }
  } catch (error) {
    Logger.error("Error updating profile data:", error);
  }
};

return (
  <Grid container className="main-account-main-grid">
    <Grid size={8} className="main-account-profile-grid account-margin">
      <Grid size={12} className="main-account-title-grid ">
        <Typography className="main-account-title accountsettings-margin">
          Personal Information
        </Typography>
        <IconButton
          onClick={openDrawer}
          className="event-detail-event-info-card-edit-btn"
        >
          <EditIcon />
        </IconButton>
      </Grid>
       <Grid size={1} className="main-account-profile-image connected" mb={0}>
            {profileData?.firstName && profileData?.lastName? (
              <Avatar  className="main-user-profile">
                {`${profileData?.firstName[0]}${profileData?.lastName[0]}`.toUpperCase()}
              </Avatar>
            ) : (
              <Avatar>
              </Avatar>
            )}
          </Grid>
      <Grid
        container
        className="main-account-detail-grid connected"
        size={12}
      >
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            First Name
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {profileData?.firstName || ""}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Last Name
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {profileData?.lastName || "N/A"}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Email
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {profileData?.email || "N/A"}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Phone Number
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {profileData?.phone || "N/A"}
          </Typography>
        </Grid>
      </Grid>
    </Grid>

    {/** */}
    <Grid size={8} className="main-account-profile-grid account-margin">
      <Grid size={12} className="main-account-title-grid ">
        <Typography className="main-account-title accountsettings-margin">
          Organisation Details
        </Typography>
        <IconButton
          onClick={openOrganisationDrawer}
          className="event-detail-event-info-card-edit-btn"
        >
          <EditIcon />
        </IconButton>
      </Grid>
      <Avatar
        className="main-user-profile"
        src={
          LogoprofileData?.assetId
            ? `${baseUrl}/asset/${LogoprofileData?.assetId}`
            : ""
        }
        alt="User Profile"
        variant="circular"
      />
      <Grid
        container
        className="main-account-detail-grid connected"
        size={12}
      >
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Organisation Name
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {LogoprofileData?.companyName || ""}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Organisation Email
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {LogoprofileData?.companyEmail || "N/A"}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Organisation Phone Number
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {LogoprofileData?.companyPhone || "N/A"}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Organisation Address
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {LogoprofileData?.companyAddress || "N/A"}
          </Typography>
        </Grid>
      </Grid>
    </Grid>

    <CustomDrawer open={isDrawerOpen} type="right">
      <Grid container className="main-account-drawer">
        <Grid size={12} container className="main-account-drawer-text">
          <Typography className="main-account-title account-drawer-textfield">
            Edit Personal Details
          </Typography>
          <IconButton onClick={closeDrawer}>
            <CloseOutlined />
          </IconButton>
        </Grid>
        <Grid size={12} className="main-connected">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction="row" alignItems="center">
              <Avatar
                className="main-user-profile"
                src={
                  drawerProfileImage
                    ? `${baseUrl}/asset/${drawerProfileImage}`
                    : `${baseUrl}/asset/${profileData?.assetId}`
                }
                alt="User Profile"
                variant="circular"
              />
              <Button
                className="main-user-profile-upload-btn"
                onClick={openmodal}
              >
                Upload New Photo
              </Button>
              <Button
                className="main-user-profile-upload-btn main-outline"
                onClick={handleDeleteAvatar}
              >
                Delete
              </Button>
              <Grid size={12} className="main-user-details">
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
          </form>
        </Grid>
      </Grid>
    </CustomDrawer>

    {/* logo change drawer*/}
    <CustomDrawer open={organsisationDrawer} type="right">
      <Grid container className="main-account-drawer">
        <Grid size={12} container className="main-account-drawer-text">
          <Typography className="main-account-title account-drawer-textfield">
            Edit Organisation Details
          </Typography>
          <IconButton onClick={closeOrganisationDrawer}>
            <CloseOutlined />
          </IconButton>
        </Grid>
        <Grid size={12} className="main-connected">
          <form onSubmit={handleSubmit(onLogoSubmit)}>
            <Grid container direction="row" alignItems="center">
              <Avatar
                className="main-user-profile"
                src={
                  drawerLogoImage
                    ? `${baseUrl}/asset/${drawerLogoImage}`
                    : `${baseUrl}/asset/${LogoprofileData?.assetId}`
                }
                alt="User Profile"
                variant="circular"
              />
              <Button
                className="main-user-profile-upload-btn"
                onClick={openLogomodal}
              >
                Upload New Logo
              </Button>

              <Grid size={12} container className="main-account-drawer-btn">
                <CustomButton
                  label="Submit"
                  type="submit"
                  className="main-user-submit-btn"
                />
              </Grid>
            </Grid>
          </form>
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
    <Modal
      open={uploadOrganisationModalOpen}
      onClose={() => setUploadOrganisationModalOpen(false)}
    >
      <Box className="modal-upload-container">
        <FileUpload
          acceptedFiles={["image/jpeg", "image/png"]}
          resolution={{ width: 200, height: 200 }}
          onSubmit={handleOrganisationImageUpload}
        />
      </Box>
    </Modal>
  </Grid>
);
});

export default PersonalAndOrganisationDetails;
