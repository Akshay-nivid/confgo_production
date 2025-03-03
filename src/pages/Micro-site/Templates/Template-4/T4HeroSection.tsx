
import { IEventResponse } from "@/Libs/types/event";
import TAuthButton from "@/pages/events/template/_components/TAuthButton/TAuthButton";
import TRegisterButton from "@/pages/events/template/_components/TRegisterButton/TRegisterButton";
import { Box, Typography } from "@mui/material";
const T4HeroSection = ({ eventData }: { eventData?: IEventResponse }) => {
    return (
        <Box className='t4-hero-container'>
            <Box className="event-header-container main">
                <Typography className="header">{eventData?.name}</Typography>
                <Box className="auth-buttons-container">
                    <TAuthButton authType='LOGIN' className="auth-btn">Login</TAuthButton>
                        <TAuthButton authType='LOGOUT' className="auth-btn">Logout</TAuthButton>
                        <TRegisterButton className='reg-btn' />
                    </Box>
            </Box>
        </Box>
    )

}

export default T4HeroSection;