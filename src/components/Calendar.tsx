import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import CustomAppBar from './AppBar';
import Sidebar from './Sidebar';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';



const CalendarEvent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const localizer = momentLocalizer(moment);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const myEventsList = [
    {
      title: 'Meeting',
      start: new Date(2024, 7, 23, 10, 0),  // August 23, 2024, 10:00 AM
      end: new Date(2024, 7, 23, 12, 0),    // August 23, 2024, 12:00 PM
    },
    {
      title: 'Lunch',
      start: new Date(2024, 7, 24, 12, 0),  // August 24, 2024, 12:00 PM
      end: new Date(2024, 7, 24, 13, 0),    // August 24, 2024, 1:00 PM
    },
  ];
  

  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CustomAppBar sidebarOpen={sidebarOpen} onSidebarToggle={handleSidebarToggle} />
      <div style={{ display: 'flex', flexGrow: 1, marginTop: 64 }}>
        <Sidebar open={sidebarOpen} />
        <Container style={{ flexGrow: 1, padding: '20px', marginLeft: sidebarOpen ? 24 : 0 }}>
          <Typography variant="h5" gutterBottom>
            Calendar
          </Typography>
          <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
      />
        
         
        </Container>
      </div>
    </div>
  );
};

export default CalendarEvent;
