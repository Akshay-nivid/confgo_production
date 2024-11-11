/**
 * Component renders the calendar
 */
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Grid from "@mui/material/Grid2";
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface calendarProps {
    id?: string;
    events: any;
    onSelectEvent?: any;
}

export const CustomCalendar: React.FC<calendarProps> = ({ id, events, onSelectEvent }) => {

    const localizer = momentLocalizer(moment);

    return (
        <Grid id={id}><Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={(e) => onSelectEvent && onSelectEvent(e)}
        /></Grid>
    )

}