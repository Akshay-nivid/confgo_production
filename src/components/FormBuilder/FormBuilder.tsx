import CustomButton from "@/components/CustomButton/CustomButton";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { validateRequiredField } from "@/Utils/Validation";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useFieldArray, useForm } from "react-hook-form";
import CustomSelect from "../CustomSelectBox/CustomSelect";
import { useState } from "react";
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";
import useStore from "@/Libs/store";
import { Logger } from "@/Utils/Logger";

export interface ICreateFormField {
  title: string;
  fieldType: string;
  required: [];
  id: string;
  option?: { value: string }[];
}

const selectOptions = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  // { label: "File", value: "file" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Radio", value: "radio" },
  { label: "Select", value: "select" },
  { label: "Address", value: "address" },
];

const isFieldTypePresent = (type: string) =>
  ["address", "checkbox", "radio", "select"].includes(type);

/**
 * Form Builder Component to creact custom form field
 *
 */
const FormBuilder = () => {
  const { control, handleSubmit, reset, watch } = useForm<ICreateFormField>({
    defaultValues: {
      title: "",
      fieldType: "",
      required: [],
      option: [{ value: "" }],
    },
  });

  const POST = useStore((state: any) => state.POST);

  /**
   * function to handle form field creation
   */
  function handleFormCreation(data: ICreateFormField) {
    const newData = {
      ...data,
      id: Date.now().toString(),
      option: isFieldTypePresent(data.fieldType) ? data.option : undefined,
    };

    
    setFormFields((prev) => {
      const updatedFields = [...prev, newData].reverse();
      return updatedFields;
    });

    reset({
      title: "",
      fieldType: "",
      required: [],
      option: [{ value: "" }],
    });
  }

  /**
   * function to handle form field data array while editing the form field
   * @param data
   */
  function handleFormFieldDataChange(data: ICreateFormField[]): void {
    setFormFields(data);
  }

  const [formFields, setFormFields] = useState<ICreateFormField[]>([]);


  function handleClickGenerateForm() {
    const parsedData = formFields.map(
      (field: ICreateFormField, index: number) => {
        return {
          name: (index += 1).toString(),
          metadata: JSON.stringify(field),
        };
      }
    );
    const formData = {
      eventId: 7,
      participantTypeId: 1,
      data: parsedData,
    };
     POST({
      url: "event/form",
      body: formData,
       id: "dynamicGeneratedForm",
      successCB: (data: any) => {
        Logger._log("dynamic GeneratedForm api call success", data);
      }
    });
  }

  const fieldType = watch("fieldType");

  const { append, remove, fields } = useFieldArray({
    control,
    name: "option",
  });

  return (
    <Grid justifyContent={"center"} container className="form-builder layout">
      <Grid container size={12} spacing={2}>
        <Grid size={12}>
          <Typography className="form-builder-title">
            Custom Form Builder
          </Typography>
        </Grid>
        <Grid size={12} className="form-builder-content-container">
          <Typography className="form-builder-content">
            Custom Fields Builder allows you to easily create and customize
            fields for your forms. Tailor your input options to gather the
          </Typography>
          <Typography className="form-builder-content">
            exact information you need, with a simple and user-friendly
            interface.
          </Typography>
        </Grid>
      </Grid>
      <Grid display={"flex"} className="grid-left" size={6}>
        {formFields.length < 1 ? (
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
        ) : (
          <Box className="fields-data-container">
            <CreatedFormFieldList
              formFields={formFields}
              handleFormFieldDataChange={handleFormFieldDataChange}
            />
          </Box>
        )}
      </Grid>
      <Grid
        size={6}
        className="grid-right"
        display={"flex"}
        overflow={"auto"}
        height={"100%"}
        paddingBlock={"2rem"}
      >
        <Box className="content-container">
          <Box className="header-container">
            <Typography textAlign={"center"} className="form-builder-sub-title">
              Create your own form fields
            </Typography>
          </Box>
          <Box className="form-container">
            <form
              onSubmit={handleSubmit(handleFormCreation)}
              noValidate
              className="form"
            >
              <Box className="textfield-container">
                <CustomTextField
                  control={control}
                  name="title"
                  placeholder="Title"
                  label={"Field Name"}
                  rules={{
                    required: validateRequiredField({}),
                  }}
                />
                <CustomSelect
                  name="fieldType"
                  control={control}
                  label="Select Field Type"
                  options={selectOptions}
                  rules={{
                    required: validateRequiredField({
                      message: "Field Type Required",
                    }),
                  }}
                />
                {isFieldTypePresent(fieldType) ? (
                  fields.map((field, index) => (
                    <Box key={field.id}>
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
                      <Box
                        display={"flex"}
                        justifyContent={"flex-end"}
                        alignItems={"center"}
                      >
                        {index > 0 ? (
                          <CustomButton
                            label="Delete"
                            onClick={() => remove(index)}
                            variant="text"
                            size="small"
                            className="text-danger"
                          />
                        ) : (
                          <></>
                        )}
                        {index === fields.length - 1 && (
                          <CustomButton
                            label="Add More"
                            onClick={() => append({ value: "" })}
                            variant="text"
                            size="small"
                          />
                        )}
                      </Box>
                    </Box>
                  ))
                ) : (
                  <></>
                )}
                <CustomCheckbox
                  control={control}
                  name="required"
                  options={[{ label: "Mandatory", value: "true" }]}
                />
              </Box>

              <CustomButton
                className="create-form-field-button"
                fullWidth
                size="large"
                label="Create Form Field"
                type="submit"
              />
            </form>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"center"}
            className="creat-form-button-container "
          >
            <CustomButton
              size="large"
              label="Generate Form"
              disabled={formFields.length < 1}
              className="create-form-button"
              onClick={handleClickGenerateForm}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FormBuilder;

const CreatedFormFieldList = ({
  formFields,
  handleFormFieldDataChange,
}: {
  formFields: ICreateFormField[];
  handleFormFieldDataChange: (data: ICreateFormField[]) => void;
}) => {
  const [expanded, setExpanded] = useState<string | false>("");
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm<ICreateFormField>({
    defaultValues: {
      title: "",
      fieldType: "",
      required: [],
    },
  });

  const handleChange =
    ({
      panel,
      currentFieldData,
    }: {
      panel: string;
      currentFieldData: ICreateFormField;
    }) =>
    () => {
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
    };

  // handle delete field
  function handleDeleteField(indexToRemove: number): void {
    const updatedFormFields = formFields.filter(
      (_, index) => index !== indexToRemove
    );
    handleFormFieldDataChange(updatedFormFields);
    setExpanded(false);
  }

  function handleEditField(data: ICreateFormField, indexToEdit: number) {
    if (Object.keys(dirtyFields).length === 0) {
      setExpanded(false);
      return;
    }
    const newData = {
      ...data,
      id: formFields[indexToEdit].id,
    };
    handleFormFieldDataChange(
      formFields.map((field, index) =>
        index === indexToEdit ? newData : field
      )
    );
    setExpanded(false);
  }

  return (
    <>
      {formFields?.map((field, index) => {
        return (
          <Box key={field.id} className="field-accordion-card">
            <Accordion expanded={expanded === field.id}>
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
                        {field.required?.length > 0 ? "Yes" : "No"}
                      </span>{" "}
                    </Typography>
                  </Box>

                  <Box className="button-group">
                    <CustomButton
                      size="small"
                      onClick={handleChange({
                        panel: field.id,
                        currentFieldData: field,
                      })}
                      label="Edit"
                      className="edit-button"
                    />
                    <CustomButton
                      size="small"
                      className="delete-button"
                      onClick={() => handleDeleteField(index)}
                      label="Delete"
                    />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails className="">
                <Box className="form-container ">
                  <form
                    onSubmit={handleSubmit((data) =>
                      handleEditField(data, index)
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
                        columnSpacing={2}
                        rowSpacing={2}
                        className="text-select-wrapper"
                      >
                        <Grid size={12}>
                          <CustomTextField
                            control={control}
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
                        <Grid size={12}>
                          <CustomSelect
                            size="small"
                            name="fieldType"
                            control={control}
                            label="Select Field Type"
                            options={selectOptions}
                            rules={{
                              required: validateRequiredField({}),
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container columnSpacing={2} marginTop={"1rem"}>
                        {isFieldTypePresent(field.fieldType) &&
                          field.option &&
                          field.option.map((optn, index) => {
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
                      <CustomCheckbox
                        control={control}
                        name="required"
                        options={[{ label: "Mandatory", value: "true" }]}
                      />
                    </Box>
                    <Box className="save-button-container">
                      <CustomButton
                        className="save-button "
                        fullWidth
                        size="medium"
                        label="Save Changes"
                        type="submit"
                      />
                    </Box>
                  </form>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        );
      })}
    </>
  );
};
