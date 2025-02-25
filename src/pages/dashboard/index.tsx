/**
 * Component handles the organization dashboard
 */
import Grid from "@mui/material/Grid2";


import { EventListCard } from "./EventListCard";
import { Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import useStore from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import moment from "moment";
import { CalendarCardData } from "./CalendarCard";
import { CalenderNoData } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import routes from "@/router/routes";
import { useNavigate } from "react-router-dom";
import NoDataDashBoard from "./NoDataDashBoard";
import TermsAndConditon from "./TermsAndCondition";
import UpComingEvents from "./UpcomingEvents";
import EventDropDown from "./EventDropDown";
import EventFeedBack from "./EventFeedBack";
import PendingProgram from "./PendingProgram";
import RevenueAndUserChart from "./RevenueAndUserChart";
import OngoingEvents from "./OngoingEvents";

const Dashboard = () => {
  const POST = useStore((state: any) => state.POST);
  const GET = useStore((state: any) => state.GET);
  const [upcomingData, setUpcomingData] = useState<CalendarCardData | null>(null);
  const navigate = useNavigate();
  const fullEventList = useStore((state: any) => state?.compData?.["fullEventList"]?.['event/list']) ?? [];
  const pendingEventList = useStore((state: any) => state?.compData?.["pendingEventList"]?.['event/list']) ?? [];
  // const eventCountData = useStore((state: any) => state?.compData?.["dashBoardEventCount"]?.['dashboard/eventAndUserCount']) ?? [];
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);//true 
  const handleClose = () => setOpen(false);
  const acceptedTerms = sessionStorage.getItem('acceptedTerms');
  const [ongoingData, setOngoingData] = useState<any[]>([]);
  /**
   * Useeffect hook handles the api call for fetching upcoming event list and pending event list
   */
  useEffect(() => {
    fetchCompanyCountInfo();
    fetchFullEventList();
    fetchUpcomingEventList();
    fetchPendingEventList();
    fetchOngoingEventList();
    if (acceptedTerms == '0') {
      handleOpen();
    }
  }, []);
  /**
  * Method fetch the company count
  */
  const fetchCompanyCountInfo = async () => {
    try {
      await GET({
        url: 'dashboard/eventAndUserCount',
        id: 'dashBoardEventCount',
        errorCB: (context: any) => {
          Logger.error('Dashboard', context?.message);
        }
      });
    } catch (error) {
      Logger.error('Dashboard.tsx', error);
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
          // limit: 5,
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
        url: 'event/eventList',
        body: {
          sortDirection: "asc",
          sortBy: "startTime",
          limit: 1,
          offset: 0,
          filters: {
            published: 1,
            startTime: moment(new Date()).add(1, 'days').format('YYYY-MM-DD'),
          }
        },

        id: 'upcomingEventList',
        successCB: (context: any) => {
          if (context?.success) {
            setUpcomingData(context?.data?.[0]);
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
   * Function used to fetch the currently on going event
   */
  const fetchOngoingEventList = async () => {
    try {
      await POST({
        url: 'event/eventList',
        body: {
          sortDirection: "asc",
          sortBy: "startTime",
          limit: 100,
          offset: 0,
          filters: {
            published: 1,
            startTime:new Date().toISOString()
          }
        },

        id: 'ongoingEventList',
        successCB: (context: any) => {
          if (context?.success) {
            setOngoingData(context?.data);
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
// Function to get the currently ongoing event and select the first one in ascending order.
  const getOngoingEvent = (ongoingData:any) => {
    const currentTime = moment().format('YYYY-MM-DD HH:mm')// Get current time

    // Filter events where currentTime is between startTime and endTime
    const filteredEvents = ongoingData.filter((event:any) => {
      const start = moment(event.startTime).format('YYYY-MM-DD hh:mm')//);
      const end =  moment(event.endTime).format('YYYY-MM-DD hh:mm') ;
      return currentTime >= start && currentTime <= end;
    });
    // Sort by startTime in ascending order
    const sortedEvents = filteredEvents.sort((a: any, b: any) => a.startTime - b.startTime);

    // Return the first ongoing event or null if none found
    return sortedEvents.length > 0 ? sortedEvents[0] : null;

  };
  
  const firstOngoingEvent = getOngoingEvent(ongoingData);
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
            // setPendingData(context?.data?.[0])
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

  if (fullEventList?.data?.length == 0) return <NoDataDashBoard />
  return (pendingEventList?.success ?
    <>
      <TermsAndConditon open={open} onClose={handleClose} />


      <Grid container width={'100%'} padding={2} columnSpacing={2} rowSpacing={4}>

        <Grid container size={{ xs: 12, sm: 12, md: 12, lg: 8 }}  rowSpacing={2}>

          <Grid size={{ xs: 12, }}>

            <EventDropDown data={fullEventList} />

          </Grid>

          <Grid container size={12}>

            <EventFeedBack />

          </Grid>

          <RevenueAndUserChart />
        </Grid>

        <Grid size={{ xs: 12,lg: 4 }} height={"max-content"} container rowSpacing={2} columnSpacing={2}>
          {firstOngoingEvent ? (<Grid size={{xs:12, md:6,lg:12 }} className="dashboard-calendar-card shadow-app"> <OngoingEvents data={firstOngoingEvent}/> </Grid> ):
          upcomingData ? (<Grid size={{ xs: 12,md:6,lg:12 }} className="dashboard-calendar-card shadow-app" > <UpComingEvents data={upcomingData} /> </Grid>) : (
            <Grid size={{ xs: 12,md:12,lg:12 }} container  className="dashboard-no-event-calender shadow-app" justifyContent={"center"} alignItems={"center"} alignContent={"center"} flexDirection={"column"}>
              <CalenderNoData width={50} height={50} />
              <Typography className="dashboard-no-event-calender-header">No Events Scheduled</Typography>
              <Typography className="dashboard-no-event-calender-subHeader">Create New Events !</Typography>
              <CustomButton
                className="dashboard-no-event-calender-btn"
                label="Create New Event"
                onClick={() => navigate(routes.createEvent())}
              />
            </Grid>
          )}


          {upcomingData &&
            <Grid size={{ xs: 12,md:6,lg:12 }} container  className="dashboard-calendar-card shadow-app" >

              <PendingProgram />

            </Grid>}

        </Grid>

        <Grid size={{ xs: 12, sm: 12 }} maxWidth={"100%"} container direction={'column'} borderRadius={2}  mb={2} className="shadow-app dashboard-event-list ">
            {fullEventList?.data?.length < 5 ? (
              <Grid className="dashboard-event-list-card mt-0">
                <EventListCard view={false} dashView={true} />
              </Grid>
            ) : (
              <Grid className="dashboard-event-list-card relative overflow-x-auto" size={{ xs: 12, sm: 12 }}>
                <EventListCard view={true} dashView={true} />
              </Grid>
            )}

          </Grid>

      </Grid>
    </> :
    <Grid container justifyContent={'center'} height={'100%'} alignItems={"center"}><CircularProgress color="success" /> </Grid>)
};

export default Dashboard;
