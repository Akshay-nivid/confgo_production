
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import DashboardCardItem from './DashboardCardItem';
import {  DownloadCertsIcon, DownloadEventIcon, EventsSvg, HeartEventIcon, PaymentDashboardIcon,  TransactionHistoryIcon } from '@/assets/svg';
import React from 'react';
import useStore from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import { CalendarCard } from '../dashboard/CalendarCard';
// import moment from 'moment';
import CustomButton from '@/components/CustomButton/CustomButton';
import DashboardEventCards from './DashboardEventCard';
import NoCalenderData from './NoCalenderData';
import NoDataCard from './NoDataCard';
import { formatUTCDateTime, useIsMobileScreen } from '@/Utils/CommonBaseClass';
import EventCard from '../Participant-User/Components/EventCard';
import OngoingEventCard from './OngoingEventCard';
import SummitCard from './SummitCard';
import moment from 'moment';

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
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const setDataById = useStore((state: any) => state.setDataById);
  const POST = useStore((state: any) => state.POST);
  const GET = useStore((state: any) => state.GET);
  /**
   * Retrieve userDetails from the store
   */
  const userDetails = useStore((state) => state?.compData?.["userDetails"]) ?? {};
  const eventAndUserCount = useStore((state: any) => state?.compData?.["eventAndUserCount"]?.['dashboard/eventAndUserCount']) ?? [];
  const userCompletedEvents = useStore((state: any) => state?.compData?.["userCompletedEvents"]?.['participant/list']) ?? [];
  const userEvents = useStore((state: any) => state?.compData?.["userLatestEvents"]) ?? [];
  const isMobileView = useIsMobileScreen()
  const userId = sessionStorage.getItem('userId');
  const firstCheckedIn = userCompletedEvents.data?.find((event: { checkedIn: any; }) => event.checkedIn) || null;
  const today=moment(new Date().toISOString())
  const EventStartDate = moment(userEvents?.startTime)
  const upCommingEvent = userEvents["event/list"];
  const EventEndDate = moment(userEvents?.endTime)
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
  const getDashboardCount =  () => {
    try {
      setIsCountLoading(true);
       GET({
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
    const formattedDate=formatUTCDateTime(new Date().toISOString())
    try {
      setIsCalendarLoading(true);
      await POST({
        url: "event/list",
        body: {
          limit: 1,
          offset: 0,
          sortBy: "id",
          sortDirection: "ASC",
          filters: {
            "startTime": formattedDate.replace("T"," ")
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
      Logger.error("An error occurred event/list/filter:", error);

    }
    finally {
      setIsCalendarLoading(false);
    }
  }
  /**
  * fetch completed events /last attended events
  */
  const fetchPastEvents =  () => {
    try {
      setIsLoading(true);
       POST({
        url: "participant/list",
         body: {
          offset: 0,
          sortBy: "id",
          sortDirection: "DESC",
          filters: {
            userId:userId
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
      Logger.error("An error occurred on participant/list:", error);

    }
    finally {
      setIsLoading(false);
    }
  }
  const formattedDate = moment(upCommingEvent?.data?.[0]?.eventStartTime).format("MMMM D, YYYY");

  return (
    <Grid container size={12} className="dashboard" spacing={1}  >
      {/* left */}
      <Grid container size={{ xs: 12, md: 7 }}   className="dashboard-left"
      >
        <Grid size={12} className="dashboard-left-profile">
          <Grid size={12} className="dashboard-left-profile-textgroup">
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
          <Grid size={12} className="dashboard-left-profile-buttongroup">
            <CustomButton
              className="dashboard-left-profile-button"
              label="View Events"
              onClick={() => navigate('/user/my-event')}
            />
          </Grid>
        </Grid>
        <Grid container size={12} spacing={2}>
        {!isMobileView && (
         <Grid size={12}>
           <Typography className="dashboard-left-profile-accounttitle" gutterBottom>
              Account Overview
          </Typography>
         </Grid>
        )}
          {isCountLoading ? <CircularProgress /> :
            <Grid container  size={{ xs: 12}}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <DashboardCardItem onClick={() => navigate("/user/my-event")} count={eventAndUserCount?.data?.totalEventCount ?? 0} icon={EventsSvg} title="Total Events Registered" className={isMobileView? 'dashboard-left-profile-dashboard-event': ""}/>
              </Grid>
    <Grid size={isMobileView ?{xs:6}: {xs:12, sm:6, md: 4}}>
      <DashboardCardItem
        onClick={() => navigate("/user/my-event")}
        count={eventAndUserCount?.data?.attendedSessions ?? 0}
        icon={DownloadEventIcon}
        title="Sessions Participated"
        className={isMobileView? "dashboard-left-profile-dashboard-session":""}
      />
    </Grid>
    <Grid size={isMobileView ? {xs:6} :{xs:12, sm:6, md: 4 }}>
      <DashboardCardItem
        onClick={() => navigate("/user/payment-history")}
        count={eventAndUserCount?.data?.totalAmountPaid ?? 0}
        icon={PaymentDashboardIcon}
        title="Total Amount Paid"
        className={isMobileView ? "dashboard-left-profile-dashboard-session" :""}
      />
    </Grid>
  
            </Grid>}
        </Grid>
        {isMobileView && (
  <Grid size={12}>
    {upCommingEvent?.data?.length > 0 ? (
      <SummitCard
        date={formattedDate}
        title={upCommingEvent?.data?.[0]?.name}
        location={upCommingEvent?.data?.[0]?.venue?.address}
        url={upCommingEvent?.data?.[0]?.url}
      />
    ) : (
      <NoDataCard title={'No Upcoming Events'} description={"It looks like you haven’t registered for any upcoming events. Don’t miss out on exciting opportunities!"} />
    )}
  </Grid>
)}

        <Grid size={12}> 
          {!isMobileView &&
          <Typography className="dashboard-left-profile-accounttitle" gutterBottom>
            Attended Event
          </Typography>
          }
          <Grid size={{ xs: 12 }} className="dashboard-left-profile-card">
          {isLoading ? <CircularProgress /> :
           userCompletedEvents && Array.isArray(userCompletedEvents?.data) && userCompletedEvents?.data.length && userCompletedEvents.data.some((event: any) => event?.checkedIn) ? (

            isMobileView ? (
              <EventCard Eventstatus={true} datetitle={firstCheckedIn?.participant?.event?.startTime} eventFullData={firstCheckedIn?.participant?.event} squareButtonLabels={[]} title={firstCheckedIn?.participant?.event?.name} location={`${firstCheckedIn?.participant?.event?.venue?.address}, ${firstCheckedIn?.participant?.event?.venue?.city}`} />
            ) : (
        
              <DashboardEventCards event={firstCheckedIn?.participant?.event} />
            )
          ):
          (
            <NoDataCard title={"No Addended Events"} description={"It looks like you haven't attended any events yet. Don't miss out on exciting opportunities!"}/>
          )}
          </Grid>
        </Grid>
      </Grid>

      {/* Right Column */}
      <Grid size={{ xs: 12, md: 4 }} className="dashboard-right" justifyContent="flex-end">
      {!isMobileView && (
        <Grid container className="dashboard-right-calendar" >
            {isCalendarLoading ? <CircularProgress /> :
            userEvents && Array.isArray(userEvents['event/list']?.data) && userEvents['event/list']?.data.length > 0 ? 
            today.isBetween(EventStartDate, EventEndDate, "minute", "[]") ? <OngoingEventCard data={userEvents['event/list']?.data}/> : 
              <CalendarCard data={userEvents} />
              :<NoCalenderData/>
            }
         
        </Grid>
      )}
        <Grid className="dashboard-right-events">
          {/* title */}
          <Typography className="dashboard-subhead" gutterBottom>
            Recent Activities
          </Typography>

          <Grid  >
           <Box>
            <Grid size={12} mt={1} className="dashboard-left-profile-card-recent" onClick={() => navigate('/user/payment-history')}>
              <TransactionHistoryIcon fontSize={24} />   View Payment History
            </Grid>
            <Divider className='dashboard-left-profile-card-recent-dividers' />
            <Grid size={12} mt={1}  className="dashboard-left-profile-card-recent" onClick={() => navigate('/user/my-event')}>
              <HeartEventIcon fontSize={24} /> View All My Events
            </Grid>
            <Divider className='dashboard-left-profile-card-recent-dividers' />
            <Grid size={12} mt={1}  className="dashboard-left-profile-card-recent" onClick={() => navigate('/user/my-event')} >
              <DownloadCertsIcon fontSize={24} /> Download Tickets & Certificates
            </Grid>
            </Box>
          
            </Grid>


        </Grid>
      </Grid>
    </Grid>

  )
});

export default UserDashboard;