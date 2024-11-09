/**
 * Component displays the week calendar
 */
import Grid from "@mui/material/Grid2";
import moment from "moment";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface CalendarCardProps{
}

export const CalendarCard: React.FC<CalendarCardProps> = ({ }) =>  {

    const localizer = momentLocalizer(moment);

    const defaultDate = new Date(); // Set the default start date to today
  const views = { week: true };


  const events = [
    {
      title: 'Team Meeting',
      start: new Date(2024, 10, 11, 10, 0),
      end: new Date(2024, 10, 11, 12, 0),
    },
    {
      title: 'Project Update',
      start: new Date(2024, 10, 12, 13, 0),
      end: new Date(2024, 10, 12, 14, 0),
    },
    {
      title: 'Client Call',
      start: new Date(2024, 10, 13, 9, 0),
      end: new Date(2024, 10, 13, 10, 0),
    },
   
  ];


    return(
        <Grid container>
       <div style={{ height: 300, width: 350 }}> {/* Adjust height and width as needed */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={views}
        defaultDate={defaultDate}
        toolbar={false} // Hide toolbar for a clean look
        step={1440} // One slot per day
        timeslots={1}
        showMultiDayTimes={false}
        formats={{
          dayFormat: 'D', // Display only date number in headers
          eventTimeRangeFormat: () => '', // Hide event times
        }}
        style={{ fontSize: '0.8em' }} // Smaller font for compact display
      />
    </div>
        </Grid>
    )    
};