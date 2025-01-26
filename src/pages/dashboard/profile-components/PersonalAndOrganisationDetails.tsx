/**
 * profile ui component for appbar in main dashboard
 * @author Nevin
 * used to edit and view details of admin user
 */
import React from "react";
import Grid from "@mui/material/Grid2";
import { Avatar, Box, Button, CircularProgress, IconButton, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import "./mainProfile.scss"
import { useCallback, useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { CloseOutlined } from "@mui/icons-material";
import apiClient from "@/Libs/Https/API-client"; 
import EditIcon from "@/assets/svg/event-edit.svg";
import useStore from "@/Libs/store/store";
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
  const [loading, setLoading] = useState(false); 
  const [compId,setCompId]=useState()

  const baseUrl = config.api.url;  
  const openOrganisationDrawer =()=> setorgansisationDrawer(true)
  const closeOrganisationDrawer = () => setorgansisationDrawer(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const setDataById = useStore((state: any) => state.setDataById)
  const userDetails = useStore((state) => state?.compData?.["userDetails"]) ?? {};
  useEffect(() => {
    AccountProfile();
  }, []);

/**
 * Fetch profile data of the admin user
 */
  const AccountProfile = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch company and user data
      const response = await apiClient.get(`/company`);
      const { status, data } = processAPIResponse(response, "personalInformation");
      if (status) {
        const AccountData = {     
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
          email: data.user.email,
          assetId: data.user.assetId || null,
          isSsoUser:data?.isSsoUser,       
        };
        setCompId(data.id)        
        setProfileData(AccountData); 
        useStore.getState().setDataById("company-user", { email: data?.user.email});

        const OrganisationData = {
          companyName:data.companyName,
          companyPhone:data.phone,
          companyAddress:data.companyAddress,
          companyEmail:data.email,
          assetId:data?.assetId || null
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

        setValue("companyName", data.companyName);
        setValue("companyAddress", data.companyAddress);
        
        setEmail(data.user.email);
      }
    } catch (error) {
      Logger.error("Error fetching participant data:", error);
    }
    finally {
      setLoading(false);
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
    let payload:any = {
      companyName: newdata.companyName || LogoprofileData?.companyName || "", 
      companyPhone: newdata.companyPhone || LogoprofileData?.companyPhone || "",
      companyAddress: newdata.companyAddress || LogoprofileData?.companyAddress || "", 
      companyEmail: newdata.companyEmail || LogoprofileData?.companyEmail || "",
    };

  if(drawerLogoImage || LogoprofileData?.assetId){
       payload["assetId"] = drawerLogoImage || LogoprofileData?.assetId ;
  }
    // Send the payload to the server for updating the company details
    const response = await apiClient.put(`/company/${compId}`, payload);
    const { status,message } = processAPIResponse(response, "personalInformation");
    if (status) {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: message });
      setLogoProfileData((prevData) => ({
        ...prevData,
        ...payload,
      }));
      setDataById("logo", {
        status: "success",
      });
    }
    else{
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: message })
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
      assetId: drawerProfileImage || profileData?.assetId || null,
    };
    const response = await apiClient.put(`/user`, payload);
    const { status, message } = processAPIResponse(response, "personalInformation");
    if (status) {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: message });
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

return (
  <>
  {loading ? (
    <CircularProgress />
  ) : (
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
      <Grid container className="main-account-detail-grid connected" size={12}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            First Name
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {profileData?.firstName}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Last Name
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {profileData?.lastName}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">Email</Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {profileData?.email}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Phone Number
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {profileData?.phone}
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
      {LogoprofileData?.assetId ? (
        <Avatar
          className="main-user-profile"
          src={
            LogoprofileData?.assetId
              ? `${baseUrl}asset/${LogoprofileData?.assetId}`
              : ""
          }
          alt="User Profile"
          variant="circular"
        />
      ) : (
        <Grid size={1} className="main-account-profile-image connected" mb={0}>
         {LogoprofileData?.companyName ? (
           <Avatar className="main-user-profile main-user-profile-text">
           {LogoprofileData.companyName
            .split(' ')
              .map(word => word[0].toUpperCase()) 
                .join('')} 
                  </Avatar>
                      ) : (
          <Avatar></Avatar>
                    )}
        </Grid>
      )}
      <Grid container className="main-account-detail-grid connected" size={12}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Organisation Name
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {LogoprofileData?.companyName}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Organisation Email
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {LogoprofileData?.companyEmail}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Organisation Phone Number
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {LogoprofileData?.companyPhone}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography className="main-account-user-detail1">
            Organisation Address
          </Typography>
          <Typography variant="body1" className="main-account-user-detail2">
            {LogoprofileData?.companyAddress}
          </Typography>
        </Grid>
      </Grid>
    </Grid>

    <CustomDrawer open={isDrawerOpen} type="right">
      <Grid container className="main-account-drawer">
        <Grid size={12} display={'flex'} justifyContent={'space-between'} alignItems={'center'} container className="main-account-drawer-text">
          <Typography className="edit-personal-text">
            Edit Personal Details
          </Typography>
          <IconButton onClick={closeDrawer} className="close">
            <CloseOutlined />
          </IconButton>
        </Grid>
        <Grid size={12} className="main-connected">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction="row" alignItems="center">
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
              <Button
                className="main-user-profile-upload-btn"
                onClick={openmodal}
              >
                Upload New Photo
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
          <Typography className="edit-organisation-text">
            Edit Organisation Details
          </Typography>
          <IconButton onClick={closeOrganisationDrawer}>
            <CloseOutlined />
          </IconButton>
        </Grid>
        <Grid size={12} className="main-connected">
          <form onSubmit={handleSubmit(onLogoSubmit)}>
            <Grid container direction="row" alignItems="center">
            {LogoprofileData?.assetId || drawerLogoImage != null ? (
                  <Avatar
                    className="main-user-profile"
                    src={
                      drawerLogoImage
                        ? `${baseUrl}asset/${drawerLogoImage}`
                        : `${baseUrl}asset/${LogoprofileData?.assetId}`
                    }
                    alt="User Profile"
                    variant="circular"
                  />
                ) : (
                  <>
                    {LogoprofileData?.companyName ? (
                      <Avatar className="main-user-profile main-user-profile-text">
                        {LogoprofileData.companyName
                          .split(" ")
                          .map((word) => word[0].toUpperCase())
                          .join("")}
                      </Avatar>
                    ) : (
                      <Avatar></Avatar>
                    )}
                  </>
                )}
              <Button
                className="main-user-profile-upload-btn"
                onClick={openLogomodal}
              >
                Upload New Logo
              </Button>
              <Grid size={12} className="main-user-details">
              <CustomTextField
                  name="companyName"
                  placeholder="Company Name"
                  control={control}
                  requiredField
                  className="main-account-drawer-textfield"
                />
                <CustomTextField
                  name="companyAddress"
                  placeholder="Company Address"
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
      )}
</>
);
});

export default PersonalAndOrganisationDetails;