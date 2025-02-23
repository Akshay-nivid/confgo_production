import { IEventResponse } from '@/Libs/types/event'
import { Box, Typography } from '@mui/material'
import React from 'react'
import TEventTimer from '../Template-components/TEventTimer/TEventTimer'

const T6timeRemaining = ({ eventData }: { eventData?: IEventResponse }) => {

    const isTime = (eventData?.startTime !== null || eventData?.startTime !== undefined) ? true : false
    return (
        <>
            {isTime ? <Box className='t6-time-remaining'>
                <Box className='main t6-time-remaining-content'>
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

export default T6timeRemaining