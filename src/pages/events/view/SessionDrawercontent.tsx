import { Typography, IconButton, Box } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomButton from "@/components/CustomButton/CustomButton";
import Grid from "@mui/material/Grid2";
import { useForm, FieldValues } from "react-hook-form";
import { useEffect } from "react";
import moment from "moment";

interface SessionDrawerContentProps {
    isEditing: boolean;
    selectedProgram: Program | null;
    setShowPriceField: (show: boolean) => void;
    setEditorContent: (content: string) => void;
    onSubmit: (data: FieldValues) => void;
    closeDrawer: () => void;
    isAddon: boolean; 
  }
  
  const SessionDrawerContent: React.FC<SessionDrawerContentProps> = ({
    isEditing,
    selectedProgram,
    setShowPriceField,
    onSubmit,
    closeDrawer,
    isAddon, // Destructuring the isAddon prop
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
  
    // Prevent the drawer from opening if isAddon is true
    useEffect(() => {
      if (isAddon) {
        closeDrawer();  // Ensure drawer is closed if isAddon is true
      }
    }, [isAddon, closeDrawer]);
  /**
   * Used to set value into the field if its edit and reset if it's add
   */
    useEffect(() => {
      if (isEditing && selectedProgram) {
        setValue("name", selectedProgram.name);
        setValue("description", selectedProgram.description);
        setValue("startTime", moment(selectedProgram.startTime).format("YYYY-MM-DDTHH:mm"));
        setValue("endTime", moment(selectedProgram.endTime).format("YYYY-MM-DDTHH:mm"));
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
  
    useEffect(() => {
        if (isPaid === "FREE") setValue("price", 0);
      }, [isPaid, setShowPriceField, setValue]);
  
    return (
      <Box sx={{ maxWidth: 600 }}>
        <Grid container spacing={2} padding={2}>
          <Grid container justifyContent="space-between" alignItems="center" size={{xs:12}}>
            <Typography className="event-detail-speakers-card-contributor-header">
              {isEditing ? "Edit Program" : "Add Program"}
            </Typography>
            <IconButton onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Grid>
  
          <Grid size={{xs:12}}>
            <CustomTextField
              name="name"
              placeholder="Name"
              control={control}
              rules={{required:"Name is compolsory"}}
 
            />
          </Grid>
  
          <Grid size={{xs:12}}>
            <CustomTextField
              name="description"
              placeholder="Description"
              control={control}
              rules={{required:"Description is required"}}
            />
          </Grid>
  
          <Grid size={{xs:12}}>
            <CustomTextField
              name="startTime"
              label="Start Time"
              placeholder="Start Time"
              control={control}
              type="datetime-local"
              requiredField={true}
            />
          </Grid>
  
          <Grid size={{xs:12}}>
            <CustomTextField
              name="endTime"
              label="End Time"
              placeholder="End Time"
              control={control}
              type="datetime-local"
            />
          </Grid>
  
          <Grid size={{xs:12}}>
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
            <Grid size={{xs:12}}>
              <CustomTextField
                name="price"
                placeholder="Price"
                control={control}
                type="number"
                requiredField={true}
              />
            </Grid>
          )}
  
          <Grid size={{xs:12}}>
            <Grid container justifyContent="right">
              <CustomButton
                label="Submit"
                onClick={handleSubmit(onSubmit)}
                className="event-sessions-edit-button"
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  export default SessionDrawerContent;
  