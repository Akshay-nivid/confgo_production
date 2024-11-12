
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import DashboardCardItem from './DashboardCardItem';
import { CalendarEventIcon, DownloadEventIcon, NoDataSvg, PaymentDashboardIcon } from '@/assets/svg';
import React from 'react';
import EventCard from '../User/Components/EventCard';
import useStore from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import NoDataCard from './NoDataCard';

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
  console.log("userLatestEvents ", userLatestEvents);
  /**
  * Useeffect hook handles the api call 
  */
  useEffect(() => {
    fetchUserOldEvents();
    fetchLatestEvents();
  }, [])

  /**
    * Sample event data for testing or demonstration purposes.
    */
  const events = [
    { datetitle: '2023-12-15', title: 'Conference1', location: 'Kannur' },
  ];
  /**
   * fetch Old Events
   */
  const fetchUserOldEvents = async () => {
    try {

      await POST({
        url: "event/list",
        body: {
          offset: 0,
          sortBy: "id",
          sortDirection: "DESC",
          filters: {
            "endDate": "2024-11-10"
          },
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
  * fetch upcoming events
  */
  const fetchLatestEvents = async () => {
    try {
    //  setIsLoading(true);
      await POST({
        url: "event/list",
        body: {
          offset: 0,
          sortBy: "id",
          sortDirection: "DESC",
          filters: {
            "starDate": "2024-11-10"
          },
        },
        id: 'userLatestEvents',
        successCB: (context: any) => {
          console.log("SUCCESS ")
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
      //setIsLoading(false);
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
    <Grid container size={12} border={3} className="dashboard" >

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

          <Grid container spacing={2} >
            {
             userLatestEvents && userLatestEvents?.data && userLatestEvents.data.length > 0 ? (
                <Grid size={12}>
                  <EventCard
                    eventFullData={userLatestEvents.data[0]}
                    Eventstatus={false}
                    viewCertificate={true}
                    viewEventRecap={true}
                    squareButton={true}
                    viewButton={true}
                    datetitle={userLatestEvents.data[0].datetitle}
                    title={userLatestEvents.data[0].title}
                    location={userLatestEvents.data[0].location}
                    buttonPress={handleButtonPress}
                    squareButtonLabels={squareButtonLabels}
                    onSquareButtonClick={handleSquareButtonClick}
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