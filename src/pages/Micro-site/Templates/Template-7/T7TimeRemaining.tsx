import { IEventResponse } from '@/Libs/types/event'
import { Box, Typography } from '@mui/material'
import TEventTimer from '../Template-components/TEventTimer/TEventTimer'
/**
 * Componet for Template 7 event timer 
 * @param eventData
 */
const T7timeRemaining = ({ eventData }: { eventData?: IEventResponse }) => {
    const isTime = (eventData?.startTime !== null || eventData?.startTime !== undefined) ? true : false
    return (
        <>
            {isTime ? <Box className='t7-time-remaining'>
                <Box className='main t7-time-remaining-content'>
                    <Typography className='time-remaining-content-title'>Time Remaining</Typography>
                    <Box>
                        <TEventTimer className='time-remaining-content-timer' />
                    </Box>
                </Box>
            </Box > : <></>
            }
        </>
    )
}

export default T7timeRemaining