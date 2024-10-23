import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NavBar from '@/pages/participant/NavBar';


/**
 * 
 * @returns 
 */
const UserLayout = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Box  className="user-layout">
        <NavBar/>
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
