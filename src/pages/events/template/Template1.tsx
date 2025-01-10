/**
 * Component handles the first template
 */
import Grid from '@mui/material/Grid2';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AboutSection from './AboutSection';
import EventContributorsSection from './EventContributorsSection';
import FooterSection from './FooterSection';
import TicketingSection from './TicketingSection';
import LocationSection from './LocationSection';
import RegisterBannerSection from './RegisterBannerSection';
import TopMenuSection from './TopMenuSection';
import TitleSection from './TitleSection';
import Temp1PhotoIcon from '@/assets/png/template1-photo.png';
import { formatDateRange, groupByDate, toTitleCase, truncateString } from '@/Utils/CommonBaseClass';
import LocationIcon from '@/assets/svg/template1-location.svg';
import CalendarIcon from '@/assets/svg/template1-calendar.svg';
import EmailIcon from '@/assets/svg/template1-email.svg';
import PhoneIcon from '@/assets/svg/template1-phone.svg';
import LinkIcon from '@/assets/svg/template1-url.svg';
import { Box, Button,Typography } from '@mui/material';
import moment from 'moment';
import TimeComponent from './TimeComponent';
import TitleComponent from './TitleComponent';
import DescriptionComponent from './DescriptionComponent';
import CustomButton from '@/components/CustomButton/CustomButton';
import ClockIcon from '@/assets/svg/template1-clock-white.svg';


type TemplateViewProps = {
    data: any;
}


