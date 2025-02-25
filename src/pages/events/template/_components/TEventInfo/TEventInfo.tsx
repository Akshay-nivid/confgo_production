import { IEventResponse } from "@/Libs/types/event"
import useStore from "@/Libs/store";
import moment from "moment";



/**
 * Method transforms the start time and end time to November 20-25, 2024 like format
 * @param startTime : start time
 * @param endTime : end time
 * @returns : November 20-25, 2024 like format
 */
export const formatDateRange = (startTime: string, endTime: string) => {
  const start = moment(startTime);
  const end = moment(endTime);

  if (start.month() === end.month() && start.year() === end.year()) {
    // Same month and year
    return `${start.format('MMMM D')}-${end.format('D, YYYY')}`;
  } else if (start.year() === end.year()) {
    // Same year but different month
    return `${start.format('MMMM D')}-${end.format('MMMM D, YYYY')}`;
  } else {
    // Different year
    return `${start.format('MMMM D, YYYY')} - ${end.format('MMMM D, YYYY')}`;
  }
};
interface TEventInfoProps extends React.HTMLAttributes<HTMLParagraphElement> {
    
}
const TEventName = ({...props}: TEventInfoProps) => {

    const event: IEventResponse = useStore(state => state.compData?.['event']?.data);

    return (
        <p {...props}>{event?.name || "NA"}</p>
    )
}






const TEventDescription = ({...props}: TEventInfoProps) => {
    const event: IEventResponse = useStore(state => state.compData?.['event']?.data);

    return (
        <p {...props}>{event?.description || "NA"}</p>
    )
}





const TEventDate = ({...props}: TEventInfoProps) => {
    const event: IEventResponse = useStore(state => state.compData?.['event']?.data);

    return (
        <p {...props}>{formatDateRange(event?.startTime, event?.endTime) || "NA" }</p>
    )
}





const TEventAddress = ({...props}: TEventInfoProps) => {
    const event: IEventResponse = useStore(state => state.compData?.['event']?.data);

    return (
        <p {...props}>{event.venue.address || "NA" }</p>
    )
}

export { TEventName, TEventDescription, TEventDate, TEventAddress } 