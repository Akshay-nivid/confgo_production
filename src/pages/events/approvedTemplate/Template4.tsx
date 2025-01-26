import React, { useEffect, useMemo, useRef, useState } from 'react'
import Grid from '@mui/material/Grid2';
import TopMenuHeader, { LinkData } from './TopMenuHeader';
import AuthFormHandler from './AuthFormHandler';
import TEventDetails from './TEventDetails';
import TimerCounterComp from '../template/TemplateTimer/TimerCounterComp';
import { getLocalTimeDate, groupByDate } from '@/Utils/CommonBaseClass';
import { Avatar, Typography } from '@mui/material';
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
    const baseUrl = config.api.url;
    const [day, setDay] = useState<string>('');
    const [hour, setHour] = useState<string>('');
    const [minute, setMinute] = useState<string>('');
    const [second, setSecond] = useState<string>('');

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
        { text: "Speakers" },
        { text: "Sponsers" },
        { text: "Programmes" },
        { text: "Location" }
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
    // function handleProgramCardClick(item:any) {
    //     setNonPersistedDataById('isProgramDetailsModelOpen', { value: true })
    //     setNonPersistedDataById('programDetails', { value: item })
    //   }
      let generalAddsOn = data?.addons?.filter((item: { startTime: any; endTime: any; }) => !item.startTime || !item.endTime);
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
                {/* Program section */}
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
                            <Grid size={{ xs: 11 }} justifyContent={'center'} pl={{ xs: 2, md: 4 }} p={2} key={index}
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
                    <Grid container spacing={3} className={`${classPrefix}-program-content-container`} mt={2} direction="column" alignContent={'center'} size={{ xs: 12, sm: 12 }}>
                        {combinedAndSortedItems?.map((item: any, index: number) => (
                            <Grid /*onClick={() => handleProgramCardClick(item)}*/ size={{ xs: 11 }} justifyContent={'center'} pl={{ xs: 2, md: 4 }} p={2} key={index}
                                className={`${classPrefix}-program-content-item ${item?.type === 'program' ? `${classPrefix}-program-content-item-program` : `${classPrefix}-program-content-item-addon`}`}
                            >
                                <Grid container alignItems="center" >
                                    <Grid size={{ xs: 6, sm: 4 }} container direction="row" alignItems="center" justifyContent="start" className={`${classPrefix}-program-content-time`} >
                                        <Grid className={`${classPrefix}-program-content-time${item?.type === 'program' ? "-divider-gray" : "-divider-black"}`} size={{ xs: 3, sm: 2 }} container justifyContent={"center"} display={"block"}>
                                            <Typography textAlign={"center"} className={`${classPrefix}-program-content-time-day`}>{getLocalTimeDate(item.startTime, 'ddd')}</Typography>
                                            <Typography textAlign={"center"} className={`${classPrefix}-program-content-time-num`}>{getLocalTimeDate(item.startTime, 'DD')}</Typography>
                                        </Grid>
                                        <Grid >
                                            <Grid container display={"flex"} alignItems={"center"} columnGap={1} rowGap={2}>
                                                {item?.type === 'program' ? <TemplateGrayClockIcon /> : <TemplateBlackClockIcon />}
                                                <TimeComponent
                                                    startTime={item?.startTime}
                                                    endTime={item?.endTime}
                                                    classPrefix={`${classPrefix}-program-content-time-value`}
                                                />
                                            </Grid>
                                            <Grid container display={"flex"} alignItems={"center"} columnGap={1}>
                                                {item?.type === 'program' ? <TemplatePriceGrayIcon /> : <TemplatePriceBlackIcon />}
                                                <Typography>{config?.currency}{item?.amount}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid size={{ xs: 6, sm: 8 }} className={`${classPrefix}-program-content-details-${item.type === 'program' ? 'program' : 'addon'}`}>
                                        <Grid display={"flex"} justifyContent={"space-between"}>
                                            <TitleComponent
                                                title={item?.type === 'program' ? item?.name : item?.addon?.name}
                                                classPrefix={`${classPrefix}-program-content-title`}
                                            />

                                            {item.eventSpeakers?.map((speaker: any) => {
                                               return <Avatar
                                                
                                                    alt={speaker?.user?.firstName}
                                                    src={speaker?.user?.assetId
                                                        ? `${baseUrl}asset/${speaker?.assetId}`
                                                        : ""}
                                                />
                                            })}
                                        </Grid>

                                        <DescriptionComponent
                                            description={item?.description}
                                            classPrefix={`${classPrefix}-program-content-description`}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}

                        <ProgramDetailsModal />
                    </Grid>
                </Grid>
                <LocationSection classPrefix={`${classPrefix}-location`}data={data} onScrollToTier={LocationRef}/>
                <FooterSection classPrefix={`${classPrefix}-footer`} data={data} />
            </Grid>
        </Grid>
    )
})

export default Template4;
