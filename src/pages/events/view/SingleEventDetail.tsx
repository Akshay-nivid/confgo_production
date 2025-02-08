import React from "react";
import Grid from "@mui/material/Grid2";

interface EventDetailCardProps {
  count?: any;
  title?: string;
  description?: string;
  icon?:any
}
/**
 * Component to display the count of speakers, sponsors, Programs in eventdetails page etc
 */
const SingleEvent: React.FC<EventDetailCardProps> = ({ count, title, description,icon }) => {
  return (
    <Grid size={3} className="single-event-grid">
      <Grid>{icon}</Grid>
      <Grid className="single-event-count">{count}</Grid>
      <Grid className="single-event-title">{title}</Grid>
      <Grid className="single-event-description">{description}</Grid>
    </Grid>
  );
};

export default SingleEvent;