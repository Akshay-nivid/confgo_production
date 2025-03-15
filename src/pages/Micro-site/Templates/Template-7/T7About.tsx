import { IEventResponse } from '@/Libs/types/event'
import { Typography } from '@mui/material'
import   Grid  from '@mui/material/Grid2'
import HTMLReactParser from 'html-react-parser/lib/index'
/**
 * Componet for Template 7 about
 * @param eventData
 */
const T7About = ({ eventData }: { eventData?: IEventResponse }) => {
    return (
        <Grid className='template-7-about'>
            <Grid className='main'>
                <Typography className='template-section-title about-section-title'>Welcome to {eventData?.name}</Typography>
                <Typography className='about-section-description'>{HTMLReactParser(eventData?.description || '')}</Typography>
            </Grid>

        </Grid>
    )
}

export default T7About