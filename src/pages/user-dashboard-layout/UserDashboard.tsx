
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import DashboardCardItem from './DashboardCardItem';
import { CalendarEventIcon, DownloadEventIcon, PaymentDashboardIcon } from '@/assets/svg';
import React from 'react';
import EventCard from '../User/Components/EventCard';
import useStore from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import NoDataCard from './NoDataCard';
import routes from '@/router/routes';
import { CalendarCard, CalendarCardData } from '../dashboard/CalendarCard';
import moment from 'moment';

/**
 * Used to render user dashboard 
 * @author Neethu 
 */
const UserDashboard: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const setDataById = useStore((state: any) => state.setDataById);
  const POST = useStore((state: any) => state.POST);
  // Retrieve userDetails from the store
  const userDetails = useStore((state) => state?.compData?.["userDetails"]) ?? {};
  const userLatestEvents = useStore((state: any) => state?.compData?.["userLatestEvents"]?.['event/list']) ?? [];
  const [upcomingData, setUpcomingData] = useState<CalendarCardData | null>(null);

  /**
  * Useeffect hook handles the api call 
  */
  useEffect(() => {
    fetchUpcomingEvents();
    fetchLatestEvents();
  }, [])

  /**
    * fetch upcoming events
  */
  const fetchUpcomingEvents = async () => {
    try {
      setIsLoading(true);
      await POST({
        url: "event/list",
        body: {
          offset: 0,
          sortBy: "id",
          sortDirection: "ASC",
          filters: {
            "startTime": new Date()
          },
        },
        id: 'userLatestEvents',
        successCB:(context:any)=>{
          if (context?.success) {
            if(context?.data)
            setUpcomingData({"id":context?.data[0].id,"name":context?.data[0].name,"startTime":context?.data[0].startTime,"endTime":context?.data[0].endTime})
          }
        },
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
    finally {
      setIsLoading(false);
    }
  }
  /**
  * fetch completed events /last attended events
  */
  const fetchLatestEvents = async () => {
    try {
      setIsLoading(true);
      await POST({
        url: "event/list",
        body: {
          offset: 0,
          sortBy: "id",
          sortDirection: "DESC",
          filters: {
            "endTime": getPreviousDay(new Date())
          },
        },
        id: 'userLatestEvents',
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
    finally {
      setIsLoading(false);
    }
  }
  /**
   * Function to get the previous day of a given date
   */
  function getPreviousDay(date: any) {
    return moment(date).subtract(1, 'days').format('YYYY-MM-DD');
  }
  /**
   * Labels for the square buttons on each event card
   */
  const squareButtonLabels: string[] = ["View Certificate", "Event Recap"];

  /**
   * @param index  Function to handle the event selection from the autocomplete input.
   * It updates the API request configuration based on the selected event.
   */
  const handleSquareButtonClick = (index: number, eventId: number) => {
    if (index === 0) {
    } else if (index === 1) {
      navigate(routes.userEventRecap(), { state: { eventId: eventId } });
    }
  };

  return (
    <Grid container size={12} className="dashboard" >
      {/* left */}
      <Grid size={{ xs: 12, md: 7 }}  className="dashboard-left" >
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
      <Grid  size={{ xs: 12, md: 4 }}  className="dashboard-right" >
        <Grid container >
          <Grid><Typography className="dashboard-subhead">Weekly Calendar</Typography></Grid>
          <Grid className="dashboard-calendar-card"> <CalendarCard data={upcomingData} /> </Grid>
        </Grid>
        <Grid className="dashboard-right-events">
          {/* title */}
          <Typography className="dashboard-subhead" gutterBottom>
            Attended Event
          </Typography>

          <Grid container >
            {
              isLoading ? <CircularProgress /> :
                userLatestEvents && userLatestEvents?.data && userLatestEvents.data.length > 0 ? (
                  <Grid size={12}>
                    <EventCard
                      eventFullData={userLatestEvents.data[0]}
                      Eventstatus={true}
                      viewCertificate={true}
                      viewEventRecap={true}
                      squareButton={true}
                      viewButton={false}
                      datetitle={userLatestEvents.data[0].startTime}
                      title={userLatestEvents.data[0].name}
                      location={userLatestEvents.data[0].venue.city}
                      // buttonPress={handleButtonPress}
                      squareButtonLabels={squareButtonLabels}
                      onSquareButtonClick={(btnIndex: number) => handleSquareButtonClick(btnIndex, userLatestEvents.data[0].id)}

                    />
                  </Grid>
                ) : (

                  <NoDataCard />

                )}

          </Grid>


        </Grid>
      </Grid>
    </Grid>

  )
});

export default UserDashboard;