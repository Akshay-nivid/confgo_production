import { IEventResponse } from '@/Libs/types/event'
import TemplateNavbar from '../Template-components/TemplateNavbar'
import TLink from '../Template-components/TLink'
import { Box } from '@mui/material'
/**
 * Componet for Template 4 Navbar
 * @param eventData
 */
const T4Navbar = ({ eventData }: { eventData?: IEventResponse }) => {
    const links=[
        {
            className:"link-item",
            usageType:'Header',
            targetelementId:'speakers',
            label:'Speakers'
        },
        {
            className:"link-item",
            usageType:'Header',
            targetelementId:'sponsors',
            label:'Sponsors'
        },
        {
            className:"link-item",
            usageType:'Header',
            targetelementId:'programs',
            label:'Programs'
        },
        {
            className:"link-item",
            usageType:'Header',
            targetelementId:'location',
            label:'Location'
        },
        {
            className:"link-item",
            usageType:'Header',
            targetelementId:'tickets',
            label:'Ticket'
        },

    ]
    return (
        <TemplateNavbar className='t4-navbar main' eventData={eventData}>
            {
                () => (
                    <Box className="links-container">
                        <Box className='links'>
                            {links?.map((item: any) => (
                                <TLink className={item?.className} usageType={item?.usageType} targetelementId={item?.targetelementId} >{item?.label}</TLink>
                            ))}
                        </Box>
                        <TLink className='sponsor-button' usageType='Header' targetelementId='sponsor-form' >Become Sponsor</TLink>
                    </Box>
                )
            }
        </TemplateNavbar>
    )
}

export default T4Navbar