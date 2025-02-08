import CustomButton from "@/components/CustomButton/CustomButton";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { PUT, setDataById } from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import { CloseOutlined } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EditUserDrawerProps {
  data: UserData;
  closeDrawer: () => void;
  onSuccess: () => void;
}

type UserData = {
  id: number;
  firstName: string;
  lastName: string;
};

/**
 * EditUserDrawer Component - A component to edit user details.
 */
const EditUserDrawer: React.FC<EditUserDrawerProps> = ({ data, closeDrawer, onSuccess }) => {
  const [originalData, setOriginalData] = useState(data);
  const { id, firstName, lastName } = data;
  const { control, handleSubmit, setValue, reset } = useForm<any>();

  /**
   * Updates form fields when user data changes.
   */
  useEffect(() => {
    setValue("firstName", firstName);
    setValue("lastName", lastName);
    setOriginalData(data);
  }, [data, setValue]);

  /**
   * Restores the form to its original state and closes the drawer.
   */
  const restore = () => {
    if (originalData) {
      reset(originalData);
      closeDrawer();
    }
  };

  /**
   * Handles form submission to update user details.
   * @param formData - The updated user data from the form.
   */
  const onSubmit = async (formData: any) => {
      await PUT({
        url: `user/update/${id}`,
        id: "updateEditUserInfo",
        body: { ...formData },
        errorCB: (context: any) => {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "error",
            message:
              context.message ||
              "Failed to update the user details.",
          });
          Logger.error("EditUserDrawer", context?.message);
        },
        successCB: () => {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "success",
            message: "user details updated",
          });
          closeDrawer();
          onSuccess();
        },
      });
  };

  return (
    <Grid container spacing={2} padding={2} className="edit-user-custom-drawer">
      {/* Drawer header with title and close button */}
      <Grid
        size={{ xs: 12 }}
        container
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography className="edit-user-custom-drawer-heading">
          Edit User Info
        </Typography>
        <IconButton onClick={closeDrawer}>
          <CloseOutlined />
        </IconButton>
      </Grid>

      {/* Form content */}
      <Grid size={{ xs: 12 }} mt={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* First name input field */}
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                name="firstName"
                placeholder="First Name"
                control={control}
                type="text"
                rules={{
                  required: { value: true, message: "First Name is required" },
                  pattern: {
                    value: /^(?!\s*$)(?!\s+$).+/,
                    message: "First Name cannot be only spaces"
                  },
                }}
              />
            </Grid>
            {/* First name input field */}
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                name="lastName"
                placeholder="Last Name"
                control={control}
                type="text"
                rules={{
                  required: { value: true, message: "Last Name is required" },
                  pattern: {
                    value: /^(?!\s*$)(?!\s+$).+/,
                    message: "Last Name cannot be only spaces"
                  },
                }}
              />
            </Grid>
            {/* Form action buttons */}
            <Grid size={{ xs: 12 }} mt={2}>
              <Grid
                container
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
              >
                <Grid>
                  {/* Cancel button restores original data */}
                  <CustomButton
                    className="event-information-restore-btn"
                    label="Cancel"
                    variant="outlined"
                    size="large"
                    onClick={restore}
                  />
                </Grid>
                <Grid>
                  {/* Submit button to submit the form */}
                  <CustomButton
                    className="event-information-edit-btn"
                    label="Submit"
                    variant="contained"
                    size="large"
                    type="submit"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default EditUserDrawer;
