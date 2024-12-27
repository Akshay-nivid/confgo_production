import { Box } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Outlet } from 'react-router-dom';

/**
 * This component is a wrapper around the GoogleOAuthProvider component.
 * It provides the client id from the environment variable VITE_GOOGLE_CLIENT_ID
 * to the GoogleOAuthProvider, which is required to use the Google OAuth API.
 * @returns {JSX.Element}
 */
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