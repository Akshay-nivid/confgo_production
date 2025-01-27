/**
 * Component handles the second template
 */
import Grid from '@mui/material/Grid2';
import React, { useRef, useState } from 'react';
import AboutSection from './AboutSection';
import ProgramSection from './ProgramSection';
import EventContributorsSection from './EventContributorsSection';
import FooterSection from './FooterSection';
import TicketingSection from './TicketingSection';
import LocationSection from './LocationSection';
import RegisterBannerSection from './RegisterBannerSection';
import TopMenuSection from './TopMenuSection';
import { formatDateRange, getLocalTimeDate, toTitleCase, truncateString } from '@/Utils/CommonBaseClass';
import LocationIcon from '@/assets/svg/template1-location.svg';
import CalendarIcon from '@/assets/svg/template1-calendar.svg';
import EmailIcon from '@/assets/svg/template1-email.svg';
import LinkIcon from '@/assets/svg/template1-url.svg';
import { Box, Typography } from '@mui/material';
import TitleSection from './TitleSection';
import TimerCounterComp from './TemplateTimer/TimerCounterComp';
import SponsorShip from './sponsorShipForm/SponsorShip';



type TemplateViewProps = {
    data: any;
}


const Template2: React.FC<TemplateViewProps> = React.memo(({ data }) => {
    const aboutRef = useRef(null);
    const contributorsRef = useRef(null);
    const programRef = useRef(null);
    const tierRef = useRef(null);
    const LocationRef = useRef(null);
    // const [copied, setCopied] = useState(false);
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

    //Create item array dynamically based on Event Class
    const itemArray = [];
    if (data?.eventClass === "ONLINE") {
        itemArray.push({ icon: <LinkIcon />, label: "Website link", value: data?.url || "" });
    } else {
        itemArray.push({ icon: <LocationIcon />, label: "Location", value: data?.venue?.address || "" });
    }
    itemArray.push({
        icon: <CalendarIcon />,
        label: "Date",
        value: formatDateRange(data?.startTime, data?.endTime),
    });
    itemArray.push({ icon: <EmailIcon />, label: "Email", value: data?.eventContacts[0]?.email || "" });
    if (data?.eventClass === "HYBRID") {
        itemArray.push({ icon: <LinkIcon />, label: "Website link", value: data?.url || "" });
     }
     // else {
    //     itemArray.push({ icon: <PhoneIcon />, label: "Phone", value: data?.eventContacts[0]?.phone || "" });
    // }

    // const CopyUrl = data?.venue?.mapUrl

    /**
    * Method to copy the URL to clipboard
    */
    // const copyToClipboard = () => {
    //     const url = data?.venue?.mapUrl;
    //     if (url) {
    //         navigator.clipboard.writeText(url).then(() => {
    //             setCopied(true); // Indicate that the URL was copied
    //             setTimeout(() => setCopied(false), 3000); // Reset copied state after 2 seconds
    //         });
    //     }
    // };
    /**
     * Method handles the scroll functionality based on click event
     * @param ref : event reference
     */
    const handleScrollTo = (ref: any) => {
        if (ref?.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const classPrefix = 'event-template-template2';


    return <Grid container size={{ xs: 12, sm: 12 }}>
        <Grid container size={{ xs: 12, sm: 12 }} className={classPrefix}>
            <Grid  container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-header`}>
                {/* Top menu section */}
                <TopMenuSection  classPrefix={`${classPrefix}-top-menu`} data={data} onScrollToProgram={() => handleScrollTo(programRef)} onScrollToAbout={() => handleScrollTo(aboutRef)} onScrollToContributors={() => handleScrollTo(contributorsRef)} onScrollToLocation={() => handleScrollTo(LocationRef)} />
                <Grid  container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} direction={'row'}>
                  
                    <Grid   container className={`${classPrefix}-title-container`} size={{ xs: 12, sm: 6,lg:12 }} >
                        <Grid  container direction={'column'} alignItems={'center'}  className={`${classPrefix}-title`}>
                            <TitleSection onScrollToTier={() => handleScrollTo(tierRef)} classPrefix={`${classPrefix}-title`} data={data} />
                        </Grid>
                    </Grid> 
                    {/* Details section */}
                    <Grid  container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-details-container`}>
                        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-details`} justifyContent={'center'} alignItems={'center'}>
                            <Grid size={{ xs: 12, sm: 12 }} container className={`${classPrefix}-details-item`} spacing={1}  justifyContent={'center'} alignItems={'center'}>
                                {
                                    itemArray?.map((item: any) => {
                                        return <Grid  className={
                                                 `${classPrefix}-details-index-box`
                                        } container size={{ xs: 12, sm: 3 }} direction={'column'} justifyContent={'center'} alignItems={'center'} columnGap={"2rem"}>
                                            <Grid  className={
                                                    `${classPrefix}-details-icon`
                                            }>{item.icon} </Grid>
                                            <Grid><Typography className={`${classPrefix}-details-label`}>{item.label}</Typography></Grid>
                                            <Grid><Typography className={`${classPrefix}-details-value`} textAlign={'left'} title={toTitleCase(item.value)}> {truncateString(toTitleCase(item.value), 25, "Untitled")}
                                            </Typography></Grid>
                
                                        </Grid>
                                    })

                                }
                                {/* {CopyUrl && data.eventClass !== 'OFFLINE' && (
                                    <Grid container size={{ xs: 1 }} justifyContent="center" direction="column" >
                                        <Button onClick={copyToClipboard} variant="outlined" color="primary">
                                            {copied ? "Copied!" : "Copy URL"}
                                        </Button>
                                    </Grid>
                                )} */}

                            </Grid>
                        </Grid></Grid>

                </Grid>
            </Grid>
        </Grid>
        {/*Event Count down  */}
        <Grid className="template1-countdown" spacing={2} container justifyContent={"center"} >
        <Grid className="template1-countdown-container" size={12} justifyContent={"center"} spacing={2}>
          <TimerCounterComp
            targetDate={getLocalTimeDate(data.startTime, 'YYYY-MM-DD HH:mm:ss')}
            onTimeUpdate={handleTimeUpdate}
          >
            <Typography textAlign={"center"} className='template2-countdown-headerText'>Time Remaining</Typography>
            <Grid container size={12} justifyContent="center" alignItems="center" direction="row" display={"flex"}>
              <Grid size={2} />
              <Grid size={2}>
                <Box display="flex" flexDirection="row" alignItems="baseline" justifyContent="center" className="template2-countdown-timerTypo">
                  <Typography textAlign={"center"} variant="h4" className='template2-countdown-timerDigit'>{day}</Typography>
                  <Typography textAlign={"center"}>Days</Typography>
                </Box>
              </Grid>
              <Grid size={2}>
                <Box display="flex" flexDirection="row" alignItems="baseline" justifyContent="center" className="template2-countdown-timerTypo">
                  <Typography variant="h4" className='template2-countdown-timerDigit'>{hour}</Typography>
                  <Typography>Hours</Typography>
                </Box>
              </Grid>
              <Grid size={2}>
                <Box display="flex" flexDirection="row" alignItems="baseline" justifyContent="center" className="template2-countdown-timerTypo">
                  <Typography variant="h4" className='template2-countdown-timerDigit'>{minute}</Typography>
                  <Typography>Minutes</Typography>
                </Box>
              </Grid>
              <Grid size={2}>
                <Box display="flex" flexDirection="row" alignItems="baseline" justifyContent="center" className="template2-countdown-timerTypo">
                  <Typography variant="h4" className='template2-countdown-timerDigit'>{second}</Typography>
                  <Typography>Seconds</Typography>
                </Box>
              </Grid>
            </Grid>
          </TimerCounterComp>
        </Grid>
      </Grid>
        {/* About section */}
        <AboutSection classPrefix={`${classPrefix}-about`} data={data} ref={aboutRef} />
        {/* Event Contributors section */}
        {(data?.eventSpeakers?.length > 0) && <EventContributorsSection classPrefix={`${classPrefix}-event-contributors`} data={data?.eventSpeakers} ref={contributorsRef} />}
        {/* Program section */}
        <ProgramSection classPrefix={`${classPrefix}-program`} data={data} ref={programRef} />
        {
            (data?.venue) ? (
                <LocationSection
                    classPrefix={`${classPrefix}-location`}
                    data={data}
                    onScrollToTier={LocationRef}
                />
            ) : (
                <RegisterBannerSection
                    classPrefix={`${classPrefix}-register-banner`}
                    data={data}
                    onScrollToTier={() => handleScrollTo(tierRef)}
                />
            )
        }
        {/* Ticketing section */}
        {(data?.eventPriceTiers?.length > 0) && <TicketingSection ref={tierRef} classPrefix={`${classPrefix}-ticketing`}  data={data} />}
        {/* Register Banner section */}
        {(data?.venue) &&
            <RegisterBannerSection
                classPrefix={`${classPrefix}-register-banner`}
                data={data}
                onScrollToTier={() => handleScrollTo(tierRef)}
            />
        }
        {/* Sponsor */}
        <Grid  minHeight={"max-content"} size={12} container>
        <SponsorShip eventId={data?.id}/>
        </Grid>
        {/* Footer section */}
        <FooterSection classPrefix={`${classPrefix}-footer`} data={data} />
    </Grid>
});

export default Template2;
