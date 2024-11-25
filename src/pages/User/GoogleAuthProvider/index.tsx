import { Box } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Outlet } from 'react-router-dom';

const GoogleAuthProvider = () => {

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
            <Box className="auth">
            <Box className=" user-layout-content">
                <Box className="user-layout-card">
                    <Outlet />
                </Box>
                </Box>
                </Box>
        </GoogleOAuthProvider >

    )
}

export default GoogleAuthProvider