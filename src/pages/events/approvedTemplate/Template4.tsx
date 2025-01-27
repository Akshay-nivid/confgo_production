import React, { useEffect, useMemo, useRef, useState } from 'react'
import Grid from '@mui/material/Grid2';
import TopMenuHeader, { LinkData } from './TopMenuHeader';
import AuthFormHandler from './AuthFormHandler';
import TEventDetails from './TEventDetails';
import TimerCounterComp from '../template/TemplateTimer/TimerCounterComp';
import { getLocalTimeDate, groupByDate } from '@/Utils/CommonBaseClass';
import { Avatar, Box,Divider, Typography } from '@mui/material';
import LocationSection from '../template/LocationSection';
import FooterSection from '../template/FooterSection';
import moment from 'moment';
import DescriptionComponent from '../template/DescriptionComponent';
import TitleComponent from '../template/TitleComponent';
// import { setNonPersistedDataById } from '@/Libs/store';
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
import NoSpeakerIcon from "../../../assets/svg/no-speaker-image.svg";


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
    const tierRef = useRef(null);
    const sponsorRef = useRef(null);
    const beSponsorRef = useRef(null);
    const baseUrl = config.api.url;
    const [day, setDay] = useState<string>('');
    const [hour, setHour] = useState<string>('');
    const [minute, setMinute] = useState<string>('');
    const [second, setSecond] = useState<string>('');
    const navigate = useNavigate();



    /**
      * Callback function to receive the updated time values from TimerCounterComp
      * @param day,hour,minute,second
      */
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
        return combined?.sort((a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf());
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

        setNonPersistedDataById('isSpeakerDetailsModelOpen', { value: true })
        setNonPersistedDataById('speakerDetails', { value: item })

    }

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

    function groupSponsorsByCategory(sponsors: any) {

        const groupedSponsors = {} as any

        sponsors.forEach((sponsor: any) => {


            if (!groupedSponsors[sponsor?.sponsorType?.name]) {

                groupedSponsors[sponsor?.sponsorType?.name] = [sponsor]

            } else {

                groupedSponsors[sponsor?.sponsorType?.name].push(sponsor)

            }

        })

        return groupedSponsors
    }


    const groupedSponsors = groupSponsorsByCategory(sponsors)



    return (
        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-bg`}>
            <Grid container size={{ xs: 12, sm: 12 }} className={classPrefix}>
                <TopMenuHeader links={headerLinks} classPrefix={`${classPrefix}-top-menu`} data={data} onScrollToProgram={() => handleScrollTo(programRef)} onScrollToAbout={() => handleScrollTo(aboutRef)} onScrollToContributors={() => handleScrollTo(contributorsRef)} onScrollToLocation={() => handleScrollTo(LocationRef)} onScrollToBeSponsor={() => handleScrollTo(beSponsorRef)} onScrollToSponsor={() => handleScrollTo(sponsorRef)} />
                <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-header`} />
                <AuthFormHandler className={`${classPrefix}-headerBottom`} data={data} onScrollToTier={() => handleScrollTo(tierRef)} />
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
                {/* Speaker section starts here  */}
                {data?.eventSpeakers?.length > 0 && getUniqueSpeakers(data?.eventSpeakers)?.length > 0 && <Grid id={'Contributors'} container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-event-contributors `} spacing={1} direction={'column'} justifyContent={'center'} alignItems={'center'} ref={contributorsRef}>
                    <SpeakerDetailsModal />
                    <Grid className={`${classPrefix}-event-contributors-title`}>Meet Our Esteemed Speakers</Grid>
                    <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-event-contributors-item-group-container`} justifyContent={'flex-start'} alignItems={'center'} spacing={4}>
                        {data?.eventSpeakers?.length > 0 && getUniqueSpeakers(data?.eventSpeakers)?.map((item: any) => {
                            return <Grid alignSelf={'stretch'} onClick={() => handleSpeakerCardClick(item)} size={{ xs: 12, sm: 3 }} container direction={'row'} className={`${classPrefix}-event-contributors-item-container `} spacing={2}>
                                <Grid size={{ xs: 12, sm: 12 }} container direction={'column'} className={`${classPrefix}-event-contributors-item-container-speaker-card `}>
                                    <Grid overflow={'hidden'} className={`${classPrefix}-event-contributors-item-container-speaker-card-image-container`}>
                                        {item?.user?.assetId ? (<img
                                            src={`${baseUrl}asset/${item?.user?.assetId}`}
                                            alt={item.name}
                                        />) : (
                                            <NoSpeakerIcon className={`h-full w-full ${classPrefix}-event-contributors-item-container-no-profile-picture`} />
                                        )}

                                    </Grid>
                                    <Grid container direction={'column'} >
                                        <Grid className={`${classPrefix}-event-contributors-item-name`}>{`${item.user?.firstName} ${item.user?.lastName}`}</Grid>
                                        {item.user?.designation && <Grid className={`${classPrefix}-event-contributors-item-designation`}>{item.user?.designation}</Grid>}
                                        <Grid className={`${classPrefix}-event-contributors-item-view-more`} ><CustomButton
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
                <Grid id={"Program"} container size={{ xs: 12, sm: 12 }} spacing={2} mb={10} ref={programRef}>
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
                            <Grid size={{ xs: 11 }} onClick={() => handleProgramCardClick(item)} justifyContent={'center'} pl={{ xs: 2, md: 4 }} p={2} key={index}
                                className={`${classPrefix}-program-content-item ${item?.type === 'program' ? `${classPrefix}-program-content-item-program` : `${classPrefix}-program-content-item-addon`}`}
                            >
                                <Grid container alignItems="center" spacing={3}>
                                    <Grid size={{ xs: 2 }} container direction="row" alignItems="center" justifyContent="start" className={`${classPrefix}-program-content-time`} >
                                        <Grid size={{ xs: 2 }}>
                                        </Grid>
                                        <Grid size={{ xs: 10 }}>
                                            <Typography variant='h6'>
                                                {'General Addons'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
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
                    <Grid  container spacing={3} className={`${classPrefix}-program-content-container`} mt={2} direction="column" alignContent={'center'} size={{ xs: 12, sm: 12 }}>
                        {combinedAndSortedItems?.map((item: any, index: number) => (
                            <Grid onClick={() => handleProgramCardClick(item)} size={{ xs: 11 }} justifyContent={'center'} pl={{ xs: 2, md: 4 }} p={2} key={index}
                                className={`${classPrefix}-program-content-item ${item?.type === 'program' ? `${classPrefix}-program-content-item-program` : `${classPrefix}-program-content-item-addon`}`}
                            >
                                <Grid container alignItems="center" >
                                    <Grid size={{ xs: 6, sm: 4 }} container direction="row" alignItems="center" justifyContent="start" className={`${classPrefix}-program-content-time`} >
                                        <Grid className={`${classPrefix}-program-content-time${item?.type === 'program' ? "-divider-gray" : "-divider-black"}`} size={{ xs: 3, sm: 2 }} container justifyContent={"center"} display={"block"}>
                                            <Typography textAlign={"center"} className={`${classPrefix}-program-content-time-day`}>{getLocalTimeDate(item.startTime, 'ddd')}</Typography>
                                            <Typography textAlign={"center"} className={`${classPrefix}-program-content-time-num`}>{getLocalTimeDate(item.startTime, 'DD')}</Typography>
                                        </Grid>
                                        <Grid >
                                            <Grid  container display={"flex"} alignItems={"center"} columnGap={1} rowGap={2} className={`${classPrefix}-program-content-time-icon`}>
                                                {item?.type === 'program' ? <TemplateGrayClockIcon /> : <TemplateBlackClockIcon />}
                                                <TimeComponent
                                                    startTime={item?.startTime}
                                                    endTime={item?.endTime}
                                                    classPrefix={`${classPrefix}-program-content-time-value`}
                                                />
                                            </Grid>
                                            <Grid container display={"flex"} alignItems={"center"} columnGap={1} className={`${classPrefix}-program-content-time-icon`}>
                                                {item?.type === 'program' ? <TemplatePriceGrayIcon /> : <TemplatePriceBlackIcon />}
                                                <Typography className={`${classPrefix}-program-content-time-value`}>{config?.currency}{item?.amount}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid  size={{ xs: 6, sm: 8 }} className={`${classPrefix}-program-content-details-${item.type === 'program' ? 'program' : 'addon'}`} container flex={"column"}>
                                        <Grid  display={"flex"} justifyContent={"space-between"}size={6} container>
                                           <Grid size={12}>
                                            <TitleComponent
                                                title={item?.type === 'program' ? item?.name : item?.addon?.name}
                                                classPrefix={`${classPrefix}-program-content-title`}
                                            /></Grid>

                                            {/* {item.eventSpeakers?.map((speaker: any) => {
                                               return <Avatar
                                                
                                                    alt={speaker?.user?.firstName}
                                                    src={speaker?.user?.assetId
                                                        ? `${baseUrl}asset/${speaker?.user?.assetId}`
                                                        : ""}
                                                />
                                            })} */}
                                      
                                        
                                        <Grid size={12}>
                                        <DescriptionComponent
                                            temp={"temp4"}
                                            description={item?.description}
                                            classPrefix={`${classPrefix}-program-content-description`}
                                        />
                                        </Grid>
                                        </Grid>
                                        <Grid size={6} container  justifyContent={"flex-end"} >
                                        {(item?.eventSponsors?.length !== 0 && item?.eventSponsors?.length<2 &&item?.eventSpeakers?.length===0)&& (
                                        <Grid container  className={`${classPrefix}-program-content-sponsor`} columnSpacing={3} >
                                           <Grid container justifyContent={"center"} size={12} className={`${classPrefix}-program-content-sponsor-heading`}>
                                           <Typography >Sponsored by</Typography>

                                           </Grid>
                                            {item.eventSponsors.map((sponsor: any) => (
                                                <Grid  container justifyContent={"flex-end"} alignItems={"center"} className={`${classPrefix}-program-content-sponsor-ImgBox`}>

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
                                    )}
                                
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container size={12} className="mt-2">
                                  {((item?.eventSponsors?.length !== 0 &&item?.eventSponsors?.length>1) || (item?.eventSponsors?.length !== 0 &&item?.eventSponsors?.length>0 && item?.eventSpeakers?.length >0))?(
                                <Grid  size={12}  className={`${classPrefix}-program-content-divider`}>
                                 <Divider/>
                                </Grid>
                                   ):<Grid></Grid>}

                                    {((item?.eventSponsors?.length !== 0 &&item?.eventSponsors?.length>1) || (item?.eventSponsors?.length !== 0 &&item?.eventSponsors?.length>0 && item?.eventSpeakers?.length >0))&& (
                                        <Grid container  className={`${classPrefix}-program-content-sponsor`} columnSpacing={3} >
                                           <Grid container size={12} className={`${classPrefix}-program-content-sponsor-heading`}>
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
                                    )}
                                
                                {item?.eventSpeakers?.length >0 &&(
                                <Grid  container size={6} >
                             
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
                                         ) }
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
                    <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-sponsors-item-group-container`} justifyContent={'center'} alignItems={'center'} spacing={4}>
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
                                    key === "DIAMOND" ? (
                                        <Box width={'100%'} mb={10}>
                                            <Box width={'100%'}>
                                                <Typography className='template4-sponsor-banner-text' textAlign={"center"}>{`Our ${key?.toLowerCase()} Sponsors`}</Typography>

                                            </Box>
                                            <Box className="flex flex-col gap-y-6 w-full">
                                                {
                                                    items?.map((item: any) => {
                                                        return (
                                                            <Box className="max-h-[438px] contain-content " width={'100%'}>
                                                                <img className='object-fill' width={'100%'} src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''} alt="" />
                                                            </Box>
                                                        )

                                                    })
                                                }
                                            </Box>
                                        </Box>
                                    ) : key === "PLATINUM" ? (
                                        <Grid size={12} container direction={'column'} mb={10}>
                                            <Typography className='template4-sponsor-banner-text' textAlign={"center"}>{`Our ${key.toLowerCase()} Sponsors`}</Typography>
                                            {
                                                items?.map((item: any) => {
                                                    return (
                                                        <Grid size={{ xs: 12, sm: 6 }} container direction={'row'} spacing={2}>
                                                            <img className='object-fill' width={'100%'} src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''} alt="" />
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    ) : key === "GOLD" ? (
                                        <Grid mb={10} size={12} container direction={'column'} >
                                            <Typography className='template4-sponsor-banner-text' textAlign={"center"}>{`Our ${key.toLowerCase()} Sponsors`}</Typography>
                                            {
                                                items?.map((item: any) => {
                                                    return (
                                                        <Grid size={{ xs: 12, sm: 4 }} container direction={'row'} spacing={2}>
                                                            <img className='object-fill' width={'100%'} src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''} alt="" />
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    ) : <>
                                        <Grid size={12} container direction={'column'}>
                                            <Typography textAlign={"center"} className='template4-sponsor-banner-text'>{`Our ${key.toLowerCase()} Sponsors`}</Typography>
                                            {
                                                items?.map((item: any) => {
                                                    return (
                                                        <Grid size={{ xs: 12, sm: 3 }} container direction={'row'} spacing={2}>
                                                            <img className='object-fill' height={'100%'} width={'100%'} src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''} alt="" />
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
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
                                            <Grid container justifyContent={'center'} alignItems={'flex-end'} className={`${classPrefix}-ticketing-register-button-container`}><CustomButton onClick={() => handleClickRegister(amountCalculatedData[participantType]?.[0])} label="Register Now" className={`${classPrefix}-ticketing-register-button`} /></Grid>

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
                <FooterSection classPrefix={`${classPrefix}-footer`} data={data} />
            </Grid>
        </Grid>
    )
})

export default Template4;
