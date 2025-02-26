import { Typography } from '@mui/material';
import { DashboardIcon, ToRight } from '@/assets/svg';
import Grid from '@mui/material/Grid2';
import { useNavigate } from "react-router-dom";
import routes from '@/router/routes';

/**Create Event Top Section */
const CreateNewEvent = () => {
    const navigate = useNavigate();
    
  return (
    <Grid container direction="column" spacing={1}>
    <Grid>
      <Typography className="create-top-section">
        Create New Event
      </Typography>
    </Grid>
    <Grid container alignItems="center" spacing={1}>
      <Grid>
        <DashboardIcon className="create-top-section-img" />
      </Grid>
      <Grid className="create-top-section-nav" onClick={()=>navigate(routes.dashboard())}>
        <Typography className="create-top-section-items">Dashboard</Typography>
      </Grid>
      <Grid>
        <ToRight className="create-top-section-next" />
      </Grid>
      <Grid className="create-top-section-nav" onClick={()=>navigate(routes.events())}>
        <Typography className="create-top-section-items">Events</Typography>
      </Grid>
      <Grid>
        <ToRight className="create-top-section-next" />
      </Grid>
      <Grid>
        <Typography className="create-top-section-event">Create New Event</Typography>
      </Grid>
    </Grid>
  </Grid>
  
  );
};

export default CreateNewEvent;
