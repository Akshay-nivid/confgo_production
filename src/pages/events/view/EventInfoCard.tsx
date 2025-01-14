import CustomButton from "@/components/CustomButton/CustomButton";
import Grid from "@mui/material/Grid2";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import { IconButton, Typography } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import apiClient from "@/Libs/Https/API-client";
import { useParams } from "react-router-dom";
import useStore, { POST } from "@/Libs/store";
import { formatUTCDateTime, processAPIResponse } from "@/Utils/CommonBaseClass";
import moment from "moment";
import EditIcon from "@/assets/svg/event-edit.svg";
import parse from 'html-react-parser';
import ReactQuill from "react-quill";
import React from "react";
import config from "../../../../config.json";
import FileListModal from "@/components/FileUpload/FileListModal";
import { validateEmail, validateMaxLength, validatePhoneNumber } from "@/Utils/Validation";
import GoogleMapPlacePicker from "../GoogleMapPlacePicker";
import CustomSwitch from "@/components/CustomSwitch/CustomSwitch";
import CustomActionModal from "@/components/CustomActionModal/CustomActionModal";
import { WarningIcon } from "@/assets/svg";


const baseUrl = config.api.url;

interface CustomFile {
  id: number;
  name: string;
  sourcePath: string;
}

interface Specialty{
  value:number,
  label:string
}

/**
 * Information Card to view and update event details.
 * @param eventData
 * @returns
 */
