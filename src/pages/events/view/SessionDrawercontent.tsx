import { Typography, IconButton, Box } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomButton from "@/components/CustomButton/CustomButton";
import Grid from "@mui/material/Grid2";
import { useForm, FieldValues } from "react-hook-form";
import { useEffect } from "react";

interface SessionDrawerContentProps {
  isEditing: boolean;
  selectedProgram: Program | null;
  setShowPriceField: (show: boolean) => void;
  setEditorContent: (content: string) => void;
  onSubmit: (data: FieldValues) => void;
  closeDrawer: () => void;
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
 * Component used to edit and add the session program
 */
const SessionDrawerContent: React.FC<SessionDrawerContentProps> = ({
  isEditing,
  selectedProgram,
  setShowPriceField,
  onSubmit,
  closeDrawer,
}) => {
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isPaid: isEditing && selectedProgram?.amount > 0 ? "PAID" : "FREE", 
      startTime: selectedProgram ? selectedProgram.startTime : "",
      endTime: selectedProgram ? selectedProgram.endTime : "",
      name: selectedProgram ? selectedProgram.name : "",
      description: selectedProgram ? selectedProgram.description : "",
      price: selectedProgram ? selectedProgram.amount : "",
    },
  });

  const isPaid = watch("isPaid");
//Make date and time  formated 
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (isEditing && selectedProgram) {
      setValue("name", selectedProgram.name);
      setValue("description",selectedProgram.description);
      setValue("startTime", formatDateTime(selectedProgram.startTime));
      setValue("endTime", formatDateTime(selectedProgram.endTime));
      setValue("isPaid", selectedProgram.amount > 0 ? "PAID" : "FREE");
      setValue("price", selectedProgram.amount);
    } else {
      reset({
        isPaid: "FREE",
        startTime: "",
        endTime: "",
        name: "",
        description: "",
        price: "",
      });
    }
  }, [isEditing, selectedProgram, reset, setValue]);

  //used to make the price field 0 if the radio button is paid
  useEffect(() => {
    setShowPriceField(isPaid === "PAID");
    if (isPaid === "FREE") setValue("price", 0);
  }, [isPaid, setShowPriceField, setValue]);

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Grid container spacing={2} padding={2}>
        <Grid container justifyContent="space-between" alignItems="center" size={{ xs: 12 }}>
          <Typography className="event-detail-speakers-card-contributor-header">
            {isEditing ? "Edit Program" : "Add Program"}
          </Typography>
          <IconButton onClick={closeDrawer}>
            <CloseOutlined />
          </IconButton>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <CustomTextField
            name="name"
            placeholder="Name"
            control={control}
            requiredField={true} 
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <CustomTextField
            name="description"
            placeholder="Description"
            control={control}
            requiredField={true}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <CustomTextField
            name="startTime"
            label="Start Time"
            placeholder="Start Time"
            control={control}
            type="datetime-local"
            requiredField={true}
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
              placeholder="Price"
              control={control}
              type="number"
            />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Grid container justifyContent="right">
            <CustomButton label="Submit" onClick={handleSubmit(onSubmit)} className="event-sessions-edit-button" />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionDrawerContent;
