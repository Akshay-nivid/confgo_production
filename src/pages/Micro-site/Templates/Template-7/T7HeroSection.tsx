import { IEventResponse } from "@/Libs/types/event";
import TAuthButton from "@/pages/events/template/_components/TAuthButton/TAuthButton";
import TRegisterButton from "@/pages/events/template/_components/TRegisterButton/TRegisterButton";
import { convertUTCToUserTimeZone } from "@/Utils/CommonBaseClass";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
/**
 * Componet for Template 7 HeroSection
 * @param eventData
 */
const T7HeroSection = ({ eventData }: { eventData?: IEventResponse }) => {
    return (
        <Grid className="hero-container">
            <Grid className="content ">
                <Grid className="border-left">
                    <Grid className="dark-box"></Grid>
                </Grid>
                <Grid className="elements">
                    <Grid>
                        <Typography className="date-text">
                            Date
                        </Typography>
                        <Typography className="date-value">
                            {
                                convertUTCToUserTimeZone(eventData?.startTime || "NA", "MMMM DD") + "-" + convertUTCToUserTimeZone(eventData?.endTime || "NA", "DD") + ", " + convertUTCToUserTimeZone(eventData?.startTime || "NA", "YYYY")
                            }
                        </Typography>
                    </Grid>
                    <Grid className="event-title-box">
                        <p className="title">{eventData?.name || 'No name'}</p>
                    </Grid>
                    <Grid className="auth-buttons-container">
                    <TAuthButton authType='LOGIN' className="auth-btn">Login</TAuthButton>
                        <TAuthButton authType='LOGOUT' className="auth-btn">Logout</TAuthButton>
                        <TRegisterButton className='reg-btn' />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )

}

export default T7HeroSection;