
import Grid from '@mui/material/Grid2';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Typography } from "@mui/material";
/**
 * Used to render events list
 * @author Vanisree 
 */
const UserDashboard = () => {
  const navigate = useNavigate();

  const { control } = useForm();

  /**
  * Useeffect hook handles the api call 
  */
  useEffect(() => {

  }, [])



  return (
    <Grid container className="dashboard" spacing={2}>
      <Grid size={12}>
        <Typography className="dashboard-title" gutterBottom>
          <span className="dashboard-title-wave-icon"></span>
          <span className="greeting-text">Hey Andrew!</span>
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography className="dashboard-subtitle" gutterBottom>
          Your hub for all events and registrations
        </Typography>
      </Grid>

      <Grid container size={12} spacing={2}>
        <Grid size={8}>
          dsfdslfhdshfdsfhdsjkfhkjdsfh
        </Grid>
        <Grid size={4}>
          ABBBBBBBB
        </Grid>
      </Grid>
    </Grid>

  )
}

export default UserDashboard;