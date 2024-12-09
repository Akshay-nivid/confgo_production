/**
 * Component displays the event list without actions
 */
import EventList from "../events/EventList";

interface Eventprops{
    view? : any
}

export const EventListCard: React.FC<Eventprops> = ({ view }) => {

    return (
        <EventList hideAction={view} />
    )

}