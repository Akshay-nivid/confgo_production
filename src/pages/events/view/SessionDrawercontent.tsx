import { Typography, IconButton, Box } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomButton from "@/components/CustomButton/CustomButton";
import Grid from "@mui/material/Grid2";
import { useForm, FieldValues } from "react-hook-form";
import { useEffect } from "react";
import moment from "moment";
import SessionAddonDrawer from "./SessionAddonDrawer";

interface SessionDrawerContentProps {
    isEditing: boolean;
    selectedProgram: any;
    onSubmit: (data: FieldValues) => void;
    closeDrawer: () => void;
    isAddon: boolean; 
    eventEndTime:any;
    eventStartTime:any;
  }
  
  const SessionDrawerContent: React.FC<SessionDrawerContentProps> = ({
    isEditing,
    selectedProgram,
    eventEndTime,
    eventStartTime,
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
    } = useForm({
      defaultValues: {
        isPaid: isEditing && selectedProgram?.amount > 0 ? "PAID" : "FREE", 
        startTime: selectedProgram ? selectedProgram.startTime : (eventStartTime ? eventStartTime:""),
        endTime: selectedProgram ? selectedProgram.endTime : (eventEndTime ? eventEndTime:""),
        name: selectedProgram ? selectedProgram.name : "",
        description: selectedProgram ? selectedProgram.description : "",
        price: selectedProgram ? selectedProgram.amount : "",
      },
    });
    
    const isPaid = watch("isPaid");
  
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
          startTime: moment(eventStartTime).format("YYYY-MM-DDTHH:mm"),
          endTime: moment(eventEndTime).format("YYYY-MM-DDTHH:mm"),
          name: "",
          description: "",
          price: "",
        });
      }
    }, [isEditing, selectedProgram, reset, setValue]);

  /**
   * making the field price 0 if free
   */
    useEffect(() => {
        if (isPaid === "FREE") setValue("price", 0);
      }, [isPaid, setValue]);
  
		if(isAddon){
				return <SessionAddonDrawer closeDrawer={closeDrawer} isEditing={isEditing} selectedAddOn={selectedProgram} onSubmit={onSubmit}/>
		}  
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
              defaultValue={moment(eventStartTime).format("YYYY-MM-DDTHH:mm")} 
              min={moment(eventStartTime).format("YYYY-MM-DDTHH:mm")} 
              max={moment(eventEndTime).format("YYYY-MM-DDTHH:mm")}
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
              defaultValue={moment(eventStartTime).format("YYYY-MM-DDTHH:mm")} 
              min={moment(eventStartTime).format("YYYY-MM-DDTHH:mm")} 
              max={moment(eventEndTime).format("YYYY-MM-DDTHH:mm")}
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
  