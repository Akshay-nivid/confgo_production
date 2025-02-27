import './footer.scss'
import { Box, Typography } from '@mui/material'
import LogoIcon from '@/assets/svg/template1-logo.svg';
import FacebookIcon from '@/assets/svg/template1-facebook.svg';
import InstagramIcon from '@/assets/svg/template1-instagram.svg';
import TwitterIcon from '@/assets/svg/template1-twitter.svg';
import { Link } from 'react-router-dom';


const TFooter = () => {
    return (
        <Box className='template-footer'>
            <Box display={'flex'} flexDirection={{xs:'column',md:'row'}} className="main template-footer-content">
                <Box flex={1} mb={{xs:4,md:0}} className='grid-1'>
                    <Box className='footer-icons-container' display={"flex"} rowGap={2} flexDirection={"column"}>
                        <LogoIcon className='logo' />
                        <Box columnGap={2} display={'flex'}>
                            <FacebookIcon className='social-icon' />
                            <InstagramIcon className='social-icon' />
                            <TwitterIcon className='social-icon' />
                        </Box>
                    </Box>
                </Box>
                <Box flex={1} display={'flex'} flexDirection={{xs:'column',sm:'row'}} className="info-link-container ">
                <Box mb={{xs:4,sm:0}} className="grid-2" flex={1} display={"flex"} flexDirection={"column"} rowGap={3}>
                    <Box className="text-small" display={'flex'} rowGap={1} flexDirection={'column'}>
                        <Typography className="text-small">
                            Torch Club 18 Waverly Pl,
                        </Typography>
                        <Typography className="text-small">
                            New York, NY 10003, USA
                        </Typography>
                    </Box>
                    <Box className="text-small" display={'flex'} rowGap={1} flexDirection={'column'}>
                        <Typography className="text-small">
                            0497 2701371
                        </Typography>
                        <Typography className="text-small">
                            support@confgo.co
                        </Typography>
                    </Box>
                </Box>
                <Box className="grid-3">

                    <Box className="links-conatiner text-small" display={'flex'} columnGap={4}>
                        <Box display={'flex'} rowGap={4} flexDirection={'column'}>
                            <Link to={'#'}>Home</Link>
                            <Link to={'#'}>Speakers</Link>
                        </Box>
                        <Box textAlign={'end'} className="text-small" display={'flex'} rowGap={4} flexDirection={'column'}>
                            <Link to={'#'}>Sponsors</Link>
                            <Link to={'#'}>Location</Link>

                        </Box>
                    </Box>
                    <Typography className='copyright'>© 2024 — Copyright</Typography>
                </Box>
                </Box>
            </Box>

        </Box>
    )
}

export default TFooter