
import useStore from "@/Libs/store"
import { MapIframe } from "../../MapIFrame"
import { IEventResponse } from "@/Libs/types/event"
const TLocationMap = () => {


    const eventData: IEventResponse = useStore(state => state?.compData?.event?.data)

    return (
        <>
            {
                eventData?.venue?.mapUrl ?
                    <MapIframe url={eventData?.venue?.mapUrl} key="map-i-frame" />
                    : <></>}
        </>
    )
}

export default TLocationMap