const EventInfoCard: React.FC<any> = React.memo(
  ({ eventData, onSubmitHandler }) => {
  const { id } = useParams();
  const methods = useForm<any>();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = methods;
  const setDataById = useStore((state: any) => state.setDataById)
  // const { control, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<any>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [specialty,setspecialty]=useState<Specialty[]>([]);
  // Functions to open and close the drawer.
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const [drawerOpen,setDrawerOpen]=useState(false);

  // Store a copy of the original event data for restoring data.
  const [originalData, setOriginalData] = useState(eventData);
  const [editorContent, setEditorContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const companyId = sessionStorage.getItem('companyId');
  const [isWarning, setIsWarning] = useState(false);
  const [SubmitData, setSubmitData] = useState();
    /**
   *useEffect get specialty
   */
   useEffect(() => {
    getspecialty()
},[])
  /**
   * useEffect hook to reset the form with formatted event data when `eventData` changes.
   */
  useEffect(() => {
    if (eventData) {
      const formattedEventData = {
        ...eventData,
        startTime: moment(eventData.startTime).format(
          "YYYY-MM-DD"
        ),
        endTime: moment(eventData.endTime).format("YYYY-MM-DD"),
      };
      reset(formattedEventData);
      setEditorContent(eventData.description);
      setValue('venueName',eventData?.venue?.name);
      setValue('country',eventData?.venue?.country);
      setValue("description", eventData.description);
      setValue("address",eventData?.venue?.address);
      setValue("city",eventData?.venue?.city);
      setValue("postalCode",eventData?.venue?.postalCode);
      setValue("state",eventData?.venue?.state);
      setValue("mapUrl",eventData?.venue?.mapUrl);
      setValue("phone",eventData?.eventContacts?.[0]?.phone)
      setValue("email",eventData?.eventContacts?.[0]?.email)
      setOriginalData(eventData);
    }
  }, [eventData, reset]);

    /**
    * get full specialty list 
    */
    const getspecialty=async ()=>{
      await POST({
          url:'specialty/list',
          body:{},
          id:'specialty-list',
          successCB: (_context: any) => {
            let _speciality:any=[];
            _context.data.forEach((item: any) => {
              _speciality.push({
                value: item?.id,
                label: item?.name
              })
            })
            setspecialty(_speciality);
          }, 
          errorCB: (context: any) => {
              setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
          }
      });
  }

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
   * handles to show warning if dates are changed
   */
  const onEditSubmit= (data:any)=>{
    //checks the start tima and end time
    const EventStart= moment(eventData?.startTime).format("MMM D, YYYY")
    const EventEnd = moment(eventData?.endTime).format("MMM D, YYYY")

    const startTime = moment(data?.startTime).format("MMM D, YYYY");
    setSubmitData(data)
    const endTime = moment(data?.endTime).format("MMM D, YYYY")
    if (startTime > endTime) {
      setError(`startTime`, {
        type: 'manual',
        message: 'Start date cannot be greater than end date',
      });
      return
    }
    { 
      if( EventStart != startTime || EventEnd != endTime){
        setIsWarning(true)
      }else{
        onSubmit(data)
      } 
     }  
  }

  /**
   * Form submission handler that sends the updated event data to the API.
   * @param data
   */
  const onSubmit = async (data: any) => {
  const formattedEndTime = `${data.endTime.split('T')[0]}T23:59`;
  const formattedStartTime=`${data.startTime.split('T')[0]}T00:00`;
    setIsWarning(false)
    // Format the date and time fields before update request.
   let excludeKeys = ['slugName','city','address','venue','country','mapUrl','postalCode','state','status','templateId','template','eventPriceTiers','eventProgramSchedules','programs','addons','eventContacts','venueId','email','phone','venueName'];
    if(data?.eventClass === "OFFLINE"){
      excludeKeys.push('url');
    }
    if(data?.eventClass === "ONLINE"){
      excludeKeys.push('venueName');
    }
    if(data?.specialtyId!='1' || data?.isAbstract !=true){
      excludeKeys.push('abstractDate');
    }
    const formattedData = {
      //remove unnessary fields
      ...Object.fromEntries(
        Object.entries(data).filter(([key]) => !excludeKeys.includes(key))),
      startTime: formatUTCDateTime(formattedStartTime),
      endTime: formatUTCDateTime(formattedEndTime),
      assetId: selectedFile?.id,
      isAbstract: data.isAbstract==true ? 1 : 0,
      ...(data?.eventClass !== "ONLINE" ?{
      venue: {
        name: data?.venueName,
        mapUrl: data?.mapUrl,
        address: data?.address,
        city: data?.city,
        state: data?.state,
        country: data?.country,
        postalCode: data?.postalCode,
      }, }
      : {}),
      contacts: [
        {
          phone: data?.phone,
          email: data?.email
        }
      ],
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
            Basic Info
          </Typography>
        </Grid>
        <Grid>
          <IconButton onClick={eventEdit} className="event-detail-event-info-card-edit-btn">
            <EditIcon />
          </IconButton>
        </Grid>
        </Grid>
         {eventData?.assetId ?
         <Grid size={12}>
       {/* <Grid size={0}>  */}
        {/* {eventData?.assetId!=0&& <Grid size={0}>
        </Grid>} */}
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
        </Grid>
         : null} 
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
      <Grid size={{ xs: 3 }}>
          <Typography className="event-information-subtitle">
             Phone
          </Typography>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <Typography className="event-information-content">
            {eventData?.eventContacts?.[0]?.phone}
          </Typography>
        </Grid>
        <Grid size={{ xs: 3 }}>
          <Typography className="event-information-subtitle">
             Email
          </Typography>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <Typography className="event-information-content">
            {eventData?.eventContacts?.[0]?.email}
          </Typography>
        </Grid>
         
        <Grid size={{ xs: 3 }}>
          <Typography className="event-information-subtitle">
          Specialty
          </Typography>
        </Grid>
        <Grid size={{ xs: 9 }}>
          <Typography className="event-information-content">
            {eventData?.speciality?.name}
          </Typography>
        </Grid>
        {eventData?.eventClass === "ONLINE" && (
        <>
         <Grid size={{ xs: 3 }}>
            <Typography className="event-information-subtitle">URL</Typography>
        </Grid>
        <Grid size={{ xs: 3 }}>
            <Typography className="event-information-content">
                {eventData?.url}
            </Typography>
        </Grid>
    </>
)}

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
              Edit Basic Info
            </Typography>
            <IconButton onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 12 }} mt={2}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onEditSubmit)}>
              <Grid container spacing={2} direction="column">
              <Grid size={{ xs: 12, sm: 12 }} direction={'row'} container flexDirection={"row"}>
                            <Grid container direction={'row'} alignItems={'center'} justifyContent={"center"} alignContent={"center"}>
                            {selectedFile &&(
                              <Grid className="create-event-btn-container-img-box" >
                                <img
                                  src={selectedFile?.id?`${baseUrl}asset/${selectedFile?.id}`:`${baseUrl}asset/${eventData?.assetId}`}
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
                    rules={{
                      required: true,
                      maxLength: validateMaxLength({
                        maxLength: 255,
                        fieldName: 'Event Name',
                      }),
                    }}
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
                    placeholder="Start Date"
                    control={control}
                    name="startTime"
                    type="date"
                    defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                    min={moment(new Date()).format("YYYY-MM-DD")}
                    rules={{
                      pattern: {
                        value: /^\d{4}-\d{2}-\d{2}$/, 
                        message: "Please enter a valid start date (DD-MM-YYYY)"
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    placeholder="End Date"
                    control={control}
                    name="endTime"
                    type="date"
                    defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                    min={moment(new Date()).format("YYYY-MM-DD")}
                    rules={{
                      pattern: {
                        value: /^\d{4}-\d{2}-\d{2}$/,
                        message: "Please enter a valid end date (DD-MM-YYYY)"
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    name="amount"
                    placeholder="Price"
                    control={control}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    placeholder="Phone"
                    control={control}
                    name="phone"
                    type="phone"
                    rules={{
                      required: 'Phone is required',
                      pattern: validatePhoneNumber({})
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    placeholder="Email"
                    control={control}
                    name="email"
                    type="email"
                    rules={{
                      required: 'Email is required',
                      pattern: validateEmail({})
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12}}>
                    <CustomSelect
                    fullWidth
                    className="add-program-select"
                    name="specialtyId"
                    control={control}
                    label="Specialty"
                    options={specialty}
                    />
                  </Grid>
                  {watch('specialtyId')=='1'&&
                  <Grid size={{ xs: 12 }}>
                      <CustomSwitch
                        className="add-program-switch-btn"
                        buttonColor="success"
                        label="Abstract Submission"
                        name={`isAbstract`}
                        control={control}
                      />
                  </Grid>}
                  {watch('specialtyId')=='1'&& watch('isAbstract') == true && 
                  <Grid size={{xs:12}}>
                    <CustomTextField
                      placeholder="Abstract Submission Date"
                      control={control}
                      name="abstractDate"
                      type="date"
                      className="create-event"
                      defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                      min={moment(new Date()).format("YYYY-MM-DD")}
                      rules={{
                        required:true,
                        pattern: {
                          value: /^\d{4}-\d{2}-\d{2}$/, 
                          message: "Please enter a valid start date (DD-MM-YYYY)"
                        }
                      }}
                    />
                  </Grid>}
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
              <CustomDrawer open={drawerOpen} type="right" children={
                <GoogleMapPlacePicker onClose={()=>setDrawerOpen(false)}/>
                  } />
            </form>
            </FormProvider>
          </Grid>
        </Grid>
      </CustomDrawer>
      <CustomActionModal
        icon={<WarningIcon className="unpublish-modal-icon" />}
        open={isWarning}
        onClose={() => setIsWarning(false)}
        cancelLabel="Cancel"
        cancelAction={() => setIsWarning(false)}
        header="Warning"
        subHeader="Changing the event date may require updating the program dates associated with this event."
        submitAction={() => onSubmit(SubmitData)}
        submitLabel="Done"
        modalClassName="unpublish-modal"
      />
    </Grid>
  );
});

export default EventInfoCard;
