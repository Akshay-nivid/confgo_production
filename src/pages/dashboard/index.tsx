/**
 * Component handles the organization dashboard
 */
import Grid from "@mui/material/Grid2";
import { WelcomeCard } from "./WelcomeCard";
import { UpcomingEventCard } from "./UpcomingEventCard";
import { ItemCard } from "./ItemCard";
import EventHostedIcon from '@/assets/svg/events-hosted-icon.svg';
import UsersRegisteredIcon from '@/assets/svg/users-registered-icon.svg';
import NewRegistrationsIcon from '@/assets/svg/new-registrations-icon.svg';
import { EventListCard } from "./EventListCard";
import { CalendarCard } from "./CalendarCard";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useStore from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import moment from "moment";
import { CalendarCardData } from "./CalendarCard";
import { PendingEventCard } from "./PendingEventCard";

const Dashboard = () => {

  const POST = useStore((state: any) => state.POST);
  const [upcomingData, setUpcomingData] = useState<CalendarCardData | null>(null);
  const [pendingData, setPendingData] = useState<any>(null);


  /**
   * Useeffect hook handles the api call for fetching upcoming event list and pending event list
   */
  useEffect(() => {
    fetchUpcomingEventList();
    fetchPendingEventList();
  }, [])

  /**
  * Method fetch the upcoming event list
  */
  const fetchUpcomingEventList = async () => {
    try {
      await POST({
        url: 'event/list',
        body: {
          filters: {
            published: 1,
            startTime: moment(new Date()).format('YYYY-MM-DD'),
          },
          sortDirection: "asc",
          sortBy: "startTime",
          limit: 1,
          offset: 0
        },
        id: 'upcomingEventList',
        successCB: (context: any) => {
          if (context?.success) {
            setUpcomingData(context?.data?.[0])
          }
        },
        errorCB: (context: any) => {
          Logger.error('Dashboard', context?.message);
        }
      });
    } catch (error) {
      Logger.error('Dashboard', error);

    }
  }

  /**
  * Method fetch the pending event list
  */
  const fetchPendingEventList = async () => {
    try {
      await POST({
        url: 'event/list',
        body: {
          filters: {
            published: 0,
            startTime: moment(new Date()).format('YYYY-MM-DD'),
            statusId: 3
          },
          sortDirection: "asc",
          sortBy: "startTime",
          limit: 1,
          offset: 0
        },
        id: 'upcomingEventList',
        successCB: (context: any) => {
          if (context?.success) {
            setPendingData(context?.data?.[0])
          }
        },
        errorCB: (context: any) => {
          Logger.error('Dashboard', context?.message);
        }
      });
    } catch (error) {
      Logger.error('Dashboard', error);

    }
  }

  return <Grid container size={{ xs: 12, sm: 12 }} spacing={2} className="dashboard" >
    <Grid size={{ xs: 12, sm: 8 }} container >
      <Grid size={{ xs: 12, sm: 12 }} container>
        <Grid size={{ xs: 12, sm: 6 }} className="dashboard-welcome-card"><WelcomeCard /></Grid>
        {upcomingData && <Grid size={{ xs: 12, sm: 6 }} className="dashboard-upcoming-event-card"><UpcomingEventCard data={upcomingData}/></Grid>}
      </Grid>
      <Grid size={{ xs: 12, sm: 12 }} container>
        <Grid size={{ xs: 12, sm: 4 }} className="dashboard-item-card"><ItemCard label="Total Events Hosted" value="04" icon={<EventHostedIcon />} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }} className="dashboard-item-card"><ItemCard label="Total Users Registered" value="2000" icon={<UsersRegisteredIcon />} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }} className="dashboard-item-card"><ItemCard label="New Registrations" value="312" icon={<NewRegistrationsIcon />} /></Grid>
      </Grid>
      {pendingData && <Grid size={{ xs: 12, sm: 12 }} container className="dashboard-pending-event-card"><PendingEventCard data={pendingData}/></Grid>}
    </Grid>

    <Grid size={{ xs: 12, sm: 4 }} >
      <Grid><Typography className="dashboard-calendar-card-header">Weekly Calendar</Typography></Grid>
      {upcomingData && <Grid className="dashboard-calendar-card"> <CalendarCard data={upcomingData}/> </Grid>}
    </Grid>
    <Grid size={{ xs: 12, sm: 12 }} container direction={'column'}>
      <Grid className="dashboard-event-list-card"><EventListCard /></Grid>
    </Grid>
  </Grid>;
};

export default Dashboard;