const Template1: React.FC<TemplateViewProps> = React.memo(({ data }) => {

    const aboutRef = useRef(null);
    const contributorsRef = useRef(null);
    const programRef = useRef(null);
    const tierRef = useRef(null);
    const LocationRef = useRef(null);
    const [copied, setCopied] = useState(false);

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
    } else {
        itemArray.push({ icon: <PhoneIcon />, label: "Phone", value: data?.eventContacts[0]?.phone || "" });
    }

    const CopyUrl = data?.venue?.mapUrl

    /**
    * Method to copy the URL to clipboard
    */
    const copyToClipboard = () => {
        const url = data?.venue?.mapUrl;
        if (url) {
            navigator.clipboard.writeText(url).then(() => {
                setCopied(true); // Indicate that the URL was copied
                setTimeout(() => setCopied(false), 3000); // Reset copied state after 2 seconds
            });
        }
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

    const [selectedDate, setSelectedDate] = useState<string>('');
    
    // Group and sort `programs` and `addons` by date
    const groupedPrograms = useMemo(() => groupByDate(data.programs), [data.programs]);
    const groupedAddons = useMemo(() => groupByDate(data.addons), [data.addons]);
    
    // Combine and sort programs and addons for the selected date
    const combinedAndSortedItems = useMemo(() => {
      const programs = groupedPrograms[selectedDate] || [];
      const addons = groupedAddons[selectedDate] || [];
    
      // Add type to distinguish between programs and addons
      const combined = [
        ...programs?.map((program:any) => ({ ...program, type: 'program' })),
        ...addons?.map((addon:any) => ({ ...addon, type: 'addon' })),
      ];
    
      // Sort by start time
      return combined?.sort((a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf());
    }, [groupedPrograms, groupedAddons, selectedDate]);
    
    // Set default selected date
    useEffect(() => {
      const firstDate = Object.keys(groupedPrograms)[0];
      if (firstDate) {
        setSelectedDate(firstDate);
      }
    }, [groupedPrograms]);
    
    const handleTabChange = (_event: React.MouseEvent<Element>, newValue: string) => {
      setSelectedDate(newValue);
    };
    
    
    const classPrefix = 'event-template-template1';

    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-bg`}>
        <Grid container size={{ xs: 12, sm: 12 }} className={classPrefix}>
            <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-header`}>
                {/* Top menu section */}
                <TopMenuSection classPrefix={`${classPrefix}-top-menu`} data={data} onScrollToProgram={() => handleScrollTo(programRef)} onScrollToAbout={() => handleScrollTo(aboutRef)} onScrollToContributors={() => handleScrollTo(contributorsRef)} onScrollToLocation={() => handleScrollTo(LocationRef)} />
                <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} direction={'row'}>
                    {/* Title section */}
                    <Grid container className={`${classPrefix}-title-container`} size={{ xs: 12, sm: 6 }} alignItems={'center'}>
                        <Grid container direction={'column'} alignItems={'flex-start'} className={`${classPrefix}-title`}>
                            <TitleSection onScrollToTier={() => handleScrollTo(tierRef)} classPrefix={`${classPrefix}-title`} data={data} />
                        </Grid>
                    </Grid>
                    <Grid className={`${classPrefix}-header-photo-container`} size={{ xs: 12, sm: 6 }}><img src={Temp1PhotoIcon} alt="Template 1 Photo" /></Grid>
                    {/* Details section */}
                    <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-details-container`}>
                        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-details`} justifyContent={'center'} alignItems={'center'}>
                            <Grid size={{ xs: 12, sm: 12 }} container className={`${classPrefix}-details-item`} spacing={1}>
                                {
                                    itemArray?.map((item: any, index: number) => {
                                        return <Grid className={
                                            index === 2
                                                ? `${classPrefix}-details-index-box`
                                                : `${classPrefix}-details-box`
                                        } container size={{ xs: 12, sm: 12, md: 6, lg:3   }} direction={'column'} justifyContent={'flex-start'} alignItems={'flex-start'} columnGap={"2rem"}>
                                            <Grid className={
                                                index === 2
                                                    ? `${classPrefix}-details-index-icon`
                                                    : `${classPrefix}-details-icon`
                                            }>{item.icon} </Grid>
                                            <Grid><Typography className={`${classPrefix}-details-label`}>{item.label}</Typography></Grid>
                                            <Grid><Typography className={`${classPrefix}-details-value`} textAlign={'left'}> {truncateString(toTitleCase(item.value), 35, "Untitled")}
                                            </Typography></Grid>
                                            {index === 0 ? (<Grid className={`${classPrefix}-details-border-line`} />) : null}
                                        </Grid>
                                    })

                                }
                                {CopyUrl && data.eventClass !== 'OFFLINE' && (
                                    <Grid container size={{ xs: 1 }} justifyContent="center" direction="column" >
                                        <Button onClick={copyToClipboard} variant="outlined" color="primary">
                                            {copied ? "Copied!" : "Copy URL"}
                                        </Button>
                                    </Grid>
                                )}

                            </Grid>
                        </Grid></Grid>

                </Grid>
            </Grid>
        </Grid>



        {/* About section */}
        <AboutSection classPrefix={`${classPrefix}-about`} data={data} ref={aboutRef} />
        {/* Event Contributors section */}
        {(data?.eventSpeakers?.length > 0) && <EventContributorsSection classPrefix={`${classPrefix}-event-contributors`} data={data?.eventSpeakers} ref={contributorsRef} />}
        {/* Program section */}
        <Grid container size={{ xs: 12, sm: 12 }} spacing={2} mb={10} ref={programRef}>
          <Grid size={{xs:12}} justifyContent={'center'} mt={{xs:2,sm:4}}><Typography className={`${classPrefix}-program-schedule-heading`}>Conference Program Schedule</Typography></Grid>
          <Grid container size={{xs:12}} justifyContent={'center'} alignItems="center" mb={{xs:2,sm:3}}>
            <Box className={`${classPrefix}-program-schedule-date`}>Event Start Date : {moment(data?.startTime)?.format('DD, MM, YYYY')}</Box>
          </Grid>
          <Grid className={`${classPrefix}-program-tabs-container`}>
            <Box className={`${classPrefix}-program-tabs-box`}>
              <Grid className={`${classPrefix}-program-tabs-list`} size={{ xs: 12, sm: 12 }}>
                {Object.keys(groupedPrograms)?.map((date, index) => (
                  <CustomButton
                    key={index}
                    onClick={(event) => handleTabChange(event, date)}
                    className={`${classPrefix}-program-tabs-tab ${selectedDate === date ? `${classPrefix}-program-tabs-tab-active` : ``}`}
                    label={` Day ${index + 1}`}
                  />
                ))}
              </Grid>
            </Box>
          </Grid>
          <Grid container spacing={3} className={`${classPrefix}-program-content-container`} mt={2} direction="column" alignContent={'center'} size={{ xs: 12, sm: 12 }}>
            {combinedAndSortedItems?.map((item: any, index: number) => (
              <Grid size={{ xs: 11 }} justifyContent={'center'}  pl={{xs:2,md:4}} p={2} key={index} 
                className={`${classPrefix}-program-content-item ${item?.type === 'program' ? `${classPrefix}-program-content-item-program` : `${classPrefix}-program-content-item-addon`}`}
              >
                <Grid container alignItems="center" spacing={3}>
                  {/* Time Block */}
                  <Grid size={{ xs: 2 }} container direction="row" alignItems="center" justifyContent="start" className={`${classPrefix}-program-content-time`} >
                    <Grid size={{ xs: 2 }}>
                      <ClockIcon className={`${classPrefix}-program-content-time-icon`} />
                    </Grid>
                    <Grid size={{ xs: 10 }}>
                      <TimeComponent
                        startTime={item?.startTime}
                        endTime={item?.endTime}
                        classPrefix={`${classPrefix}-program-content-time-value`}
                      />
                    </Grid>
                  </Grid>
                  {/* Content Block */}
                  <Grid size={{ xs: 9 }} className={`${classPrefix}-program-content-details-${item.type === 'program' ? 'program' : 'addon'}`}>
                    <TitleComponent
                      title={item?.type === 'program' ? item?.name : item?.addon?.name}
                      classPrefix={`${classPrefix}-program-content-title`}
                    />
                    <DescriptionComponent
                      description={item?.description}
                      classPrefix={`${classPrefix}-program-content-description`}
                    />
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
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
        {(data?.eventPriceTiers?.length > 0) && <TicketingSection ref={tierRef} classPrefix={`${classPrefix}-ticketing`} data={data} />}
        {/* Register Banner section */}
        {(data?.venue) &&
            <RegisterBannerSection
                classPrefix={`${classPrefix}-register-banner`}
                data={data}
                onScrollToTier={() => handleScrollTo(tierRef)}
            />
        }
        {/* Footer section */}
        <FooterSection classPrefix={`${classPrefix}-footer`} data={data} />
    </Grid>
});

export default Template1;
