/**
 * Component handles the rendering of the calendar component
 */
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";
import useStore from "@/Libs/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logger } from "@/Utils/Logger";
import { CustomCalendar } from "@/components/CustomCalendar/CustomCalendar";

interface calendarProps {
  id: string;
}

const CalendarPage: React.FC<calendarProps> = ({ id }) => {

  const setDataById = useStore((state: any) => state.setDataById);
  const clearDataById = useStore((state: any) => state?.clearDataById)
  const dataInfo = useStore((state: any) => state?.compData?.[id]?.['event/list']) ?? [];
  const POST = useStore((state: any) => state.POST);
  const navigate = useNavigate();

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
    const fetchData = async () => {
      try {
        await POST({
          url: "event/list",
          body: {
            offset: 0,
            sortBy: "id",
            sortDirection: "DESC",
            filters: {},
          },
          id: id,
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
    };

    fetchData();
  }, []); // Include dependencies if necessary


  /**
   * Method transforms the api response data to the calendar data format
   * @param data : api respone data
   * @returns : calendar data format
   */
  const transformEventData = (data: any) => {
    return data?.map((event: any) => ({
      id: event.id,
      title: event.name || "No Title", // Set to default if title is null
      start: new Date(event.startTime),
      end: new Date(event.endTime),
      description: event.description || "No Description",
    }));
  }

  /**
   * Method handles the click event in the calendar
   * @param event : event parameter
   */
  const handleSelectEvent = (event: any) => {
    navigate(`/events/detail/${event.id}`)
  };




  return (
    <Grid container size={{ xs: 12, sm: 12 }} spacing={2} className="calendar" id={id}>
      <Grid size={{ xs: 12, sm: 12 }}>
        <Typography className="calendar-title">Calendar</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 12 }} className="calendar-container">
        <CustomCalendar id="events-custom-calendar" events={dataInfo?.data && transformEventData(dataInfo?.data)} onSelectEvent={handleSelectEvent} />
      </Grid>
    </Grid>)
};

export default CalendarPage;

