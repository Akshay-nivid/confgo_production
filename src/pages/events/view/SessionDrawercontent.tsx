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
    eventData:any
  }
  
  const SessionDrawerContent: React.FC<SessionDrawerContentProps> = ({
    isEditing,
    selectedProgram,
    eventEndTime,
    eventStartTime,
    onSubmit,
    closeDrawer,
    isAddon, // Destructuring the isAddon prop
    eventData
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
        totalSeat: selectedProgram ? selectedProgram?.eventParticipantEntries?.[0]?.totalSeat : null,
        price: selectedProgram ? selectedProgram.amount : "",
        startDate:selectedProgram ? selectedProgram.startTime : (eventStartTime ? eventStartTime:""),
        endDate:selectedProgram ? selectedProgram.endTime : (eventEndTime ? eventEndTime:""),
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
        setValue("totalSeat", selectedProgram?.totalSeat);
        setValue("startTime", moment(selectedProgram?.startTime).format("HH:mm"));
        setValue("endTime", moment(selectedProgram?.endTime).format("HH:mm"));
        setValue("isPaid", selectedProgram.amount > 0 ? "PAID" : "FREE");
        setValue("price", selectedProgram.amount);
        setValue('startDate', moment(selectedProgram?.startTime).format("YYYY-MM-DD"))
        setValue('endDate', moment(selectedProgram?.endTime).format("YYYY-MM-DD"))
      } else {
        reset({
          isPaid: "FREE",
          startTime: moment(eventStartTime).format("HH:mm"),
          endTime: moment(eventStartTime).format("HH:mm"),
          startDate:moment(eventStartTime).format("YYYY-MM-DD"),
          endDate:moment(eventStartTime).format("YYYY-MM-DD"),
          name: "",
          description: "",
          totalSeat: "",
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
				return <SessionAddonDrawer closeDrawer={closeDrawer} isEditing={isEditing} selectedAddOn={selectedProgram} onSubmit={onSubmit} eventData={eventData} />
		}  
  /**
   * formating the submit request
   */
    const handleSubmitRequest = (data: FieldValues) => {
      const startDateTime = `${data.startDate}T${data.startTime}`;
      const endDateTime = `${data.endDate}T${data.endTime}`;

      // Create the new transformed object
      const transformedProgram = {
        isPaid: data.isPaid,
        name: data.name,
        description: data.description,
        price: data.price,
        ...(data.totalSeat ? { totalSeat: data.totalSeat } : {}),
        startTime: startDateTime,
        endTime: endDateTime
      };
      onSubmit(transformedProgram);


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
              name="totalSeat"
              placeholder="Total Seats"
              control={control}
              type="number"
            />
          </Grid>
          <Grid size={12}>
          <CustomTextField
              name="startDate"
              label="Start Date"
              placeholder="Program Date"
              control={control}
              defaultValue={moment(eventStartTime).format("YYYY-MM-DD")} 
              min={moment(eventStartTime).format("YYYY-MM-DD")} 
              max={moment(eventEndTime).format("YYYY-MM-DD")}
              type="date"
              requiredField={true}
            />
          </Grid>
          <Grid size={12}>
          <CustomTextField
              name="endDate"
              label="End Date"
              placeholder="Program Date"
              control={control}
              defaultValue={moment(eventStartTime).format("YYYY-MM-DD")} 
              min={moment(eventStartTime).format("YYYY-MM-DD")} 
              max={moment(eventEndTime).format("YYYY-MM-DD")}
              type="date"
              requiredField={true}
            />
          </Grid>
  
  
          <Grid container size={{xs:12}} justifyContent={"space-between"}>
<Grid size={6}>
          <CustomTextField
                name="startTime"
                label="Start Time"
                placeholder="Start Time"
                control={control}
                type="time"
              />
              </Grid>
              <Grid size={6}>
             <CustomTextField
                name="endTime"
                label="End Time"
                placeholder="End Time"
                control={control}
                type="time"
              />
              </Grid>
          </Grid>
  
          <Grid size={{xs:12}}>
         
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
                onClick={handleSubmit(handleSubmitRequest)}
                className="event-sessions-edit-button"
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  export default SessionDrawerContent;
  