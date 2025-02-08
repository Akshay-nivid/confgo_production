import { Clocks } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import useStore from "@/Libs/store";
import routes from "@/router/routes";
import { formatedTimeRangeProgram, truncateString } from "@/Utils/CommonBaseClass";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import moment from "moment";
import { useNavigate } from "react-router-dom";



/**
 * PendingProgram Component
 * Displays details of a pending program, including event title, status, 
 * event timing, and a button to navigate to the calendar view.
 *
 * @returns {JSX.Element} The PendingProgram component
 */
const PendingProgram = () => {

    const navigate = useNavigate();

    /**
     * programs of UpcomingEvent
     */
    const programsData = useStore((state: any) => state?.compData?.upcomingEventList?.['event/eventList']?.data?.[0]) ?? [];


    const tomorrow = moment().add(1, "days").startOf("day"); // Tomorrow at 00:00:00

    /**
     * Filter upcoming program
     */
    const latestProgram = programsData?.events?.filter((event: any) => moment(event.startTime).isSameOrAfter(tomorrow))
        .sort((a: any, b: any) => moment(b.startTime).diff(moment(a.startTime)))
    [0];



    /**
    * Row click navigation
    */
    const handleRowClick = (id: number | string,) => {
        
        
        navigate(`/events/detail/${id}`, { state: { tabId: "3" } });
    };

    return (
        <Grid container size={12} className="pending-programs" spacing={2}>
            <Grid size={12} container spacing={1} className="pending-programs-header" >


                <Grid size={12} >
                    <Typography className="heading">
                        {latestProgram?.name}
                    </Typography>

                </Grid>

                <Grid size={12} className="description">
                    <Typography>
                        {truncateString(latestProgram?.description, 50)}

                    </Typography>

                </Grid>


            </Grid>


            <Grid className="pending-programs-time" size={10} container alignItems={"center"} spacing={0} >

                <Grid size={1} >

                    <Clocks />

                </Grid>

                <Grid size={11} >

                    <Typography className="time">

                        {formatedTimeRangeProgram(
                            latestProgram?.startTime,
                            latestProgram?.endTime,
                        )}

                    </Typography>

                </Grid>

            </Grid>

            <Grid container size={12} className="pending-programs-btn" justifyContent={"center"} alignItems={"center"}>

                <Grid container size={12} minHeight={"3rem"} onClick={() => handleRowClick(programsData?.id)} >
                    <CustomButton
                        className="btn"
                        fullWidth
                        label="View  all Programs" />
                </Grid>

            </Grid>
        </Grid>
    )
}
export default PendingProgram;