/**
 * AddProgram component handles the program addition for event
 */
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Box, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import EditIcon from "@/assets/svg/edit-program-icon.svg";
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import moment from "moment";
import CustomActionModal from "@/components/CustomActionModal/CustomActionModal";
import { WarningIcon } from "@/assets/svg";

type FormData = {
  programs: {
    name: string;
    description: string;
    startDate:string;
    endDate:string;
    startTime: string;
    endTime:string;
    type: string;
    amount: string;
    // totalSeat:string; //for future development changes
  }[];
  savedPrograms: {
    id?: string;
    name: string;
    description: string;
    startDate:string;
    endDate:string;
    startTime: string;
    endTime:string;
    type: string;
    amount: string;
    // totalSeat:string;
  }[];
};
type ProgramProps = {
  formSubmit: boolean;
  onSubmitHandler: (event: any, type: string) => void;
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
  ({ formSubmit, onSubmitHandler, data, onSaveHandler ,eventData}) => {
    const { handleSubmit, control, watch, setValue,setError } = useForm<FormData>({
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
            // totalSeat:""
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
     * Method handles the form submission
     * @param data : form data
     */
    const onSubmit: SubmitHandler<FormData> = (data) => {
      if (onSubmitHandler) {
          onSubmitHandler(data.savedPrograms, "PROGRAM");
      }
  };
   

    /**
     * Useeffect hook set the field based on the data
     */
    useEffect(() => {
      if (!data) return; // Early exit if data is undefined or null
      setValue("programs", data);
      setValue("savedPrograms", data);
  }, [data]);
  

    /**
     * Method handles the saving of the programs
     */
    const handleSaveNewPrograms = () => {
      handleSubmit(onSave)();
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
      const newPrograms = [...programs];
      // Handle saving logic based on `editMode`
      if (!editMode) {
        const newProgram = {
          name: "",
          description: "",
          startDate:moment(eventData?.startTime).format("YYYY-MM-DD"),
          endDate:moment(eventData?.startTime).format("YYYY-MM-DD"),
          startTime: moment().format("HH:mm"),
          endTime:moment().format("HH:mm"),
          type: "PAID",
          amount: "",
          // totalSeat:"",
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

      // Exit edit mode
      setEditMode(false);
    };


    /**
     * Method handles the Update of the program
     * @param index : index of the program to edit
     */
    const handleEdit = (index: number) => {
      setEditMode(true);
      setValue("programs", watch("savedPrograms"));
      setProgramIndex(index);
    };

/**
     * opens the custom action model to show warning
     */
    const handleDeleteConfirmbox =(index: number) =>{
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
            startDate:moment().format("YYYY-MM-DD"),
            endDate:moment().format("YYYY-MM-DD"),
            startTime: moment(new Date()).format("HH:mm"),
            endTime:moment(new Date()).format("HH:mm"),
            type: "PAID",
            amount: "",
            // totalSeat:"",
          });
          saveProgram.push({
            name: "",
            description: "",
            startDate:moment().format("YYYY-MM-DD"),
            endDate:moment().format("YYYY-MM-DD"),
            startTime: moment(new Date()).format("HH:mm"),
            endTime:moment(new Date()).format("HH:mm"),
            type: "PAID",
            amount: "",
            // totalSeat:"",
          });
        } else {
          setProgramIndex(programsCopy.length);
        }
      }
      onSaveHandler && onSaveHandler(saveProgram,'program');
    };



    return (
      <Box className="add-program-container">
        <Grid container className="">
          <Grid
            container
            size={{ xs: 12, sm: 12 }}
            direction={"row"}
            className=""
            gap={1}
          >
            <Grid
              size={{ xs: 12, sm: 7 }}
              className="add-program-form-container"
              ml={6}
            >
              <Box className="add-program-form-spacing">
                <Box className="">
                  <Grid
                    container
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Grid>
                      <Typography
                        textAlign={"start"}
                        variant="h3"
                        lineHeight={2}
                        className="add-program-title"
                      >
                        Add Program
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box className={"form-wrapper1"}>
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
                                <Grid size={{ xs: 12, sm: 12 }} display={"flex"} justifyContent={"space-between"} container spacing={2}>
                                  <Grid size={{xs:12,sm:6}}>
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
                                  <Grid size={{xs:12,sm:6}}>
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
                                  {/* <Grid size={{xs:12,sm:4}}>
                                    <CustomTextField
                                    placeholder="End Time"
                                    control={control}
                                    name={`programs.${index}.startDateEndTime`}
                                    type="time"
                                    defaultValue={moment().format("HH:mm")}
                                    rules={{
                                      required: true,
                                    }}
                                  />
                                  </Grid> */}
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12 }} display={"flex"} justifyContent={"space-between"} container spacing={2}>
                                  <Grid size={{xs:12,sm:6}}>
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
                                  {/* <Grid size={{xs:12,sm:4}}>
                                   <CustomTextField
                                    placeholder="Start Time"
                                    control={control}
                                    name={`programs.${index}.startDateStartTime`}
                                    type="time"
                                    defaultValue={moment().format("HH:mm")}
                                    rules={{
                                      required: true,
                                    }}
                                  />
                                  </Grid> */}
                                  <Grid size={{xs:12,sm:6}}>
                                    <CustomTextField
                                    placeholder="End Time"
                                    className="create-event"
                                    control={control}
                                    name={`programs.${index}.endTime`}
                                    type="time"
                                    defaultValue={moment().format("HH:mm")}
                                    rules={{
                                      required: true,
                                    }}
                                  />
                                  </Grid>
                                  {/* <CustomTextField
                                    placeholder="Start Date & Time"
                                    control={control}
                                    name={`programs.${index}.startTime`}
                                    type="datetime-local"
                                    min={moment().format("YYYY-MM-DDTHH:mm")}
                                    maxDate={eventData?.endTime}
                                    rules={{
                                      required: true,
                                      validate: (value) => {
                                        if (
                                          typeof value === "string" &&
                                          value
                                        ) {
                                          const selectedDate = new Date(value);
                                          const now = new Date();
                                          now.setHours(0, 0, 0, 0);
                                          return (
                                            selectedDate >= now ||
                                            "Start Date cannot be in the past"
                                          );
                                        }
                                        return "Invalid date";
                                      },
                                    }}
                                  /> */}
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  {/* <CustomTextField
                                    placeholder="End Date & Time"
                                    control={control}
                                    name={`programs.${index}.endTime`}
                                    type="datetime-local"
                                    min={moment().format("YYYY-MM-DDTHH:mm")}
                                    rules={{
                                      required: true,
                                      validate: (value) => {
                                        if (
                                          typeof value === "string" &&
                                          value 
                                        ) {
                                          const selectedDate = new Date(value);
                                          const now = new Date();
                                          now.setHours(0, 0, 0, 0);
                                          return (
                                            selectedDate >= now ||
                                            "End Date cannot be in the past"
                                          );
                                        }
                                        return "Invalid date";
                                      },
                                    }}
                                  /> */}
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
                                  />
                                </Grid>
                                {watch(`programs.${index}.type`) === "PAID" && (
                                  <Grid size={{ xs: 12, sm: 6 }}>
                                    <CustomTextField
                                      placeholder="Price"
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
                                {/* <Grid size={{ xs: 12, sm: 6 }}>
                                    <CustomTextField
                                      placeholder="Total seat"
                                      control={control}
                                      name={`programs.${index}.totalSeat`}
                                      type="number"
                                    />
                                  </Grid> */}
                                <Grid
                                  container
                                  direction={"row"}
                                  justifyContent="right"
                                  alignItems="center"
                                  size={{ xs: 12, sm: 12 }}
                                >
                                  <Grid>
                                    <CustomButton
                                      className="add-program-save-btn"
                                      onClick={handleSaveNewPrograms}
                                      label="Save"
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
                </Box>
              </Box>
            </Grid>
            {watch("savedPrograms")?.length > 0 &&
            <Grid
              container
              direction={"column"}
              className="add-program-display-container"
              size={{ xs: 12, sm: 4 }}
              spacing={2}
              key='add-program-display-container'
            >
            <Grid>
              <Typography textAlign={"start"} className="add-program-display-title">
                Saved Programs
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 12 }}
              className="add-program-display-items"
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              {watch("savedPrograms")?.map(
                (field, index) =>
                  field.name
                  && (
                    <Grid
                      key={field.id}
                      container
                      alignItems="center"
                      className="add-program-display-item"
                      alignContent={"center"}
                      size={{ xs: 12 }}
                    >
                      <Grid size={{ xs: 8, sm: 9 }} >
                        <Grid container size={{ xs: 12 }} direction={'column'}>
                        <Grid size={{ xs: 12 }}><Typography className="text-p2 font-700 truncate-text" title={field.name}>{field.name}</Typography> </Grid>
                        <Grid size={{ xs: 12}}><Typography className="truncate-text" title={field.description} >{field.description}</Typography></Grid>    
                        </Grid>
                                            
                      </Grid>

                      <Grid size={{ xs: 4, sm: 3 }}>
                        <IconButton onClick={() => handleEdit(index)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteConfirmbox(index)}>
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
                        submitAction={() => handleDelete(index)}
                        submitLabel="Delete"
                        modalClassName="publish-modal"
                      />
                    </Grid>
                  )
              )}
							</Grid>
            </Grid>}
          </Grid>
        </Grid>
      </Box>
    );
  }
);

export default AddProgram;
