
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import DashboardCardItem from './DashboardCardItem';
import { CalendarEventIcon, DownloadEventIcon, EventsSvg, HeartEventIcon, PaymentDashboardIcon, PaymentHistoryIcon } from '@/assets/svg';
import React from 'react';
import useStore from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import { CalendarCard } from '../dashboard/CalendarCard';
import moment from 'moment';
import CustomButton from '@/components/CustomButton/CustomButton';
import DashboardEventCards from './DashboardEventCard';
import NoCalenderData from './NoCalenderData';
import NoDataCard from './NoDataCard';

export interface CalendarCardData {
  id: string;
  startTime: string | null;
  endTime: string | null;
  name: string;
}

/**
 * Used to render user dashboard 
 * @author Neethu 
 */
const UserDashboard: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const setDataById = useStore((state: any) => state.setDataById);
  const POST = useStore((state: any) => state.POST);
  const GET = useStore((state: any) => state.GET);
  /**
   * Retrieve userDetails from the store
   */
  const userDetails = useStore((state) => state?.compData?.["userDetails"]) ?? {};
  const eventAndUserCount = useStore((state: any) => state?.compData?.["eventAndUserCount"]?.['dashboard/eventAndUserCount']) ?? [];
  const userCompletedEvents = useStore((state: any) => state?.compData?.["userCompletedEvents"]?.['event/list']) ?? [];
  const userEvents = useStore((state: any) => state?.compData?.["userLatestEvents"]) ?? [];
  /**
  * Useeffect hook handles the api call 
  */
  useEffect(() => {
    fetchUpcomingEvents();
    fetchPastEvents();
    getDashboardCount();
  }, [])


  /**
  * fetch upcoming events
  */
  const getDashboardCount = async () => {
    try {
      setIsCountLoading(true);
      await GET({
        url: "dashboard/eventAndUserCount",
        id: 'eventAndUserCount',
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
      setIsCountLoading(false);
    }
  }
  /**
  * fetch upcoming events
  */
  const fetchUpcomingEvents = async () => {
    try {
      setIsLoading(true);
      await POST({
        url: "event/list",
        body: {
          limit: 1,
          offset: 0,
          sortBy: "id",
          sortDirection: "ASC",
          filters: {
            "startTime": new Date()
          },
        },
        id: 'userLatestEvents',
        successCB: (context:any) => {
          if (context?.success && context?.data.length > 0) {
            const event = context.data[0];
            setDataById("userLatestEvents", {
              id: event.id,
              startTime: event.startTime,
              endTime: event.endTime,
              name: event.name,
            });
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
  const fetchPastEvents = async () => {
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
        id: 'userCompletedEvents',
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

  return (
    <Grid container size={12} className="dashboard" >
      {/* left */}
      <Grid size={{ xs: 12, md: 7 }} className="dashboard-left" >
        <Grid size={12} className="dashboard-left-profile">
          <Grid size={12}>
            <Typography className="dashboard-left-profile-title" gutterBottom>
              <span className="dashboard-left-profile-greeting-text">Hey {userDetails?.firstName}!</span>
              <span className="dashboard-left-profile-title-wave-icon"></span>
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography className="dashboard-left-profile-subtitle" gutterBottom>
              Your hub for all events and registrations.
            </Typography>
          </Grid>
          <Grid size={12}>
            <CustomButton
              className="dashboard-left-profile-button"
              label="View Events"
              onClick={() => navigate('/user/my-event')}
            />
          </Grid>
        </Grid>
        <Grid container className="dashboard-tight-spacing" size={12} spacing={2}>
          <Grid size={12}>
            <Typography className="dashboard-left-profile-accounttitle" gutterBottom>
              Account Overview
            </Typography>
          </Grid>
          {isCountLoading ? <CircularProgress /> :
            <>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <DashboardCardItem onClick={() => navigate("/user/my-event")} count={eventAndUserCount?.data?.totalEventCount ?? 0} icon={EventsSvg} title="Total Events Registered" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <DashboardCardItem onClick={() => navigate("/user/my-event")} count={eventAndUserCount?.data?.pastEventCount ?? 0} icon={DownloadEventIcon} title="Sessions Participated" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <DashboardCardItem onClick={() => navigate("/user/payment-history")} count={eventAndUserCount?.data?.currentEventCount ?? 0} icon={PaymentDashboardIcon} title="Pending Payments" />
              </Grid>
            </>}
        </Grid>
        <Grid size={12}>
          <Typography className="dashboard-left-profile-accounttitle" gutterBottom>
            Attended Event
          </Typography>
          <Grid size={{ xs: 12 }} className="dashboard-left-profile-card">
          {isLoading ? <CircularProgress /> :
          userCompletedEvents?.data?
            <DashboardEventCards event={userCompletedEvents?.data && userCompletedEvents?.data[0]} />
            :  <NoDataCard/>
          }
          </Grid>
        </Grid>

      </Grid>

      {/* Right Column */}
      <Grid size={{ xs: 12, md: 4 }} className="dashboard-right" >
        <Grid container >
          <Grid>
            {isLoading ? <CircularProgress /> :
            userEvents?
              <CalendarCard data={userEvents} />
              :<NoCalenderData/>
            }
          </Grid>
        </Grid>
        <Grid className="dashboard-right-events">
          {/* title */}
          <Typography className="dashboard-subhead" gutterBottom>
            Recent Activities
          </Typography>

          <Grid container >
           <Box>
            <Grid size={12} mt={1} className="dashboard-left-profile-card-recent" onClick={() => navigate('/user/payment-history')}>
              <CalendarEventIcon fontSize={20} /> View Payment History
            </Grid>
            <Divider className='dashboard-left-profile-card-recent-dividers' />
            <Grid size={12} mt={1} className="dashboard-left-profile-card-recent" onClick={() => navigate('/user/my-event')}>
              <HeartEventIcon fontSize={20} /> View All My Events
            </Grid>
            <Divider className='dashboard-left-profile-card-recent-dividers' />
            <Grid size={12} mt={1} className="dashboard-left-profile-card-recent" onClick={() => navigate('/user/my-event')} >
              <PaymentHistoryIcon fontSize={20} /> Download Tickets & Certificates
            </Grid>
            </Box>
          
            </Grid>


        </Grid>
      </Grid>
    </Grid>

  )
});

export default UserDashboard;