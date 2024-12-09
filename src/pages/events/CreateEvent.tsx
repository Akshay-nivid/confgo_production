/**
 * CreateEvent handles the event creation first screen
 */
import { setFormValues } from "@/Utils/CommonBaseClass";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import FileListModal from "@/components/FileUpload/FileListModal";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import config from "../../../config.json";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import { State } from "country-state-city";

type EventProps = {
  formSubmit: boolean;
  onSubmitHandler: (
    event: React.FormEvent<HTMLFormElement>,
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
  specialty: string;
  assetId:number;
};

interface CustomFile {
  id: number;
  name: string;
  sourcePath: string;
}

const typeArray = [
  { label: "Offline", value: "OFFLINE" },
  { label: "Online", value: "ONLINE" },
  { label: "Hybrid", value: "HYBRID" },
];

const CreateEvent: React.FC<EventProps> = React.memo(
  ({ formSubmit, onSubmitHandler, data }) => {
    const {
      handleSubmit,
      control, 
      setValue,
      watch,
      setError,
      formState: { errors },
    } = useForm<FormData>();

    const [editorContent, setEditorContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const companyId = sessionStorage.getItem('companyId');
  const baseUrl = config.api.url;



    /**
     * Method handles the on change event for description editor
     * @param value : event value
     */
    const handleChange = (value: any) => {
      setEditorContent(value);
      setValue("description", value);
    };

    /**
     * Useeffect hook handles the form submission based on the formSubmit variable
     */
    useEffect(() => {
      if (formSubmit) {
        handleSubmit(onSubmit)();
      }
    }, [formSubmit]);

    /**
     * Method handles the form submission
     * @param data
     */
    const onSubmit: SubmitHandler<FormData> = (data: any) => {
      if(watch("description") === "<p><br></p>"){
        return;
      }
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);
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
      onSubmitHandler && onSubmitHandler(data, "EVENT");
    };

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
                textAlign={"center"}
                variant="h3"
                lineHeight={2}
                className="create-event-title"
              >
                Create New Event
              </Typography>
            </Grid>
            <Grid>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                  container
                  spacing={2}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <CustomRadio
                      className="add-program-radio-btn"
                      control={control}
                      name="type"
                      label=""
                      options={typeArray}
                      row={true}
                      value={"OFFLINE"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <CustomTextField
                      className="add-program-text-Field"
                      placeholder="Event Name"
                      control={control}
                      name="name"
                      type="text"
                      rules={{ required: true }}
                    />
                  </Grid>
                  {/* <Grid size={{ xs: 12, sm: 6 }}>
                    <CustomTextField
                      placeholder="Specialty"
                      control={control}
                      name="specialty"
                      type="text"
                      rules={{ required: true }}
                      info={true}
                      infoContent={'test message'}
                    />
                  </Grid> */}
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <Typography
                      variant="h3"
                      className="create-event-description"
                    >
                      Event Description
                    </Typography>
                  </Grid>
                  <Grid
                    size={{ xs: 12, sm: 12 }}
                    mb={0}
                    className="create-event-description"
                  >
                   
                    <ReactQuill
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
                      modules={modules}
                    />
                    {/* <CustomTextField
                      control={control}
                      name="description"
                      type="hidden"
                      rules={{ required: true }}
                    />
                    /> */}
                  </Grid>
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
                        pattern: {
                          value: /^\d{4}-\d{2}-\d{2}$/, 
                          message: "Please enter a valid start start date (DD-MM-YYYY)"
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
                        pattern: {
                          value: /^\d{4}-\d{2}-\d{2}$/,
                          message: "Please enter a valid end date (DD-MM-YYYY)"
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <CustomTextField
                      placeholder="Price"
                      control={control}
                      name="amount"
                      type="number"
                    />
                  </Grid>
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

                  {watch("type") !== "ONLINE" && (
                    <>
                      <Grid
                        container
                        alignItems="center"
                        size={{ xs: 12, sm: 12 }}
                        mb={0}
                      >
                        <CustomTextField
                          placeholder="Location URL (must be a Google Maps link with latitude and longitude)"
                          control={control}
                          name="mapUrl" 
                          type="text" 
                          rules={{
                            required: false,
                            validate: (value: any) =>
                              /^(https?:\/\/)?(www\.)?google\.(com|[a-z]{2})\/maps\/(place\/[^\/]+\/@|@)([+-]?\d{1,2}\.\d+),([+-]?\d{1,3}\.\d+),(\d{1,2}(\.\d+)?z)(\/data=.*)?(\/entry=.*)?$/.test(value) ||
                              "URL must be a valid Google Maps link with latitude, longitude, and zoom level",                            
                                                                                   
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
                      <Grid size={{ xs: 12, sm: 6 }}>
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
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
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
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <CustomTextField
                          placeholder="City"
                          control={control}
                          name="city"
                          type="text"
                          rules={{ required: watch("type") === "OFFLINE" }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
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
                            <Grid size={{ xs: 12, sm: 12 }} direction={'row'} container flexDirection={"row"} spacing={2}>
                            <Grid container direction={'row'} alignItems={'center'} justifyContent={"center"} alignContent={"center"}>
                            {selectedFile && (
                              <Grid className="create-event-btn-container-img-box" >
                                <img
                                  src={`${baseUrl}asset/${selectedFile.id}`}
                                  alt={selectedFile.name}
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
                                    setValue('assetId',files[0]?.id);
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
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }
);

export default CreateEvent;
