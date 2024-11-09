/**
 * AddProgram component handles the program addition for event
 */
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import EditIcon from "@/assets/svg/edit-program-icon.svg";
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import moment from "moment";
import AddIcon from '@mui/icons-material/Add';
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";

type FormData = {
  addOn: {
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    type: string;
    amount:string;
    properties: {
      propertyId:string,
      propertyName: string;
      propertyAmount: string;
    }[];
    propertyName:string,
    propertyAmount:string,
    addonId: string;
    propertyChip:string
  }[];
  savedPrograms: {
    id?: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    type: string;
    amount:string;
    properties: {
      propertyId:string,
      propertyName: string;
      propertyAmount: string;
    }[];
    propertyName:string,
    propertyAmount:string,
    addonId: string;
    propertyChip:string
  }[];
};
type ProgramProps = {
  formSubmit: boolean;
  onSubmitHandler: (event: any, type: string) => void;
  onSaveHandler: (event: any, type: string) => void;
  data: any;
  addOnOptions?: any;
  onaddOnSubmitHandler:()=>void;
};
const typeArray = [
  { label: "Paid", value: "PAID" },
  { label: "Free", value: "FREE" },
];



const AddAddOns: React.FC<ProgramProps> = React.memo(
  ({ formSubmit, onSubmitHandler, data, onSaveHandler ,onaddOnSubmitHandler}) => {
    const { handleSubmit, control, watch, setValue,resetField } = useForm<FormData>({

      defaultValues: {
        addOn: [
          {
            name: "",
            description: "",
            startTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            endTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            type: "PAID",
            properties: [
              { propertyName: "", propertyAmount: "" },
            ],
            addonId: "",
          },
        ],
      },
    });
    const { fields, append, remove } = useFieldArray({
      control,
      name: "addOn",
    });
    const [programIndex, setProgramIndex] = useState<any>();
    const [editMode, setEditMode] = useState(false);
    /**
     * Useeffect hook updates the programIndex value based on the savedPrograms dependency
     */
    useEffect(() => {

      const savedPrograms = watch("savedPrograms");
      if (savedPrograms && savedPrograms.length > 0) {
        setProgramIndex(savedPrograms.length - 1);
      } else {
        setProgramIndex(0);
      }
    }, [watch("savedPrograms")]);
    
    /**
     * Useeffect hook submits the form based on the formSubmit variable
     */
    useEffect(() => {
      if (formSubmit) {
        onSubmitHandler && onSubmitHandler(data?.savedPrograms, "ADDS");
      }
    }, [formSubmit]);

    /**
     * Method handles the form submission
     * @param data : form data
     */
    const onSubmit: SubmitHandler<FormData> = (data: any) => {
      onSubmitHandler && onSubmitHandler(data?.savedPrograms, "ADDS");
    };

    /**
     * Useeffect hook set the field based on the data
     */
    useEffect(() => {
      if (data) {
        setValue("addOn", data);
        setValue("savedPrograms", data);
      }
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
      // Get the current programs data from `watch("programs")`
      const addOn = watch("addOn");
      const newPrograms = [...addOn];

      // Handle saving logic based on `editMode`
      if (!editMode) {
        const newAddon = {
          name: "",
          description: "",
          startTime: moment().format("YYYY-MM-DDTHH:mm"),
          endTime: moment().format("YYYY-MM-DDTHH:mm"),
          type: "PAID",
          amount:"",
          properties: [
            
          ],
          propertyName:"",
          propertyAmount:"",
          addonId: "",
          propertyChip:""
        };
        newPrograms.push(newAddon);

        // Update both `savedPrograms` and the local `programs` array
        setValue("savedPrograms", addOn);
        append(newAddon);
        setProgramIndex(addOn?.length || 0);
      } else {
        // If in `editMode`, just update the program index
        setProgramIndex(addOn?.length ? addOn.length - 1 : 0);
      }

      // Trigger the save handler with the current programs
      onSaveHandler && onSaveHandler(newPrograms,'addOns');

      // Exit edit mode
      setEditMode(false);
    };


    /**
     * Method handles the Update of the program
     * @param index : index of the program to edit
     */
    const handleEdit = (index: number) => {
      setEditMode(true);
      setValue("addOn", watch("savedPrograms"));
      setProgramIndex(index);
    };

    /**
     * Method handles the deletion of the program
     * @param index : index of the program to delete
     */
    const handleDelete = (index: number) => {
      setValue("addOn", watch("savedPrograms"));
      setProgramIndex(index);
      const programsCopy = [...watch("savedPrograms")];
      programsCopy.splice(index, 1);
      setValue("savedPrograms", programsCopy);
      const saveProgram = programsCopy;

      remove(index);
      if (index === programsCopy.length) {
        if (index === 0) {
          const obj={
            name: "",
            description: "",
            startTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            endTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            type: "PAID",
            addonId: "",
            properties: [{propertyId:"", propertyName: "", propertyAmount: "" }],
            propertyName:"",
            propertyAmount:"",
            propertyChip:"",
            amount:""
          };
          append(obj);
          saveProgram.push(obj);
        } else {
          setProgramIndex(programsCopy.length);
        }
      }
      onSaveHandler && onSaveHandler(saveProgram,'addOns');
    };
    /**
     * Method handles the adding a new property
     * @param index : form index
     */
    const addProperty = (index:number) => {
      const values = watch();      
      const propertyName = values.addOn[index].propertyName; 
      const propertyAmount = values.addOn[index].propertyAmount;
    
      const newProperty = {
        propertyId:Date.now().toString(),
        propertyName: propertyName,
        propertyAmount: propertyAmount,
      };
    
      const updatedAddOn = [...values.addOn]; 
    
      updatedAddOn[index].properties = updatedAddOn[index].properties.filter(
        prop => prop.propertyName !== ""
      );
      updatedAddOn[index].properties.push({ ...newProperty});
    
      setValue("addOn", updatedAddOn);
      resetField(`addOn.${index}.propertyName`,{});
      resetField(`addOn.${index}.propertyAmount`,{});
    }
    /**
     * Method handles the delete a property
     * @param index : form index
     */
    const deleteChip = (item: any, _index: number) => {
      const values = watch(); 
      const updatedAddOn = values.addOn.map((addOnItem) => {
          const updatedProperties = addOnItem.properties.filter(
            (property) => property.propertyId !== item.propertyId
          );
          const data= {
            ...addOnItem,
            property: updatedProperties,
          };
        return data;
      });
      setValue('addOn', updatedAddOn);
    };
    

    return (
      <Box className="add-program-container">
        <Grid onClick={onaddOnSubmitHandler}>Hello</Grid>
        <Grid container className="">
          <Grid
            container
            size={{ xs: 12, sm: 12 }}
            direction={"row"}
            className=""
          >
            <Grid
              size={{ xs: 12, sm: 8 }}
              className="add-program-form-container"
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
                        Add Ons
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
                                <Grid size={{ xs: 12, sm: 6 }} mb={2}>
                                  {/* <CustomSelect/> */}
                                  {/* <CustomTextField
                                    placeholder="Add-on Name"
                                    control={control}
                                    name={`addOn.${index}.name`}
                                    type="text"
                                    rules={{ required: true }}
                                  /> */}
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <CustomTextField
                                    placeholder="Add-on Description"
                                    control={control}
                                    name={`addOn.${index}.description`}
                                    type="text"
                                    rules={{ required: true }}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <CustomTextField
                                    placeholder="Date"
                                    control={control}
                                    name={`addOn.${index}.startTime`}
                                    type="date"
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
                                            "Start Date cannot be in the past"
                                          );
                                        }
                                        return "Invalid date";
                                      },
                                    }}
                                  />
                                </Grid>
                                <Grid  size={{ xs: 12, sm: 6 }} display={"flex"} justifyContent={"space-between"}>
                                  {/* <CustomTextField
                                    placeholder="End Date & Time"
                                    control={control}
                                    name={`addOn.${index}.endTime`}
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
                                  <Grid size={{xs:3}}>
                                  <CustomTextField
  placeholder="Start Time"
  control={control}
  name={`addOn.${index}.startTime`}
  type="time"
  min={moment().format("HH:mm")}  // Setting min time as current time (can be adjusted if needed)
  rules={{
    required: true,
    validate: (value) => {
      if (value) {
        const currentTime = moment().format("HH:mm");
        return (
          value >= currentTime || "Start Time cannot be in the past"
        );
      }
      return "Invalid time";
    },
  }}
/>
</Grid>

<Grid size={{xs:3}}>
<CustomTextField
  placeholder="End Time"
  control={control}
  name={`addOn.${index}.endTime`}
  type="time"
  min={moment().format("HH:mm")}  // Setting min time as current time (can be adjusted if needed)
  rules={{
    required: true,
    validate: (value) => {
      const startTime = watch(`addOn.${index}.startTime`);  // Get the value of start time
      if (value && startTime) {
        // If end time is less than start time, show an error message
        return (
          value > startTime || "End Time must be after Start Time"
        );
      }
      return "Invalid time";
    },
  }}
/>
</Grid>
                                </Grid>
                                <Grid size={{  xs: 12, sm: 6  }} >
                                        <CustomTextField
                                          placeholder="Price"
                                          control={control}
                                          name={`addOn.${index}.amount`}
                                          type="text"
                                          rules={{
                                            required: "Price is required",
                                            pattern: {
                                              value: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
                                              message:
                                                "Enter a valid price (up to 2 decimal places)",
                                            },
                                            validate: (value) => {
                                              if (typeof value === "string") {
                                                const price = parseFloat(value);
                                                return (
                                                  price >= 0 ||
                                                  "Price cannot be negative"
                                                );
                                              }
                                              return "Invalid price format";
                                            },
                                          }}
                                        />
                                      </Grid>
                                <Grid container size={{ xs: 12 }} display={"flex"} justifyContent={"space-between"}>
                                  <Grid>
                                    <Typography
                                      textAlign={"start"}
                                      variant="h5"
                                      lineHeight={2}
                                      className="add-program-addon-property-header"
                                    >
                                      Add Property
                                    </Typography>
                                  </Grid>
                                  <Grid>
                                    <CustomRadio
                                      className="add-program-radio-btn"
                                      control={control}
                                      name={`addOn.${index}.type`}
                                      label=""
                                      options={typeArray}
                                      row={true}
                                      value={"PAID"}
                                    />
                                  </Grid>
                                </Grid>
                                <Grid container display={"flex"} justifyContent={"space-between"} size={{xs:12,sm:12}} alignItems={"center"}>
                                  <Grid size={{ xs: 12, sm: 6 }}>
                                    <CustomTextField
                                      placeholder="Property Name"
                                      control={control}
                                      name={`addOn.${index}.propertyName`}
                                      type="text"
                                      // rules={{ required: true }}
                                    />
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 6 }} display={"flex"} >
                                    {watch(`addOn.${index}.type`) === "PAID" && (
                                      <Grid size={{ xs: 12, sm: 12 }}>
                                        <CustomTextField
                                          placeholder="Price"
                                          control={control}
                                          name={`addOn.${index}.propertyAmount`}
                                          type="text"
                                          rules={{
                                            // required: "Price is required",
                                            pattern: {
                                              value: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
                                              message:
                                                "Enter a valid price (up to 2 decimal places)",
                                            },
                                            validate: (value) => {
                                              if (typeof value === "string") {
                                                const price = parseFloat(value);
                                                return (
                                                  price >= 0 ||
                                                  "Price cannot be negative"
                                                );
                                              }
                                              return "Invalid price format";
                                            },
                                          }}
                                        />
                                      </Grid>
                                    )}
                                    <Grid ml={1} mt={1}>
                                      <IconButton
                                        className="add-program-prop-add"
                                        onClick={()=>addProperty(index)}
                                      >
                                        <AddIcon />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                {watch(`addOn.${index}.properties`).length!=0&&<Grid container flexDirection={"column"}>
                                  <Typography variant="h6">Properties</Typography>
                                  <Grid container spacing={1}>
                                  {watch(`addOn.${index}.properties`)?.map((item,index)=>{
                                    return  <Chip className="add-program-chip-item" onDelete={()=>deleteChip(item,index)} key={index+"chip"} label={`${item.propertyName} ${item?.propertyAmount ? "- $" + item.propertyAmount : ""}`}/> 
                                  })}
                                  </Grid>
                                </Grid>}
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
            <Grid
              container
              direction={"column"}
              className="add-program-display-container"
              size={{ xs: 12, sm: 4 }}
              spacing={2}
              key='add-program-display-container'
            >
              {watch("savedPrograms")?.length>=1&&<Grid container className="add-program-display-container-box">
               <Typography variant="h6">Saved Add-Ons</Typography>
              {watch("savedPrograms")?.map(
                (field, index) =>
                  field.name
                  && (
                    <Grid
                      key={field.id}
                      container
                      className="add-program-display-item"
                      size={{ xs: 12, sm: 12 }}
                    >
                      <Grid size={{ xs: 8, sm: 8 }} >
                        <Grid container size={{ xs: 12, sm: 12 }} direction={'column'}>
                         
                        <Grid>{field.name}</Grid>
                        <Grid>{field.description}</Grid>    
                        </Grid>
                                            
                      </Grid>

                      <Grid size={{ xs: 4, sm: 4 }}>
                        <IconButton onClick={() => handleEdit(index)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  )
              )}
            </Grid>}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }
);

export default AddAddOns;
