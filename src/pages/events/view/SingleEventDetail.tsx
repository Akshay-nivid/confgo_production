import React from "react";
import Grid from "@mui/material/Grid2";
import { setDataById } from "@/Libs/store";

interface EventDetailCardProps {
  count?: any;
  title?: string;
  description?: string;
  icon?:any
  navigation?:any
}
/**
 * Component to display the count of speakers, sponsors, Programs in eventdetails page etc
 */
const EventDetailCountCard: React.FC<EventDetailCardProps> = ({ count, title, description,icon ,navigation}) => {
  /**
   * while clicking each card navigate to its tabs
   */
  const handlenavigation=()=>{
     setDataById("tabValue", { value: navigation });
  }
  
  return (
    <Grid size={{lg:3,sm:12}} className="single-event-grid"  onClick={()=>handlenavigation()}>
      <Grid>{icon}</Grid>
      <Grid className="single-event-count">{count}</Grid>
      <Grid className="single-event-title">{title}</Grid>
      <Grid className="single-event-description">{description}</Grid>
    </Grid>
  );
};

export default EventDetailCountCard;