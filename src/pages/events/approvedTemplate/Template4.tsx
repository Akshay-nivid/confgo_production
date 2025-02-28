import React, { useEffect, useMemo, useRef, useState } from 'react'
import Grid from '@mui/material/Grid2';
import TopMenuHeader, { LinkData } from './TopMenuHeader';
import AuthFormHandler from './AuthFormHandler';
import TEventDetails from './TEventDetails';
import TimerCounterComp from '../template/TemplateTimer/TimerCounterComp';
import { getLocalTimeDate, groupByDate, toTitleCase, truncateString } from '@/Utils/CommonBaseClass';
import { Avatar, Box, Divider, Typography } from '@mui/material';
import LocationSection from '../template/LocationSection';
import FooterSection from '../template/FooterSection';
import moment from 'moment';
import DescriptionComponent from '../template/DescriptionComponent';
import TitleComponent from '../template/TitleComponent';

import { TemplateBlackClockIcon, TemplateGrayClockIcon, TemplatePriceBlackIcon, TemplatePriceGrayIcon } from '@/assets/svg';
import config from "../../../../config.json";
import TimeComponent from '../template/TimeComponent';
import { ProgramDetailsModal } from '../template/_components';
import CustomButton from '@/components/CustomButton/CustomButton';
import SpeakerDetailsModal from '../template/_components/SpeakerDetailsModal';
import ViewMoreLink from "../../../assets/svg/view-more.svg";
import { setDataById, setNonPersistedDataById, snackBar } from '@/Libs/store';
import routes from '@/router/routes';
import { useNavigate } from 'react-router-dom';
import SponsorShip from '../template/sponsorShipForm/SponsorShip';
import TempHall from "../../../assets/svg/temp-hall.svg";
import { personPlaceholder } from '@/assets/png';
import {YellowSeat, RedSeat} from '@/assets/svg/index';
import BannerSection from '@/pages/Micro-site/Templates/Template-components/Banner/Banner-section';

type TemplateViewProps = {
    data: any;
}

/**
 * Template 
 */
