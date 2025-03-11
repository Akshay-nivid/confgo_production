import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import useStore, { IStoreState } from "@/Libs/store";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Logger } from "@/Utils/Logger";
import { CustomCalendar } from "@/components/CustomCalendar/CustomCalendar";
import moment from "moment";
import routes from "@/router/routes";

interface calendarProps {
  id: string;
}


  const CalendarPage: React.FC<calendarProps> = ({ id }) => {
  const setDataById = useStore((state: any) => state.setDataById);
  const clearDataById = useStore((state: any) => state?.clearDataById)
  const dataInfo = useStore((state: IStoreState) => state?.compData?.['eventList']?.['event/eventList']);
  const POST = useStore((state: any) => state.POST);
  const navigate = useNavigate();
  const location = useLocation(); 
  const containsUserCalendar = location.pathname.indexOf('user/calendar') !== -1;
  const dataInfotUser = useStore((state: IStoreState) => state?.compData?.['eventList']?.["event/registered/eventList"]);

  /**
   * Useeffect hook clears the state data while unmounting
   */
  useEffect(() => () => {
    clearDataById(id)
  }, [])

  /**
   * Useeffect hook fetches the state data through api call
   */
  useEffect(() => {
    const dateObj = {
      startTime: moment().startOf('month').format('YYYY-MM-DD'),
      endTime: moment().endOf('month').format('YYYY-MM-DD')
    };
    fetchData(dateObj);
  }, []); 

  /**
   * Method handles the api call for getting event list data
   */
  const fetchData = async (filters: { startTime: string, endTime: string }) => {
    try {
      const commonRequestBody = {
        offset: 0,
        sortBy: "id",
        sortDirection: "DESC",
        limit: 1000,
        filters
      };
      const commonErrorHandler = (context: any) => {
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "error",
          message: context?.message || "An error occurred",
        });
      };
      if(id==="company-calendar"){
       POST({
        url: "event/eventList",
        body: commonRequestBody,
        id: "eventList",
        errorCB: commonErrorHandler,
      });
    }
    else{
      if(id==="user-calendar"){
       POST({
        url: "event/registered/eventList",
        body:commonRequestBody,
        id: "eventList",
        successCB:(context:any)=>{
          setDataById("programs",{data:context?.data})
          },
          errorCB: commonErrorHandler,
      });
    }
  }
    } catch (error) {
      Logger.error("An error occurred:", error);
    }
  };


  /**
   * Method transforms the api response data to the calendar data format
   * @param data : api respone data
   * @returns : calendar data format
   */
  const transformEventData = (data: any) => {
    return data?.map((event: any) => ({
      id: event?.id,
      title: event?.name || "No Title",
      start: new Date(event?.startTime),
      end: new Date(event?.endTime),
      description: event?.description || "No Description",
    }));
  }

  /**
   * Method handles the click event in the calendar
   * @param event : event parameter
   */
  const handleSelectEvent = (event: any) => {
     containsUserCalendar? navigate(routes.userEventRecap(),{state:{eventId:event.id}}): navigate(`/events/detail/${event.id}`);
  };

  /**
   * Method handles the navigate event in the calendar
   * @param event : event parameter
   */
  const handleNavigate = (dateObj: { startTime: '', endTime: '' }) => {
    fetchData(dateObj);
  };


  return (
    <Grid container size={{ xs: 12, sm: 12 }} spacing={2} className="calendar " id={id}>
      <Grid size={{ xs: 12, sm: 12 }}>
        <Typography className="calendar-title">Calendar</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 12 }} className={containsUserCalendar?"calendar-usercontainer shadow-app":"calendar-container shadow-app"}>
      {dataInfotUser ? (
        <CustomCalendar
            id="user-calendar"
            events={dataInfotUser?.data && transformEventData(dataInfotUser?.data)}
            onSelectEvent={handleSelectEvent}
            onNavigate={handleNavigate}
            defaultDate={new Date()}/>
      ) : (
        <CustomCalendar
              id="company-calendar"
              events={dataInfo?.data && transformEventData(dataInfo?.data)}
              onSelectEvent={handleSelectEvent}
              onNavigate={handleNavigate}
              defaultDate={new Date()} />
      )}
      </Grid>
    </Grid>)
};

export default CalendarPage;

