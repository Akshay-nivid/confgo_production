import { IEventResponse } from '@/Libs/types/event'
import TLocationMap from '@/pages/events/template/_components/TLocation/TLocation'
import { Box } from '@mui/material'

const T6location = ({ eventData }: { eventData?: IEventResponse }) => {

    const isOffline = (eventData?.eventClass === "OFFLINE" || eventData?.eventClass === "HYBRID") && eventData?.venue?.mapUrl;
    return (
        <>
            {isOffline ? <Box className="template-6-location">

                <Box className='main'>
                    <h3 className='template-6-location-title template-section-title '>
                        Location
                    </h3>
                    <TLocationMap />
                </Box>
            </Box > : <></>
            }
        </>
    )
}

export default T6location