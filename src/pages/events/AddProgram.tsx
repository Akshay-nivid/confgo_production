/**
 * AddProgram component handles the program addition for event
 */
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import EditIcon from "@/assets/svg/edit-program-icon.svg";
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import moment from "moment";
import CustomActionModal from "@/components/CustomActionModal/CustomActionModal";
import useStore, { POST, setDataById } from "@/Libs/store";
import { NoProgramIcon, WarningIcon } from "@/assets/svg";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import { CloseOutlined } from "@mui/icons-material";
import { Logger } from "@/Utils/Logger";
import { Speaker } from '@mui/icons-material';
import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import config from "../../../config.json";
import { truncateString } from "@/Utils/CommonBaseClass";
import NewSpeakerDrawer from "./NewSpeakerDrawer";
import confgo  from "../../../config.json"
type Speaker = {
  speakerId?: string;
  speakerFullName?: string;
  speakerAssetId?: string;
  designation: string;
}

type FormData = {
  programs: {
    name: string;
    description: string;
    totalSeat: string;
    startDate:string;
    endDate:string;
    startTime: string;
    endTime:string;
    type: string;
    amount: string;
    speakers?: {
      speakerId?: string;
      speakerFullName?: string;
      speakerAssetId?: string;
      designation: string;
    }[];
    speakerId?: string;
    speakerFullName?: string;
    speakerAssetId?: string;
    designation?: string;
    speakerSelection?: string;
  }[];
  savedPrograms: {
    id?: string;
    name: string;
    description: string;
    totalSeat: string;
    startDate:string;
    endDate:string;
    startTime: string;
    endTime:string;
    type: string;
    amount: string;
    speakers?: {
      speakerId?: string;
      speakerFullName?: string;
      speakerAssetId?: string;
      designation: string;
    }[];
    speakerId?: string;
    speakerFullName?: string;
    speakerAssetId?: string;
    designation?: string;
    speakerSelection?: string;
  }[];
};
type ProgramProps = {
  formSubmit: boolean;
  formDraftSubmit: boolean;
  onSubmitHandler: (event: any, type: string) => void;
  onDraftSubmitHandler: (event: any, type: string) => void;
  onSaveHandler: (event: any, type: string) => void;
  data: any;
  addOnOptions?: any;
  eventData?:any
};
const typeArray = [
  { label: "Paid", value: "PAID" },
  { label: "Free", value: "FREE" },
];



