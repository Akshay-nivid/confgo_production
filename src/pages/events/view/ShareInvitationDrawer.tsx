import { IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { useForm } from "react-hook-form";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import { CloseOutlined } from "@mui/icons-material";
import CustomChip from "@/components/CustomChip/CustomChip";
import config from "../../../../config.json";
import useStore from "@/Libs/store";

interface ShareInvitationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: any;
  eventURL: string;
}

/**
 * ShareInvitationDrawer component for managing the event invitation form
 */
const ShareInvitationDrawer: React.FC<ShareInvitationDrawerProps> = ({
  isOpen,
  onClose,
  eventData,
  eventURL,
}) => {
  const { setDataById }: any = useStore();
  const { control, reset, handleSubmit } = useForm<any>();
  const subDomain = config['event']['sub-domain'];

  /**
   * Email validation function used for validating chips in CustomChip
   * @param {string} chip - value
   * @returns {string | boolean} - Returns a string error message if the chip is invalid, or `true` if valid.
   */
  const validateEmail = (chip: string) => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chip.trim());
    if (!isValidEmail) {
      return "Please enter a valid email address.";
    }
    return true;
  };

  // Handles form submission
  const onSubmit = async (data: any) => {
    const req = {
      eventName: eventData?.name,
      eventUrl: `${subDomain}${eventURL}`,
      emails: data.emails,
      notes: data.notes,
    };

    // Making an API request to send email invitations
    const response = await apiClient.post(`notification/emailInivte`, req);
    const { status, message } = await processAPIResponse(
      response,
      "event-share-invitation"
    );

    // Handling the response from the API
    if (status) {
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "success",
        message: message,
      });
      reset();
      onClose();
    } else {
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: message || "Failed to share invitation. Please try again.",
      });
    }
  };

  /**
   * Resets the form and closes the drawer
   */
  const resetForm = () => {
    reset({
      emails: "",
      notes: "",
    });
    onClose();
  };

  return (
    <CustomDrawer open={isOpen} type="right">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} direction="column">
          <Grid
            className="share-invitation-drawer"
            container
            spacing={2}
            padding={2}
          >
            <Grid
              size={{ xs: 12 }}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography className="event-information-edit-heading">
                Share Invitation
              </Typography>
              <IconButton onClick={onClose}>
                <CloseOutlined />
              </IconButton>
            </Grid>

            {/* CustomChip component for entering email addresses */}
            <CustomChip
              name="emails"
              control={control}
              label="E Mails"
              placeholder=""
              rules={{ required: "At least one email is required" }}
              validateChip={validateEmail}
            />

            <Grid size={{ xs: 12 }}>
              <CustomTextField
                name="notes"
                multiline
                rows={6}
                placeholder="Add Note"
                control={control}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Grid container justifyContent="flex-end" spacing={2}>
                <Grid>
                  <CustomButton
                    className="event-information-restore-btn"
                    label="Cancel"
                    variant="outlined"
                    size="large"
                    onClick={resetForm}
                  />
                </Grid>
                <Grid>
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
        </Grid>
      </form>
    </CustomDrawer>
  );
};

export default ShareInvitationDrawer;
