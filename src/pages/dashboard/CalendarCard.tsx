/**
 * Component displays the week calendar
 */
import Grid from "@mui/material/Grid2";
import CalendarIcon from '@/assets/svg/calendar-clock.svg';
import { Typography } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {Tooltip} from "@mui/material";

export interface CalendarCardData {
  id: string;
  startTime: string | null;
  endTime: string | null;
  name: string;
}
interface CalendarCardProps {
  data: CalendarCardData | null;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({ data }) => {

  const dayFormatted: any = moment(data?.startTime).format("DD");
  const navigate = useNavigate();


  /**
   * Method creates day array from start date time
   * @param startTime : start time
   * @returns : day array
   */
  const createDayArray = (startTime: string): string[] => {
    const startDate = new Date(startTime);
    const dayArray: string[] = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      dayArray.push(day.getDate().toString().padStart(2, '0'));
    }

    return dayArray;
  }

  const dayArray = createDayArray(data?.startTime ?? "")

  /**
   * Method calculates the number of days from start date time to end date time
   * @param startTime : start date and time
   * @param endTime : end date time
   * @returns : number of days
   */
  const calculateDaysBetween = (startTime: string, endTime: string): number => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Calculate the difference in milliseconds
    const differenceInMs = end.getTime() - start.getTime();

    // Convert milliseconds to days
    let differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    // Limit the difference to a maximum of 6 days
    if (differenceInDays > 6) {
      differenceInDays = 6;
    }

    return Math.floor(differenceInDays);
  }

  const dynamicClass = `dashboard-calendar-card-event-${calculateDaysBetween(data?.startTime ?? "", data?.endTime ?? "")}`;

  return (
    <Grid container size={{ xs: 12, sm: 12 }}>
      <Grid container size={{ xs: 12, sm: 12 }} className="dashboard-calendar-card-title-container">
        <Grid className="dashboard-calendar-card-icon"><CalendarIcon /></Grid>
        <Grid container direction={'column'}>
          <Grid><Typography className="dashboard-calendar-card-title">{moment(data?.startTime).format("DD MMM YYYY")}</Typography></Grid>
          <Grid><Typography className="dashboard-calendar-card-sub-title">{moment(data?.startTime).format("dddd")}</Typography></Grid>
        </Grid>
      </Grid>
      <Grid container size={{ xs: 12, sm: 12 }} direction={'row'}>
        <Grid container size={{ xs: 12, sm: 2 }} direction={'column'}>
          {dayArray?.map((item: any) => {
            return (
              <Grid container className="dashboard-calendar-card-text-item">
                <Grid className="dashboard-calendar-card-sub-item"><Typography className="dashboard-calendar-card-day">{item}</Typography></Grid>
              </Grid>
            )
          })}
        </Grid>
        <Grid container size={{ xs: 12, sm: 10 }} direction={'column'}>
          {dayArray?.map((item: any, index: number) => {
            return (
              <Grid 
              container 
              className="dashboard-calendar-card-event-item" 
              onClick={() => navigate('/calendar')}
              key={index} // Adding key for performance
            >
              <Grid 
                container 
                size={{ xs: 11, sm: 11 }} 
                justifyContent="center" 
                alignItems="center" 
                className={dayFormatted === item ? `dashboard-calendar-card-event ${dynamicClass}` : ''}
              >
                {index === Math.floor(calculateDaysBetween(data?.startTime ?? "", data?.endTime ?? "") / 2) && (
                  <Tooltip title={data?.name || ''} arrow>
                    <Typography 
                      className="dashboard-calendar-card-event-title">
                      {data?.name}
                    </Typography>
                  </Tooltip>
                )}
              </Grid>
            </Grid>
            )
          })}
        </Grid>
      </Grid>
    </Grid>
  )
};