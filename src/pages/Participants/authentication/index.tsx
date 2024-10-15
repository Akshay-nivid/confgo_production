import Grid from '@mui/material/Grid2';
import { Outlet } from 'react-router-dom';

const UserAuthentication = () => {
  return (
    <Grid container className="user-authentication-main layout-wrapper">
      <Grid size={{ xs: 0, md: 6 }} className="grid-left">
        
      </Grid>
      <Grid
        container
        size={{ xs: 12, md: 6 }}
        className="grid-right"
        display={'flex'}
      >
        <Outlet />
      </Grid>
    </Grid>
  );
};

export default UserAuthentication;

