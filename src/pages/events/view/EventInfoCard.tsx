import CustomButton from "@/components/CustomButton/CustomButton";
import Grid from "@mui/material/Grid2";
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
import { formatUTCDateTime, processAPIResponse } from "@/Utils/CommonBaseClass";
import moment from "moment";
import EditIcon from "@/assets/svg/event-edit.svg";
import parse from 'html-react-parser';
import ReactQuill from "react-quill";
import React from "react";
import config from "../../../../config.json";
import FileListModal from "@/components/FileUpload/FileListModal";
import { State } from "country-state-city";


const baseUrl = config.api.url;

interface CustomFile {
  id: number;
  name: string;
  sourcePath: string;
}

/**
 * Information Card to view and update event details.
 * @param eventData
 * @returns
 */
const EventInfoCard: React.FC<any> = React.memo(
  ({ eventData, onSubmitHandler }) => {
  const { id } = useParams();
  const setDataById = useStore((state: any) => state.setDataById);
  const { control, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<any>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Functions to open and close the drawer.
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Store a copy of the original event data for restoring data.
  const [originalData, setOriginalData] = useState(eventData);
  const [editorContent, setEditorContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const companyId = sessionStorage.getItem('companyId');

  /**
   * useEffect hook to reset the form with formatted event data when `eventData` changes.
   */
  useEffect(() => {
    if (eventData) {
      const formattedEventData = {
        ...eventData,
        startTime: moment(eventData.startTime).format(
          "YYYY-MM-DDTHH:mm"
        ),
        endTime: moment(eventData.endTime).format("YYYY-MM-DDTHH:mm"),
      };
      reset(formattedEventData);
      setEditorContent(eventData.description);
      setValue("description", eventData.description);
      setValue("address",eventData?.venue?.address);
      setValue("city",eventData?.venue?.city);
      setValue("postalCode",eventData?.venue?.postalCode);
      setValue("state",eventData?.venue?.state);
      setValue("mapUrl",eventData?.venue?.mapUrl);
      setOriginalData(eventData);
    }
  }, [eventData, reset]);

  /**
   * Function to restore form data to its original state.
   */
  const restore = () => {
    if (originalData) {
      const formattedOriginalData = {
        ...originalData,
        startTime: moment(originalData.startTime).format("YYYY-MM-DDTHH:mm"),
        endTime: moment(originalData.endTime).format("YYYY-MM-DDTHH:mm"),
      };
      reset(formattedOriginalData);
      closeDrawer();
    }
  };

  /**
   * Form submission handler that sends the updated event data to the API.
   * @param data
   */
  const onSubmit = async (data: any) => {
    // Format the date and time fields before update request.
    const excludeKeys = ['slugName','city','address','venue','country','mapUrl','postalCode','state','status','templateId','template','eventPriceTiers','eventProgramSchedules','programs','addons'];
    const formattedData = {
      //remove unnessary fields
      ...Object.fromEntries(
        Object.entries(data).filter(([key]) => !excludeKeys.includes(key))),
      startTime: formatUTCDateTime(data.startTime),
      endTime: formatUTCDateTime(data.endTime),
      assetId:selectedFile?.id,
      venue:{
        name: data?.name,
        mapUrl: data?.mapUrl,
        address: data?.address,
        city: data?.city,
        state: data?.state,
        country: data?.country,
        postalCode: data?.postalCode,
    }
  }

    const response = await apiClient.put(`event/update/${id}`, formattedData);
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
      onSubmitHandler();
    } else {
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: message || "Failed to update the event. Please try again.",
      });
    }
  };

  /**
 *  Map options for dropdown
 */
const countryOptions = [
  {
    label: "United States",
    value: "US",
  },
  {
    label: "India",
    value: "IN",
  },
];

/**
 * Handle State dropdown according to Country
 * @param countryCode 
 * @returns 
 */
const stateOptions = (countryCode:any) =>
  State.getStatesOfCountry(countryCode)?.map((s:any) => ({
    label: s.name,
    value: s.isoCode,
  }));

   /**
     * Method handles the on change event for description editor
     * @param value : event value
     */
   const handleChange = (value: any) => {
    setEditorContent(value);
    setValue("description", value);
  };

  // Array of options for the event type dropdown.
  const eventTypeOptions = [
    { value: "ONLINE", label: "Online" },
    { value: "OFFLINE", label: "Offline" },
    { value: "HYBRID", label: "Hybrid" },
  ];
  /**
   * method to handle event info edit
   */
  const eventEdit=()=>{
    if(eventData?.published){
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: "Event is Already Published !",
      });
    }else{
      if(eventData?.assetId!=0){
        setSelectedFile({
          id: eventData?.assetId,
          name: 'Business'
      });
      }

      openDrawer()
    }
  }

    /**
   *function to handle clean file state
   */
   const handleFileDelete = () => {
    setSelectedFile(null);
  };


    /**
     *  Configuration for the editor toolbar
     */
    const modules = {
      toolbar: [
        [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
        ['bold', 'italic', 'underline'],
      ]
    };
  return (
    <Grid container className="event-detail-event-info-card" spacing={2}>
      <Grid
        size={{ xs: 12 }}
        container
        justifyContent="flex-start"
      >
        <Grid container size={{xs: 12}}>
        <Grid>
          <Typography
            variant="h3"
            className="event-detail-event-info-card-title"
          >
            Event Information
          </Typography>
        </Grid>
        <Grid>
          <IconButton onClick={eventEdit} className="event-detail-event-info-card-edit-btn">
            <EditIcon />
          </IconButton>
        </Grid>
        </Grid>
        {eventData?.assetId!=0&& <Grid size={0}>
        </Grid>}
       {eventData?.assetId!=0&&<Grid size={{ xs: 12 }}>
        <Grid container flexDirection={"row"} direction={"row"}>
                        <Grid>
                          <Grid
                            container
                            className="create-event-btn-container-img-box"
                            key={'event-information-logo-id'}
                            alignItems={"flex-start"}
                          >
                            <Grid>
                              <img
                                src={`${baseUrl}asset/${eventData?.assetId}`}
                                alt={'Business'}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                  </Grid>
        </Grid>} 
        <Grid size={{ xs: 3 }}>
          <Typography className="event-information-subtitle">
             Name
          </Typography>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <Typography className="event-information-content">
            {eventData?.name}
          </Typography>
        </Grid>

        <Grid size={{ xs: 3 }}>
          <Typography className="event-information-subtitle">
             Description
          </Typography>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <Typography className="event-information-content">
            {eventData?.description && parse(eventData?.description)}
          </Typography>
        </Grid>

        <Grid size={{ xs: 3 }}>
          <Typography className="event-information-subtitle">
             Type
          </Typography>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <Typography className="event-information-content">
            {eventData?.eventClass}
          </Typography>
        </Grid>

        <Grid size={{ xs: 3 }}>
          <Typography className="event-information-subtitle">
             Start Date
          </Typography>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <Typography className="event-information-content">
            {moment(eventData?.startTime).format(
              "MMM D, YYYY"
            )}
          </Typography>
        </Grid>

        <Grid size={{ xs: 3 }}>
          <Typography className="event-information-subtitle">
             End Date
          </Typography>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <Typography className="event-information-content">
            {moment(eventData?.endTime).format(
              "MMM D, YYYY"
            )}
          </Typography>
        </Grid>
        <Grid size={{ xs: 3 }}>
          <Typography className="event-information-subtitle">
             Price
          </Typography>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <Typography className="event-information-content">
            {eventData?.amount}
          </Typography>
        </Grid>
      </Grid>
      {/* Drawer Component */}
      <CustomDrawer open={isDrawerOpen} type="right">
        <Grid container spacing={2} padding={2} className="event-information-custom-drawer">
          <Grid
            size={{ xs: 12 }}
            container
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography className="event-information-edit-heading">
              Edit Event Information
            </Typography>
            <IconButton onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 12 }} mt={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} direction="column">
              <Grid size={{ xs: 12, sm: 12 }} direction={'row'} container flexDirection={"row"}>
                            <Grid container direction={'row'} alignItems={'center'} justifyContent={"center"} alignContent={"center"}>
                            {selectedFile &&(
                              <Grid className="create-event-btn-container-img-box" >
                                <img
                                  src={selectedFile?.id?`${baseUrl}asset/${selectedFile?.id}`:`${baseUrl}asset/${eventData?.assestId}`}
                                  alt={selectedFile?.name}
                                />
                              </Grid>
                            )}
                              <CustomButton
                            className="create-event-btn-container-select-btn"
                            label="Choose Logo"
                            variant="outlined"
                            onClick={() => setModalOpen(true)}
                          />
                              {selectedFile && ( <Grid container spacing={1}>

                                <CustomButton
                                className="create-event-btn-container-delete-btn"
                                label="Delete"
                                variant="outlined"
                                onClick={handleFileDelete}
                                />
                              </Grid>
                              )}
                            </Grid>                   
                        <Grid
                          className="create-event-btn-container"
                          container
                          justifyContent={"flex-start"}
                          size={{ xs: 12, sm: 12 }}
                          direction={'row'}
                        >
                         
                          <Grid>
                            {modalOpen && (
                              <FileListModal
                                open={modalOpen}
                                handleClose={() => setModalOpen(false)}
                                onSelectFile={(files: CustomFile[]) => {
                                  // Automatically select the newly uploaded file if it exists
                                  if (files && files.length > 0) {
                                    setSelectedFile(files[0]); // Set only the first selected file
                                  }
                                  setModalOpen(false);
                                }}
                                companyId={companyId}
                                multipleSelect={false}
                                imagesPerRow={4}
                              />
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
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
                    key='eventClass'
                    name="eventClass"
                    label="Event Type"
                    control={control}
                    options={eventTypeOptions}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <ReactQuill
                      modules={modules}
                      className={
                        errors?.description ||
                        watch("description") === "<p><br></p>"
                          ? "create-event-description-error"
                          : ""
                      }
                      value={editorContent}
                      onChange={handleChange}
                      theme="snow"
                      placeholder="Type your description here..."
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
                  <CustomTextField
                    name="amount"
                    placeholder="Price"
                    control={control}
                  />
                </Grid>
                {watch("eventClass") !== "OFFLINE" && (
                    <Grid size={{ xs: 12, sm: 12 }}>
                      <CustomTextField
                        placeholder="Url"
                        control={control}
                        name="url"
                        type="text"
                        rules={{ required: watch("eventClass") === "ONLINE" }}
                      />  
                    </Grid>
                  )}
                
                 {watch("eventClass") !== "ONLINE" && (
                    <>
                      <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                          placeholder="Location URL (must be a Google Maps link with latitude and longitude)"
                          control={control}
                          name="mapUrl" 
                          type="text" 
                          rules={{
                            required: false,
                            validate: (value: any) => {
                              if (value) {
                                const isValidGoogleMapsLink = /^(https?:\/\/)?(www\.)?google\.(com|[a-z]{2})\/maps\/(place\/[^\/]+\/@|@)([+-]?\d{1,2}\.\d+),([+-]?\d{1,3}\.\d+),(\d{1,2}(\.\d+)?z)(\/data=.*)?(\/entry=.*)?$/.test(
                                  value
                                );
                                return (
                                  isValidGoogleMapsLink ||
                                  "URL must be a valid Google Maps link with latitude, longitude, and zoom level"
                                );
                              }
                              return true;
                            },                         
                                                      
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                          placeholder="Address"
                          control={control}
                          name="address"
                          type="text"
                          rules={{ required: watch("type") === "OFFLINE" }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }}>
                      <CustomSelect
                          name="country"
                          label="Country"
                          control={control}
                          options={countryOptions}
                          defaultValue="IN"
                          onChange={(e:any) => {
                            setValue("country", e.target.value);
                            setValue("state", "");
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }}>
                         <CustomSelect
                            name="state"
                            label="State"
                            control={control}
                            options={stateOptions(watch("country")) || []}
                            rules={{
                              required:Boolean(watch('country')),
                            }}
                            fullWidth
                          />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                          placeholder="City"
                          control={control}
                          name="city"
                          type="text"
                          rules={{ required: watch("eventClass") === "OFFLINE" }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                          placeholder="Pin Code"
                          control={control}
                          name="postalCode"
                          type="text"
                          rules={{
                            required: watch("type") === "OFFLINE",
                            pattern: {
                              value: /(^\d{5}(-\d{4})?$)|(^\d{6}$)/,
                              message: "Enter a valid postal code (e.g., '12345', '12345-6789', or '123456')",
                            },
                          }}
                        />
                      </Grid>

                    </>
                  )}
                
                <Grid size={{ xs: 12 }} mt={2}>
                  <Grid
                    container
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid>
                      <CustomButton
                        className="event-information-restore-btn"
                        label="Cancel"
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
});

export default EventInfoCard;
