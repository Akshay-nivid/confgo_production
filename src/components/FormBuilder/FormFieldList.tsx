import { validateRequiredField } from "@/Utils/Validation";
import { Box, Typography, Accordion, AccordionSummary, IconButton, AccordionDetails, } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useStore, { setDataById } from "@/Libs/store";
import CustomSelect from "../CustomSelectBox/CustomSelect";
import CustomTextField from "../CustomTextfield/CustomTextField";
import { selectOptions, isFieldTypePresent } from "./programHandlers";
import EditIcon from "@/assets/svg/edit-program-icon.svg";
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import CustomSwitch from "../CustomSwitch/CustomSwitch";
import DoneIcon from '@mui/icons-material/Done';
import { useLocation } from "react-router-dom";
/**
 * FormFieldList component renders a list of form fields for a specific 
 * participant type. It allows for editing, deleting, and updating form 
 * fields. The component uses an accordion to display each field's 
 * details, which can be expanded or collapsed. It integrates with a 
 * store to manage the state of form fields and uses react-hook-form for 
 * form handling.
 *
 * @param {Object} props - Component props
 * @param {string} props.participantType - The type of participant for 
 * which the form fields are rendered. This determines which set of form 
 * fields from the store are displayed and managed.
 */

interface FormBuilderProps {
    eventData?: any;
    participantType:string
  }
  
