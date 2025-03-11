import { IEventResponse } from '@/Libs/types/event'
import { Box, Stack } from '@mui/material'
import clsx from 'clsx'
import { LocationOn, CalendarToday } from "@mui/icons-material"
import LanguageIcon from '@mui/icons-material/Language';
import Card from '@mui/material/Card/Card'
import { convertUTCToUserTimeZone } from '@/Utils/CommonBaseClass'
import TAuthButton from '@/pages/events/template/_components/TAuthButton/TAuthButton';
import TRegisterButton from '@/pages/events/template/_components/TRegisterButton/TRegisterButton';

const T6heroSection = ({ eventData }: { eventData?: IEventResponse }) => {
    return (
        <Box className="hero-container ">
            <Box className="spacer"></Box>
            <Box className="hero-content main">

                <Box className="hero-details">
                    <h1 className={clsx('template-section-title', 'hero-title')}>{eventData?.name || 'No name'} </h1>
                    <Card
                        className='hero-card'
                    >
                        <Stack spacing={2} direction={'column'}>
                            {eventData?.eventClass === "OFFLINE" ? <Stack direction="row" spacing={2} alignItems="start">
                                <Box
                                    className="icon-container">
                                    <LocationOn className='icon' />
                                </Box>
                                <Box>
                                    <p className='label'>
                                        Location
                                    </p>
                                    <p className='value'>
                                        {eventData?.venue?.address || 'No address provided'}
                                    </p>
                                </Box>

                            </Stack>
                                : eventData?.eventClass === "ONLINE" ?
                                    <Stack direction="row" spacing={2} alignItems="start">
                                        <Box
                                            className="icon-container">
                                            <LanguageIcon className='icon' />
                                        </Box>
                                        <Box>
                                            <p className='label'>
                                                Event Type
                                            </p>
                                            <p className='value'>
                                                {eventData?.eventClass || 'No type provided'}
                                            </p>
                                        </Box>
                                    </Stack> :
                                    <></>

                            }
                            <Stack direction={"row"} spacing={2} alignItems="start">
                                <Box
                                    className="icon-container date"
                                >
                                    <CalendarToday className='icon' />
                                </Box>
                                <Box>
                                    <p className='label'>
                                        Date
                                    </p>
                                    <p className='value'>
                                        {
                                            convertUTCToUserTimeZone(eventData?.startTime || "NA", "MMMM DD") + "-" + convertUTCToUserTimeZone(eventData?.endTime || "NA", "DD") + ", " + convertUTCToUserTimeZone(eventData?.startTime || "NA", "YYYY")
                                        }
                                    </p>
                                </Box>
                            </Stack>
                        </Stack>
                        <Stack className='auth-button-container' direction={'row'}>
                            <TAuthButton authType='LOGIN' className="auth-btn">Login</TAuthButton>
                            <TAuthButton authType='LOGOUT' className="auth-btn">Logout</TAuthButton>
                            <TRegisterButton className='reg-btn' />
                        </Stack>
                    </Card>
                </Box>

                <Box className="images">
                    <Box className="img1-wrapper">
                        <img className='img1' src="/src/assets/images/t6hero1.png" alt="" />
                    </Box>
                    <Box className="images-group">
                        <Box className="img2-wrapper">
                            <img className='img2' src="/src/assets/images/t6hero2.png" alt="" />
                        </Box>
                        <Box className="img3-wrapper">
                            <img className='img3' src="/src/assets/images/t6hero3.png" alt="" />
                        </Box>

                    </Box>
                </Box>

            </Box>

            <Box className="img-group2 main">


                <Box className="img-group2-wrapper">
                    <img src="/src/assets/images/t6hero4.png" alt="" />
                </Box>

                <Box className="img-group2-wrapper">
                    <img src="/src/assets/images/t6hero5.png" alt="" />
                </Box>

                <Box className="img-group2-wrapper">
                    <img src="/src/assets/images/t6hero6.png" alt="" />
                </Box>

                <Box className="img-group2-wrapper">
                    <img src="/src/assets/images/t6hero7.png" alt="" />
                </Box>

            </Box>

        </Box>
    )
}

export default T6heroSection


