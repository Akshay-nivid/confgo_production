import { Box } from '@mui/material'
import React from 'react'

const HeroSection5 = ({ children }: { children?: React.ReactNode }) => {
    return (
        <Box className="hero-main">

            <Box className="hero-content main">
                {children}
            </Box>

        </Box>
    )
}

export default HeroSection5