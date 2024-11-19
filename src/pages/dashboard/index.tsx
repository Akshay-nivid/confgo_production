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
import { CalenderNoData } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import routes from "@/router/routes";
import { useNavigate } from "react-router-dom";
import NoDataDashBoard from "./NoDataDashBoard";

const Dashboard = () => {

  const POST = useStore((state: any) => state.POST);
  const GET = useStore((state: any) => state.GET);
  const [upcomingData, setUpcomingData] = useState<CalendarCardData | null>(null);
  const [pendingData, setPendingData] = useState<any>(null);
  const navigate = useNavigate();
  const fullEventList = useStore((state: any) => state?.compData?.["fullEventList"]?.['event/list']) ?? [];
  const eventCountData=useStore((state:any)=>state?.compData?.["dashBoardEventCount"]?.['dashboard/eventAndUserCount'])??[];
  /**
   * Useeffect hook handles the api call for fetching upcoming event list and pending event list
   */
  useEffect(() => {
    fetchCompanyCountInfo();
    fetchFullEventList();
    fetchUpcomingEventList();
    fetchPendingEventList();
  }, [])

  /**
  * Method fetch the company count
  */
   const fetchCompanyCountInfo=async()=>{
    try{
      await GET({
        url:'dashboard/eventAndUserCount',
        id:'dashBoardEventCount',
        errorCB: (context: any) => {
          Logger.error('Dashboard', context?.message);
        }
      });
    }catch(error){
      Logger.error('Dashboard.tsx',error);
    }

   }
    /**
  * Method fetch the upcoming event list
  */
    const fetchFullEventList = async () => {
      try {
        await POST({
          url: 'event/list',
          body: {
            filters: {
            },
            offset: 0,
            limit: 5,
            sortBy: "id",
            sortDirection: "DESC",
          },
          id: 'fullEventList',
          errorCB: (context: any) => {
            Logger.error('Dashboard', context?.message);
          }
        });
      } catch (error) {
        Logger.error('Dashboard', error);
  
      }
    }

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
            statusId: 1// 3 will be the future
          },
          sortDirection: "asc",
          sortBy: "startTime",
          limit: 1,
          offset: 0
        },
        id: 'pendingEventList',
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


  return(<>{fullEventList?.data?.length==0?<NoDataDashBoard/>:  <Grid container size={{ xs: 12, sm: 12 }} spacing={2} className="dashboard" >
    <Grid size={{ xs: 12, sm: 8 }} container >
      <Grid size={{ xs: 12, sm: 12 }} container>
        <Grid size={{ xs: 12, sm:upcomingData? 6:12 }} className="dashboard-welcome-card"><WelcomeCard /></Grid>
        {upcomingData&& <Grid size={{ xs: 12, sm: 6 }} className="dashboard-upcoming-event-card"><UpcomingEventCard data={upcomingData}/></Grid>}
      </Grid>
      <Grid size={{ xs: 12, sm: 12 }} container>
        <Grid size={{ xs: 12, sm: 4 }} className="dashboard-item-card"><ItemCard label="Total Events Hosted" value={eventCountData?.data?.totalEventCount} icon={<EventHostedIcon />} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }} className="dashboard-item-card"><ItemCard label="Total Users Registered" value={eventCountData?.data?.totalUserCount} icon={<UsersRegisteredIcon />} /></Grid>
        <Grid size={{ xs: 12, sm: 4 }} className="dashboard-item-card"><ItemCard label="New Registrations" value={eventCountData?.data?.newUserCount} icon={<NewRegistrationsIcon />} /></Grid>
      </Grid>
      {pendingData ? <Grid size={{ xs: 12, sm: 12 }} container className="dashboard-pending-event-card"><PendingEventCard data={pendingData}/></Grid>:
      <Grid display={"flex"} size={12} className="dashboard-pending-event-card" justifyContent={"space-between"} alignContent={"center"} alignItems={"center"}>
        <Typography className="dashboard-no-pending-event-header">No Pending Events</Typography>
        <CustomButton 
         onClick={()=>navigate(routes.createEvent())}
        className="dashboard-no-pending-event-btn"
        label="Create New Event"/>
        </Grid>}
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }} >
      <Grid><Typography className="dashboard-calendar-card-header">Weekly Calendar</Typography></Grid>
      {upcomingData? <Grid className="dashboard-calendar-card"> <CalendarCard data={upcomingData}/> </Grid>:
        <Grid container className="dashboard-no-event-calender" justifyContent={"center"} alignItems={"center"} alignContent={"center"} flexDirection={"column"}>
         <CalenderNoData width={50} height={50}/>
         <Typography className="dashboard-no-event-calender-header">No Events Scheduled</Typography>
         <Typography className="dashboard-no-event-calender-subHeader">Looks like your calendar is clear!</Typography>
         <CustomButton 
         className="dashboard-no-event-calender-btn"
         label="Create New Event"
         onClick={()=>navigate(routes.createEvent())}
         />
        </Grid>
       }
    </Grid>
    <Grid size={{ xs: 12, sm: 12 }} container direction={'column'}>
      <Grid className="dashboard-event-list-card"><EventListCard /></Grid>
    </Grid>
  </Grid>}
  </>)};

export default Dashboard;
