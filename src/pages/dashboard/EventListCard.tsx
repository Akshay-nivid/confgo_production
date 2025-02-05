/**
 * Component displays the event list without actions
 */
import EventList from "../events/EventList";

interface Eventprops{
    view? : any
    dashView?:boolean;
}

export const EventListCard: React.FC<Eventprops> = ({ view,dashView }) => {

    return (
        <EventList hideAction={true} view={view} dashView={dashView} />
    )

}