const FormFieldList: React.FC<FormBuilderProps> = ({ participantType,eventData }) => {
    const eventId = useLocation()?.pathname.split("/")[3];

    const [expanded, setExpanded] = useState<string | false>("");

    const formFieldsArray = useStore((state) => state?.compData?.["formFieldsArray"]) ?? {};

    const Data = formFieldsArray?.[eventId]?.[participantType] || [];

    const {
        control,
        handleSubmit,
        reset,
        formState: { dirtyFields },
    } = useForm<any>({
        defaultValues: {
            title: "",
            fieldType: "",
            required: false,
        },
    });


    /**
     * Handles edit icon click event for a given field
     * @param {Object} currentFieldData - current field data
     * @param {string} panel - panel name
     */
    function handleClickEditIcon(currentFieldData: any, panel: string) {
        if (eventData?.published) {
            setDataById("snackBarInfo", {
              open: true,
              autoHideDuration: 2000,
              severity: "error",
              message: "Event is Already Published !",
            });}
            else{
                if (panel === expanded) {
                    return;
                }
                reset({
                    title: currentFieldData.title,
                    fieldType: currentFieldData.fieldType,
                    required: currentFieldData.required,
                    option: currentFieldData.option,
                });
                setExpanded(panel);
            }
     
    }


    /**
     * Handles delete icon click event for a given field
     * @param {string} id - id of the field to be deleted
     */
    function handleClickDeleteIcon(id: string) {
        if (eventData?.published) {
            setDataById("snackBarInfo", {
              open: true,
              autoHideDuration: 2000,
              severity: "error",
              message: "Event is Already Published !",
            });}
            else{
        const updatedFormFields = { ...formFieldsArray };
        updatedFormFields[eventId][participantType] = updatedFormFields?.[eventId]?.[participantType].filter((field: any) => field.uuid !== id);
        setDataById("formFieldsArray", {
            ...formFieldsArray,
            [eventId]: {
              ...formFieldsArray[eventId],
              [participantType]: updatedFormFields[eventId][participantType],
            },
          });
    }
}


    /**
     * Updates the form fields array with the new data provided and saves it 
     * to the store. The field with the matching ID is updated with the new 
     * values from the data parameter. After updating, it collapses the 
     * expanded accordion panel.
     *
     * @param {Object} data - The data containing updated field information 
     * including the field ID, title, field type, required status, and options.
     */
    function handleSaveChanges(data: any,id:string) {

        if (Object.keys(dirtyFields).length === 0) {
            setExpanded(false);
            return;
        }

        const updatedFormFields = { ...formFieldsArray };

        updatedFormFields[eventId][participantType] = updatedFormFields?.[eventId]?.[participantType].map((field: any) => {
            if (field.uuid === id) {
                return {
                    ...field,
                    title: data.title,
                    fieldType: data.fieldType,
                    required: data.required,
                    option: data.option,
                };
            }
            return field;
        });

        setDataById("formFieldsArray", { ...updatedFormFields });

        setExpanded(false);
    }

    return (
        <>
            {Data.length < 1 ? (
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    className="no-fields-placehold-container"
                >
                    <Typography className="no-fields-placeholder" textAlign={"center"}>
                        No Fields Created Yet
                    </Typography>
                </Box>
            ) : <>
                {formFieldsArray?.[eventId]?.[participantType] && formFieldsArray?.[eventId]?.[participantType].map((field: any) => {
                    return (
                        <Box key={field.uuid} className="field-accordion-card">
                            <Accordion className="field-accordion" expanded={expanded === field.uuid}>
                                <AccordionSummary
                                    expandIcon={<></>}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Box
                                        display={"flex"}
                                        justifyContent={"space-between"}
                                        alignItems={"center"}
                                        className="accordion-header-container"
                                        width={"100%"}
                                    >
                                        <Box
                                            display={"flex"}
                                            flexDirection={"column"}
                                            gap={2}
                                            className="accordion-header"
                                        >
                                            <Typography className="field-header">
                                                Field Name :{" "}
                                                <span className="field-value">{field.title}</span>{" "}
                                            </Typography>

                                            <Typography className="field-header">
                                                Field Type :{" "}
                                                <span className="field-value">{field.fieldType}</span>{" "}
                                            </Typography>

                                            <Typography className="field-header">
                                                Mandatory :{" "}
                                                <span className="field-value">
                                                    {field.required ? "Yes" : "No"}
                                                </span>{" "}
                                            </Typography>
                                        </Box>

                                        <Box className="button-group">
                                            <IconButton onClick={() => handleClickEditIcon(field, field.uuid)} className="edit-button">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton className="delete-button"
                                                onClick={() => handleClickDeleteIcon(field.uuid)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>

                                        </Box>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails className="">
                                    <Box className="form-container ">
                                        <form
                                            onSubmit={handleSubmit((data) =>
                                                handleSaveChanges(data,field.uuid)
                                            )}
                                            noValidate
                                            className="form"
                                        >
                                            <Box
                                                className="textfield-container"
                                                display={"flex"}
                                                flexDirection={"column"}
                                            >
                                                <Grid
                                                    container
                                                    size={12}
                                                    columnSpacing={2}
                                                    rowSpacing={2}
                                                    className="text-select-wrapper"
                                                >
                                                    <Grid size={5}>
                                                        <CustomTextField
                                                            control={control}
                                                            size="medium"
                                                            name="title"
                                                            placeholder="Field Name"
                                                            label={"Field Name"}
                                                            rules={{
                                                                required: validateRequiredField({
                                                                    message: "Please Provide Field Name",
                                                                }),
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid size={5}>
                                                        <CustomSelect
                                                            size="medium"
                                                            name="fieldType"
                                                            control={control}
                                                            label="Select Field Type"
                                                            options={selectOptions}
                                                            rules={{
                                                                required: validateRequiredField({}),
                                                            }}
                                                        />
                                                        
                                                    </Grid>
                                                    <Grid className="" size={2} display={"flex"} justifyContent={'center'} alignItems={'center'}>
                                                            <IconButton type="submit" className="add-icon-button-wrapper">
                                                                <DoneIcon className="add-icon" />
                                                            </IconButton>
                                                        </Grid>
                                                </Grid>
                                                <Grid container columnSpacing={2} marginTop={"1rem"}>
                                                    {isFieldTypePresent(field.fieldType) && field.option && field.option.map((optn: { value: string }, index: number) => {
                                                        return (
                                                            <Grid size={6} key={index}>
                                                                <Box
                                                                    key={index}
                                                                    className="textfield-container"
                                                                    display={"flex"}
                                                                    flexDirection={"column"}
                                                                >
                                                                    <CustomTextField
                                                                        defaultValue={optn.value}
                                                                        control={control}
                                                                        name={`option.${index}.value`}
                                                                        placeholder="Field Option"
                                                                        label={"Field Option"}
                                                                        rules={{
                                                                            required: validateRequiredField({}),
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                                <CustomSwitch buttonColor="success" control={control} name="required" label="Mandatory" />

                                            </Box>
                                           
                                        </form>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    );
                })}
            </>
            }

        </>
    );
};

export default FormFieldList;