/**
 * AddProgram component handles the program addition for event
 */
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Box, Button, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, useFieldArray} from "react-hook-form";
import EditIcon from "@/assets/svg/edit-program-icon.svg";
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import moment from "moment";
import AddIcon from '@mui/icons-material/Add';
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CreateAddon from "./CreateAddon";
import CustomSwitch from "@/components/CustomSwitch/CustomSwitch";
import { validateRequiredField } from "@/Utils/Validation";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { CloseOutlined } from "@mui/icons-material";
import { NoAddons } from "@/assets/svg";

type FormData = {
  addOn: {
    name: string;
    description: string;
    date:string,
    startTime: string;
    endTime: string;
    type: string;
    properties: {
      propertyId:string,
      propertyName: string;
      propertyAmount: string;
    }[];
    propertyName:string,
    propertyAmount:string,
    addonId: string;
    propertyChip:string
    dateRequired: string[];
    addonType:string;
    repeat:string[];
    noOfDays:string;
  }[];
  savedAddOns: {
    id?: string;
    name: string;
    description: string;
    date:string;
    startTime: string;
    endTime: string;
    type: string;
    properties: {
      propertyId:string,
      propertyName: string;
      propertyAmount: string;
    }[];
    propertyName:string,
    propertyAmount:string,
    addonId: string;
    propertyChip:string;
    dateRequired: string[];
    addonType:string;
    repeat:string[],
    noOfDays:string
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
  onaddOnSubmitHandler:()=>void;
  eventData?:any
};
const typeArray = [
  { label: "Paid", value: "PAID" },
  { label: "Free", value: "FREE" },
];



const AddAddOns: React.FC<ProgramProps> = React.memo(
  ({ formSubmit, formDraftSubmit, onSubmitHandler, onDraftSubmitHandler, data, onSaveHandler ,onaddOnSubmitHandler,addOnOptions,eventData}) => {
    const { handleSubmit, control, watch, setValue,resetField,setError,setFocus} = useForm<FormData>({

      defaultValues: {
        addOn: [
          {
            name: "",
            description: "",
            startTime:  moment().format("HH:mm"),
            endTime:  moment().format("HH:mm"),
            type: "PAID",
            date:moment(eventData?.startTime).format("YYYY-MM-DD"),
            properties: [
            ],
            addonId: "",
            dateRequired:[],
            addonType:"PAID",
            noOfDays:""
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
    const [addOnView,setAddonView]=useState(false);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

     /**
     * craete addon drawer open 
     */
     const handleDrawerOpen = () => {
      setIsDrawerOpen(true); 
    };
  
    /**
     * craete addon drawer close 
     */
    const handleDrawerClosing = () => {
      setIsDrawerOpen(false); 
    };

    /**
     * Useeffect hook updates the programIndex value based on the savedAddOns dependency
     */
    useEffect(() => {

      const savedAddOns = watch("savedAddOns");
      if (savedAddOns && savedAddOns.length > 0) {
        setProgramIndex(savedAddOns.length - 1);
      } else {
        setProgramIndex(0);
      }
    }, [watch("savedAddOns")]);
    /**
     * Useeffect hook submits the form based on the formSubmit variable
     */
    useEffect(() => {
      if (formSubmit) {
        onSubmitHandler && onSubmitHandler(data?.savedAddOns, "ADDS");
      }
    }, [formSubmit]);

    
    /**
     * Useeffect hook submits the form based on the formDraftSubmit variable
     */
    useEffect(() => {
      if (!formDraftSubmit) return; // Short-circuit if formDraftSubmit is false
      if (onDraftSubmitHandler) {
        onDraftSubmitHandler(watch()?.savedAddOns, "ADDS");
      }
    }, [formDraftSubmit]);

    /**
     * Method handles the form submission
     * @param data : form data
     */
    const onSubmit: SubmitHandler<FormData> = (data: any) => {
      onSubmitHandler && onSubmitHandler(data?.savedAddOns, "ADDS");
    };

    /**
     * Useeffect hook set the field based on the data
     */
    useEffect(() => {
      if (data) {
        setValue("addOn", data);
        setValue("savedAddOns", data);
      }
    }, [data]);
  
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
     * Method handles the saving of the programs
     */
    const handleSaveNewPrograms = () => {

      handleSubmit(onSave,
        (errors) => {
        // Check if addOn exists and is an array before forEach
        if (errors.addOn && Array.isArray(errors.addOn)) {
          errors.addOn.forEach((programError, index) => {
            const firstErrorKey = Object.keys(programError ?? {})[0] as keyof FormData["addOn"][number] | undefined;
    
            if (firstErrorKey) {
              const errorField = `addOn.${index}.${firstErrorKey}` as const;              
              scrollToError(errorField);
              setFocus(errorField as unknown as keyof FormData);
            }
          });
        }
      }
    )();
    
    };

    /**
     * Method handles the form submission
     * @param data : form data
     */
    const onSave: SubmitHandler<FormData> = () => {
      // Get the current programs data from `watch("programs")`
      const addOn = watch("addOn");
      const lastItem = addOn[addOn.length - 1];
      const lastIndex = addOn.length - 1;
      let newPrograms = [...addOn];
      //checking atleast property length

      // Handle saving logic based on `editMode`
      if (!editMode) {
        const newAddon = {
          name: "",
          description: "",
          date: moment(eventData?.startTime).format("YYYY-MM-DD"),
          startTime: moment().format("HH:mm"),
          endTime: moment().format("HH:mm"),
          type: "PAID",
          properties: [],
          propertyName: "",
          propertyAmount: "",
          addonId: "",
          propertyChip: "",
          dateRequired: [],
          addonType: "PAID",
          repeat: [],
          noOfDays: ""
        };
        if (lastItem.properties && lastItem.properties.length== 0){
          setError(`addOn.${lastIndex}.propertyName`, {
            type: 'manual',
            message: `Minimum one Addon property should be there`,
          });
          return;
        }
        const startDate = moment(eventData.startTime).startOf('day');
        const endDate = moment(eventData.endTime).startOf('day');
        const differenceInDays = endDate.diff(startDate, 'days') + (startDate.isBefore(endDate) ? 1 : 0);
        if (parseInt(lastItem?.noOfDays) > differenceInDays) {
          setError(`addOn.${lastIndex}.noOfDays`, {
            type: 'manual',
            message: `Maximum ${differenceInDays} can be repeated!`,
          });
          return;
        }

        //When Repeat is true
        if (lastItem.noOfDays !== '' && lastItem?.repeat?.length > 0) {
          // Loop over the remaining days and increment the date for each
          for (let i = 1; i < parseInt(lastItem?.noOfDays); i++) {
            // Create a new addon by copying lastItem
            const newAddon = { ...lastItem };
            const currentDate = new Date(newAddon.date);
            currentDate.setDate(currentDate.getDate() + i);  
            newAddon.date = currentDate.toISOString().split('T')[0];
            //update newPrograms Array
            newPrograms.push(newAddon);
          }
          setValue("savedAddOns", addOn); 
          newPrograms.push(newAddon);
          append(newAddon); 
          setProgramIndex(addOn?.length || 0);
        } else {
          newPrograms.push(newAddon);
        // Update both `savedAddOns` and the local `programs` array
          setValue("savedAddOns", addOn);
          append(newAddon);
          setProgramIndex(addOn?.length || 0);
        }
      } else {
        // If in `editMode`, just update the program index
        setProgramIndex(addOn?.length ? addOn.length - 1 : 0);
      }

      // Trigger the save handler with the current programs
      onSaveHandler && onSaveHandler(newPrograms,'addOns');
      // Exit edit mode
      setEditMode(false);
      handleDrawerClosing();
     
    };


    /**
     * Method handles the Update of the program
     * @param index : index of the program to edit
     */
    const handleEdit = (index: number) => {
      setEditMode(true);
      setValue("addOn", watch("savedAddOns"));
      setProgramIndex(index);
    };

    /**
     * Method handles the deletion of the program
     * @param index : index of the program to delete
     */
    const handleDelete = (index: number) => {
      setValue("addOn", watch("savedAddOns"));
      setProgramIndex(index);
      const programsCopy = [...watch("savedAddOns")];
      programsCopy.splice(index, 1);
      setValue("savedAddOns", programsCopy);
      const saveProgram = programsCopy;
      setEditMode(false);

      remove(index);
      if (index === programsCopy.length) {
        if (index === 0) {
          const obj={
            name: "",
            description: "",
            date:moment(eventData?.startTime).format("YYYY-MM-DD"),
            startTime: moment(new Date()).format("HH:mm"),
            endTime: moment(new Date()).format("HH:mm"),
            type: "PAID",
            addonId: "",
            properties: [{propertyId:"", propertyName: "", propertyAmount: "" }],
            propertyName:"",
            propertyAmount:"",
            propertyChip:"",
            dateRequired:[],
            addonType:"PAID",
            repeat:[],
            noOfDays:""
            
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
    const addProperty = (index: number) => {
      const values = watch();
      const propertyName = values.addOn[index].propertyName;
      const propertyAmount = values.addOn[index].propertyAmount;
      const propertyType = watch(`addOn.${index}.type`);
    
      // Check if the propertyName and propertyAmount are valid
      if (!propertyName) {
        setError(`addOn.${index}.propertyName`, {
          type: 'manual',
          message: 'This field is required',
        });
        return;
      }
      
      // Check if the propertyName exceeds 50 characters
      if (propertyName.length > 100) {
        setError(`addOn.${index}.propertyName`, {
          type: 'manual',
          message: 'property name cannot exceed 100 characters.',
        });
        return;
      }

      //check if propertyAmount is valid 
      if (propertyType === "PAID" && !/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(propertyAmount)) {
         setError(`addOn.${index}.propertyAmount`, {
          type: 'manual',
          message: 'Enter a valid price (up to 2 decimal places)',
        });
        return;
      }
      
    // Check if propertyAmount not and propertyType is PAID
      if (!propertyAmount&&propertyType === "PAID") {  
        setError(`addOn.${index}.propertyAmount`, {
          type: 'manual',
          message: 'This field is required',
        });
        return;
      }
    
      // Prepare the new property object
      const newProperty = {
        propertyId: Date.now().toString(),
        propertyName,
        propertyAmount,
      };
    
      // Update the addOn array by filtering out empty properties and adding the new property
      const updatedAddOn = [...values.addOn];
      updatedAddOn[index].properties = updatedAddOn[index].properties.filter(
        prop => prop.propertyName !== ""
      );
      updatedAddOn[index].properties.push({ ...newProperty });
    
      // Update the addOn state and reset the form fields for propertyName and propertyAmount
      setValue("addOn", updatedAddOn);
      resetField(`addOn.${index}.propertyName`);
      resetField(`addOn.${index}.propertyAmount`);
    }
    /**
     * Method handles the delete a property
     * @param index : form index
     */
    const deleteChip = (item: any, _index: number) => {
      const values = watch();     
      // Update the addOn array by filtering out the specific property
      const updatedAddOn = values.addOn.map((addOnItem) => {
        const updatedProperties = addOnItem.properties.filter(
          (property) => property.propertyId !== item.propertyId
        );
    
        // Return the updated object with correct key (`properties`)
        return {
          ...addOnItem,
          properties: updatedProperties, // make sure the key is `properties`, not `property`
        };
      });
      // Use setValue to update the form state
      setValue('addOn', updatedAddOn);
    };
    /**
     * Method to close the Drawer
     */
    const handleDrawerClose=()=>{
      setAddonView(false)
      resetField(`addOn.${0}.addonId`,{});
    }
    return (
      <Box className="add-program-container">
        <Grid container className="">
          <Grid
            container
            size={{ xs: 12, sm: 12 }}
            direction={"row"}
            className=""
          >
            <Grid
              size={12}
              ml={6}
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
                     {isDrawerOpen && (
                    <CustomDrawer  open={true} type={"right"}>
                      <Grid container  className="add-program-drawer">
                        <Grid size={12} container flexDirection={"row"} >
                          <Grid size={6}>
                          <Typography className="event-information-edit-heading">Add Ons</Typography></Grid>
                          <Grid justifyContent={"flex-end"} container  size={6}>
                           <Button onClick={handleDrawerClosing} className="add-program-drawer-close">
                                    <CloseOutlined />
                                  </Button></Grid>
                        </Grid>
                       
                    <form id="addOnform" onSubmit={handleSubmit(onSubmit)}>
                      {fields.map((field, index) => {
                        if (index === programIndex) {
                          return (
                            <Box key={field.id} mb={2}>
                              <Grid
                                container
                                marginLeft={"auto"}
                                size={12}
                                alignItems={"center"}
                                spacing={2}
                              >
                                <Grid size={{ xs: 12, sm: 12 }}>
                                  <CustomSelect
                                  className="add-program-select"
                                  rules={{required:validateRequiredField({})}}
                                    optionClick={(value) => {
                                      if (value === 'other') {
                                        setAddonView(true)
                                      }
                                    }}
                                    control={control}
                                    label="Add-on Name"
                                    name={`addOn.${index}.addonId`}
                                    options={addOnOptions} />
                                    
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12 }}>
                                  <CustomTextField
                                    placeholder="Add-on Description"
                                    control={control}
                                    name={`addOn.${index}.description`}
                                    type="text"
                                    rules={{required:validateRequiredField({})}}
                                    multiline={true}
                                    rows={10}
                                  />
                                </Grid>
                                <Grid size={{xs:12,sm:12}}>
                                  <CustomSwitch
                                  className="add-program-switch-btn"
                                  buttonColor="success"
                                  label="Date & Time"
                                  name={`addOn.${index}.dateRequired`}
                                  control={control}
                                  />
                                </Grid>
                                 {
                                  <>{watch(`addOn.${index}.dateRequired`)&& <>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                  <CustomTextField
                                    className="create-event"
                                    placeholder="Date"
                                    control={control}
                                    name={`addOn.${index}.date`}
                                    defaultValue={moment(eventData?.startTime).format("YYYY-MM-DD")}
                                    type="date"
                                    min={moment(eventData.startTime).format("YYYY-MM-DD")}
                                    max={moment(eventData.endTime).format("YYYY-MM-DD")}
                                  />
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <CustomTextField
                                      className="create-event"
                                      placeholder="Start Time"
                                      control={control}
                                      name={`addOn.${index}.startTime`}
                                      defaultValue={ moment(new Date()).format("HH:mm")}
                                      type="time"
                                      min={moment(new Date()).format("HH:mm")} 
                                      rules={{
                                        required: true
                                      }}
                                    />
                                  </Grid>
                                    <Grid size={{ xs: 4 }}>
                                      <CustomTextField
                                        className="create-event"
                                        placeholder="End Time"
                                        control={control}
                                        name={`addOn.${index}.endTime`}
                                        type="time"
                                        min={moment(new Date()).format("HH:mm")}  
                                        rules={{
                                          required: true
                                        }}
                                      />
                                    </Grid>
                      
                                  </>
                                } </>}
                                <Grid size={{ xs: 12, sm: 12 }} display={"flex"} justifyContent={"space-between"}>
                                  <Grid size={{ xs: 12, sm: 6 }}>
                                    <Grid container display={"flex"} alignItems={"center"}>
                                    <CustomCheckbox
                                    className="add-program-check-btn"
                                      options={[{ label: 'Repeat', value: 'YES' }]}
                                      control={control}
                                      name={`addOn.${index}.repeat`}
                                      onChange={()=>{              
                                          setValue(`addOn.${index}.noOfDays`, '')
                                      }}
                                    />
                                      <Tooltip title="No of Days once Saved can't be edited" arrow>
                                        <IconButton className="add-program-warning-msg"
                                        >
                                          <ErrorOutlineIcon />
                                        </IconButton>
                                      </Tooltip>
                                  </Grid>
                                  </Grid>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12 }} display={"flex"} justifyContent={"space-between"}>
                                  {/* Conditionally render Number of Days field */}
                                  {watch(`addOn.${index}.repeat`)?.length > 0 && (
                                    <Grid size={{ xs: 12, sm: 12}}>
                                      <CustomTextField
                                        placeholder="Number of days"
                                        control={control}
                                        name={`addOn.${index}.noOfDays`}
                                        type="number"
                                        readOnly={editMode}
                                        rules={{ required: true }}
                                      />
                                    </Grid>
                                  )}
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
                                      onChange={()=>{       
                                          setValue(`addOn.${index}.propertyAmount`,'')
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                                <Grid container display={"flex"} justifyContent={"space-between"} size={{xs:12,sm:12}} alignItems={"center"}>
                                  <Grid size={{ xs: 12, sm:watch(`addOn.${index}.type`) === "PAID"?6:11}}>
                                    <CustomTextField
                                      placeholder="Property Name"
                                      control={control}
                                      name={`addOn.${index}.propertyName`}
                                      type="text"
                                      // rules={{ required: true }}
                                    />
                                  </Grid>
                                  <Grid size={{ xs: 12, sm:watch(`addOn.${index}.type`) === "PAID"?6: 1 }} display={"flex"} >
                                    {watch(`addOn.${index}.type`) === "PAID" && (
                                      <Grid size={{ xs: 12, sm: 12 }}>
                                        <CustomTextField
                                          placeholder="Price"
                                          control={control}
                                          name={`addOn.${index}.propertyAmount`}
                                          type="Number"
                                          rules={{
                                            pattern: {
                                              value: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
                                              message:
                                                "Enter a valid price (up to 2 decimal places)",
                                            }
                                          }}
                                        />
                                      </Grid>
                                    )}
                                    <Grid ml={1} mt={1}>
                                      <IconButton
                                        className="add-program-prop-add"
                                        onClick={()=>addProperty(index)}
                                      >
                                        <AddIcon className="addicon"/>
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                {watch(`addOn.${index}.properties`)?.length!=0&&<Grid container flexDirection={"column"}>
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
                                  spacing={5}
                                >
                                  <Grid>
                                    <CustomButton
                                      className="add-program-save-btn"
                                      onClick={handleDrawerClosing}
                                      label="Cansel"
                                      variant="contained"
                                      size="large"
                                    />
                                  </Grid>
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
                    
                    </Grid>
                    </CustomDrawer>
                    
                    )
                    }
                    
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid  size={12 }container justifyContent={"center"} alignItems={"center"}>
            <Grid
              container
              direction={"column"}
              className="add-program-display-container"
              size={6}
              key='add-program-display-container'
            >
             <Grid  container className="add-program-display-container-box" >
               <Typography variant="h6">Saved Add-Ons</Typography>
               </Grid>
               <Grid minHeight={"20rem"}>
               {watch("savedAddOns")?.length >= 1 ? (
               watch("savedAddOns")?.map(
               (field, index) =>
                field.addonId && (
                    <Grid
                      key={field.id}
                      container
                      alignItems="center"
                      className="add-program-display-item"
                      alignContent={"center"}
                      size={{ xs: 12, sm: 12 }}
                      
                    >
                      <Grid size={{ xs: 8, sm: 9 }} >
                        <Grid container size={{ xs: 12, sm: 12 }} direction={'column'}>
                        <Grid size={{ xs: 12 }}><Typography className="text-p2 font-700 truncate-text"> {addOnOptions?.find((option: any) => option?.value === field?.addonId)?.label || 'Unknown'}</Typography> </Grid>
                        <Grid size={{ xs: 12}}><Typography className="truncate-text">{field.description}</Typography></Grid>    
                        </Grid>                   
                      </Grid>

                      <Grid size={{ xs: 4, sm: 3 }}>
                        <IconButton onClick={() => handleEdit(index)}>
                          <EditIcon onClick={handleDrawerOpen} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                   )
                  )
                  ) : (
                <Grid 
                  display={"flex"}
                   className="add-program-NOaddon" 
                    justifyContent={"center"} 
                    alignItems={"center"}
                    flexDirection={"column"}
                    size={12}
                    >
                     <Grid size={12} display={"flex"} justifyContent={"center"} alignItems={"center"} >
                     <NoAddons/>
                     </Grid>
                     <Typography className="title">No Add-ons Added Yet</Typography>
                     <Typography className="description">Start creating your first Add-on to bring your event to life!</Typography>
                      </Grid>
              )
            }
              </Grid>
              
            </Grid>
           </Grid>
          </Grid>
        </Grid>
        <Grid size={5} marginInline={"auto"} maxHeight={"max-content"} display={"flex"} className="mt-2"  justifyContent={"center"} alignItems={"center"} >
            <CustomButton className="add-program-addon-btn"   label="Create Add Ons"  onClick={handleDrawerOpen} ></CustomButton>
            </Grid>

        <CustomDrawer
        children={<CreateAddon submitHandler={onaddOnSubmitHandler} closeDrawer={handleDrawerClose} />}
        open={addOnView}
        type="right"
        onClose={()=>handleDrawerClose}

        />
      </Box>
    );
  }
);

export default AddAddOns;