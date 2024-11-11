
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

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

interface AccountSettingProps {
  setEmail: (email: string) => void; 
}

const AccountSetting: React.FC<AccountSettingProps> = ({ setEmail }) => {
  const { handleSubmit, control, setValue } = useForm<Profile>();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  useEffect(() => {
    AccountProfile();
  }, []);

  // Fetch profile data
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

        // Prepopulate the form
        setValue("firstName", data.firstName);
        setValue("lastName", data.lastName);
        setValue("email", data.email);
        setValue("phone", data.phone);

        setEmail(data.email); 
      }
    } catch (error) {
      console.error("Error fetching participant data:", error);
    }
  }, [setEmail,setValue]);

  // Submit form to update profile data
  const onSubmit = async (data: Profile) => {
    try {
      const response = await apiClient.put(`/user`, data, {
    
      });

      if (response.data.status === "success") {
        // Update local state with the new data
        setProfileData((prevProfileData) => ({
          ...prevProfileData,
          ...data,
        }));
        closeDrawer();
      }
    } catch (error) {
      console.error("Error updating profile data:", error);
    }
  };

  return (
    <Grid container p={1}>
      <Grid size={8} className="account-profile-grid" p={2}>
        <Grid size={12} display="flex" alignItems="center">
          <Typography className="account-title">Personal Information</Typography>
          <IconButton onClick={openDrawer} className="event-detail-event-info-card-edit-btn">
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid display="flex" mt={2}>
          <Avatar
          className="user-profile"
            src={profileData?.avatarUrl}
            alt="User Profile"
            variant="square"
          />
        </Grid>
        <Grid container spacing={2} marginTop={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography className="account-user-detail1">
              First Name
            </Typography>
            <Typography variant="body1" className="account-user-detail2">
              {profileData?.firstName || "N/A"}
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

      <Grid size={8} p={2} marginTop={2} className="account-profile-grid">
      <Typography className="account-title">Connected accounts</Typography>
      <Grid mt={2} display="flex" alignItems="center">
          <Grid
            className="account-connected-grid"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ width: 100, height: 50, mr: 2 }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google"
              style={{ width: 60, height: 32 }}
            />
          </Grid>
        </Grid>
      </Grid>

      <CustomDrawer open={isDrawerOpen} type="right">
        <Grid container spacing={2} padding={2}>
          <Grid size={12} container justifyContent="space-between" alignItems="center">
            <Typography className="account-title">Personal Information</Typography>
            <IconButton onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Grid>
          <Grid size={12} mt={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} direction="column">
                <Grid size={12}>
                  <CustomTextField name="firstName" placeholder="First Name" control={control} requiredField />
                </Grid>
                <Grid size={12}>
                  <CustomTextField name="lastName" placeholder="Last Name" control={control} requiredField />
                </Grid>
                <Grid size={12} mt={2} container justifyContent="flex-end" alignItems="center">
                  <CustomButton label="Change" variant="contained" size="large" type="submit" className="account-submit-btn"/>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </CustomDrawer>
    </Grid>
  );
};

export default AccountSetting;
