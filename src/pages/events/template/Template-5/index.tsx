import './template5.scss'
import TRegisterButton from "../_components/TRegisterButton/TRegisterButton"
import TAuthButton from "../_components/TAuthButton/TAuthButton"
import { Avatar, Box } from "@mui/material"
import HeroSection from "./HeroSection5"
import Nav5 from './Nav5'
import { CalendarEventIcon } from '@/assets/svg'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AboutSection5 from './AboutSection5'
import TEventTimer from '../_components/TEventTimer/TEventTimer'
import Grid from "@mui/material/Grid2";
import TEventSpeakers from '../_components/TEventSpeakers/TEventSpeakers'


const Template5 = () => {
    return (
        <Box className="w-full template5">

            <HeroSection>
                <Nav5 />
                <Box className="date__container">
                    <Box className="date__container__card">
                        <Avatar className='date__container__card__icon'>
                            <CalendarEventIcon />
                        </Avatar>
                        <Box className="date__container__card__content">
                            <p className='date__container__card__content__title'>Date</p>
                            <p className='date__container__card__content__date'>September 15-17, 2025</p>
                        </Box>
                    </Box>
                </Box>

                <Box className="hero-content">
                    <p className='hero-content__title'>Advancing Healthcare: Medical Innovations & Research Conference 2024</p>
                    <Box className="hero-content__buttons">
                        <TAuthButton authType='LOGIN' className="hero-content__buttons__login">Login</TAuthButton>
                        <TRegisterButton className='hero-content__buttons__register' />
                    </Box>
                </Box>
                <Box className="venue__container">
                    <Box className="venue__container__card">
                        <Avatar className='venue__container__card__icon'>
                            <PlaceOutlinedIcon />
                        </Avatar>
                        <Box className="venue__container__card__content">
                            <p className='venue__container__card__content__title'>Location</p>
                            <p className='venue__container__card__content__date'>September 15-17, 2025</p>
                        </Box>
                    </Box>
                </Box>

            </HeroSection>

            <AboutSection5 />

            <Box className="timer-section main">
                <p className='timer-section__title'>Time Remaining</p>
                <TEventTimer className='timer-section__timer' />
            </Box>


            <Box className="speakers-section main">
                <h2 className='speakers-section__title'>Meet Our Esteemed Speakers</h2>

                <Grid className="speakers-section__container" container justifyContent={"center"} columnSpacing={4} rowSpacing={6}>
                    <TEventSpeakers ItemWrapper={({ children }) => <Grid className='speakers-section__container__item' size={3}>
                        {children}
                    </Grid>
                    } />
                </Grid>
            </Box>


            <Box className="programs-section">
                <p className='programs-section__title'>Conference Program Schedule</p>
            </Box>




            {/* <Grid container columnSpacing={2} rowSpacing={2} >
                <Grid id="SPEAKERS" container marginInline={"auto"} size={11}>
               
            </Grid>

            <TProgram>
                {(props: any) => {
                    return (
                     <></>
                   )
                }}
            </TProgram>  */}

        </Box >
    )
}

export default Template5;






