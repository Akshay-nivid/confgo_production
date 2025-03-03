import { DownArrow } from "@/assets/svg";
import { IEventResponse } from "@/Libs/types/event";
import { Avatar, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import parse from 'html-react-parser';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { getLocalTimeDate } from "@/Utils/CommonBaseClass";
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
const T4About = ({ eventData }: { eventData?: IEventResponse }) => {
    console.log(eventData,'full eventData getting here>>>>')

    return (
        <Grid className="w-full t4-event-description-container">
            <Grid className="mt-10 main">
                <Grid className="description-header">
                    <Typography className="text"> Scroll Down</Typography><DownArrow className="" style={{ marginLeft: 2 }} height={"5rem"} />
                    <Grid className={"title"}>
                        <Typography>{eventData?.name}</Typography>
                    </Grid>
                    <Grid className="description">
                        <Typography >{parse(eventData?.description ?? '')}</Typography>
                        <Grid className="location-box">
                            <Grid container display={"flex"} columnGap={2}>
                            <Avatar
                            className="avathar-location">
                            <LocationOnOutlinedIcon/>
                            </Avatar>
                            <Grid>
                                <Typography>
                                    Location
                                </Typography>
                                <Typography>
                                    {eventData?.venue?.name}
                                </Typography>
                            </Grid>
                            </Grid>
                            <Grid container display={"flex"} columnGap={2}>
                            <Avatar
                            className="avathar-date">
                            <TodayOutlinedIcon/>
                            </Avatar>
                            <Grid>
                                <Typography>
                                    Date
                                </Typography>
                                <Typography>
                                {`${getLocalTimeDate(eventData?.startTime, "MMMM D")} - ${getLocalTimeDate(eventData?.endTime, "D, YYYY")}`}
                                </Typography>
                            </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default T4About;