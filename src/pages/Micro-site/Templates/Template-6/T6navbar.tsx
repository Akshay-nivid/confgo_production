import { IEventResponse } from '@/Libs/types/event'
import TemplateNavbar from '../Template-components/TemplateNavbar'
import TLink from '../Template-components/TLink'
import { Box } from '@mui/material'

const T6navbar = ({ eventData }: { eventData?: IEventResponse }) => {


    return (
        <TemplateNavbar className='t6-navbar main' eventData={eventData}>
            {
                () => (
                    <Box className="links-container">
                        <Box className='links'>
                            <TLink className='link-item' usageType='Header' targetelementId='speakers' >Speakers</TLink>
                            <TLink className='link-item' usageType='Header' targetelementId='sponsors' >Sponsors</TLink>
                            <TLink className='link-item' usageType='Header' targetelementId='programs' >Programs</TLink>
                            <TLink className='link-item' usageType='Header' targetelementId='location' >Location</TLink>
                            <TLink className='link-item' usageType='Header' targetelementId='tickets' >Ticket</TLink>
                        </Box>
                        <TLink className='sponsor-button' usageType='Header' targetelementId='sponsor-form' >Become Sponsor</TLink>
                    </Box>
                )
            }
        </TemplateNavbar>
    )
}

export default T6navbar