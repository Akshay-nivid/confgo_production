import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
// import {useLocation} from 'react-router-dom';

const UserLayout = () => {
  // const location = useLocation().pathname;
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Box  className="user-layout">
        <Box className="user-layout-header"></Box>

        <Box className="user-layout-content">
          <Box className="user-layout-card">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </GoogleOAuthProvider>
  );
};

export default UserLayout;
