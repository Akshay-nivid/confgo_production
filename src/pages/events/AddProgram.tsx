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
import AddIcon from "@/assets/svg/program-add.svg";
import EditIcon from "@/assets/svg/edit-program-icon.svg";
import DeleteIcon from "@/assets/svg/delete-program-icon.svg";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import moment from "moment";
import { getValueFromArrayBasedOnParameter } from "@/Utils/CommonBaseClass";

type FormData = {
  programs: {
    programType: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    type: string;
    amount: string;
    addonId: string;
  }[];
  savedPrograms: {
    id?: string;
    programType: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    type: string;
    amount: string;
    addonId: string;
  }[];
};
type ProgramProps = {
  formSubmit: boolean;
  onSubmitHandler: (event: any, type: string) => void;
  onSaveHandler: (event: any) => void;
  data: any;
  addOnOptions?: any;
};
const typeArray = [
  { label: "Paid", value: "PAID" },
  { label: "Free", value: "FREE" },
];

const programTypeArray = [
  { label: "Program", value: "PROGRAM" },
  { label: "Add Ons", value: "ADD_ONS" },
];

const AddProgram: React.FC<ProgramProps> = React.memo(
  ({ formSubmit, onSubmitHandler, data, onSaveHandler, addOnOptions }) => {
    const { handleSubmit, control, watch, setValue } = useForm<FormData>({
      defaultValues: {
        programs: [
          {
            programType: "PROGRAM",
            name: "",
            description: "",
            startTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            endTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            type: "PAID",
            amount: "",
            addonId: "",
          },
        ],
      },
    });
    const { fields, append, remove } = useFieldArray({
      control,
      name: "programs",
    });
    const [programIndex, setProgramIndex] = useState(0);

    /**
     * Useeffect hook submits the form based on the formSubmit variable
     */
    useEffect(() => {
      if (formSubmit) {
        onSubmitHandler && onSubmitHandler(data?.savedPrograms, "PROGRAM");
      }
    }, [formSubmit]);

    /**
     * Method handles the form submission
     * @param data : form data
     */
    const onSubmit: SubmitHandler<FormData> = (data: any) => {
      onSubmitHandler && onSubmitHandler(data?.savedPrograms, "PROGRAM");
    };

    /**
     * Useeffect hook set the field based on the data
     */
    useEffect(() => {
      if (data) {
        setValue("programs", data);
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
      setValue("savedPrograms", watch("programs"));
      onSaveHandler && onSaveHandler(watch("programs"));
    };

    /**
     * Method handles the addition of the new program
     */
    const handleAddNewPrograms = () => {
      setValue("programs", watch("savedPrograms"));
      append({
        programType: "PROGRAM",
        name: "",
        description: "",
        startTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
        endTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
        type: "PAID",
        amount: "",
        addonId: "",
      });
      setProgramIndex(
        watch("savedPrograms")?.length ? watch("savedPrograms").length : 0
      );
    };

    /**
     * Method handles the Update of the program
     * @param index : index of the program to edit
     */
    const handleEdit = (index: number) => {
      setValue("programs", watch("savedPrograms"));
      setProgramIndex(index);
    };

    /**
     * Method handles the deletion of the program
     * @param index : index of the program to delete
     */
    const handleDelete = (index: number) => {
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
            programType: "PROGRAM",
            name: "",
            description: "",
            startTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            endTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            type: "PAID",
            amount: "",
            addonId: "",
          });
          saveProgram.push({
            programType: "PROGRAM",
            name: "",
            description: "",
            startTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            endTime: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
            type: "PAID",
            amount: "",
            addonId: "",
          });
        } else {
          setProgramIndex(index - 1);
        }
      }
      onSaveHandler && onSaveHandler(saveProgram);
    };

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
                        Add Program
                      </Typography>
                    </Grid>
                    <Grid>
                      <CustomButton
                        className="add-program-add-btn"
                        onClick={handleAddNewPrograms}
                        label="Add"
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<AddIcon />}
                      />
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
                                  <CustomRadio
                                    control={control}
                                    name={`programs.${index}.programType`}
                                    label=""
                                    options={programTypeArray}
                                    row={true}
                                    value={"PROGRAM"}
                                  />
                                </Grid>
                                {watch(`programs.${index}.programType`) ===
                                  "PROGRAM" && (
                                  <>
                                    <Grid size={{ xs: 12, sm: 6 }} mb={2}>
                                      <CustomTextField
                                        placeholder="Program Name"
                                        control={control}
                                        name={`programs.${index}.name`}
                                        type="text"
                                        rules={{ required: true }}
                                      />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                      <CustomTextField
                                        placeholder="Program Description"
                                        control={control}
                                        name={`programs.${index}.description`}
                                        type="text"
                                        rules={{ required: true }}
                                      />
                                    </Grid>
                                  </>
                                )}
                                {watch(`programs.${index}.programType`) ===
                                  "ADD_ONS" && (
                                  <Grid
                                    size={{ xs: 12, sm: 12 }}
                                    className="add-program-addons-grid"
                                  >
                                    <CustomSelect
                                      name={`programs.${index}.addonId`}
                                      label="Add Ons Option"
                                      options={addOnOptions}
                                      control={control}
                                      rules={{ required: true }}
                                      fullWidth
                                    />
                                  </Grid>
                                )}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <CustomTextField
                                    placeholder="Start Date & Time"
                                    control={control}
                                    name={`programs.${index}.startTime`}
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
                                            "Start Date cannot be in the past"
                                          );
                                        }
                                        return "Invalid date";
                                      },
                                    }}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                  <CustomTextField
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
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12 }}>
                                  <CustomRadio
                                    control={control}
                                    name={`programs.${index}.type`}
                                    label=""
                                    options={typeArray}
                                    row={true}
                                    value={"PAID"}
                                  />
                                </Grid>
                                {watch(`programs.${index}.type`) === "PAID" && (
                                  <Grid size={{ xs: 12, sm: 12 }}>
                                    <CustomTextField
                                      placeholder="Price"
                                      control={control}
                                      name={`programs.${index}.amount`}
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
            >
              {watch("savedPrograms")?.map(
                (field, index) =>
                  (field.programType === "PROGRAM"
                    ? field.name
                    : field.addonId) && (
                    <Grid
                      key={field.id}
                      container
                      className="add-program-display-item"
                      size={{ xs: 12, sm: 12 }}
                    >
                      <Grid size={{ xs: 8, sm: 8 }}>
                        {field.programType === "PROGRAM"
                          ? field.name
                          : getValueFromArrayBasedOnParameter(
                              addOnOptions,
                              "value",
                              field.addonId,
                              "label"
                            )}
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
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }
);

export default AddProgram;
