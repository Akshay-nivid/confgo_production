import Box from '@mui/material/Box/Box'
import TLink from '../_components/TLink/TLink'
import MenuIcon from '@mui/icons-material/Menu';
import useStore, { setNonPersistedDataById } from '@/Libs/store';
import TDrawer from '../_components/TDrawer/TDrawer';
import { IEventResponse } from '@/Libs/types/event';
import config from '../../../../../config.json';
import TAuthButton from '../_components/TAuthButton/TAuthButton';
const Nav5 = () => {

    const baseUrl = config.api.url;

    const handleOpenDrawer = () => {
        setNonPersistedDataById('templateDrawerOpen', { value: true })
    }

    const eventData: IEventResponse = useStore(state => state.compData?.event?.data)

    return (
        <Box className="nav-container ">
            <Box className="text-5xl">
                <img src={eventData?.assetId ? `${baseUrl}asset/${eventData?.assetId}` : ''} alt="logo" className='w-16' />
            </Box>
            <Box display={{ xs: 'none', md: 'flex' }} className="nav__links">
                <Box className="nav__links__list">
                    <TLink className='nav__links__list__link' targetelementId='speakers' >Speakers</TLink>
                    <TLink className='nav__links__list__link' targetelementId='sponsors' >Sponsors</TLink>
                    <TLink className='nav__links__list__link' targetelementId='programs' >Programs</TLink>
                    <TLink className='nav__links__list__link' targetelementId='location' >Location</TLink>
                </Box>
                <TLink className='nav__links__sponsor-button' targetelementId='sponsor-form' >Become Sponsor</TLink>

            </Box>
            <MenuIcon onClick={handleOpenDrawer} className={`burger-icon`} />

            <TDrawer className=''>
                <Box className="h-full w-full bg-black t5-drawer ">

                    <Box className='p-5 py-7 header-container '>
                        <img src={eventData?.assetId ? `${baseUrl}asset/${eventData?.assetId}` : ''} alt="logo" className='w-20' />

                    </Box>

                    <Box className="drawer-links">
                        <TLink usageType='Drawer' className='nav__links__list__link' targetelementId='speakers' >Speakers</TLink>
                        <TLink  usageType='Drawer' className='nav__links__list__link' targetelementId='sponsors' >Sponsors</TLink>
                        <TLink  usageType='Drawer' className='nav__links__list__link' targetelementId='programs' >Programs</TLink>
                        <TLink  usageType='Drawer' className='nav__links__list__link' targetelementId='location' >Location</TLink>
                        <Box  className='sponsor-button-container'>
                            <TLink  usageType='Drawer' className='sponsor-button' targetelementId='sponsor-form' >Become Sponsor</TLink>
                        </Box>
                        <TAuthButton className='t5-drawer-login' authType='LOGIN'>Login</TAuthButton>
                        <TAuthButton className='t5-drawer-signup' authType='SIGNUP'>Signup</TAuthButton>

                    </Box>

                </Box>
            </TDrawer>

        </Box>
    )
}

export default Nav5