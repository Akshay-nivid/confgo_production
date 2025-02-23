import TLocationMap from '@/pages/events/template/_components/TLocation/TLocation'
import { Box } from '@mui/material'
import React from 'react'

const T6location = () => {
    return (
        <Box className="template-6-location">

            <Box className='main'>
                <h3 className='template-6-location-title template-section-title '>
                    Location
                </h3>
                <TLocationMap />
            </Box>
        </Box>
    )
}

export default T6location