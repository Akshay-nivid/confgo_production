import CustomButton from "@/components/CustomButton/CustomButton";
import Grid from "@mui/material/Grid2";
import { EditOutlined } from "@mui/icons-material";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import { IconButton, Typography } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import apiClient from "@/Libs/Https/API-client";
import { useParams } from "react-router-dom";
import useStore from "@/Libs/store";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import moment from "moment";

const EventInfoCard = (eventData: any) => {
  const { id } = useParams();
  const setDataById = useStore((state: any) => state.setDataById);
  const { control, handleSubmit, reset } = useForm<any>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const [originalData, setOriginalData] = useState(eventData?.eventData);

  useEffect(() => {
    if (eventData?.eventData) {
      const formattedEventData = {
        ...eventData.eventData,
        startTime: moment(eventData.eventData.startTime).format(
          "YYYY-MM-DDTHH:mm"
        ),
        endTime: moment(eventData.eventData.endTime).format("YYYY-MM-DDTHH:mm"),
      };
      reset(formattedEventData);
      setOriginalData(eventData.eventData);
    }
  }, [eventData, reset]);

  const restore = () => {
    if (originalData) {
      const formattedOriginalData = {
        ...originalData,
        startTime: moment(originalData.startTime).format("YYYY-MM-DDTHH:mm"),
        endTime: moment(originalData.endTime).format("YYYY-MM-DDTHH:mm"),
      };
      reset(formattedOriginalData);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        startTime: moment(data.startTime, "YYYY-MM-DD HH:mm:ss").format(
          "YYYY-MM-DDTHH:mm"
        ),
        endTime: moment(data.endTime, "YYYY-MM-DD HH:mm:ss").format(
          "YYYY-MM-DDTHH:mm"
        ),
      };
      const response = await apiClient.post(
        `event/update/${id}`,
        formattedData
      );
      console.log("API Response", response.data);
      const { status, message } = await processAPIResponse(
        response,
        "event-information-update"
      );
      if (status) {
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "success",
          message: message,
        });
        reset();
        closeDrawer();
      } else {
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "error",
          message: message || "Failed to update the event. Please try again.",
        });
      }
    } catch (error) {
      // Show error message using Snackbar
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: "Failed to update the event. Please try again.",
      });
    }
  };

  const eventTypeOptions = [
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
    { value: "hybrid", label: "Hybrid" },
  ];

  return (
    <Grid container className="event-detail-event-info-card" spacing={2}>
      <Grid
        size={{ xs: 6 }}
        container
        alignItems="center"
        justifyContent="flex-start"
      >
        <Grid size={{ xs: 6 }}>
          <Typography
            variant="h3"
            className="create-event-description"
            style={{ marginRight: 8 }}
          >
            Event Information
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <CustomButton
            className="event-detail-event-info-card-publish-btn"
            startIcon={<EditOutlined />}
            label="Edit"
            onClick={openDrawer}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography className="event-information-subtitle">
            Event Name
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography className="event-information-content" fontWeight="bold">
            {eventData?.eventData?.name}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Typography className="event-information-subtitle">
            Event Description
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography className="event-information-content" fontWeight="bold">
            {eventData?.eventData?.description}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Typography className="event-information-subtitle">
            Event Type
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography className="event-information-content" fontWeight="bold">
            {eventData?.eventData?.eventClass}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Typography className="event-information-subtitle">
            Event Start Date & Time
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography className="event-information-content" fontWeight="bold">
            {moment(eventData?.eventData?.startTime).format(
              "MMM D, YYYY hh:mm a"
            )}
          </Typography>
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Typography className="event-information-subtitle">
            Event End Date & Time
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography className="event-information-content" fontWeight="bold">
            {moment(eventData?.eventData?.endTime).format(
              "MMM D, YYYY hh:mm a"
            )}
          </Typography>
        </Grid>
      </Grid>
      {/* Drawer Component */}
      <CustomDrawer open={isDrawerOpen} type="right">
        <Grid container spacing={2} padding={2}>
          <Grid
            size={{ xs: 12 }}
            container
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h3" className="event-information-edit-heading">
              Edit Event Information
            </Typography>
            <IconButton onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} direction="column">
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    name="name"
                    placeholder="Event Name"
                    control={control}
                    requiredField
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomSelect
                    name="eventClass"
                    label="Event Type"
                    control={control}
                    options={eventTypeOptions}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    name="description"
                    multiline
                    rows={6}
                    placeholder="Description"
                    control={control}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    placeholder="Start Date & Time"
                    control={control}
                    name={"startTime"}
                    type="datetime-local"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    placeholder="End Date & Time"
                    control={control}
                    name={"endTime"}
                    type="datetime-local"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Grid
                    container
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid>
                      <CustomButton
                        className="event-information-restore-btn"
                        label="Restore"
                        variant="outlined"
                        size="large"
                        onClick={restore}
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
            </form>
          </Grid>
        </Grid>
      </CustomDrawer>
    </Grid>
  );
};

export default EventInfoCard;
