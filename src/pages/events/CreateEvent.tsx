/**
 * CreateEvent handles the event creation first screen
 */
import { setFormValues } from "@/Utils/CommonBaseClass";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import FileListModal from "@/components/FileUpload/FileListModal";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import moment from "moment";
import React, { useCallback, useEffect,useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import config from "../../../config.json";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import { validateEmail } from "@/Utils/Validation";
import { validateMaxLength } from '@/Utils/Validation';
import GoogleMapPlacePicker from "./GoogleMapPlacePicker";
import useStore, { setDataById } from "@/Libs/store";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import CustomSwitch from "@/components/CustomSwitch/CustomSwitch";
import confgo  from "../../../config.json"
import PublicOffOutlinedIcon from '@mui/icons-material/PublicOffOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import RssFeedOutlinedIcon from '@mui/icons-material/RssFeedOutlined';
import UploadLogo from '../../assets/svg/uploadLogo.svg'
import { Close } from "@mui/icons-material";
import UploadedIcon from '../../assets/svg/CreateEventimageIcon.svg'; // Replace with your actual UploadedIcon
import CustomDateTimePicker from "@/components/CustomDateTimePicker/CustomDateTimePicker";
import CustomPhone from "@/components/CustomPhone/CustomPhone";


type EventProps = {
  formSubmit: boolean;
  formDraftSubmit: boolean;
  onSubmitHandler: (
    event: React.FormEvent<HTMLFormElement>,
    type: string
  ) => void;
  onDraftSubmitHandler: (
    event: any,
    type: string
  ) => void;
  data: any;
};

type FormData = {
  type: string;
  name: string;
  startTime: Date;
  endTime: Date;
  speakers: string;
  description: string;
  venueName: string;
  mapUrl: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  url: string;
  amount: string;
  specialtyId: string;
  assetId:string;
  phone: string;
  email: string;
  isAbstract:boolean;
  abstractDate:Date;
};

interface CustomFile {
  id: string;
  name: string;
  sourcePath: string;
}

const typeArray = [
  { label: "Offline", value: "OFFLINE", icon:<PublicOffOutlinedIcon/> },
  { label: "Online", value: "ONLINE", icon:<PublicOutlinedIcon/> },
  { label: "Hybrid", value: "HYBRID", icon:<RssFeedOutlinedIcon/> },
];

const AbstractArray =[
  {label:"Allow Uplaod Abstartct", value:true},
  {label:"Don't Allow Uplaod Abstartct", value:false}
]
interface Specialty{
  value:number,
  label:string
}
const CreateEvent: React.FC<EventProps> =
  ({ formSubmit, formDraftSubmit, onSubmitHandler, onDraftSubmitHandler, data }) => {
    const methods = useForm<FormData>()
    const {
      handleSubmit,
      control,
      setValue,
      watch,
      setError,
      clearErrors,
      formState: { errors },
    } = methods;
 
  

  const [editorContent, setEditorContent] = useState("");
  const [submitted, setSubmitted] = useState(false); 
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const companyId = sessionStorage.getItem('companyId');
  const baseUrl = config.api.url;
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const POST = useStore((state: any) => state.POST);
  const [specialty,setspecialty]=useState<Specialty[]>([]);
  const currency=confgo.currency;
  const [isPlacePickerOpen, setPlacePickerOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("OFFLINE");


    // Watch values from the form
    const fields: ('mapUrl' | 'postalCode' | 'venueName' | 'city' | 'address')[] = ['mapUrl', 'postalCode', 'venueName', 'city','address'];
    const mapUrl = watch('mapUrl');
    const postalCode = watch('postalCode');
    const venueName = watch('venueName');
    const city = watch('city');
    const address = watch('address');


    /**
     * Method handles the on change event for description editor
     * @param value : event value
     */
    const handleChange = (value: any) => {
      setEditorContent(value);
      setValue("description", value);
      if (value && value !== "<p><br></p>") {
        clearErrors("description"); 
      }
    };
    const isError = submitted && (editorContent === "" || editorContent === "<p><br></p>"); 
/**
 * This method ensures that the field with validation errors or requiring attention and Scrolls smoothly to that field
 */
    const scrollToError = useCallback(() => {
      const errorFieldMap: { [key: string]: string } = {
        name: '[name="name"]',
        description:  '#react-quill-description',
        phone: '[name="phone"]',
        email: '[name="email"]',
        startTime: '[name="startTime"]',
        endTime: '[name="endTime"]',
        amount: '[name="amount"]',
        url: '[name="url"]',
        mapUrl: '[name="mapUrl"]',
        venueName: '[name="venueName"]',
        address: '[name="address"]',
        country: '[name="country"]',
        state: '[name="state"]',
        city: '[name="city"]',
        postalCode: '[name="postalCode"]',
      };
      const errorKeys = Object.keys(errors);

      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0];
        const selector = errorFieldMap[firstErrorKey];

        if (selector) {
          const errorElement = document.querySelector(selector);

          if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center",});
            // Try to focus on the first focusable element within the error element
            const focusableElement = errorElement.querySelector("input, textarea") || errorElement;
            if (focusableElement) {
              (focusableElement as HTMLElement).focus();
            }
          }
        }
      }
    }, [errors]);

    /**
     * Useeffect hook handles the form submission based on the formSubmit variable
     */
    useEffect(() => {
      if(Object.keys(errors).length > 0){
        scrollToError();
      }
      if (formSubmit) {
        handleSubmit(onSubmit)();
      }
    }, [formSubmit]);

    /**
     * Useeffect hook handles the form submission based on the formSubmit variable
     */
    useEffect(() => {
      if (formDraftSubmit) {
        onDraftSubmitHandler && onDraftSubmitHandler(watch(), "EVENT");
      }
    }, [formDraftSubmit]);

    /**
     * Method handles the form submission
     * @param data
     */
    const onSubmit: SubmitHandler<FormData> = (data: any) => {

     // checks whether the description content is empty or not
      if (editorContent === "" || editorContent === "<p><br></p>") {
        setSubmitted(true); // Set submitted to true.
        setError(`description`, {
              type: 'manual',
               message: 'description is required',
             });
        return;
      }
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);
      const today = new Date();



      if(selectedFile){
        setValue('assetId',selectedFile[0]?.id) 
      }
      if (startTime > endTime) {
        setError(`startTime`, {
          type: 'manual',
          message: 'Start date cannot be greater than end date',
        });
        return
      }

      if (startTime < today) {
        setError('startTime', {
          type: 'manual',
          message: 'Dates cannot be in the past',
        });
        return;
      }
    //store the dates to compare 
      useStore.getState().setDataById("event-date", { startDate: startTime });
      useStore.getState().setDataById("event-date", { endDate: endTime });

      onSubmitHandler && onSubmitHandler(data, "EVENT");
    };

  /**
   * it watches the location fields whether it is filled or not 
   */
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    fields.forEach((field) => {
      const value = watch(field);
      if (value) {
        clearErrors(field);
      }
    });
  }, [mapUrl, clearErrors, setError, errors, isInitialRender, postalCode, venueName, city,address]);

    /**
     * Useeffect hook set the form values based on the data
     */
    useEffect(() => {
      if (data) {
        setFormValues(data, setValue);
        data?.description && setEditorContent(data?.description);
      } else {
        setValue("type", "OFFLINE");
      }
    }, [data]);


    /**
     *  Configuration for the editor toolbar
     */
    const modules = {
      toolbar: [
        [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
        ['bold', 'italic', 'underline'],
      ]
    };


     /**
   *function to handle clean file state
   */
  const handleFileDelete = () => {
    setSelectedFile(null);
  };
  /**
   *useEffect set assestId
   */
  useEffect(() => {
    if(watch('assetId')){
      setSelectedFile({
        id: watch('assetId'),
        name: 'Business'
    });
    }
},[])

  /**
   *useEffect get specialty
   */
   useEffect(() => {
    getspecialty()
},[])

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
            setspecialty(_speciality)
          }, 
          errorCB: (context: any) => {
              setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
          }
      });
  }

   /**
   * Open the Google Place Picker
   */
   const handleTextFieldClick = () => {
    setPlacePickerOpen(true);
  };


    /**
   * Handle closing the Google Place Picker
   */
    const handlePlacePickerClose = () => {
      setPlacePickerOpen(false);
    };

    const handleChangeType = (event) => {
      setSelectedValue(event.target.value);
    };
    
    return (
      <Box className="create-event-container">
        <Grid
          container
          size={{ xs: 12, sm: 12 }}
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid size={{ xs: 12, sm: 12 }} container m={8}>
            <Grid>
              <Typography
                variant="h3"
                lineHeight={2}
                className="create-event-title"
              >
                Event Details
              </Typography>
              <Typography
                variant="h5"
                className="create-event-title-sub"
              >
                Provide the essential information for your event to get started.
              </Typography>
            </Grid>
            <Grid>
              <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                  container
                  spacing={2}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {/* <Grid size={{ xs: 12, sm: 12 }}>
                    <CustomRadio
                      className="add-program-radio-btn"
                      control={control}
                      name="type"
                      label=""
                      options={typeArray}
                      row={true}
                      value={"OFFLINE"}
                    />
                  </Grid> */}
                  <Grid container spacing={2} size={{xs:12}}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField                      
                      className="add-program-text-Field"
                      placeholder="Event Name"
                      control={control}
                      name="name"
                      type="text"
                      rules={{
                        required: true,
                        maxLength: validateMaxLength({
                          maxLength: 255,
                          fieldName: 'Event Name',
                        }),
                      }} 
                      />
                      </Grid>
                      <Grid size={{ xs: 12, sm:6 }}>
                    <CustomSelect
                    className="add-program-select"
                    name="specialtyId"
                    control={control}
                    label="Category"
                    options={specialty}
                    defaultValue={data?.speciality?.name}
                    onChange={() => setValue('isAbstract',false)}
                    />
                  </Grid>
                  {watch('specialtyId')=='1'&&
                  <Grid size={{ xs: 12 }}   >
                    <CustomRadio
                      className="create-event-abstartct-radio-button"
                      options={AbstractArray}
                      name="isAbstract"
                      control={control}
                      row={true} // Horizontal layout
                  />
                  </Grid>}
                  {watch('isAbstract')=='true' && watch('specialtyId')=='1'&&
                  <Grid size={{xs:12,sm:6}}>
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
                  </Grid>

              
                  <Grid
                    size={{ xs: 12, sm: 12 }}
                    mb={0}
                    className="create-event-description"
                  >
                   
                    <ReactQuill
                      className={isError ? "create-event-description-error" : ""}
                      value={editorContent}
                      onChange={handleChange}
                      theme="snow"
                      placeholder="Event Description"
                      modules={modules}
                      id="react-quill-description"
                    />
                    {/* <CustomTextField
                      control={control}
                      name="description"
                      type="hidden"
                      rules={{ required: true }}
                    />
                    /> */}
                  </Grid>

                  <Grid size={{xs:12}}>
                    <Typography
                      variant="h3"
                      className="create-event-title"
                    >
                    Event Type and Location
                    </Typography>
                  </Grid>
                  <Grid size={{xs:12}}  >
  <Box className="create-event-parent"  >
    <CustomRadio
      className="create-event-radio-btn "
      control={control}
      name="type"
      label=""
      options={typeArray}
      row={true} // Horizontal layout
      labelPlacement="start"
      value={"OFFLINE"}
      onChange={handleChangeType} // Update state when selection changes
    />
  </Box>
</Grid>
                  {watch("type") !== "ONLINE" && (
                  <Grid size={{ xs: 12, sm:12 }}>      
                        <CustomTextField
                          placeholder="Venue"
                          control={control}
                          name="address"
                          readOnly={true}
                          shrink={watch('address')!==''&&watch('address')!==undefined?true:undefined}
                          type="text"
                          onClick={handleTextFieldClick} // Open the place picker on click
                          rules={{ required: watch("type") === "OFFLINE" }}
                        />  
                         {isPlacePickerOpen && (
        <GoogleMapPlacePicker createEvent={true} onClose={handlePlacePickerClose} />
      )}                   
                  </Grid>
                  )}
                  {watch("type") !== "OFFLINE" && (
                    <Grid size={{ xs: 12, sm: 12 }}>
                      <CustomTextField
                        placeholder="Url"
                        control={control}
                        name="url"
                        type="text"
                        rules={{ required: watch("type") === "ONLINE" }}
                      />
                      {errors.url && (
                        <Typography color="error" variant="body2">
                          {errors.url.message}
                        </Typography>
                      )}
                    </Grid>
                  )}
                   <Grid size={{xs:12}}>
                    <Typography
                      variant="h3"
                      className="create-event-title"
                    >
                    Event Time
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomDateTimePicker
                      placeholder="Start Date"
                      control={control}
                      name="startTime"
                      defaultValue={moment().format("YYYY-MM-DD hh:mm:a")}
                      
                      rules={{
                        required:true,
                        pattern: {
                          // value: /^\d{4}-\d{2}-\d{2}\s([01][0-9]|2[0-3]):[0-5][0-9]$/,
                          // message: "Please enter a valid start date (DD-MM-YYYY hh:mm A)"
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomDateTimePicker
                      placeholder="End Date"
                      control={control}
                      name="endTime"
                      defaultValue={moment().format("YYYY-MM-DD hh:mm:a")}
                      rules={{
                        required:true,
                        pattern: {
                          // value: /^\d{4}-\d{2}-\d{2}\s([01][0-9]|2[0-3]):[0-5][0-9]$/,
                          message: "Please enter a valid end date (DD-MM-YYYY)"
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{xs:12}}>
                    <Typography
                      variant="h3"
                      className="create-event-title"
                    >
                    Event Price
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <CustomTextField
                      placeholder="Price"
                      control={control}
                      name="amount"
                      type="number"
                      rules={{
                        pattern: {
                        value: /^(0?[1-9]|[1-9]\d{0,7})(\.\d{1,2})?$/,
                          message:
                            "Enter a valid price (up to 2 decimal places & Zero not accepted)price up to 1Crore",
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{xs:12}}>
                    <Typography
                      variant="h3"
                      className="create-event-title"
                    >
                    Event Logo
                    </Typography>
                  </Grid>
                  {selectedFile ? (
          <>
                            <Grid container size={{ xs: 12 }}>

            <Grid className="create-event-uploaded-card" direction="column">

      {/* Close Button */}
      <IconButton
        onClick={handleFileDelete}
        className="create-event-uploaded-card-close-icon"
      >
        <Close fontSize="small" />
      </IconButton>

      <Grid display={"flex"} className="event-upload-document" container direction="row"  justifyItems='center' spacing={1}>
        <UploadedIcon />
        <Typography className="uploaded-container-text">
          {selectedFile.name}
        </Typography>
      </Grid>

    
    </Grid>
    </Grid>
          </>
        ) : (
          <>
                  <Grid container size={{ xs: 12 }}>
                  <Grid size={{xs:12}}
        container 
        alignItems="center" 
        justifyContent="center" 
        className="create-event-upload-box-container"
        
      >
       
          <Grid >
            <button onClick={() => setModalOpen(true)} className="create-event-upload-box-container-button">
            <UploadLogo className="create-event-upload-box-container-button-text"/>
  
            <Typography className="create-event-upload-box-container-button-text"> Upload Logo</Typography>
            <Typography variant="body2">
              Choose a file to upload, Max file size: 5MB.<br />
              Recommended ratio: 16:9 for best fit
            </Typography>
            </button>
          </Grid>
        
      </Grid>

      {modalOpen && (
        <FileListModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          onSelectFile={(files) => {
            if (files && files.length > 0) {
              setSelectedFile(files[0]);
            }
            setModalOpen(false);
          }}
          companyId={companyId}
          multipleSelect={false}
          imagesPerRow={4}
        />
      )}
                  </Grid>
                  </>
                  )}
                    <Grid size={{xs:12}}>
                    <Typography
                      variant="h3"
                      className="create-event-title"
                    >
                      Contact Informations
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      className="add-program-text-Field"
                      placeholder="Phone"
                      control={control}
                      name="phone"
                      type="text"
                      isNumeric={true}
                       rules={{
                        required: 'Phone is required',
                      //   pattern: validatePhoneNumber({})
                       }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      className="add-program-text-Field"
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
{/*                   
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      placeholder="Start Date"
                      control={control}
                      name="startTime"
                      type="date"
                      className="create-event"
                      defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                      min={moment(new Date()).format("YYYY-MM-DD")}
                      rules={{
                        required:"Start date is a required field.",
                        pattern: {
                          value: /^\d{4}-\d{2}-\d{2}$/, 
                          message: "Please enter a valid start date (DD-MM-YYYY)"
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      placeholder="End Date"
                      className="create-event"
                      control={control}
                      name="endTime"
                      type="date"
                      defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                      min={moment(new Date()).format("YYYY-MM-DD")}
                      rules={{
                        required:'End date is a required field.',
                        pattern: {
                          value: /^\d{4}-\d{2}-\d{2}$/,
                          message: "Please enter a valid end date (DD-MM-YYYY)"
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      placeholder="Price"
                       prefix={currency}
                      control={control}
                      name="amount"
                      type="number"
                      rules={{
                        pattern: {
                        value: /^(0?[1-9]|[1-9]\d{0,7})(\.\d{1,2})?$/,
                          message:
                            "Enter a valid price (up to 2 decimal places & Zero not accepted)price up to 1Crore",
                        }
                      }}
                    />
                  </Grid>  */}
                  {/* <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomSelect
                    className="add-program-select"
                    name="specialtyId"
                    control={control}
                    label="Category"
                    options={specialty}
                    defaultValue={data?.speciality?.name}
                    onChange={() => setValue('isAbstract',false)}
                    />
                  </Grid>
                  {watch('specialtyId')=='1'&&
                  <Grid size={{ xs: 12, sm: watch('isAbstract')?6:12 }}>
                      <CustomSwitch
                        className="add-program-switch-btn"
                        buttonColor="success"
                        label="Abstract Submission"
                        name={`isAbstract`}
                        control={control}
                      />
                  </Grid>}
                  {watch('isAbstract') && watch('specialtyId')=='1'&&
                  <Grid size={{xs:12,sm:6}}>
                    <CustomTextField
                      placeholder="Abstract Submission Date"
                      control={control}
                      name="abstractDate"
                      type="date"
                      className="create-event"
                      defaultValue={moment(new Date()).format("YYYY-MM-DD")}
                      min={moment(new Date()).format("YYYY-MM-DD")}
                      rules={{
                        required:"Abstract Submission Date is required",
                        pattern: {
                          value: /^\d{4}-\d{2}-\d{2}$/, 
                          message: "Please enter a valid start date (DD-MM-YYYY)"
                        }
                      }}
                    />
                  </Grid>}
                  {watch("type") !== "OFFLINE" && (
                    <Grid size={{ xs: 12, sm: 12 }}>
                      <CustomTextField
                        placeholder="Url"
                        control={control}
                        name="url"
                        type="text"
                        rules={{ required: watch("type") === "ONLINE" }}
                      />
                      {errors.url && (
                        <Typography color="error" variant="body2">
                          {errors.url.message}
                        </Typography>
                      )}
                    </Grid>
                  )} */}

                  {/* {watch("type") !== "ONLINE" && (
                    <>
                    <Grid size={12} container justifyContent={"flex-start"} alignItems={"center"} id = "create-event-location-button"
                    >
                      <CustomButton
                      className="create-event-choose-map"
                        label="Choose Venue"
                        onClick={()=>setDrawerOpen(true)}
                        />
                          <Tooltip title="Location details fills up on once choose desired location" arrow>
                            <IconButton className="add-program-warning-msg"
                            >
                              <ErrorOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      <Grid
                        container
                        alignItems="center"
                        size={{ xs: 12, sm: 12 }}
                        mb={0}
                      >
                        <CustomTextField
                          placeholder="Venue URL (must be a Google Maps link with latitude and longitude)"
                          control={control}
                          name="mapUrl" 
                          type="text" 
                          shrink={watch('mapUrl') !== '' && watch('mapUrl') !== undefined ? true : undefined}
                          readOnly
                          rules={{
                            required: true,                                                                  
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                          placeholder="Venue Name"
                          control={control}
                          name="venueName"
                          shrink={watch('venueName') !== '' && watch('venueName') !== undefined ? true : undefined}
                          type="text"
                          rules={{ required: watch("type") === "OFFLINE" }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                          placeholder="Address"
                          control={control}
                          name="address"
                          shrink={watch('address') !== '' && watch('address') !== undefined ? true : undefined}
                          type="text"
                          rules={{ required: watch("type") === "OFFLINE" }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                          name="country"
                          label="Country"
                          control={control}
                          shrink={watch('country') !== '' && watch('country') !== undefined ? true : undefined}
                          type="text"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                         <CustomTextField
                            name="state"
                            label="State"
                            control={control}
                            type="text"
                            shrink={watch('state') !== '' && watch('state') !== undefined ? true : undefined}
                            rules={{
                              required:Boolean(watch('country')),
                            }}
                          />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          label="City"
                          control={control}
                          name="city"
                          type="text"
                          shrink={watch('city') !== '' && watch('city') !== undefined ? true : undefined}
                          rules={{ required: watch("type") === "OFFLINE" }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          label="Pin Code"
                          control={control}
                          name="postalCode"
                          type="text"
                          shrink={watch('postalCode') !== '' && watch('postalCode') !== undefined ? true : undefined}
                          rules={{
                            required: watch("type") === "OFFLINE",
                            pattern: {
                              value: /^.{1,10}$/,
                              message: "Enter a valid postal code (e.g., '12345', '12345-6789', or '123456')",
                            },
                          }}
                        />
                      </Grid>

                    </>
                  )} */}
                </Grid>
                  <CustomDrawer open={drawerOpen} type="right" children={
                   <GoogleMapPlacePicker onClose={()=>setDrawerOpen(false)}/>
                  } />
              </form>
              </FormProvider>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }


export default CreateEvent;
