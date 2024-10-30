import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const SpeakerCard = (eventData: any) => {
  return (
    <Grid className="event-detail-speakers-card" container spacing={2}>
      <Grid container size={{ xs: 12, sm: 10 }}>
        <Grid className="event-detail-speakers-card-speaker-list" direction={'row'} display={'flex'}>
          <Grid direction={"column"}>
          <Typography className="event-detail-speakers-card-speaker-header" >Event Contributors </Typography>
          <Typography variant="h6">Event Contributors allows you to easily add and manage key participants in your event, such as speakers, sponsors, guests, and other contributors. Keep track of all the important roles to ensure a smooth and successful event experience.</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
export default SpeakerCard;