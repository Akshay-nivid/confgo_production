import { IEventResponse } from '@/Libs/types/event'
import { Box } from '@mui/material'
import HTMLReactParser from 'html-react-parser/lib/index'

const T6about = ({ eventData }: { eventData?: IEventResponse }) => {
    return (
        <Box className='template-6-about'>
            <Box className='main'>
                <h1 className='template-section-title about-section-title'>{eventData?.name}</h1>
                <h1 className='about-section-description'>{HTMLReactParser(eventData?.description || '')}</h1>

            </Box>

        </Box>
    )
}

export default T6about