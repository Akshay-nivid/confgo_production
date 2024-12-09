import { setDataById } from "@/Libs/store";
import { validateRequiredField } from "@/Utils/Validation";
import { Box, Typography, IconButton } from "@mui/material";
import useStore from "@/Libs/store";
import Grid from "@mui/material/Grid2";
import CustomSelect from "../CustomSelectBox/CustomSelect";
import CustomSwitch from "../CustomSwitch/CustomSwitch";
import CustomTextField from "../CustomTextfield/CustomTextField";
import AddIcon from '@mui/icons-material/Add';
import { useFieldArray, useForm } from "react-hook-form";
import { isFieldTypePresent, selectOptions } from "./programHandlers";
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import CustomButton from "../CustomButton/CustomButton";

interface IFormEditor {
    participantType: string,
    participantData?: any;
    handleGenerateForm: (participantType: string) => void
}

/**
 * FormEditor component is used to create form fields. It renders a form with the following fields:
 * 1. Field Name
 * 2. Field Type (Select Field Type)
 * 3. Add More (Icon Button)
 * 4. Mandatory (Switch)
 * If the user selects a field type that requires options, it will render a list of text fields with a delete button.
 * The component also renders a submit button to save the form fields. The saved form fields are stored in the state variable `formFieldsArray`.
 * @param participantType - The type of the participant (generic, doctor, engineer, student)
 * @param participantData - The data of the participant
 * @param handleGenerateForm - The function to be called when the user clicks the "Save Form" button
 * @returns The FormEditor component
 */

const FormEditor: React.FC<IFormEditor> = ({ participantType, participantData, handleGenerateForm }) => {


    const formFieldsArray = useStore((state: any) => state?.compData?.["formFieldsArray"]) ?? {};


    const { handleSubmit, control, watch, reset } = useForm({
        defaultValues: {
            title: "",
            fieldType: "",
            required: false,
            option: [{ value: "" }],
        },
    });

    const { append, remove, fields } = useFieldArray({
        control,
        name: "option",
    });

    const fieldType = watch("fieldType");
    
    /**
     * Handles the creation of a new form field. The form field is stored in the state variable `formFieldsArray`.
     * If the form field type is a select field type or a checkbox field type, the option array is stored in the form field data.
     * If the form field type is not a select field type or a checkbox field type, the option array is not stored in the form field data.
     * @param {Object} formData - The form data of the form field
     * @param {string} userType - The type of the user (generic, doctor, engineer, student)
     */

    const handleCreateFormField = (formData: any, userType: string) => {


        const newData = {
            ...formData,
            ...participantData,
            participantType: participantType,
            uuid: crypto.randomUUID(),
            option: isFieldTypePresent(formData.fieldType) ? formData.option : undefined,
        };


        if (!formFieldsArray) {
            setDataById('formFieldsArray', { [userType]: [formData] });
            return;
        }


        const updatedFormFieldsArray = { ...formFieldsArray };  // Create a copy of formFieldsArray to avoid direct mutation


        if (!updatedFormFieldsArray[userType]) {   // Initialize the userType array if it doesn't exist
            updatedFormFieldsArray[userType] = [];
        }

        updatedFormFieldsArray[userType].push(newData);

        setDataById('formFieldsArray', updatedFormFieldsArray);

        reset({
            title: "",
            fieldType: "",
            required: false,
            option: [{ value: "" }],
        });


    };




    return (

        <Box className="content-container">
            <Box className="header-container">
                <Typography textAlign={"center"} className="form-builder-sub-title">
                    Create your own form fields
                </Typography>
            </Box>
            <Box className="form-container">
                <form
                    onSubmit={handleSubmit((data: any) => handleCreateFormField(data, participantType))}
                    noValidate
                    className="form"
                >
                    <Box className="textfield-container ">
                        <Grid position={"relative"} container columnSpacing={2}>
                            <Grid size={5}>
                                {/* <Box className="title-type-button-container"> */}
                                <CustomTextField
                                    
                                    control={control}
                                    className="title-field"
                                    name="title"
                                    placeholder="Title"
                                    label={"Field Name"}
                                    rules={{
                                        required: validateRequiredField({ showMessage: false }),
                                    }}
                                />
                            </Grid>
                            <Grid size={5}>
                                <CustomSelect
                                    name="fieldType"
                                    control={control}
                                    label="Select Field Type"
                                    options={selectOptions}
                                    rules={{
                                        required: validateRequiredField({ showMessage: false }),
                                    }}
                                />
                            </Grid>
                            <Grid className="" size={2} display={"flex"} justifyContent={'center'} alignItems={'center'}>
                                <IconButton type="submit" className="add-icon-button-wrapper">
                                    <AddIcon className="add-icon" />
                                </IconButton>
                            </Grid>
                        </Grid>
                        {/* </Box> */}

                        {isFieldTypePresent(fieldType) ? (
                            fields.map((field: any, index: number) => (
                                <Box key={field.id} className="flex">
                                    <Grid container size={12}>
                                        <Grid size={11}>
                                            <CustomTextField
                                                key={field.id}
                                                control={control}
                                                name={`option.${index}.value`}
                                                placeholder="Field Name"
                                                label={"Field Name"}
                                                rules={{
                                                    required: validateRequiredField({}),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>



                                    <Box
                                        display={"flex"}
                                        justifyContent={"flex-end"}
                                        alignItems={"center"}
                                    >
                                        {fields.length > 0 ? (
                                            <IconButton>
                                                <DeleteIcon onClick={() => remove(index)} className="" />

                                            </IconButton>
                                            // <CustomButton
                                            //   label="Delete"
                                            //   onClick={() => remove(index)}
                                            //   variant="text"
                                            //   size="small"
                                            //   className="text-danger"
                                            // />
                                        ) : (
                                            <></>
                                        )}
                                        {index === fields.length - 1 && (
                                            // <CustomButton
                                            //   label="Add More"
                                            //   onClick={() => append({ value: "" })}
                                            //   variant="text"
                                            //   size="small"
                                            // />
                                            <IconButton>
                                                <AddIcon onClick={() => append({ value: "" })}
                                                />
                                            </IconButton>
                                        )}

                                    </Box>
                                </Box>
                            ))
                        ) : (
                            <></>
                        )}
                        <CustomSwitch buttonColor="success" control={control} name="required" label="Mandatory" />
                    </Box>
                </form>
            </Box>
            {participantType === "generic" && <Box
                display={"flex"}
                justifyContent={"center"}
                className="create-form-button-container"
            >
                <CustomButton
                    label="Save Form"
                    onClick={() => handleGenerateForm(participantType)}
                    fullWidth
                    className="create-form-button"
                    variant="contained"
                    size="large"
                />
            </Box>}
        </Box>
    )
}

export default FormEditor
