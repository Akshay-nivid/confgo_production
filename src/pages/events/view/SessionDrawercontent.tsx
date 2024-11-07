import { Typography, IconButton, Box } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import CustomButton from "@/components/CustomButton/CustomButton";
import ReactQuill from "react-quill";
import Grid from "@mui/material/Grid2";
import { useForm, FieldValues } from "react-hook-form";
import { useEffect, useState } from "react";

interface SessionDrawerContentProps {
  isEditing: boolean;
  isAddon: boolean;
  selectedProgram: Program | null;
  setShowPriceField: (show: boolean) => void;
  setEditorContent: (content: string) => void;
  onSubmit: (data: FieldValues) => void;
  closeDrawer: () => void;
  addOnOptions: { label: string; value: string }[];
}

interface Program {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  isPaid: "PAID" | "FREE";
  amount: number;
}
/**
 * Component used to display the custom layover of session edit and add
 */
const SessionDrawerContent: React.FC<SessionDrawerContentProps> = ({
  isEditing,
  isAddon,
  selectedProgram,
  setShowPriceField,
  onSubmit,
  closeDrawer,
  addOnOptions,
}) => {
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      itemType: isAddon ? "addon" : "program", // Default to "program"
      isPaid:isEditing
      ? selectedProgram && selectedProgram.amount > 0
        ? "PAID"
        : "FREE"
      : "FREE",
      startTime: selectedProgram ? (selectedProgram?.startTime) : "",  // Set default value
    endTime: selectedProgram ? (selectedProgram?.endTime) : "",
    name:selectedProgram ? (selectedProgram?.name) : "",
    price: selectedProgram ? (selectedProgram?.amount) : ""

      
    },

  });

  // Watch for changes in "isPaid" to update the visibility of the price field
  const isPaid = watch("isPaid");
  const itemType = watch("itemType", isAddon ? "addon" : "program");
  const [editorContent, setEditorContent] = useState("");

  /**
   * used to format the date strin in dd-mm-yyyy hh:mm format
   * @param dateString 
   * @returns 
   */
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.log("Invalid date:", dateString);
      return ""; // Invalid date handling
    }
  
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
/**
 * Used to fetch the value for coresponding fields
 */
  useEffect(() => {
    if (selectedProgram) {
      setValue("name", selectedProgram?.name);
      setEditorContent(selectedProgram?.description);
      setValue("startTime", formatDateTime(selectedProgram?.startTime));
      setValue("endTime", formatDateTime(selectedProgram?.endTime));
      const isPaidValue = selectedProgram.amount > 0 ? "PAID" : "FREE";
      setValue("isPaid", isPaidValue);
      setValue("price", selectedProgram?.amount);
    }
  }, [selectedProgram, setValue, setEditorContent]);

  useEffect(() => {
    setShowPriceField(isPaid === "PAID");
    if (isPaid === "FREE") setValue("price", 0);
  }, [isPaid, setShowPriceField, setValue]);

  /**
   * Method handles the on change event for description editor
   * @param value : event value
   */
  const handleChange = (value: any) => {
    setEditorContent(value);
    setValue("description", value);
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Grid container spacing={2} padding={2}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          size={{ xs: 12 }}
        >
          <Typography className="event-detail-speakers-card-contributor-header">
            {isEditing
              ? isAddon
                ? "Edit Addon"
                : "Edit Program"
              : isAddon
              ? "Add Addon"
              : "Add Program"}
          </Typography>
          <IconButton onClick={closeDrawer}>
            <CloseOutlined />
          </IconButton>
        </Grid>

        {/* Show radio options only if not in edit mode */}
        {!isEditing && !isAddon && (
          <Grid size={{ xs: 12 }}>
            <CustomRadio
              name="itemType"
              options={[
                { label: "Program", value: "program" },
                { label: "Addon", value: "addon" },
              ]}
              control={control}
              row
            />
          </Grid>
        )}

        {/* Conditionally render fields based on item type */}
        {isAddon || itemType === "addon" ? (
          <>
            {/* Display Addon-related fields in edit mode */}
            {isEditing && (
              <>
                <Grid size={{ xs: 12 }}>
                  <CustomSelect
                    name="addOnOptions"
                    label="Add-on Options"
                    options={addOnOptions}
                    control={control}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    placeholder="Start Date & Time"
                    name="startTime"
                    control={control}
                    type="datetime-local"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    placeholder="End Date & Time"
                     control={control}
                    name="endTime"
                     type="datetime-local"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    name="price"
                    placeholder="Price"
                    control={control}
                    type="number"
                  />
                </Grid>
              </>
            )}

            {/* Render add-on options for non-edit mode */}
            {!isEditing && (
              <>
                <Grid size={{ xs: 12 }}>
                  <CustomSelect
                    name="addOnOptions"
                    label="Add-on Options"
                    options={addOnOptions}
                    control={control}

                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    name="startTime"
                    placeholder="Start Time"
                    label="Start Time"
                    control={control}
                    type="datetime-local"
                    requiredField={true}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomTextField
                    name="endTime"
                    placeholder="End Time"
                    label="End Time"
                    control={control}
                    type="datetime-local"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CustomRadio
                    name="isPaid"
                    options={[
                      { label: "Paid", value: "PAID" },
                      { label: "Free", value: "FREE" },
                    ]}
                    control={control}
                    row
                  />
                </Grid>
                {isPaid === "PAID" && (
                  <Grid size={{ xs: 12 }}>
                    <CustomTextField
                      name="price"
                      label="Price"
                      placeholder="price"
                      control={control}
                      type="number"
                    />
                  </Grid>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {/* Render Program-related fields */}
            <Grid size={{ xs: 12 }}>
              <CustomTextField name="name" placeholder="Name" control={control} requiredField={true} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ReactQuill
                className={
                  errors?.description || watch("description") === "<p><br></p>"
                    ? "create-event-description-error"
                    : ""
                }
                value={editorContent}
                onChange={handleChange}
                theme="snow"
                placeholder="Type your description here..."
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                name="startTime"
                label="Start Time"
                placeholder="StartTime"
                control={control}
                type="datetime-local"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                name="endTime"
                label="End Time"
                placeholder="End Time"
                control={control}
                type="datetime-local"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <CustomRadio
                name="isPaid"
                options={[
                  { label: "Paid", value: "PAID" },
                  { label: "Free", value: "FREE" },
                ]}
                control={control}
                row
              />
            </Grid>
            {isPaid === "PAID" && (
              <Grid size={{ xs: 12 }}>
                <CustomTextField
                  name="price"
                  placeholder="price"
                  control={control}
                  type="number"
                />
              </Grid>
            )}
          </>
        )}

        <Grid size={{ xs: 12 }} >
            <Grid container justifyContent="right" >
          <CustomButton label="Submit" onClick={handleSubmit(onSubmit)} className="event-sessions-edit-button" />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionDrawerContent;
