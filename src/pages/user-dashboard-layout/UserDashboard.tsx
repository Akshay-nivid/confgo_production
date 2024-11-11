
import Grid from '@mui/material/Grid2';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import DashboardCardItem from './DashboardCardItem';
import { CalendarEventIcon, DownloadEventIcon, PaymentDashboardIcon } from '@/assets/svg';
import React from 'react';
import EventCard from '../User/Components/EventCard';
import routes from '@/router/routes';
import useStore from '@/Libs/store';
import { Logger } from '@/Utils/Logger';

/**
 * Used to render user dashboard 
 * @author Neethu 
 */
const UserDashboard: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const setDataById = useStore((state: any) => state.setDataById);
  const POST = useStore((state: any) => state.POST);
  // Retrieve userDetails from the store
  const userDetails = useStore((state) => state?.compData?.["userDetails"]) ?? {};
  //const userEvents = useStore((state) => state?.compData?.["userEvents"]) ?? {};
  /**
  * Useeffect hook handles the api call 
  */
  useEffect(() => {
    fetchUserEvents();
  }, [])

  /**
    *  * Sample event data for testing or demonstration purposes.
    */
  const events = [
    { datetitle: '2023-12-15', title: 'Conference1', location: 'Kannur' },
  ];
  /**
   * 
   */
  const fetchUserEvents=async ()=>{
    try {
   
      await POST({
        url: "event/list",
        body: {
          offset: 0,
          sortBy: "id",
          sortDirection: "DESC",
          filters: {},
        },
        id: 'userEvents',
        errorCB: (context: any) => {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "error",
            message: context?.message,
          });
        },
      });
    } catch (error) {
      Logger.error("An error occurred:", error);
    }
  }
  /**
   * Labels for the square buttons on each event card
   */
  const squareButtonLabels: string[] = ["View Certificate", "Event Recap"];
  /**
   * Function to handle button presses on the event cards.
   */
  const handleButtonPress = () => {
  }
  /**
   * @param index  Function to handle the event selection from the autocomplete input.
   * It updates the API request configuration based on the selected event.
   */
  const handleSquareButtonClick = (index: number) => {
    if (index === 0) {
    } else if (index === 1) {
    }
  };

  return (
    <Grid container size={12} className="dashboard" >

      <Grid size={{ xs: 12, md: 7 }} container className="dashboard-left" >
        <Grid size={12}>
          <Typography className="dashboard-title" gutterBottom>
            <span className="dashboard-title-wave-icon"></span>
            <span className="greeting-text">Hey {userDetails?.firstName}!</span>
          </Typography>
        </Grid>
        <Grid size={12}>
          <Typography className="dashboard-subtitle" gutterBottom>
            Your hub for all events and registrations
          </Typography>
        </Grid>

        <Grid container className="dashboard-tight-spacing" size={12} spacing={2}>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DashboardCardItem onClick={() => navigate("/user/my-event")} icon={CalendarEventIcon} title="View All My Events" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DashboardCardItem onClick={() => navigate("/user/my-event")} icon={DownloadEventIcon} title="Download Tickets & Certificates" />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DashboardCardItem onClick={() => navigate("/user/payment-history")} icon={PaymentDashboardIcon} title="View Payment History" />
          </Grid>
          
        </Grid>
      </Grid>
      {/* Right Column */}
      <Grid container size={{ xs: 12, md: 2 }} >
        <Grid container size={{ xs: 12 }}>
        
         {/* title */}
         <Typography className="dashboard-subhead" gutterBottom>
            Upcoming Events
          </Typography>
          <Grid container spacing={2}>
          
            {events.map((event, index) => (
              <Grid size={{ xs: 12, sm: 4, md: 4 }} key={index}>
                <EventCard
                  eventFullData={event}
                  Eventstatus={false}
                  viewCertificate={true}
                  viewEventRecap={true}
                  squareButton={false}
                  viewButton={true}
                  datetitle={event.datetitle}
                  title={event.title}
                  location={event.location}
                  buttonPress={handleButtonPress}
                  squareButtonLabels={squareButtonLabels}
                  onSquareButtonClick={handleSquareButtonClick}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>



    </Grid>

  )
});

export default UserDashboard;