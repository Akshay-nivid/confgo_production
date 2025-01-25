import React, { useRef, useState } from 'react'
import Grid from '@mui/material/Grid2';
import TopMenuHeader, { LinkData } from './TopMenuHeader';
import AuthFormHandler from './AuthFormHandler';
import TEventDetails from './TEventDetails';
import TimerCounterComp from '../template/TemplateTimer/TimerCounterComp';
import { getLocalTimeDate } from '@/Utils/CommonBaseClass';
import { Typography } from '@mui/material';
import LocationSection from '../template/LocationSection';
import FooterSection from '../template/FooterSection';

type TemplateViewProps = {
    data: any;
}

/**
 * Template 
 */
const Template4: React.FC<TemplateViewProps> = React.memo(({ data }) => {
    const classPrefix = 'event-template-template4';
    const aboutRef = useRef(null);
    const contributorsRef = useRef(null);
    const programRef = useRef(null);
    const LocationRef = useRef(null);

    const [day, setDay] = useState<string>('');
    const [hour, setHour] = useState<string>('');
    const [minute, setMinute] = useState<string>('');
    const [second, setSecond] = useState<string>('');

    // Callback function to receive the updated time values from TimerCounterComp
    const handleTimeUpdate = (day: string, hour: string, minute: string, second: string) => {
        setDay(day);
        setHour(hour);
        setMinute(minute);
        setSecond(second);
    };
    /**
        * Method handles the scroll functionality based on click event
        * @param ref : event reference
        */
    const handleScrollTo = (ref: any) => {
        if (ref?.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const headerLinks: LinkData[] = [
        { text: "Speakers" },
        { text: "Sponsers" },
        { text: "Programmes" },
        { text: "Location" }
    ];
    return (
        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-bg`}>
            <Grid container size={{ xs: 12, sm: 12 }} className={classPrefix}>
                <TopMenuHeader links={headerLinks} classPrefix={`${classPrefix}-top-menu`} data={data} onScrollToProgram={() => handleScrollTo(programRef)} onScrollToAbout={() => handleScrollTo(aboutRef)} onScrollToContributors={() => handleScrollTo(contributorsRef)} onScrollToLocation={() => handleScrollTo(LocationRef)} />
                <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-header`} />
                <AuthFormHandler className={`${classPrefix}-headerBottom`} data={data} />
                <TEventDetails className={`${classPrefix}-eventDetails`} data={data} />
                <Grid className="template4-countdown" container justifyContent={"center"} >
                    <Grid className="template4-countdown-container" size={12} justifyContent={"center"} >
                        <TimerCounterComp
                            targetDate={getLocalTimeDate(data.startTime, 'YYYY-MM-DD HH:mm:ss')}
                            onTimeUpdate={handleTimeUpdate}
                        >
                            <Typography textAlign={"center"} className='template4-countdown-headerText'>Time Remaining</Typography>
                            <Grid container size={12} justifyContent="center" alignItems="center" direction="row" display={"flex"}>
                                <Grid>
                                    <Grid display="flex" flexDirection="row" alignItems="baseline" justifyContent="center" className="template4-countdown-timerTypo">
                                        <Typography textAlign={"center"} variant="h4" className='template4-countdown-timerDigit'>{day}</Typography>
                                        <Typography textAlign={"center"} className='template4-countdown-timerText'>Days</Typography>
                                    </Grid>
                                </Grid>
                                <Grid>
                                    <Grid display="flex" flexDirection="row" alignItems="baseline" justifyContent="center" className="template4-countdown-timerTypo">
                                        <Typography variant="h4" className='template4-countdown-timerDigit'>{hour}</Typography>
                                        <Typography className='template4-countdown-timerText'>Hours</Typography>
                                    </Grid>
                                </Grid>
                                <Grid>
                                    <Grid display="flex" flexDirection="row" alignItems="baseline" justifyContent="center" className="template4-countdown-timerTypo">
                                        <Typography variant="h4" className='template4-countdown-timerDigit'>{minute}</Typography>
                                        <Typography className='template4-countdown-timerText'>Minutes</Typography>
                                    </Grid>
                                </Grid>
                                <Grid>
                                    <Grid display="flex" flexDirection="row" alignItems="baseline" justifyContent="center" className="template4-countdown-timerTypo">
                                        <Typography variant="h4" className='template4-countdown-timerDigit'>{second}</Typography>
                                        <Typography className='template4-countdown-timerText'>Seconds</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </TimerCounterComp>
                    </Grid>
                </Grid>
                <LocationSection classPrefix={`${classPrefix}-location`}data={data} onScrollToTier={LocationRef}/>
                <FooterSection classPrefix={`${classPrefix}-footer`} data={data} />
            </Grid>
        </Grid>
    )
})

export default Template4;
