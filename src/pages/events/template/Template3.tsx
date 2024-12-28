/**
 * Component handles the three template
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
import TitleSection from './TitleSection';
import { formatDateRange, toTitleCase, truncateString } from '@/Utils/CommonBaseClass';
import LocationIcon from '@/assets/svg/template1-location.svg';
import CalendarIcon from '@/assets/svg/template1-calendar.svg';
import EmailIcon from '@/assets/svg/template1-email.svg';
import PhoneIcon from '@/assets/svg/template1-phone.svg';
import LinkIcon from '@/assets/svg/template1-url.svg';
import { Button, Typography } from '@mui/material';
import Temp3PhotoIcon from '@/assets/png/template3-photo.png';
import CustomTooltip from '@/components/CustomToolTip/CustomTooltip';

type TemplateViewProps = {
    data: any;
}


const Template3: React.FC<TemplateViewProps> = React.memo(({ data }) => {

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

    const classPrefix = 'event-template-template3';




    const updatedTemp = data.templateId ?? 3;
    return <Grid container size={{ xs: 12, sm: 12 }}>
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
                    <Grid className={`${classPrefix}-header-photo-container`} size={{ xs: 12, sm: 6 }}><img src={Temp3PhotoIcon} alt="Template 1 Photo" /></Grid>
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
                                        } container size={{ xs: 12, sm: 3 }} direction={'column'} justifyContent={'flex-start'} alignItems={'flex-start'} columnGap={"2rem"}>
                                            <Grid className={
                                                index === 2
                                                    ? `${classPrefix}-details-index-icon`
                                                    : `${classPrefix}-details-icon`
                                            }>{item.icon} </Grid>
                                            <Grid><Typography className={`${classPrefix}-details-label`}>{item.label}</Typography></Grid>
                                            <Grid> <CustomTooltip title={item.value}><Typography className={`${classPrefix}-details-value`} textAlign={'left'}> {truncateString(toTitleCase(item.value), 35, "Untitled")}
                                            </Typography></CustomTooltip></Grid>
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

export default Template3;
