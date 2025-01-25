import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import CustomTooltip from "../CustomToolTip/CustomTooltip";
import LocalTimeDate from "../LocalTimeDate/LocalTimeDate";
// import { truncateString } from "@/Utils/CommonBaseClass";
import multiMonthPlugin from '@fullcalendar/multimonth'


interface CalendarProps {
  id?: string;
  events: Array<{
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    programs: any
  }>;
  programs: Array<{
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    programs: any
  }>;
  // Array of event objects
  onSelectEvent?: (event: any) => void;
  onNavigate?: (dateInfo: any) => void;
  defaultDate?: Date;

}
/**
* CustomCalendar Component
*
* This component provides a customizable calendar interface using FullCalendar,
* integrated with Material-UI for additional layout and styling.
* 
* **Features:**
* - Displays events and programs dynamically.
* - Handles event clicks, date navigation, and custom rendering of events.
* - Offers a responsive interface with support for different calendar views:
*   - Monthly view (`dayGridMonth`)
*   - Weekly view (`timeGridWeek`)
*   - Daily view (`timeGridDay`)
*   - Yearly view (`dayGridYear`)
* - Integrates a color palette for dynamic event styling.
*
*/

export const CustomCalendar: React.FC<CalendarProps> = ({
  id,
  events = [],
  programs = [],
  onSelectEvent,
  onNavigate,
  defaultDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate || new Date());
  const [currentView, setCurrentView] = useState<string>("dayGridMonth");
  /**
   * Define colors for events
   */
  const colorPalette = [
    { bg: "#29CC390D", text: "#4D5E80", border: "#29CC39" },
    { bg: "#33BFFF0D", text: "#4D5E80", border: "#33BFFF" },
    { bg: "#FF66330D", text: "#4D5E80", border: "#FF6633" },
    { bg: "#FFFACD", text: "#4D5E80", border: "#FFCB33" },
    { bg: "#8833FF0D", text: "#4D5E80", border: "#8833FF" },
    { bg: "#2EE6CA0D", text: "#4D5E80", border: "#E62E7B" },
  ];

  /**
   * Method handles navigation between dates
   */
  const handleDateChange = (dateInfo: any) => {
    setSelectedDate(new Date(dateInfo.start));
    onNavigate && onNavigate(dateInfo);
    //  setCurrentView(dateInfo?.view?.type);
  };

  /**
   * Method handles event click
   */
  const handleEventClick = (info: any) => {
    onSelectEvent && onSelectEvent(info.event);
  };

  /**
   * Custom function to render event details with dynamic styles
   */
  const renderEventContent = (eventInfo: any) => {
    const eventId = eventInfo.event.id;
    const colorIndex = eventId % colorPalette.length; 
    const { bg, text, border } = colorPalette[colorIndex];
    // const truncatedTitle = truncateString(eventInfo.event.title, 15, "");

    const getEventStyles = (bg: string, text: string, border: string) => ({
      textAlign: "start",
      // paddingLeft: ".5rem",
      paddingInline: ".5rem",
      width:"max-content",
      fontWeight: "700",
      backgroundColor: bg,
      color: text,
      border: `0.2rem solid ${border}`,
      borderRadius: "0.4rem",
      minHeight: "3rem",
      // display: "grid",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "1rem",
      marginInline: "0.5rem",
      // gridTemplateColumns: "repeat(7, 1fr)",
    });
  
    return (
      <Grid
       size={12}
        container
        style={{
          ...getEventStyles(bg, text, border), 
          textAlign: "start",
        }}
      >
        <Grid justifyContent={"center"} alignContent={"center"}>
         
          <CustomTooltip className="calendar-head" title={eventInfo.event.title}> 
            {/* <Grid width={"100%"} bgcolor={"black"} > */}
            {(currentView === "timeGridWeek" || currentView === "timeGridDay") &&
              <Typography style={{
                backgroundColor: border,
                borderRadius: "0.7rem",
                width:"",
                height:"2rem",
                marginTop:"0.3rem",
                textAlign:"center"
              }}>
                <LocalTimeDate
                  className="calendar-time"
                  utcDateTime={eventInfo.event.start}
                  format="h:mm A" // For 12-hour format with AM/PM
                />
              </Typography>
            }
            <Grid >
            <Typography className="calendar-titles flex whitespace-normal text-wrap">
                {/* {truncatedTitle} */}
              {  eventInfo.event.title}
              </Typography>
            </Grid>
          </CustomTooltip>
        </Grid> </Grid>
    );
  };
 
 return (
    <Grid id={id} className="calendar-wrapper">
     <FullCalendar
      
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin,multiMonthPlugin]}
        initialView="dayGridMonth" 
        events={currentView === "dayGridMonth" || currentView === "dayGridYear" ? events : programs}
        viewDidMount={(viewInfo: any) => setCurrentView(viewInfo.view.type)}
        dateClick={(info: any) => setSelectedDate(new Date(info.date))}
        eventClick={handleEventClick}
       datesSet={handleDateChange}
       multiMonthMaxColumns={2} 
       dayMaxEvents={1}
       dayMaxEventRows={1}
       
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "multiMonthFourMonth,dayGridMonth,timeGridWeek,timeGridDay",
       }}
       views={{
          multiMonthFourMonth: {
            
            type: 'multiMonth',
            duration: { months: 12 },
           buttonText: 'year',  
            dayMaxEventRows: 1,
         },
         timeGridWeek: {
          dayMaxEventRows: 1,
           eventMaxStack: 1,
          allDayText: 'week'
         },
         timeGridDay: {
          dayMaxEventRows: 12,
           eventMaxStack: 1,
          allDayText: 'Day'
         },
       }}
       dayHeaderFormat={{ weekday: currentView === 'dayGridMonth'?'long':'short' }}
       
      
        initialDate={selectedDate}
        eventContent={renderEventContent}
      />
    </Grid>
  );
};





