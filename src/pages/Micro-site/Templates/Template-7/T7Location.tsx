import TLocationMap from '@/pages/events/template/_components/TLocation/TLocation'
import { Box } from '@mui/material'
/**
 * Componet for Template 7 map
 */
const T7Location = () => {
    return (
        <Box id="location" className="template-7-location">

            <Box className='main'>
                <h3 className='template-7-location-title template-section-title '>
                    Location
                </h3>
                <TLocationMap />
            </Box>
        </Box>
    )
}

export default T7Location