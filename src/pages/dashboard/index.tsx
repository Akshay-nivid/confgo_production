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
import { PendingEventCard } from "./PendingEventCard";
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

const Dashboard = () => {
  const POST = useStore((state: any) => state.POST);
  const GET = useStore((state: any) => state.GET);
  const [upcomingData, setUpcomingData] = useState<CalendarCardData | null>(null);
  const [pendingData, setPendingData] = useState<any>(null);
  const navigate = useNavigate();
  const fullEventList = useStore((state: any) => state?.compData?.["fullEventList"]?.['event/list']) ?? [];
  const pendingEventList = useStore((state: any) => state?.compData?.["pendingEventList"]?.['event/list']) ?? [];
  // const eventCountData = useStore((state: any) => state?.compData?.["dashBoardEventCount"]?.['dashboard/eventAndUserCount']) ?? [];
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);//true 
  const handleClose = () => setOpen(false);
  const acceptedTerms = sessionStorage.getItem('acceptedTerms')
  /**
   * Useeffect hook handles the api call for fetching upcoming event list and pending event list
   */
  useEffect(() => {
    fetchCompanyCountInfo();
    fetchFullEventList();
    fetchUpcomingEventList();
    fetchPendingEventList();
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


  return (pendingEventList?.success ?
    <>
      <TermsAndConditon open={open} onClose={handleClose} />
      {fullEventList?.data?.length == 0 ? <NoDataDashBoard />
        :
        <Grid container size={{ xs: 12, sm: 12 }} spacing={2} className="dashboard" >
          <Grid size={{ xs: 12, sm: 8.3 }} container p={2} >
            <Grid size={{ xs: 12, sm: 12 }} container>

              <EventDropDown data={fullEventList} />

              <Grid container size={12}>

                <EventFeedBack />

              </Grid>

            </Grid>

            <RevenueAndUserChart />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} pt={.7}>

            {upcomingData ? <Grid className="dashboard-calendar-card" boxShadow={"rgba(0, 0, 0, 0.12) 0rem 0rem 0.3125rem 0rem,  rgba(0, 0, 0, 0.12) 0rem 0rem 0.0625rem 0rem"}> <UpComingEvents data={upcomingData} /> </Grid> :
              <Grid container className="dashboard-no-event-calender" justifyContent={"center"} alignItems={"center"} alignContent={"center"} flexDirection={"column"}>
                <CalenderNoData width={50} height={50} />
                <Typography className="dashboard-no-event-calender-header">No Events Scheduled</Typography>
                <Typography className="dashboard-no-event-calender-subHeader">Create New Events !</Typography>
                <CustomButton
                  className="dashboard-no-event-calender-btn"
                  label="Create New Event"
                  onClick={() => navigate(routes.createEvent())}
                />
              </Grid>
            }
            {upcomingData &&
              <Grid boxShadow={"rgba(0, 0, 0, 0.1) 0rem 0rem 0.3125rem 0rem,  rgba(0, 0, 0, 0.1) 0rem 0rem 0.0625rem 0rem"} className="dashboard-calendar-card" mt={1}>

                <PendingProgram />

              </Grid>}

          </Grid>
          <Grid size={{ xs: 12, sm: 12 }} container direction={'column'} borderRadius={2} ml={2} mb={2} mr={3.5} boxShadow={"rgba(0, 0, 0, 0.1) 0rem 0rem 0.3125rem 0rem,  rgba(0, 0, 0, 0.1) 0rem 0rem 0.0625rem 0rem"}>
            {fullEventList?.data?.length < 5 ? (
              <Grid className="dashboard-event-list-card">
                <EventListCard view={false} dashView={true} />
              </Grid>
            ) : (
              <Grid className="dashboard-event-list-card -mt-8 relative">
                <div className="absolute right-24 top-[55px] z-10  ">
                  <p className="underline" />

                </div>

                <EventListCard view={true} dashView={true} />
              </Grid>
            )}

          </Grid>
        </Grid>}
    </> :
    <Grid container justifyContent={'center'} height={'100%'} alignItems={"center"}><CircularProgress color="success" /> </Grid>)
};

export default Dashboard;
