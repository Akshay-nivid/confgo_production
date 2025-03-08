import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/core/index.js';
import '@fullcalendar/daygrid/index.js';
import '@fullcalendar/timegrid/index.js';


interface CalendarProps {
  id?: string;
  events: Array<{
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
  }>;
  onSelectEvent?: (event: any) => void;
  onNavigate?: (dateInfo: any) => void;
  defaultDate?: Date;
}
/**
 * 
 * @param param0 Custom Calendar
 * @returns 
 */
export const CustomCalendar: React.FC<CalendarProps> = ({
  id,
  events,
  onSelectEvent,
  onNavigate,
  defaultDate,
}) => {

  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate || new Date());
  const [currentView, setCurrentView] = useState<string>("dayGridMonth");

  // Method to handle navigation between dates
  const handleDateChange = (dateInfo: any) => {
    setSelectedDate(new Date(dateInfo.start));
    onNavigate && onNavigate(dateInfo);
  };

  // Method to handle event click
  const handleEventClick = (info: any) => {
    onSelectEvent && onSelectEvent(info.event);
  };
  const colorPalette = [
    { bg: "#29CC390D", text: "#29CC39", border: "#29CC39" },
    { bg: "#33BFFF0D", text: "#33BFFF", border: "#33BFFF" },
    { bg: "#FF66330D", text: "#E62E7B", border: "#E62E7B" },
    { bg: "#FFFACD", text: "#FFCB33", border: "#FFCB33" },
    { bg: "#8833FF0D", text: "#8833FF", border: "#8833FF" },
    { bg: "#2EE6CA0D", text: "#E62E7B", border: "#E62E7B" },
  ];

  return (
    <div className="calendar-container" id={id}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        events={events}
        nowIndicator={true}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        eventClick={handleEventClick}
        dateClick={handleDateChange}
        viewDidMount={(viewInfo: any) => setCurrentView(viewInfo.view.type)}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridYear,dayGridMonth,dayGridWeek,timeGridDay',
        }}
        views={{
          dayGridYear: {
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
        eventDidMount={(eventInfo) => {
          const el = eventInfo.el;
          const eventId = parseInt(eventInfo.event.id) || 0;
          const colorIndex = eventId % colorPalette.length;
          const { bg, text, border } = colorPalette[colorIndex];

          el.style.backgroundColor = bg;
          el.style.color = text;
          el.style.borderLeft = `0.25rem solid ${border}`;
          el.style.borderRadius = '0.333rem';
          el.style.padding = '0.167rem 0.333rem';
          
          const textElements = el.querySelectorAll('.fc-event-title, .fc-event-time');
          textElements.forEach(element => {
            (element as HTMLElement).style.color = text;
          });

          el.querySelectorAll('*').forEach(child => {
            (child as HTMLElement).style.color = text;
          });
        }}
        initialDate={selectedDate}
        eventOverlap={true}
      />
    </div>
  );
};

export default CustomCalendar;
