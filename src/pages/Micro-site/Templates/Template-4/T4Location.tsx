import { IEventResponse } from '@/Libs/types/event'
import TLocationMap from '@/pages/events/template/_components/TLocation/TLocation'
import { Box } from '@mui/material'

const T4Location = ({ eventData }: { eventData?: IEventResponse }) => {

    const isOffline = (eventData?.eventClass === "OFFLINE" || eventData?.eventClass === "HYBRID") && eventData?.venue?.mapUrl;
    return (
        <>
            {isOffline ? <Box className="t4-location">

                <Box className='main'>
                    <h3 className='t4-location-title template-section-title '>
                        Location
                    </h3>
                    <TLocationMap />
                </Box>
            </Box > : <></>
            }
        </>
    )
}

export default T4Location;