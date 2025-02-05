import Box from '@mui/material/Box/Box'
import TLink from '../_components/TLink/TLink'

const Nav5 = () => {
    return (
        <Box className="nav-container ">
            <Box className="text-5xl">Logo</Box>
            <nav className="nav__links">
                <Box className="nav__links__list">
                    <TLink className='nav__links__list__link' targetelementId='speakers' >Speakers</TLink>
                    <TLink className='nav__links__list__link' targetelementId='sponsors' >Sponsors</TLink>
                    <TLink className='nav__links__list__link' targetelementId='programs' >Programs</TLink>
                    <TLink className='nav__links__list__link' targetelementId='location' >Location</TLink>
                </Box>
                <TLink className='nav__links__sponsor-button' targetelementId='sponsor-form' >Become Sponsor</TLink>
            </nav>
        </Box>
    )
}

export default Nav5