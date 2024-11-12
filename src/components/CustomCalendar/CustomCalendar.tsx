/**
 * Component renders the calendar
 */
import moment from "moment";
import { Calendar, View, momentLocalizer } from "react-big-calendar";
import Grid from "@mui/material/Grid2";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from "react";

interface calendarProps {
    id?: string;
    events: any;
    onSelectEvent?: any;
    onNavigate?: any;
    defaultDate?: any;
}

export const CustomCalendar: React.FC<calendarProps> = ({ id, events, onSelectEvent, onNavigate, defaultDate }) => {

    const localizer = momentLocalizer(moment);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date()); 
  
    /**
     * Method calculates the start date and end date based on the selected date and view
     * @param date : selected date
     * @param view : month | week | day | agenda
     */
    const calculateDateRange = (date: Date, view: View) => {
      let startDate: Date;
      let endDate: Date;
  
      switch (view) {
        case 'month':
          startDate = moment(date).startOf('month').toDate();
          endDate = moment(date).endOf('month').toDate();
          break;
        case 'week':
          startDate = moment(date).startOf('week').toDate();
          endDate = moment(date).endOf('week').toDate();
          break;
        case 'day':
          startDate = moment(date).startOf('day').toDate();
          endDate = moment(date).endOf('day').toDate();
          break;
        case 'agenda':
          startDate = moment(date).startOf('week').toDate();
          endDate = moment(date).add(1, 'month').endOf('week').toDate();
          break;
        default:
          startDate = date;
          endDate = date;
      }
  
      const dateObj = {
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate:  moment(endDate).format('YYYY-MM-DD')
      }
      onNavigate && onNavigate(dateObj)
    };
  
    /**
     * Method handles the navigation events
     * @param date : selected events
     * @param view : selected view
     */
    const handleNavigate = (date: Date, view: View) => {
      setSelectedDate(date); // Update the selected date
      calculateDateRange(date, view);
    };
  
    /**
     * Method handles the view change events
     * @param view : month | week | day | agenda
     */
    const handleViewChange = (view: View) => {
      calculateDateRange(selectedDate, view); // Use selected date for the new view
    };
  
  
    return (
        <Grid id={id}><Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onNavigate={handleNavigate}
        onView={handleViewChange}
        onSelectEvent={(e) => onSelectEvent && onSelectEvent(e)}
        defaultDate={defaultDate}
        views={['month', 'week', 'day', 'agenda']}
      /></Grid>
    )

}