const Template4: React.FC<TemplateViewProps> = React.memo(({ data }) =>{

    const classPrefix = 'event-template-template4';
    const aboutRef = useRef(null);
    const contributorsRef = useRef(null);
    const programRef = useRef(null);
    const LocationRef = useRef(null);
    const tierRef = useRef(null);
    const sponsorRef = useRef(null);
    const beSponsorRef = useRef(null);
    const baseUrl = config.api.url;
    const [day, setDay] = useState<string>('');
    const [hour, setHour] = useState<string>('');
    const [minute, setMinute] = useState<string>('');
    const [second, setSecond] = useState<string>('');
    const navigate = useNavigate();
    const [timmer,setTimmer]=useState(false);

    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [apiLoading, setApiLoading] = useState(false);
    setDataById('companyTempId',{value:data?.companyId});

    /**
      * Callback function to receive the updated time values from TimerCounterComp
      * @param day,hour,minute,second
      */
    const handleTimeUpdate = (day: string, hour: string, minute: string, second: string) => {
        if(day==="0"){
            setTimmer(true);
        }
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
        ...(data?.eventSpeakers?.length > 0 && getUniqueSpeakers(data?.eventSpeakers)?.length > 0
            ? [{ text: "Speakers" }]
            : []),
        ...(data?.eventSponsors?.length > 0 && getUniqueSponsors(data?.eventSponsors)?.length > 0
            ? [{ text: "Sponsors" }]
            : []),
        { text: "Programs" },
        ...(data?.venue?.mapUrl ? [{ text: "Venue" }] : []),
    ];

    const [selectedDate, setSelectedDate] = useState<string>('');

    /**
    * Group and sort `programs` and `addons` by date
    */
    const groupedPrograms = useMemo(() => groupByDate(data.programs), [data.programs]);
    const groupedAddons = useMemo(() => groupByDate(data.addons), [data.addons]);
    /**
    * Combine and sort programs and addons for the selected date
    */


    const combinedAndSortedItems = useMemo(() => {
        const programs = groupedPrograms[selectedDate] || [];
        const addons = groupedAddons[selectedDate] || [];

        /**
         * Add type to distinguish between programs and addons
         */
        const combined = [
            ...programs?.map((program: any) => ({ ...program, type: 'program' })),
            ...addons?.map((addon: any) => ({ ...addon, type: 'addon' })),
        ];

        /**
         * Sort by start time
         */
        const sorted = combined.sort((a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf());

        /**
         * Group items by start time and add them to subItems
         */
        const grouped = sorted.reduce((acc: any[], item: any) => {
            const lastGroup = acc[acc.length - 1];

            if (lastGroup && moment(lastGroup.startTime).valueOf() === moment(item.startTime).valueOf()) {
                // If startTime matches, add item to lastGroup's subItems
                lastGroup.subItems.push(item);
            } else {
                // Otherwise, add the item as a new group and initialize subItems with the item itself
                acc.push({ ...item, subItems: [item] });
            }

            return acc;
        }, []);


        return grouped;
    }, [groupedPrograms, groupedAddons, selectedDate]);

    /**
    * Set default selected date
    */
    useEffect(() => {
        const firstDate = Object.keys(groupedPrograms)[0];
        if (firstDate) {
            setSelectedDate(firstDate);
        }
    }, [groupedPrograms]);
    /**
    * Program Tab date click handles
    * @param event, newValue
    */
    const handleTabChange = (_event: React.MouseEvent<Element>, newValue: string) => {
        setSelectedDate(newValue);
    };
    /** card click may need in future
    * Program Tab date click handles
    * @param event, newValue
    */
    function handleProgramCardClick(item: any) {
        setNonPersistedDataById('isProgramDetailsModelOpen', { value: true })
        setNonPersistedDataById('programDetails', { value: item })
    }
    let generalAddsOn = data?.addons?.filter((item: { startTime: any; endTime: any; }) => !item.startTime || !item.endTime);


    /**
  * Extracts unique speakers from a given list based on their `userId`.
  * 
  * @param {any[]} speakers - An array of speaker objects. Each object is expected to have a `userId` property.
  * @returns {any[]} An array of unique speaker objects, ensuring no duplicate `userId`s.
  * 
  * This function uses a Map to track speakers by their `userId`. 
  * It ensures that only one speaker per `userId` is included in the returned array.
  */
    function getUniqueSpeakers(speakers: any) {
        const uniqueSpeakersMap = new Map<number, any>();

        speakers.forEach((speaker: any) => {
            if (!uniqueSpeakersMap.has(speaker.userId)) {
                uniqueSpeakersMap.set(speaker.userId, speaker);
            }
        });

        return Array.from(uniqueSpeakersMap.values());
    }

    /**
  * Extracts unique sponsors from a given list based on their `sponsorId`.
  * 
  * @param {any[]} sponsors - An array of sponsor objects. Each object is expected to have a `sponsorId` property.
  * @returns {any[]} An array of unique sponsor objects, ensuring no duplicate `sponsorId`s.
  * 
  * This function uses a Map to track speakers by their `sponsorId`. 
  * It ensures that only one sponsor per `sponsorId` is included in the returned array.
  */
    function getUniqueSponsors(sponsors: any) {
        const uniqueSponsorsMap = new Map<number, any>();

        sponsors.forEach((sponsor: any) => {
            if (!uniqueSponsorsMap.has(sponsor.sponsorId)) {
                uniqueSponsorsMap.set(sponsor.sponsorId, sponsor);
            }
        });

        return Array.from(uniqueSponsorsMap.values());
    }

    function handleSpeakerCardClick(item: any) {

        setLoadingStates((prev) => ({ ...prev, [item.user?.assetId]: true }));
        setNonPersistedDataById('isSpeakerDetailsModelOpen', { value: true });
        setNonPersistedDataById('speakerDetails', { value: item });
    }
    
    useEffect(() => {
        if (!apiLoading) {
            setLoadingStates((prev) => {
                const newState = { ...prev };
                Object.keys(newState).forEach(key => newState[key] = false);
                return newState;
            });
        }
    }, [apiLoading]);
    
    /**
       * Method calculates the total amount
       * @param amountData : event data
       * @returns 
       */
    const calculateTotalAmount = (amountData: any) => {
        let totalAmount = 0;

        function traverse(node: any) {
            // If the current node has an 'amount', add it to the total
            if (node.amount) {
                totalAmount += parseFloat(node.amount) || 0;
            }

            // Recursively traverse through arrays or objects
            for (const key in node) {
                if (Array.isArray(node[key])) {
                    node[key].forEach(traverse);
                } else if (typeof node[key] === 'object' && node[key] !== null) {
                    traverse(node[key]);
                }
            }
        }

        // Start traversal from the root
        traverse(amountData);

        return totalAmount;
    }
    /**
     * Method groups the event price tiers array based on participant 
     * @param array : event price tiers array
     * @returns 
     */
    const groupByParticipantTypeId = (array: any) => {
        return array.reduce((result: any, item: any) => {
            // Use the participantTypeId as the key
            const key = item.participantType.name;

            // Initialize the group if it doesn't exist
            if (!result[key]) {
                result[key] = [];
            }

            // Add the item to the corresponding group
            result[key].push(item);

            return result;
        }, {});
    }

    /**
     * Method calculates the tier amount based on percentage and total amount
     * @param groupedData : grouped event price tiers array 
     * @param totalAmount : total amount
     * @returns 
     */
    const calculateAmounts = (groupedData: any, totalAmount: any) => {
        // Loop through each group
        Object.keys(groupedData).forEach((participantTypeId) => {
            groupedData[participantTypeId].forEach((item: any) => {
                // Convert percentage to a decimal and calculate the amount
                const percentage = 1 - (parseFloat(item.percentage) / 100);
                item.calculatedAmount = totalAmount * percentage;
            });
        });
        return groupedData;
    }


    /**
     * Method transforms the start date and end date to Nov 12, 2024 - Dec 12, 2024 format
     * @param startDate : start date
     * @param endDate : end date
     * @returns 
     */
    const formatDateRange = (startDate: any, endDate: any) => {

        const options: any = { year: 'numeric', month: 'short', day: 'numeric' };
        const start = new Date(startDate).toLocaleDateString('en-US', options);
        const end = new Date(endDate).toLocaleDateString('en-US', options);
        return `${start} - ${end}`;

    }

    /**
    * Handles the click event of the 'Register' button
    * by setting the participantTypeId in the store and navigating to the program selection page
    * @param {object} tierData - contains the participantTypeId and tierName
    */
    function handleClickRegister(tierData: any) {

        const userRole = sessionStorage.getItem('userRole')


        const userToken = sessionStorage.getItem('token')

        const startData = new Date(data?.startDate);


        const isEventEnded = startData < new Date()



        if (isEventEnded) {
            snackBar({ severity: 'error', message: "The event has ended." })
            return
        }





        // admin user is perevented from navigating to cart
        if (userToken && userRole !== 'USER') {
            snackBar({ severity: 'error', message: 'please login using participant credentials' })
            return
        }

        setDataById('participantTypeId', { value: tierData.participantTypeId });

        navigate(routes.programSelection())
    }



    const totalAmount = calculateTotalAmount(data);

    const amountCalculatedData = calculateAmounts(groupByParticipantTypeId(data?.eventPriceTiers), totalAmount);

    const sponsors = getUniqueSponsors(data?.eventSponsors)

    const isCompany = sessionStorage.getItem('userLoggedInType') === 'COMPANYADMIN'


    function groupSponsorsByCategory(sponsors: any) {

        const groupedSponsors = {
            "DIAMOND": [],
            "PLATINUM": [],
            "GOLD": [],
            "SILVER": [],
        } as any

        sponsors?.forEach((sponsor: any) => {

            groupedSponsors[sponsor?.sponsorType?.name]?.push(sponsor)
        })

        return groupedSponsors
    }


    const groupedSponsors = groupSponsorsByCategory(sponsors)

   
    /**
     * handle program details modal 
     * 
     */

    // function handleCloseModal() {
    //     setNonPersistedDataById("isProgramDetailsModelOpen", { value: false })
    //     setNonPersistedDataById('programDetails', { value: null })
    // }


    /**
    * Checks if the given `subItem` array contains at least one moderator.
    *
    * @param {any[]} subItem - The list of speakers to check.
    * @returns {boolean} - Returns `true` if at least one speaker is a moderator, otherwise `false`.
    */

    const hasModerator = (subItem: any): boolean => {
        return subItem?.some((speaker: any) => speaker?.speakerBios?.[0]?.isModerator) ?? false;
    };


    return (
        <Grid  container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-bg`}  >
            <Grid container size={{ xs: 12, sm: 12 }} className={classPrefix}>
                <TopMenuHeader links={headerLinks} classPrefix={`${classPrefix}-top-menu`} data={data} onScrollToProgram={() => handleScrollTo(programRef)} onScrollToAbout={() => handleScrollTo(aboutRef)} onScrollToContributors={() => handleScrollTo(contributorsRef)} onScrollToLocation={() => handleScrollTo(LocationRef)} onScrollToBeSponsor={() => handleScrollTo(beSponsorRef)} onScrollToSponsor={() => handleScrollTo(sponsorRef)} />
                <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-header`} />
                <AuthFormHandler className={`${classPrefix}-headerBottom`} data={data} onScrollToTier={() => handleScrollTo(tierRef)} />
                <TEventDetails className={`${classPrefix}-eventDetails`} data={data} />
                <Grid className="template4-countdown" container justifyContent={"center"}>
                    <Grid className="template4-countdown-container" size={12} justifyContent={"center"} >
                       {!timmer&&
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
                        }
                    </Grid>
                </Grid>
                {/* Speaker section starts here  */}
                {data?.eventSpeakers?.length > 0 && getUniqueSpeakers(data?.eventSpeakers)?.length > 0 && <Grid id={'Contributors'} container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-event-contributors `} spacing={1} direction={'column'} justifyContent={'center'} alignItems={'center'} ref={contributorsRef}>
                    <SpeakerDetailsModal onApiLoadingChange={setApiLoading} />
                    <Grid className={`${classPrefix}-event-contributors-title`}>Meet Our Esteemed Speakers</Grid>
                    <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-event-contributors-item-group-container`} justifyContent={'flex-start'} alignItems={'center'} spacing={4}>
                        {data?.eventSpeakers?.length > 0 && getUniqueSpeakers(data?.eventSpeakers)?.map((item: any) => {
                            return <Grid alignSelf={'stretch'} onClick={() => handleSpeakerCardClick(item)} size={{ xs: 12, sm: 3 }} container direction={'row'} className={`${classPrefix}-event-contributors-item-container `} spacing={2}>
                                <Grid size={{ xs: 12, sm: 12 }} container direction={'column'} className={`${classPrefix}-event-contributors-item-container-speaker-card `}>
                                    <Grid overflow={'hidden'} className={`${classPrefix}-event-contributors-item-container-images`}>
                                        {item?.user?.assetId ? (<img
                                           className="max-h-[16.7rem]"
                                            src={`${baseUrl}asset/${item?.user?.assetId}`}
                                            alt={item.name}
                                        />) : (
                                            <img alt={item.name} src={personPlaceholder} className={`max-h-[16.2rem]`} />
                                        )}

                                    </Grid>
                                    <Grid container direction={'column'} >
                                        <Grid className={`${classPrefix}-event-contributors-item-name`}>{`${item.user?.firstName} ${item.user?.lastName}`}</Grid>
                                        {item.user?.designation && <Grid className={`${classPrefix}-event-contributors-item-designation`} title={item.user?.designation}>{truncateString(item.user?.designation, 30)}</Grid>}
                                        <Grid className={`${classPrefix}-event-contributors-item-view-more`} ><CustomButton
                                            isLoading={loadingStates[item.user?.assetId] || false}
                                            label={'View more'}
                                            className={`${classPrefix}-event-contributors-item-view-more-button`}
                                            onClick={handleSpeakerCardClick}
                                            endIcon={<ViewMoreLink />}
                                        /></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        })}
                    </Grid>
                </Grid>}

                {/* Speaker section ends here  */}
                {/* Program section starts here */}
                <Grid id={"Program"} container size={{ xs: 12, sm: 12 }} spacing={2} mb={5} ref={programRef}>
                    <Grid size={{ xs: 12 }} justifyContent={'center'} mt={{ xs: 2, sm: 4 }}><Typography className={`${classPrefix}-program-schedule-heading`}>Conference Program Schedule</Typography></Grid>
                    {/* <Grid container size={{xs:12}} justifyContent={'center'} alignItems="center" mb={{xs:2,sm:3}}>
            <Box className={`${classPrefix}-program-schedule-date`}>Event Start Date : {moment(data?.startTime)?.format('DD, MM, YYYY')}</Box>
          </Grid> */}
                    <Grid className={`${classPrefix}-program-tabs-container`}>
                        {/* <Box className={`${classPrefix}-program-tabs-box`}> */}
                        <Grid className={`${classPrefix}-program-tabs-list`} size={{ xs: 12, sm: 12 }}>
                            {Object.keys(groupedPrograms)?.map((date, index) => (
                                <CustomButton
                                    key={index}
                                    onClick={(event) => handleTabChange(event, date)}
                                    className={`${classPrefix}-program-tabs-tab ${selectedDate === date ? `${classPrefix}-program-tabs-tab-active` : ``}`}
                                    label={` ${moment(date).format('MMM DD')}`}
                                />
                            ))}
                        </Grid>
                        {/* </Box> */}
                    </Grid>
                    <Grid container spacing={3} className={`${classPrefix}-program-content-container`} mt={2} direction="column" alignContent={'center'} size={{ xs: 12, sm: 12 }}>
                        {generalAddsOn?.map((item: any, index: number) => (
                            <Grid size={{ xs: 11 }} minHeight={"10rem"} onClick={() => handleProgramCardClick(item)} justifyContent={'center'} pl={{ xs: 2, md: 4 }} p={2} key={index}
                                className={`${classPrefix}-program-content-item ${item?.type === 'program' ? `${classPrefix}-program-content-item-program` : `${classPrefix}-program-content-item-addon`}`}
                            >
                                <Grid container alignItems="center" spacing={3}>
                                    <Grid size={{ xs: 9, lg: 6 }} className={`${classPrefix}-program-content-details-${item.type === 'program' ? 'program' : 'gerenarl-addon'}`}>
                                        <TitleComponent
                                            title={item?.type === 'program' ? item?.name : item?.addon?.name}
                                            classPrefix={`${classPrefix}-program-content-title`}
                                        />
                                        <DescriptionComponent
                                            description={item?.description}
                                            classPrefix={`${classPrefix}-program-content-description`}
                                        />
                                    </Grid>

                                    {item?.eventSponsors?.length > 0 && (

                                        <Grid size={5} className={`${classPrefix}-program-content-sponsor-generalAddon`}>

                                            <Grid container size={item?.eventSponsors?.length > 1 ? 12 : 11} justifyContent={"flex-end"}>
                                                {item?.eventSponsors?.length > 1 ? (
                                                    <Grid container size={4} className={`${classPrefix}-program-content-sponsor-heading`} justifyContent={"center"} >
                                                        <Typography >Sponsored by</Typography>
                                                    </Grid>

                                                ) :
                                                    <Grid container className={`${classPrefix}-program-content-sponsor-heading`}>
                                                        <Typography >Sponsored by</Typography>
                                                    </Grid>

                                                }

                                                <Grid container size={12} justifyContent={"flex-end"} spacing={2}>
                                                    {item?.eventSponsors?.map((sponsor: any) => (
                                                        <Grid container   >

                                                            {sponsor?.sponsor?.logoAssetId ? (
                                                                <img
                                                                    alt={sponsor?.sponsor?.name}
                                                                    src={`${baseUrl}asset/${sponsor?.sponsor?.logoAssetId}`}
                                                                />
                                                            ) : (
                                                                <Avatar
                                                                    alt={sponsor?.sponsor?.name}
                                                                    src=""
                                                                />
                                                            )}

                                                        </Grid>
                                                    ))}
                                                </Grid>

                                            </Grid>

                                        </Grid>
                                    )}
                                </Grid>

                                {/* two sponsers ingeneral  adon */}

                                {/* {item.eventSponsors.length > 1 && (
                                    <Grid size={12} >
                                        <Grid size={12} className={`${classPrefix}-program-content-sponsor-generalAddon`} container bgcolor={"red"} >
                                            <Grid className={`${classPrefix}-program-content-sponsor-heading`} size={12}  >
                                                <Typography>Sponsored by</Typography>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                {item.eventSponsors.map((sponsor: any) => (
                                                    <Grid>
                                                        {sponsor?.sponsor?.logoAssetId ? (

                                                            <img

                                                                alt={sponsor?.sponsor?.name}
                                                                src={`${baseUrl}asset/${sponsor?.sponsor?.logoAssetId}`}
                                                            />
                                                        ) : (

                                                            <Avatar
                                                                alt={sponsor?.sponsor?.name}
                                                                src=""
                                                            />
                                                        )}
                                                    </Grid>

                                                ))} </Grid>
                                        </Grid>

                                    </Grid>)} */}
                            </Grid>
                        ))}
                    </Grid>
                    <Grid container spacing={3} className={`${classPrefix}-program-content-container`} mt={2} direction="column" alignContent={'center'} size={{ xs: 12, sm: 12 }}>
                        {combinedAndSortedItems?.map((item: any, index: number) => (
                            <Grid size={{ xs: 11 }} justifyContent={'center'} pl={{ xs: 2, md: 4 }} p={2} key={index}
                                className={`${classPrefix}-program-content-item ${item?.type === 'program' ? `${classPrefix}-program-content-item-program` : `${classPrefix}-program-content-item-addon`}`}
                            >
                                <Grid container alignItems="center" size={12} >
                                    <Grid size={{ xs: 6, sm: 4, lg: 3 }} container direction="row" alignItems="center" justifyContent="start" className={`${classPrefix}-program-content-time`} >
                                         <Grid  className={`${classPrefix}-program-content-time${item?.type === 'program' ? "-divider-gray" : "-divider-black"}`} size={{ xs: 3, sm: 2, lg: 3 }} container justifyContent={"center"} display={"block"}>
                                            <Typography textAlign={"center"} className={`${classPrefix}-program-content-time-day`}>{getLocalTimeDate(item.startTime, 'ddd')}</Typography>
                                            <Typography textAlign={"center"} className={`${classPrefix}-program-content-time-num`}>{getLocalTimeDate(item.startTime, 'DD')}</Typography>
                                            
                                            {moment(item?.startTime).format('YYYY-MM-DD') !== moment(item?.endTime).format('YYYY-MM-DD') && (
                                               
                                               <TimeComponent
                                                    month={true}
                                                    startTime={item?.startTime}
                                                    endTime={item?.endTime}
                                                    classPrefix={`${classPrefix}-program-content-time-value`}
                                                />
                                            )}
                                         </Grid>
                                        <Grid >
                                            <Grid  container display={"flex"} alignItems={"center"} columnGap={1} rowGap={2} className={`${classPrefix}-program-content-time-icon`}>
                                                {item?.type === 'program' ? <TemplateGrayClockIcon /> : <TemplateBlackClockIcon />}
                                    
                                                <Typography  className={`${classPrefix}-program-content-time-value`}>
                                                    {moment(item?.startTime).format('hh:mm A')} - {moment(item?.endTime).format('hh:mm A')}
                                                </Typography>

                                            </Grid>
                                            <Grid container display={"flex"} alignItems={"center"} columnGap={1} className={`${classPrefix}-program-content-time-icon`}>
                                                {item?.type === 'program' ? <TemplatePriceGrayIcon /> : <TemplatePriceBlackIcon />}
                                                <Typography className={`${classPrefix}-program-content-time-value`}>{config?.currency}{item?.amount}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 8 }} className={`${classPrefix}-program-content-details-${item.type === 'program' ? 'program' : 'addon'}`} container direction='column' flex={"column"}>
                                        {item.subItems && item.subItems.length > 0 ? (
                                            item.subItems.map((subItem: any, subIndex: number) => (
                                                <Grid container key={subIndex} size={12} display={"flex"} onClick={() => handleProgramCardClick(subItem)}  >
                                                    <Grid size={8} container >
                                                        <Grid size={12}>
                                                            <TitleComponent
                                                                title={subItem?.type === 'program' ? subItem?.name : subItem?.addon?.name}
                                                                classPrefix={`${classPrefix}-program-content-title`}
                                                            />
                                                        </Grid>
                                                        <Grid size={12}>
                                                            <DescriptionComponent
                                                                temp={"temp4"}
                                                                description={subItem?.description}
                                                                classPrefix={`${classPrefix}-program-content-description`}
                                                            />
                                                        </Grid>

                                                    </Grid>

                                                    {subItem?.eventSponsors && subItem?.eventSponsors?.length !== 0 && (<Grid size={4} container justifyContent={"flex-end"} >

                                                        <Grid container className={`${classPrefix}-program-content-sponsor`} justifyContent={subItem?.eventSponsors?.length > 1 ? "center" : 'flex-start'} >

                                                            <Grid container justifyContent={subItem?.eventSponsors?.length > 1 ? "center" : 'flex-start'} size={12} className={`${classPrefix}-program-content-sponsor-heading`}>
                                                                <Typography>Sponsored by</Typography>
                                                            </Grid>

                                                            {subItem.eventSponsors.map((sponsor: any) => (
                                                                <Grid key={sponsor.id} container className={`${classPrefix}-program-content-sponsor-ImgBox`} >
                                                                    <Grid>
                                                                        {sponsor?.sponsor?.logoAssetId ? (
                                                                            <img
                                                                                alt={sponsor?.sponsor?.name}
                                                                                src={`${baseUrl}asset/${sponsor?.sponsor?.logoAssetId}`}
                                                                            />
                                                                        ) : (
                                                                            <Avatar
                                                                                alt={sponsor?.sponsor?.name}
                                                                                src=""
                                                                            />
                                                                        )}
                                                                    </Grid>
                                                                </Grid>
                                                            ))}

                                                        </Grid>

                                                    </Grid>
                                                    )}
                                                    {subItem?.hall && (
                                                        <Grid container size={12} alignItems={"center"} className={`${classPrefix}-program-content-hall`} >
                                                            <Grid> <TempHall /></Grid>
                                                            <Typography className={`${classPrefix}-program-content-hall-content`}>  {subItem?.hall}</Typography>
                                                        </Grid>
                                                    )}
                                                    {subItem?.eventSpeakers && subItem?.eventSpeakers?.length !== 0 &&
                                                        
                                                        <Grid size={12} container className="mt-2" spacing={1}>
                                                            <Grid size={12} container className={`${classPrefix}-program-content-sponsor-heading`}>

                                                                {hasModerator(subItem?.eventSpeakers) &&
                                                                    (
                                                                        <><Typography >Moderator</Typography>
                                                                            <Typography >|</Typography>
                                                                        </>
                                                                    )
                                                                }

                                                                <Typography >Speakers</Typography>

                                                            </Grid>

                                                            {subItem?.eventSpeakers
                                                                ?.slice() 
                                                                ?.sort((a: any, b: any) => {
                                                                    const isModeratorA = a?.speakerBios?.[0]?.isModerator ? -1 : 1;
                                                                    const isModeratorB = b?.speakerBios?.[0]?.isModerator ? -1 : 1;
                                                                    return isModeratorA - isModeratorB; // Sort moderators first
                                                                })
                                                                ?.map((speaker: any) => {
                                                                    const isModerator = speaker?.speakerBios?.[0]?.isModerator;
                                                                    
                                                                    return !isModerator ? (

                                                                        <Avatar
                                                                            className={`${classPrefix}-program-content-sponsor-heading-avatar`}
                                                                            alt={speaker?.user?.firstName}
                                                                            src={speaker?.user?.assetId ? `${baseUrl}asset/${speaker?.user?.assetId}` : ""}
                                                                        />

                                                                    ) : (
                                                                        <Grid container size={1} >

                                                                            <Avatar
                                                                                className={`${classPrefix}-program-content-sponsor-heading-moderator`}
                                                                                alt={speaker?.user?.firstName}
                                                                                src={speaker?.user?.assetId ? `${baseUrl}asset/${speaker?.user?.assetId}` : ""}
                                                                            />

                                                                        </Grid>
                                                                    );

                                                                })}


                                                        </Grid>}
                                                        <Grid container spacing={2} alignItems="center">
                                                        {(item.eventParticipantEntries || []).map((entry: any, index: any) => {
                                                            const { seatAllocated = 0, totalSeat = 1 } = entry;
                                                            const remainingSeat = totalSeat - seatAllocated;
                                                            const bookedPercentage = (seatAllocated / totalSeat) * 100;
                                                            const isOverbookedRed = bookedPercentage > 85;
                                                            const isOverbookedYellow = bookedPercentage > 70;

                                                            if (!isOverbookedYellow) return null;
                                                            return (
                                                                <Grid container key={index}  spacing={2} alignItems="center" paddingTop={2}>
                                                                {/* Seat Information */}
                                                                <Grid container alignItems="center" spacing={.5}>
                                                                  <Grid paddingBottom={.5}>
                                                                   {isOverbookedRed ? <RedSeat fontSize={18}  /> : <YellowSeat fontSize={18} />}
                                                                  </Grid>
                                                                  <Grid>
                                                              {remainingSeat === 0 ? (
                                                              <Typography variant="body1" className="program-seat-alert-red">
                                                              {seatAllocated} / {totalSeat} Unfortunately, all seats have been booked.
                                                              </Typography>
                                                              ) : (
                                                              <Typography variant="body1" className={isOverbookedRed ? "program-seat-alert-red" : "program-seat-alert-yellow"}>
                                                              {seatAllocated} / {totalSeat} Hurry up! Only {remainingSeat} left! Secure your spot now!
                                                              </Typography>
                                                                     )}
                                                                  </Grid>
                                                                </Grid>
                                                                </Grid>
                                                            );
                                                            })}
                                                        </Grid>
                                                        {item.subItems.eventParticipantEntries}
                                                        {item?.subItems?.length > 1 && subIndex !== item?.subItems?.length - 1 &&
                                                    <Grid size={12} className={`${classPrefix}-program-content-divider`}>
                                                                <Divider />
                                                            </Grid>}                       
                                                </Grid>

                                            ))

                                        ) : (<Grid container size={12}>
                                            <Grid display={"flex"} justifyContent={"space-between"} size={6} container >
                                                <Grid size={12}>
                                                    <TitleComponent
                                                        title={item?.type === 'program' ? item?.name : item?.addon?.name}
                                                        classPrefix={`${classPrefix}-program-content-title`}
                                                    /></Grid>

                                                <Grid size={12}>
                                                    <DescriptionComponent
                                                        temp={"temp4"}
                                                        description={item?.description}
                                                        classPrefix={`${classPrefix}-program-content-description`}
                                                    />
                                                </Grid>
                                            </Grid>
                                            {/* single sponser  in program*/}
                                            {/* {(item?.eventSponsors?.length !== 0 && item?.eventSponsors?.length<2 && (item?.eventSpeakers?.length===0 || !item?.eventSpeakers))&& ( */}
                                            {(item?.eventSponsors) && (
                                                <Grid size={{ xs: 9, lg: 6 }} container >
                                                    <Grid container className={`${classPrefix}-program-content-sponsor`} size={item?.eventSponsors?.length > 1 ? 12 : 10.5} justifyContent={"flex-end"}>
                                                        {item?.eventSponsors?.length > 1 ? (
                                                            <Grid container size={3} className={`${classPrefix}-program-content-sponsor-heading`}>
                                                                <Typography >Sponsored by</Typography>

                                                            </Grid>
                                                        ) :
                                                            item?.eventSponsors?.length !== 0 &&
                                                            <Grid container className={`${classPrefix}-program-content-sponsor-heading`}>
                                                                <Typography >Sponsored by</Typography>

                                                            </Grid>
                                                        }
                                                        <Grid container size={12} justifyContent={"flex-end"} spacing={2} >
                                                            {item?.eventSponsors?.map((sponsor: any) => (
                                                                <Grid container className={`${classPrefix}-program-content-sponsor-ImgBox`} >

                                                                    {sponsor?.sponsor?.logoAssetId ? (
                                                                        <img
                                                                            alt={sponsor?.sponsor?.name}
                                                                            src={`${baseUrl}asset/${sponsor?.sponsor?.logoAssetId}`}
                                                                        />
                                                                    ) : (
                                                                        <Avatar
                                                                            alt={sponsor?.sponsor?.name}
                                                                            src=""
                                                                        />
                                                                    )}

                                                                </Grid>
                                                            ))}
                                                        </Grid>

                                                    </Grid>


                                                </Grid>)}

                                        </Grid>
                                        )}
                                    </Grid>

                                </Grid>

                                <Grid container size={12} className="mt-2" >
                                    {/* {item?.eventSpeakers?.length > 0 ? (
                                        <Grid size={12} className={`${classPrefix}-program-content-divider`}>
                                            <Divider />
                                        </Grid>
                                    ) : <Grid></Grid>} */}


                                    {/* {((item?.eventSponsors?.length !== 0 &&item?.eventSponsors?.length>1) || (item?.eventSponsors?.length !== 0 &&item?.eventSponsors?.length>0 && item?.eventSpeakers?.length >0))&& (
                                        <Grid container  className={`${classPrefix}-program-content-sponsor`} columnSpacing={3} >
                                           <Grid container size={12} className={`${classPrefix}-program-content-sponsor-heading`}  >
                                           <Typography >Sponsors</Typography>
                                           </Grid>

                                              {item?.eventSponsors?.map((sponsor: any) => (
                                                  <Grid  container justifyContent={"center"} alignItems={"center"} className={`${classPrefix}-program-content-sponsor-ImgBox`}>

                                                    {sponsor?.sponsor?.logoAssetId ? (
                                                        <img
                                                        
                                                            alt={sponsor?.sponsor?.name}
                                                            src={`${baseUrl}asset/${sponsor?.sponsor?.logoAssetId}`}
                                                        />
                                                    ) : (
                                                        <Avatar
                                                            alt={sponsor?.sponsor?.name}
                                                            src=""
                                                        />
                                                    )}

                                                  </Grid>
                                                ))}
                                        </Grid>
                                    )} */}

                                    {/* bottom speaker */}

                                    {/* {item?.eventSpeakers?.length > 0 && (

                                        <Grid container className="ml-4"  >

                                            <Grid container size={12} className={`${classPrefix}-program-content-sponsor-heading`}>
                                                <Typography >Speakers</Typography>

                                            </Grid>
                                            {item?.eventSpeakers?.map((speaker: any) => {
                                                return <Avatar

                                                    alt={speaker?.user?.firstName}
                                                    src={speaker?.user?.assetId
                                                        ? `${baseUrl}asset/${speaker?.user?.assetId}`
                                                        : ""}
                                                />
                                            })}
                                        </Grid>
                                    )} */}
                                </Grid>
                            </Grid>

                        ))}

                        <ProgramDetailsModal />
                    </Grid>
                </Grid>
                {/* Program section ends here */}
                {data?.venue?.mapUrl && <LocationSection classPrefix={`${classPrefix}-location`} data={data} onScrollToTier={LocationRef} />}

                {/* Sponsors section starts here */}
                {data?.eventSponsors?.length > 0 && getUniqueSponsors(data?.eventSponsors)?.length > 0 && <Grid id={'sponsors'} container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-sponsors `} spacing={1} direction={'column'} justifyContent={'center'} alignItems={'center'} ref={sponsorRef}>
                    <Grid className={`${classPrefix}-sponsors-title`}>Our Sponsors</Grid>
                    <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-sponsors-item-group-container`} justifyContent={'center'} alignItems={'center'}>
                        {/* {data?.eventSponsors?.length > 0 && getUniqueSponsors(data?.eventSponsors)?.map((item: any) => {
                            return <Grid alignSelf={'stretch'} size={{ xs: 12, sm: 3 }} container direction={'row'} className={`${classPrefix}-sponsors-item-container `} spacing={2}>
                                <Grid size={{ xs: 12, sm: 12 }} container direction={'column'} justifyContent={'center'} alignItems={'center'} className={`${classPrefix}-sponsors-item-container-card `}>
                                    <Grid overflow={'hidden'} className={`${classPrefix}-sponsors-item-container-card-image-container`}>
                                        {item?.sponsor?.logoAssetId ? (<img
                                            src={`${baseUrl}asset/${item.sponsor?.logoAssetId}`}
                                            alt={item.sponsor?.name}
                                        />) : (
                                            <NoProfilePicture className='h-full w-full' />
                                        )}

                                    </Grid>
                                </Grid>
                            </Grid>
                        })} */}
                        {
                            Object.keys(groupedSponsors)?.length > 0 && Object?.entries(groupedSponsors)?.map(([key, items]: any) => {
                                return (
                                    key === "DIAMOND" ? items?.length > 0 && (
                                        <Box width={'100%'} mb={5}>
                                            <Box width={'100%'}>
                                                <Typography className='template4-sponsor-banner-text' textAlign={"center"}>{`${key && toTitleCase(key)} Sponsors`}</Typography>

                                            </Box>
                                            <Box className="flex flex-col gap-y-6 w-full">
                                                {
                                                    items?.map((item: any) => {
                                                        return (
                                                            <Grid container justifyContent={"center"} alignItems={"center"} size={12}  >
                                                                <img 
                                                                className='sponsor-banner-diamond'
                                                                src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''} 
                                                                alt="" />
                                                            </Grid>
                                                        )

                                                    })
                                                }
                                            </Box>
                                        </Box>
                                    ) : key === "PLATINUM" ? items?.length > 0 && (
                                        <Grid size={12} justifyContent={'center'} container mb={5}>
                                            <Grid size={12}>
                                                <Typography className='template4-sponsor-banner-text' textAlign={"center"}>{`${key && toTitleCase(key)} Sponsors`}</Typography>
                                            </Grid>
                                            {
                                                items?.map((item: any) => {
                                                    return (
                                                        <Grid container justifyContent={"center"} alignItems={"flex-start"}  size={{ xs: 12, sm: 6 }}>
                                                            <img
                                                               className='sponsor-banner-platinum'
                                                                src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''}
                                                                alt=""
                                                            />

                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    ) : key === "GOLD" ? items?.length > 0 && (
                                        <Grid mb={5} size={12} container justifyContent={'center'}>
                                            <Grid size={12}>
                                                <Typography className='template4-sponsor-banner-text' textAlign={"center"}>{`${key && toTitleCase(key)} Sponsors`}</Typography>

                                            </Grid>
                                            {
                                                items?.map((item: any) => {
                                                    return (
                                                        <Grid container justifyContent={"center"} alignItems={"flex-start"} alignContent={"flex-start"}  size={{ xs: 12, sm: 4 }}  >
                                                            <img  className='sponsor-banner-gold'  src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''} alt="" />
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    ) : <>
                                        {items?.length > 0 && <Grid size={12} container justifyContent={'center'}>
                                            <Grid size={12}>
                                                <Typography textAlign={"center"} className='template4-sponsor-banner-text'>{`${key && toTitleCase(key)} Sponsors`}</Typography>
                                            </Grid>
                                            {
                                                items?.map((item: any) => {
                                                    return (
                                                        <Grid size={{ xs: 12, sm: 3 }} container justifyContent={'center'} alignItems={"flex-start"} alignContent={"flex-start"}  >
                                                            <img className='sponsor-banner-silver' src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''} alt="" />
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>}
                                    </>


                                )
                            })
                        }
                    </Grid>
                </Grid>}
                {/* Sponsors section ends here */}
                {/* Registration and ticketing section starts here */}
                {Object.keys(amountCalculatedData).length > 0 && <Grid ref={tierRef} container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-ticketing`} justifyContent={'center'} alignItems={'center'} spacing={2} direction={'column'}>
                    <Grid><Typography className={`${classPrefix}-ticketing-title`}>Registration & Ticketing</Typography></Grid>

                    <Grid className={`${classPrefix}-ticketing-anim-container`} container spacing={2} justifyContent={'center'} alignContent={'center'}>
                        {
                            Object.keys(amountCalculatedData)
                                .map((participantType: any) => {

                                    return (

                                        <Grid size={{ xs: 12, sm: 6 }} key={participantType} className={`${classPrefix}-ticketing-item-container anim-item`}>
                                            <Grid container justifyContent={'center'}>
                                                <Typography className={`${classPrefix}-ticketing-item-title`}>
                                                    {participantType}
                                                </Typography>
                                            </Grid>
                                            <Grid className={`${classPrefix}-ticketing-content-container`}>
                                                {
                                                    amountCalculatedData[participantType]
                                                        .map((item: any) => {
                                                            const dateRange = formatDateRange(item.startDate, item.endDate);
                                                            return parseFloat(item?.percentage) > 0 ? (
                                                                <Grid container className={`${classPrefix}-ticketing-sub-item-container`} justifyContent={'space-between'}>
                                                                    <Grid container direction={'column'}>
                                                                        <Grid><Typography className={`${classPrefix}-ticketing-sub-item-name`}>{item.name}</Typography></Grid>
                                                                        <Grid><Typography className={`${classPrefix}-ticketing-sub-item-date`}>{dateRange}</Typography></Grid>
                                                                    </Grid>
                                                                    <Grid container alignItems={'center'}>
                                                                        <Typography className={`${classPrefix}-ticketing-sub-item-amount`}>{parseFloat(item?.percentage)}% OFF</Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            ) : <></>;
                                                        })
                                                }
                                            </Grid>

                                            <Grid container justifyContent={'center'} alignItems={'flex-end'} className={`${classPrefix}-ticketing-register-button-container`}><CustomButton onClick={isCompany ? undefined : () => handleClickRegister(amountCalculatedData[participantType]?.[0])} label="Register Now" className={`${classPrefix}-ticketing-register-button`} /></Grid>

                                        </Grid>)
                                })
                        }
                    </Grid>
                </Grid>}
                {/* Registration and ticketing section ends here */}
                {/* Sponsor enquiry form starts here */}
                <Grid minHeight={"max-content"} size={12} container ref={beSponsorRef}>
                    <SponsorShip eventId={data?.id} />
                </Grid>
                {/* Sponsor enquiry form ends here */}
                {/* App banner Image */}
                <BannerSection className='t4-banner'/>
                <FooterSection classPrefix={`${classPrefix}-footer`} data={data} links={headerLinks} onScrollToProgram={() => handleScrollTo(programRef)} onScrollToAbout={() => handleScrollTo(aboutRef)} onScrollToContributors={() => handleScrollTo(contributorsRef)} onScrollToLocation={() => handleScrollTo(LocationRef)} onScrollToBeSponsor={() => handleScrollTo(beSponsorRef)} onScrollToSponsor={() => handleScrollTo(sponsorRef)}/>
            </Grid>
        </Grid>
    )
})

export default Template4;