const AddProgram: React.FC<ProgramProps> = React.memo(
  ({ formSubmit, formDraftSubmit, onSubmitHandler, onDraftSubmitHandler, data, onSaveHandler ,eventData}) => {
    const { handleSubmit, control, watch, setValue,setError,setFocus,resetField } = useForm<FormData>({
      defaultValues: {
        programs: [
          {
            name: "",
            description: "",
            startDate:moment(eventData?.startTime).format("YYYY-MM-DD"),
            endDate:moment(eventData?.startTime).format("YYYY-MM-DD"),
            startTime: moment(new Date()).format("HH:mm"),
            endTime:moment(new Date()).format("HH:mm"),
            type: "PAID",
            amount: "",
            totalSeat:"",
            speakers:[]
          },
        ],
      },
    });
    const { fields, append, remove } = useFieldArray({
      control,
      name: "programs",
    });

    const [programIndex, setProgramIndex] = useState<any>();
    const [editMode, setEditMode] = useState(false);
    const [openModal,setOpenModal]=useState(false);
    const eventDate = useStore((state: any) => state?.compData?.["event-date"]);
    const eventStartDate= eventDate?.startDate;
    const eventEndDate= eventDate?.endDate;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const companyId = sessionStorage.getItem("companyId")
    const [searchResults, setSearchResults] = useState<Speaker[]>([]);
    const [showSpeakerSection, setShowSpeakerSection] = useState(false);
    const baseUrl = config.api.url;
    const [newSpeakerDrawerOpen, setNewSpeakerDrawerOpen] = useState(false);
    const currency=confgo.currency;

    /**
     * Method transforms data to the autocomplete data format
     * @param data : api response data
     * @returns 
     */
    function transformUserData(data: any): Speaker[] {
      return data?.map((item: any) => ({
        speakerId: item?.id,
        speakerFullName: `${item?.firstName} ${item?.lastName}`,
        speakerAssetId: item?.assetId,
        ...item
      }));
    }

    /**
     *  Function to handle search API for user role autocomplete 
     */ 
    const handleSearch = async (query: string) => {
      setLoading(true);
      await POST({
        url: "user/userRole/list",
        id: "userRoleList",
        body: {
          filters: {
            roleEnums: ['SPEAKER'],
            name: query,
            companyId: companyId,
          },
          limit:30
        },
        successCB: (context: any) => {
          setSearchResults(transformUserData(context?.data))
          setLoading(false);
        },
        errorCB: (context: any) => {
          Logger.error("Error fetching search results:", context?.message);
          setLoading(false);
        }
      })
    };

    /**
     * function to close the add program drawer
     */
    const closeDrawer = () => {
      setDrawerOpen(false);
      setEditMode(false);
      setValue('programs',watch('savedPrograms'))
      setShowSpeakerSection(false)
    };


    /**
     * Useeffect hook updates the programIndex value based on the savedPrograms dependency
     */
    useEffect(() => { 
      const savedPrograms = watch("savedPrograms");
      setProgramIndex(savedPrograms?.length ? savedPrograms.length - 1 : 0);
  }, [watch("savedPrograms")]);
   

    /**
     * Useeffect hook submits the form based on the formSubmit variable
     */
    useEffect(() => {
      if (!formSubmit) return; // Short-circuit if formSubmit is false
      if (onSubmitHandler) {
          onSubmitHandler(data?.savedPrograms, "PROGRAM");
      }
  }, [formSubmit]);

  /**
     * Useeffect hook submits the form based on the formDraftSubmit variable
     */
  useEffect(() => {
    if (!formDraftSubmit) return; // Short-circuit if formDraftSubmit is false
    if (onDraftSubmitHandler) {
        onDraftSubmitHandler(watch()?.savedPrograms, "PROGRAM");
    }
}, [formDraftSubmit]);
  


    /**
     * Method handles the form submission
     * @param data : form data
     */
    const onSubmit: SubmitHandler<FormData> = (data) => {
      if (onSubmitHandler) {
          onSubmitHandler(data.savedPrograms, "PROGRAM");
      }
  };
   

    /**
     * useEffect to format program start and end dates based on the event's start time.
     * it ensures that each programs 'startDate' and 'endDate' are not earlier than event's startTime.
     * If they are, the program dates are updated to match event's startTime.
     * form state ('programs' and 'savedPrograms') will be updated with formatted data.
     */
    useEffect(() => {
      if (!data) return;
      if (!eventData?.startTime) return;
      const formattedData = data.map((item: any) => {
        const eventStartDate = moment(eventData.startTime);
        const itemStartDate = moment(item.startDate);
        const itemEndDate = moment(item.endDate);        
        // Check if startDate or endDate is earlier than eventData.startTime
        return {
          ...item,
          startDate: itemStartDate.isBefore(eventStartDate)
            ? eventStartDate.format("YYYY-MM-DD")
            : itemStartDate.format("YYYY-MM-DD"),
          endDate: itemEndDate.isBefore(eventStartDate)
            ? eventStartDate.format("YYYY-MM-DD")
            : itemEndDate.format("YYYY-MM-DD"),
        };
      });
           
      // Update the form values with the validated and formatted data
      setValue("programs", formattedData);
      setValue("savedPrograms", formattedData);

      }, [data, eventData?.startTime, setValue]);
  
/**
 * This method ensures that the field with validation errors or requiring attention and Scrolls smoothly to that field
 */
const scrollToError = (errorField: string) => {
  const fieldElement = document.querySelector(`[name="${errorField}"]`);
  if (fieldElement) {
    fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
    (fieldElement as HTMLElement).focus();
  }
};

/**
 * handle add program button click
 */
const handleAddProgram = () => {
  const savedPrograms = watch("savedPrograms");
  setProgramIndex(savedPrograms?.length ? savedPrograms.length - 1 : 0);
  setEditMode(false);
  setDrawerOpen(true); // Open the drawer for the new program
};

    /**
     * Method handles the saving of the programs
     */
  const handleSaveNewPrograms = () => {
         // handleSubmit(onSave)();
    handleSubmit(onSave, (errors) => {
    // Check if programs exists and is an array before forEach
    if (errors.programs && Array.isArray(errors.programs)) {
      errors.programs.forEach((programError, index) => {
        const firstErrorKey = Object.keys(programError ?? {})[0] as keyof FormData["programs"][number] | undefined;
 
        if (firstErrorKey) {
          const errorField = `programs.${index}.${firstErrorKey}` as const;
          
          scrollToError(errorField);
          setFocus(errorField as unknown as keyof FormData);
        }
      });
    }
  })();
};

    /**
     * Method handles the form submission
     * @param data : form data
     */
    const onSave: SubmitHandler<FormData> = () => {
      const programs = watch("programs");
      const lastItem = programs[programs.length - 1];
      const lastIndex = programs.length - 1;
      const startDate = new Date(lastItem.startDate);
      const endDate = new Date(lastItem.endDate);
      if (startDate > endDate) {
        setError(`programs.${lastIndex}.startDate`, {
          type: 'manual',
          message: 'Start date cannot be greater than end date',
        });
        return
      }
    // Ensure dates are valid Date objects
    let selectedDate =programs?.[programIndex]?.startDate
    let selectedEndDate =programs?.[programIndex]?.endDate
    let eventStartDateObj = new Date(eventStartDate);
    let startDateObj = new Date(selectedDate);
    let endDateObj = new Date(programs?.[programIndex]?.endDate);
    let eventEndDateObj = new Date(eventEndDate)

      // Perform the comparison of dates
      if (startDateObj.getTime() < eventStartDateObj.getTime() || startDateObj.getTime() > eventEndDateObj.getTime()) {
        setError(`programs.${programIndex}.startDate`, {
          type: 'manual',
          message: 'Start date should be within event Dates',
        });
        return
      } 
  
      if (endDateObj.getTime() > eventEndDateObj.getTime()) {
        setError(`programs.${programIndex}.endDate`, {
          type: 'manual',
          message: 'End date should be within event Dates',
        });
        return
      }   

    const today = moment(new Date()).format("YYYY-MM-DD") 
    let selectedStartTime = programs?.[programIndex]?.startTime;
    let selectedEndTime = programs?.[programIndex]?.endTime;

    //check if time is greater than current time if selected date is today
    if(selectedDate == today) {
    const now = moment(new Date()).format("HH:mm");
    if(selectedStartTime < now) {
      setError(`programs.${programIndex}.startTime`, {
        type: 'manual',
        message: 'Start time cannot be in the past',
      });
      return
      }
    }
    //check if selected end time is greater than selected start time is start and end dates are equal
    if(selectedEndDate == selectedDate){
      if(selectedEndTime < selectedStartTime) {
        setError(`programs.${programIndex}.endTime`, {
          type: 'manual',
          message: 'End time must be greater than start time',
        });
        return
        }
    }
    //check if end date is greater than start date
    if(selectedEndDate < selectedDate){
      setError(`programs.${programIndex}.startDate`, {
        type: 'manual',
        message: 'Start Date must be earlier than End date',
      });
      return
      }

  
      const newPrograms = [...programs];
      // Handle saving logic based on `editMode`
      if (!editMode) {
        const newProgram = {
          name: "",
          description: "",
          totalSeat: "",
          startDate:moment(eventData?.startTime).format("YYYY-MM-DD"),
          endDate:moment(eventData?.startTime).format("YYYY-MM-DD"),
          startTime: moment().format("HH:mm"),
          endTime:moment().format("HH:mm"),
          type: "PAID",
          amount: "",
          speakers: [],
          speakerId: "",
          speakerFullName: "",
          speakerAssetId: "",
          designation: "",
        };
        newPrograms.push(newProgram);

        // Update both `savedPrograms` and the local `programs` array
        setValue("savedPrograms", programs);
        append(newProgram);
        setProgramIndex(programs?.length || 0);
      } else {
        // If in `editMode`, just update the program index
        setProgramIndex(programs?.length ? programs.length - 1 : 0);
      }

      // Trigger the save handler with the current programs
      onSaveHandler && onSaveHandler(newPrograms,'program');

      closeDrawer();
      setShowSpeakerSection(false)

      // Exit edit mode
      setEditMode(false);
    };


    /**
     * Method handles the Update of the program
     * @param index : index of the program to edit
     */
    const handleEdit = (index: number) => {
      setEditMode(true);
      setDrawerOpen(true);
      setValue("programs", watch("savedPrograms"));
      setProgramIndex(index);
      if(watch(`programs.${index}.speakers`)){
        setShowSpeakerSection(true)
      }
    };

    /**
     * opens the custom action model to show warning
     */
    const handleDeleteConfirmbox = (index: number) => {
      setOpenModal(true)
      setProgramIndex(index);
    }

    /**
     * Method handles the deletion of the program
     * @param index : index of the program to delete
     */
    const handleDelete = (index: number) => {
      setOpenModal(false)
      setValue("programs", watch("savedPrograms"));
      setProgramIndex(index);
      const programsCopy = [...watch("savedPrograms")];
      programsCopy.splice(index, 1);
      setValue("savedPrograms", programsCopy);
      const saveProgram = programsCopy;

      remove(index);
      if (index === programsCopy.length) {
        if (index === 0) {
          append({
            name: "",
            description: "",
            totalSeat: "",
            startDate: moment().format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"),
            startTime: moment(new Date()).format("HH:mm"),
            endTime: moment(new Date()).format("HH:mm"),
            type: "PAID",
            amount: "",
            speakers: [{speakerId:"", speakerFullName: "", designation: "",speakerAssetId: "" }],
            speakerId: "",
            speakerFullName: "",
            speakerAssetId: "",
            designation: "",
          });
          saveProgram.push({
            name: "",
            description: "",
            totalSeat: "",
            startDate: moment().format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD"),
            startTime: moment(new Date()).format("HH:mm"),
            endTime: moment(new Date()).format("HH:mm"),
            type: "PAID",
            amount: "",
            speakers: [{speakerId:"", speakerFullName: "", designation: "",speakerAssetId: "" }],
            speakerId: "",
            speakerFullName: "",
            speakerAssetId: "",
            designation: "",
          });
        } else {
          setProgramIndex(programsCopy.length);
        }
      }
      onSaveHandler && onSaveHandler(saveProgram, 'program');
    };


    /**
     * Adds a new speaker to the specified program's speakers array.
     * fetches the current form values for the specified program (using `index`), 
     * prepares a new speaker object using the form values, and adds it to the `speakers` array
     * After adding the speaker, the form fields related to the speaker are reset for the next input.
     * @param {number} index - The index of the program which the speaker is to be added.
     */
    const addSpeaker = (index: number) => {
      const values = watch();
      
      const speakerId = values.programs[index].speakerId;
      const speakerFullName = values.programs[index].speakerFullName;
      const speakerAssetId = values.programs[index].speakerAssetId;
      const designation = values.programs[index].designation;
      const speakerSelection = values.programs[index].speakerSelection;


      if (!speakerSelection) {
        setError(`programs.${index}.speakerSelection`, {
          type: 'manual',
          message: 'please select a speaker',
        });
        return;
      }
      if (!designation) {
        setError(`programs.${index}.designation`, {
          type: 'manual',
          message: 'Designation is required',
        });
        return;
      }

      const newSpeaker = {
        speakerId,
        speakerFullName,
        speakerAssetId,
        designation,
      };
      // Get current programs list and update the speakers array for the selected program index
      const updatedPrograms = [...values.programs];
      if (!updatedPrograms[index].speakers) {
        updatedPrograms[index].speakers = [];
      }    
      // Filter out empty or undefined speakers
      updatedPrograms[index].speakers = updatedPrograms[index].speakers?.filter(
        speaker => speaker.speakerId
      );
      // Check if a speaker with the same ID already exists
      const isDuplicate = updatedPrograms[index].speakers.some(
        (speaker) => speaker.speakerId === newSpeaker.speakerId
      );
      if (isDuplicate) {
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: "speaker is already added" })
        return;
      }
      
      // Add the new speaker to the speakers array
      updatedPrograms[index].speakers.push({ ...newSpeaker });
      setValue("programs", updatedPrograms);
    
      resetField(`programs.${index}.speakerId`);
      resetField(`programs.${index}.speakerAssetId`);
      resetField(`programs.${index}.designation`);
      resetField(`programs.${index}.speakerFullName`);
      resetField(`programs.${index}.speakerSelection`);
    }; 

    /**
     * Removes a speaker from the specified program's speakers array.
     * This function filters out the speaker with the matching `speakerId` from the `speakers` array of the program (by `item.speakerId`).
     * @param {object} item - The speaker object that needs to be removed.
     * @param {number} _index - The index of the program in the programs array .
     */
    const removeSpeaker = (item: any, _index: number) => {
      const values = watch();
      const updatedPrograms = values.programs.map((program) => {
        const updatedSpeakers = program.speakers?.filter(
          (speaker) => speaker?.speakerId !== item?.speakerId
        ) || [];
        return {
          ...program,
          speakers: updatedSpeakers,
        };
      });
      setValue('programs', updatedPrograms);
    };    



    return (
      <Grid container className="add-program-container" justifyContent={'center'} spacing={4}>
        <CustomDrawer open={drawerOpen} type="right">
          <Grid container spacing={2} padding={2} className="add-program-drawer">
            <Grid
              size={{ xs: 12 }}
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography className="add-program-drawer-heading">
                Add Program
              </Typography>
              <IconButton onClick={closeDrawer}>
                <CloseOutlined />
              </IconButton>
            </Grid>
            <Box className={"add-program-form-wrapper1"}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => {
                  if (index === programIndex) {
                    return (
                      <Box key={field.id} mb={2}>
                        <Grid
                          container
                          size={{ xs: 12, sm: 12 }}
                          spacing={2}
                        >

                          <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomTextField
                              placeholder="Program Name"
                              control={control}
                              name={`programs.${index}.name`}
                              type="text"
                              rules={{ required: true }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomTextField
                              placeholder="Program Description"
                              control={control}
                              name={`programs.${index}.description`}
                              type="text"
                              rules={{ required: true }}
                              multiline={true}
                              rows={10}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomTextField
                              placeholder="Total Seats"
                              control={control}
                              name={`programs.${index}.totalSeat`}
                              type="number"
                              rules={{
                                pattern: {
                                  value: /^(0|[1-9]\d{0,7})$/,
                                  message: "Enter a valid number (e.g., 0, 123, 27)",
                                },
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12 }} display={"flex"} justifyContent={"space-between"} container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <CustomTextField
                                placeholder="Start Date"
                                className="create-event"
                                control={control}
                                name={`programs.${index}.startDate`}
                                type="date"
                                defaultValue={moment(eventData?.startTime).format("YYYY-MM-DD")}
                                min={moment(eventData?.startTime).format("YYYY-MM-DD")}
                                max={moment(eventData?.endTime).format("YYYY-MM-DD")}
                                rules={{
                                  required: true
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <CustomTextField
                                className="create-event"
                                placeholder="Start Time"
                                control={control}
                                name={`programs.${index}.startTime`}
                                type="time"
                                defaultValue={moment().format("HH:mm")}
                                rules={{
                                  required: true,
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12 }} display={"flex"} justifyContent={"space-between"} container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <CustomTextField
                                placeholder="End Date"
                                className="create-event"
                                control={control}
                                name={`programs.${index}.endDate`}
                                type="date"
                                defaultValue={moment(eventData?.startTime).format("YYYY-MM-DD")}
                                min={moment(eventData?.startTime).format("YYYY-MM-DD")}
                                max={moment(eventData?.endTime).format("YYYY-MM-DD")}
                                rules={{
                                  required: true
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <CustomTextField
                                placeholder="End Time"
                                className="create-event"
                                control={control}
                                name={`programs.${index}.endTime`}
                                type="time"
                                defaultValue={moment().format("HH:mm")}
                                rules={{
                                  required: true,
                                  validate: (value) => {
                                    if (
                                      typeof value === "string" &&
                                      value
                                    ) {
                                      const today = moment(new Date()).format("YYYY-MM-DD")
                                      const endDate = moment(eventData.endTime).format("YYYY-MM-DD");
                                      if (endDate == today) {
                                        //check if time is greater than current time
                                        const now = moment(new Date()).format("HH:mm");
                                        if (value < now) {
                                          return (
                                            "End Time cannot be in the past"
                                          );
                                        }
                                      }
                                    }
                                  }
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12 }}>
                            <CustomRadio
                              className="add-program-radio-btn"
                              control={control}
                              name={`programs.${index}.type`}
                              label=""
                              options={typeArray}
                              row={true}
                              value={"PAID"}
                              onChange={(e) => {
                                const newType = e.target.value;
                                if (newType === "FREE") {
                                  setValue(`programs.${index}.amount`, "");
                                }
                              }}
                            />
                          </Grid>
                          {watch(`programs.${index}.type`) === "PAID" && (
                            <Grid size={{ xs: 12, sm: 12 }}>
                              <CustomTextField
                                placeholder="Price"
                                prefix={currency}
                                control={control}
                                name={`programs.${index}.amount`}
                                type="number"
                                rules={{
                                  required: "Price is required",
                                  pattern: {
                                    value: /^(0?[1-9]|[1-9]\d{0,7})(\.\d{1,2})?$/,
                                    message:
                                      "Enter a valid price (up to 2 decimal places & Zero not accepted)price up to 1Crore",
                                  }
                                }}
                              />
                            </Grid>
                          )}
                          {!showSpeakerSection ? (
                            <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'center'}>
                              <CustomButton
                                className="add-program-drawer-speaker-option-btn"
                                label="Assign Speakers for this Program?"
                                variant="outlined"
                                size="large"
                                type="button"
                                onClick={() => setShowSpeakerSection(true)}
                              />
                            </Grid>
                          ) : (
                            <Grid container size={{ xs: 12, sm: 12 }} p={{ xs: 1, sm: 2 }} className="add-program-speaker-section">
                                {/* speaker add section */}
                                <Grid
                                  size={{ xs: 12 }}
                                  container
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Typography className="add-program-drawer-heading">
                                    Assign Speakers
                                  </Typography>
                                  <IconButton onClick={() => setShowSpeakerSection(false)}>
                                    <CloseOutlined />
                                  </IconButton>
                                </Grid>{/*end of speaker header section */}
                                <Grid size={{ xs: 12}}>
                                  <CustomAutocomplete
                                    name={`programs.${index}.speakerSelection`}
                                    control={control}
                                    placeholder="Search Speaker"
                                    options={searchResults}
                                    getOptionLabel={(option: any) => option.speakerFullName || ""}
                                    onSearch={handleSearch}
                                    loading={loading}
                                    onChange={(selectedOption)=>{
                                      setValue(`programs.${index}.speakerId`,selectedOption?.speakerId)
                                      setValue(`programs.${index}.speakerAssetId`,selectedOption?.speakerAssetId)
                                      setValue(`programs.${index}.speakerFullName`,selectedOption?.speakerFullName)
                                    }}
                                  />
                                </Grid>
                                <Grid container className="add-program-drawer-new-speaker-link" justifyContent={'end'} onClick={() => setNewSpeakerDrawerOpen(true)} size={{xs:12}}>
                                  <Typography className="cursor-container" variant="h6">Create New Speaker ?</Typography>
                                </Grid>
                                <Grid size={{ xs: 12}}>
                                  <CustomTextField
                                    placeholder="Designation"
                                    control={control}
                                    name={`programs.${index}.designation`}
                                    type="text"
                                  />
                                </Grid>
                                <Grid size={{xs:12}} >
                                  <CustomButton
                                    className="add-program-drawer-btn-cancel"
                                    label="Assign Speaker"
                                    variant="outlined"
                                    size="large"
                                    onClick={()=>addSpeaker(index)}
                                  />
                                </Grid>
                                  {watch(`programs.${index}.speakers`)?.length !== 0 && (
                                    <Grid container flexDirection={"column"} className="add-program-speaker-section-card-container" size={{xs:12}}>
                                      <Grid container spacing={1}>
                                        {watch(`programs.${index}.speakers`)?.map((item, speakerIndex) => {
                                          return (
                                            <Grid size={{xs:12}} key={speakerIndex + "grid"} container alignItems="center" className="add-program-speaker-section-card-item" p={1}>
                                              <Grid size={{xs:2}} justifyItems={'center'}> 
                                                <Avatar
                                                  alt={item.speakerFullName}
                                                  src={item?.speakerAssetId
                                                    ? `${baseUrl}asset/${item?.speakerAssetId}`
                                                    : ""}
                                                />
                                              </Grid>
                                              <Grid size={{xs:8}} justifyItems={'start'}>
                                                <Typography className="add-program-speaker-section-card-item-title">
                                                  {item.speakerFullName}
                                                </Typography>
                                                <Typography className="add-program-speaker-section-card-item-subtitle">
                                                  { truncateString(item?.designation,35)}
                                                </Typography>
                                              </Grid>
                                              <Grid size={{xs:2}} justifyItems={'center'}>
                                                <IconButton
                                                  onClick={() => removeSpeaker(item,index)} // Handle removal logic
                                                  sx={{ padding: 1 }}
                                                >
                                                  <DeleteIcon />
                                                </IconButton>
                                              </Grid>
                                            </Grid>
                                          );
                                        })}
                                      </Grid>
                                    </Grid>
                                  )}
                            </Grid>// end of add speaker section
                          )}
                          <Grid
                            container
                            direction={"row"}
                            justifyContent="right"
                            alignItems="center"
                            size={{ xs: 12, sm: 12 }}
                          >
                            <Grid>
                              <CustomButton
                                className="add-program-drawer-btn-cancel"
                                label="Cancel"
                                variant="outlined"
                                size="large"
                                onClick={closeDrawer}
                              />
                            </Grid>
                            <Grid>
                              <CustomButton
                                className="add-program-drawer-btn-save"
                                onClick={handleSaveNewPrograms}
                                label={"Save"}
                                variant="contained"
                                size="large"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  }
                })}
              </form>
            </Box>
          </Grid>
        </CustomDrawer>
        <Grid
            container
            direction={"row"}
            className="add-program-display-container"
            size={{ xs: 12, sm: 7 }}
            spacing={2}
            key='add-program-display-container'
            mt={{ xs: 2, sm: 4 }}
            sx={{ height: { xs: 200, sm: 300, md: 400 } }}
            p={3}
            justifyContent={'center'}
          >
        {watch("savedPrograms")?.length > 1 ? (
          <Grid size={{ xs: 12, sm: 12 }}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography textAlign={"start"} className="add-program-display-title">
                Saved Programs
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12 }}
              className="add-program-display-items"
              alignItems="flex-start"
              justifyContent="flex-start"
              mt={{xs:1,sm:3}}
            >
              {watch("savedPrograms")?.map(
                (field, index) =>
                  field.name
                  && (
                    <Grid
                      key={field.id}
                      container
                      alignItems="flex-start"
                      className="add-program-display-item"
                      alignContent={"center"}
                      size={{ xs: 12 }}
                    >
                      <Grid size={{ xs: 8, sm: 9 }} >
                        <Grid container size={{ xs: 12 }} direction={'column'}>
                          <Grid size={{ xs: 12 }}><Typography className="text-p2 font-700 truncate-text" title={field.name}>{field.name}</Typography> </Grid>
                          <Grid size={{ xs: 12 }}><Typography className="truncate-text" title={field.description} >{field.description}</Typography></Grid>
                        </Grid>

                      </Grid>

                      <Grid container size={{ xs: 4, sm: 3 }} justifyContent={'center'}>
                        <IconButton key={`${index}-edit-program`} onClick={() => handleEdit(index)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton key={`${index}-delete-program`} onClick={() => handleDeleteConfirmbox(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                      <CustomActionModal
                        open={openModal}
                        icon={<WarningIcon className="unpublish-modal-icon" />}
                        onClose={() => setOpenModal(false)}
                        cancelLabel="Cancel"
                        cancelAction={() => setOpenModal(false)}
                        header="Delete Program?"
                        subHeader="Are you sure you want to delete this program? This action cannot be undone"
                        submitAction={() => handleDelete(programIndex)} 
                        submitLabel="Delete"
                        modalClassName="publish-modal"
                      />
                    </Grid>
                  )
              )}
            </Grid>
          </Grid>) : (
            <Grid container alignSelf={'center'} justifyContent={'center'}>
              <Grid container size={{ xs: 12,sm: 8 }} alignSelf={'center'} justifyContent={'center'} spacing={3}>
                <Grid>
                  <NoProgramIcon width={90} height={90}/>
                </Grid>
                <Grid>
                  <Typography className="add-program-empty-title">No Programs Added Yet</Typography>
                  <Typography className="add-program-empty-subtitle">Start creating your first program to bring your event to life!</Typography>
                </Grid>
              </Grid>
            </Grid>
        )}
          <Grid
            container
            size={{ xs: 12,sm: 8 }}
            alignSelf={'end'}
          >
            <CustomButton
              className="add-program-save-btn"
              onClick={handleAddProgram}
              label="Add Program"
              variant="contained"
              size="large"
            />
          </Grid>
        </Grid>
        {/* Drawer to create a new Speaker */}
        <Grid >
          <CustomDrawer
            children={<NewSpeakerDrawer onSuccess={()=>{handleSearch("")}} closeDrawer={()=>setNewSpeakerDrawerOpen(false)}/>}
            open={newSpeakerDrawerOpen} 
            type="right"
          />
        </Grid>
      </Grid>
    );
  }
);

export default AddProgram;
