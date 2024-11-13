/**
 * Component handles the organization dashboard
 */
import Grid from "@mui/material/Grid2";
import { WelcomeCard } from "./WelcomeCard";
import { UpcomingEventCard } from "./UpcomingEventCard";
import { ItemCard } from "./ItemCard";
import EventHostedIcon from '@/assets/svg/events-hosted-icon.svg';
import UsersRegisteredIcon from '@/assets/svg/users-registered-icon.svg';
import AttendanceIcon from '@/assets/svg/attendance-icon.svg';
import NewRegistrationsIcon from '@/assets/svg/new-registrations-icon.svg';
import { EventListCard } from "./EventListCard";
import { CalendarCard } from "./CalendarCard";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useStore from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import moment from "moment";
import { CalendarCardData } from "./CalendarCard";

const Dashboard = () => {

  const POST = useStore((state: any) => state.POST);
  const [upcomingData, setUpcomingData] = useState<CalendarCardData | null>(null);


  /**
   * Useeffect hook handles the api call for fetching upcoming event list
   */
  useEffect(() => {
    fetchUpcomingEventList();
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
            endTime: moment(new Date()).endOf('year').format('YYYY-MM-DD')
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

  return <Grid container size={{ xs: 12, sm: 12 }} spacing={2} className="dashboard" >
    <Grid size={{ xs: 8, sm: 8 }} container >
      <Grid size={{ xs: 12, sm: 12 }} container>
        <Grid size={{ xs: 6, sm: 6 }} className="dashboard-welcome-card"><WelcomeCard /></Grid>
        <Grid size={{ xs: 6, sm: 6 }} className="dashboard-upcoming-event-card"><UpcomingEventCard /></Grid>
      </Grid>
      <Grid size={{ xs: 12, sm: 12 }} container>
        <Grid size={{ xs: 3, sm: 3 }} className="dashboard-item-card"><ItemCard label="Total Events Hosted" value="04" icon={<EventHostedIcon />} /></Grid>
        <Grid size={{ xs: 3, sm: 3 }} className="dashboard-item-card"><ItemCard label="Total Users Registered" value="2000" icon={<UsersRegisteredIcon />} /></Grid>
        <Grid size={{ xs: 3, sm: 3 }} className="dashboard-item-card"><ItemCard label="Event Attendance" value="80%" icon={<AttendanceIcon />} /></Grid>
        <Grid size={{ xs: 3, sm: 3 }} className="dashboard-item-card"><ItemCard label="New Registrations" value="312" icon={<NewRegistrationsIcon />} /></Grid>
      </Grid>
      <Grid size={{ xs: 12, sm: 12 }} container className="dashboard-main-event-card">
      </Grid>
    </Grid>

    <Grid size={{ xs: 4, sm: 4 }} >
      <Grid><Typography className="dashboard-calendar-card-header">Weekly Calendar</Typography></Grid>
      <Grid className="dashboard-calendar-card"> <CalendarCard data={upcomingData} /> </Grid>
    </Grid>
    <Grid size={{ xs: 12, sm: 12 }} container direction={'column'}>
      <Grid className="dashboard-event-list-card"><EventListCard /></Grid>
    </Grid>
  </Grid>;
};

export default Dashboard;
