/**
 * Component handles the first template
 */
import Grid from '@mui/material/Grid2';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import EventContributorsSection from './EventContributorsSection';
import FooterSection from './FooterSection';
import TicketingSection from './TicketingSection';
import LocationSection from './LocationSection';
import RegisterBannerSection from './RegisterBannerSection';
import Temp1PhotoIcon from '@/assets/png/template1-photo.png';
import { formatDateRange, getLocalTimeDate, getUserToken, groupByDate, handleLogout, toTitleCase, truncateString, useIsMobileOrTabletScreen } from '@/Utils/CommonBaseClass';
import LocationIcon from '@/assets/svg/template1-location.svg';
import CalendarIcon from '@/assets/svg/template1-calendar.svg';
import EmailIcon from '@/assets/svg/template1-email.svg';
import PhoneIcon from '@/assets/svg/template1-phone.svg';
import LinkIcon from '@/assets/svg/template1-url.svg';
import { Box, Button,Tooltip,Typography } from '@mui/material';
import moment from 'moment';
import TimeComponent from './TimeComponent';
import TitleComponent from './TitleComponent';
import DescriptionComponent from './DescriptionComponent';
import CustomButton from '@/components/CustomButton/CustomButton';
import ClockIcon from '@/assets/svg/template1-clock-white.svg';
import config from "../../../../config.json";
import MenuIcon from '@mui/icons-material/Menu';
import { CloseIcon } from '@/assets/svg';
import { Drawer } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useStore, { resetStore, setDataById, setNonPersistedDataById, snackBar } from '@/Libs/store';
import routes from '@/router/routes';
import parse from 'html-react-parser';
import TimerCounterComp from './TemplateTimer/TimerCounterComp';
import ProgramDetailsModal from './_components/ProgramDetailsModal';
import SponsorShip from './sponsorShipForm/SponsorShip';



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
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const isMobileOrTabletScreen = useIsMobileOrTabletScreen();
    const navigate = useNavigate();
    const location = useLocation();
    const baseUrl = config.api.url;
    const slugName = useStore((state: any) => state?.compData?.["slugName"]?.value) || '';
    const slugInfo = useStore((state: any) => state?.compData?.['slugEventDetails']?.[`event/slug/${slugName}`]?.data) ?? [];
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
    itemArray.push({ icon: <EmailIcon />, label: "Email", value: data?.eventContacts?.[0]?.email || "" });
    if (data?.eventClass === "HYBRID") {
        itemArray.push({ icon: <LinkIcon />, label: "Website link", value: data?.url || "" });
    } else {
        itemArray.push({ icon: <PhoneIcon />, label: "Phone", value: data?.eventContacts?.[0]?.phone || "" });
    }

    const CopyUrl = data?.venue?.mapUrl
    let generalAddsOn = data?.addons?.filter((item: { startTime: any; endTime: any; }) => !item.startTime || !item.endTime);

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
    
    // const handleTabChange = (_event: React.MouseEvent<Element>, newValue: string) => {
    //   setSelectedDate(newValue);
    // };

     /**
     * Opens the drawer component
     */
     function handleOpenDrawer() {
      setDrawerOpen(true);
  }


  /**
   * Closes the drawer component
   */
  function handleCloseDrawer() {
      setDrawerOpen(false);
  }

       /**
     * Handles the click event on a link, prevents the default anchor behavior,
     * and triggers the scroll to the "About" section.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} e - The mouse event triggered by the link click.
     */

  function handleLinkClick(value: 'About' | 'Program' | 'Contributors' | 'Location') {


    if (location?.pathname?.startsWith('/event-link')) {
      scrollToTargetLink(value)

    } else {
      setDataById('currentLink', { value: value });

      const targetRoute = `/event-link/${slugName}`

      navigate(targetRoute);


    }
    handleCloseDrawer()
  }

  /**
 * Scrolls to a specific section of the page based on the provided link.
 *
 * @param {'About' | 'Program' | 'Contributors' | 'Location'} link - The target section to scroll to.
 * 
 * The function determines the section to scroll to by comparing the `link` parameter.
 * It calls the `handleScrollTo` function with the corresponding reference:
 * - `'About'`: Scrolls to the `aboutRef` section.
 * - `'Program'`: Scrolls to the `programRef` section.
 * - `'Contributors'`: Scrolls to the `contributorsRef` section.
 * - `'Location'`: Scrolls to the `locationRef` section.
 *
 * If the `link` matches one of the predefined sections, it triggers scrolling to that section.
 */
  function scrollToTargetLink(link: 'About' | 'Program' | 'Contributors' | 'Location') {

    if (link === 'About') {
      handleScrollTo(aboutRef)
      return
    }
    if (link === 'Program') {
      handleScrollTo(programRef)
      return
    }
    if (link === 'Contributors') {
      handleScrollTo(contributorsRef)
      return
    }
    if (link === 'Location') {
      handleScrollTo(LocationRef)
      return
    }
  }

  /**
    * Function navigates to the login page and stores the previous route in the store
    */
  const loginFn = () => {
    setDataById("previousRoute", { url: location.pathname });

    navigate(routes.userLogin());
  }

  /**
   * Function navigates to the signup page and stores the previous route in the store
   */
  const SignupFn = () => {
    setDataById("previousRoute", { url: location.pathname });
    navigate(routes.userRegister());
  }

  /**
   * Function handles the logout functionality
   * Calls the handleLogout from CommonBaseClass with a callback
   * The callback resets the store and navigates to the login page
   */
  function logoutFn() {
    handleLogout({
      onLogoutSuccess: () => {
        resetStore();
        navigate(routes.userLogin());
      }
    });
  }


  const eventPriceTiersPresent = data?.eventPriceTiers !== undefined && data?.eventPriceTiers !== null && data?.eventPriceTiers?.length > 0;

  /**
     * Handles the click event for the register button
     * @param e The event details
     */
  function handleClickRegister(e: any) {

    e.preventDefault();

    const userToken = sessionStorage.getItem('token')
    const userRole = sessionStorage.getItem('userRole')

    // admin user is perevented from navigating to cart
    if (userToken && userRole !== 'USER') {
      snackBar({ severity: 'error', message: 'please login using participant credentials' })
      return
    }
    if (eventPriceTiersPresent) {

      handleScrollTo(tierRef);
      return;

    }
    navigate(routes.programSelection())
  }

    
  function handleProgramCardClick(item:any) {
    
    setNonPersistedDataById('isProgramDetailsModelOpen', { value: true })
    setNonPersistedDataById('programDetails', { value: item })

  }
    
    const classPrefix = 'event-template-template1';

    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-bg`}>
        <Grid container size={{ xs: 12, sm: 12 }} className={classPrefix}>
            <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-header`}>
                {/* Top menu section starts here */}
          <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-top-menu`}>
            <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} alignItems={'center'} className={`${classPrefix}-top-menu-container`}>
              {
                isMobileOrTabletScreen ? (
                  <>
                    <MobileNavbar classPrefix={classPrefix} data={data} slugInfo={slugInfo} handleOpenDrawer={handleOpenDrawer} />
                  </>
                )
                  :
                  <>
                    <Grid className={`${classPrefix}-top-menu-logo`}>{(data?.assetId || slugInfo?.assetId) ? <img
                      className={`${classPrefix}-top-menu-logo-img`}
                      src={`${baseUrl}asset/${data?.assetId ?? slugInfo?.assetId ?? ''}`}
                    /> : <Grid></Grid>}</Grid>
                    <Grid container spacing={4}>
                      <Grid className={`${classPrefix}-top-menu-sub-item`}><Link to={'#'} onClick={() => handleLinkClick('About')}> About </Link></Grid>
                      {data?.eventSpeakers?.length > 0 && <Grid className={`${classPrefix}-top-menu-sub-item`}><Link to={'#'} onClick={() => { handleLinkClick('Contributors') }}> Contributors </Link></Grid>}
                      <Grid className={`${classPrefix}-top-menu-sub-item`}><Link to={'#'} onClick={() => { handleLinkClick('Program') }}> Programs </Link></Grid>
                      <Grid className={`${classPrefix}-top-menu-sub-item`}><Link to={'#'} onClick={() => { handleLinkClick('Location') }}> Location </Link></Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      {getUserToken() ? <Grid className={`${classPrefix}-top-menu-book-button`}><CustomButton label='Logout' onClick={logoutFn} /></Grid> :
                        <><Grid className={`${classPrefix}-top-menu-login-button`}><span role='button' onClick={loginFn}> Login </span></Grid>
                          <Grid className={`${classPrefix}-top-menu-button-border`}></Grid>
                          <Grid className={`${classPrefix}-top-menu-book-button`}><CustomButton onClick={SignupFn} label='Signup'
                          /></Grid></>}
                    </Grid>
                  </>
              }
            </Grid>

            {isMobileOrTabletScreen && <Drawer

              PaperProps={{
                sx: {
                  width: '100%', // Makes the drawer take full width
                  maxWidth: '100%', // Ensures it doesn't exceed viewport width

                }
              }}
              anchor="right"
              open={drawerOpen}>

              <CloseIcon onClick={handleCloseDrawer} className={`${classPrefix}-top-menu-container-close-icon`} />

              <Grid container flexDirection={'column'} height={'100vh'} className={`${classPrefix}-top-menu-container-drawer`} >

               
                <Grid container flexDirection={'column'} rowSpacing={4}>
                  <Grid className={`${classPrefix}-top-menu-sub-item`}><Link to={'#'} onClick={() => handleLinkClick('About')}> About </Link></Grid>
                  {data?.eventSpeakers?.length > 0 && <Grid className={`${classPrefix}-top-menu-sub-item`}><Link to={'#'} onClick={() => handleLinkClick('Contributors')}> Contributors </Link></Grid>}
                  <Grid className={`${classPrefix}-top-menu-sub-item`}><Link to={'#'} onClick={() => handleLinkClick('Program')}> Programs </Link></Grid>
                  <Grid className={`${classPrefix}-top-menu-sub-item`}><Link to={'#'} onClick={() => handleLinkClick('Location')}> Location </Link></Grid>
                </Grid>

                <Grid container spacing={2} flexDirection={'column'} marginTop={"auto"}>

                  {getUserToken() ?
                    <Grid className={`${classPrefix}-top-menu-book-button`}><CustomButton fullWidth label='Logout' onClick={logoutFn} /></Grid>
                    :
                    <>
                      <Grid className={`${classPrefix}-top-menu-book-button login`}><CustomButton fullWidth onClick={loginFn} label='Login' /> </Grid>
                      <Grid className={`${classPrefix}-top-menu-book-button`}><CustomButton fullWidth onClick={SignupFn} label='Signup' /></Grid>
                    </>
                  }

                </Grid>
              </Grid>

            </Drawer>}

          </Grid>
                {/* Top menu section ends here */}

                <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} direction={'row'}>
                    {/* Title section starts here */}
            <Grid container className={`${classPrefix}-title-container`} size={{ xs: 12, sm: 6 }} alignItems={'center'}>
              <Grid container direction={'column'} alignItems={'flex-start'} className={`${classPrefix}-title`}>
                <Grid className={`${classPrefix}-title-container`}>
                  <Tooltip title={data?.name}>
                    <Typography className={`${classPrefix}-title-title1 ${classPrefix}-title-hero-header`}> {data?.name}</Typography>
                  </Tooltip>
                </Grid>

                <Grid>
                  <CustomButton label="Register Now" className={`${classPrefix}-title-register-button`} onClick={(e) => handleClickRegister(e)} />
                </Grid>
              </Grid>
            </Grid>

                    {/* Title section ends here */}
                    <Grid className={`${classPrefix}-header-photo-container`} size={{ xs: 12, sm: 6 }}><img src={Temp1PhotoIcon} alt="Template 1 Photo" /></Grid>
                    {/* Details section */}
                    <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-details-container`}>
                        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-details`} justifyContent={'center'} alignItems={'center'}>
                            <Grid size={{ xs: 12, sm: 12 }} container className={`${classPrefix}-details-item`} spacing={1}>
                                {
                                    itemArray?.map((item: any, index: number) => {
                                        return <Grid className={`${classPrefix}-details-box ${
                                          index === 2 ? `${classPrefix}-details-index-box` : ""
                                        } ${index === 0 ? `${classPrefix}-details-border-line` : ""}`} container size={{ xs: 12, sm: 12, md: 6, lg:3   }} direction={'column'} justifyContent={'flex-start'} alignItems={'flex-start'} columnGap={"2rem"}>
                                            <Grid className={
                                                index === 2
                                                    ? `${classPrefix}-details-index-icon`
                                                    : `${classPrefix}-details-icon`
                                            }>{item.icon} </Grid>
                                            <Grid><Typography className={`${classPrefix}-details-label`}>{item.label}</Typography></Grid>
                                            <Grid><Typography className={`${classPrefix}-details-value`} textAlign={'left'}> {truncateString(toTitleCase(item.value), 35, "Untitled")}
                                            </Typography></Grid>
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
      {/* Event count down component */}
      <Grid className="template1-countdown" spacing={2} container justifyContent={"center"} >
        <Grid className="template1-countdown-container" size={12} justifyContent={"center"} spacing={2}>
          <TimerCounterComp
            //  customStyles="template1-countdown"
            targetDate={getLocalTimeDate(data.startTime, 'YYYY-MM-DD HH:mm:ss')}
            onTimeUpdate={handleTimeUpdate}
          >
            <Typography textAlign={"center"} className='template1-countdown-headerText'>Time Remaining</Typography>
            <Grid container size={12} justifyContent="center" alignItems="center" direction="row" display={"flex"}>
              <Grid size={2} />
              <Grid size={2}>
                <Box display="flex" flexDirection="row" alignItems="baseline" justifyContent="center" className="template1-countdown-timerTypo">
                  <Typography textAlign={"center"} variant="h4" className='template1-countdown-timerDigit'>{day}</Typography>
                  <Typography textAlign={"center"}>Days</Typography>
                </Box>
              </Grid>
              <Grid size={2}>
                <Box display="flex" flexDirection="row" alignItems="baseline" justifyContent="center" className="template1-countdown-timerTypo">
                  <Typography variant="h4" className='template1-countdown-timerDigit'>{hour}</Typography>
                  <Typography>Hours</Typography>
                </Box>
              </Grid>
              <Grid size={2}>
                <Box display="flex" flexDirection="row" alignItems="baseline" justifyContent="center" className="template1-countdown-timerTypo">
                  <Typography variant="h4" className='template1-countdown-timerDigit'>{minute}</Typography>
                  <Typography>Minutes</Typography>
                </Box>
              </Grid>
              <Grid size={2}>
                <Box display="flex" flexDirection="row" alignItems="baseline" justifyContent="center" className="template1-countdown-timerTypo">
                  <Typography variant="h4" className='template1-countdown-timerDigit'>{second}</Typography>
                  <Typography>Seconds</Typography>
                </Box>
              </Grid>
            </Grid>
          </TimerCounterComp>
        </Grid>
      </Grid>
        {/* About section */}
      <Grid id="About" container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-about`} justifyContent={'center'} alignItems={'center'} spacing={2} direction={'column'} ref={aboutRef}>
        <Grid textAlign={{ xs: 'center', sm: 'center' }} className={`${classPrefix}-about-title`}>{`Welcome to the   ${truncateString(data?.name, 18, "Untitled")}`}</Grid>
        <Grid container className={`${classPrefix}-about-content`} textAlign={'center'}>{data?.description && parse(data?.description)}</Grid>
      </Grid>

        {/* Event Contributors section */}
        {(data?.eventSpeakers?.length > 0) && <EventContributorsSection classPrefix={`${classPrefix}-event-contributors`} data={data?.eventSpeakers} ref={contributorsRef} />}
        {/* Program section */}
        <Grid id={"Program"} container size={{ xs: 12, sm: 12 }} spacing={2} mb={10} ref={programRef}>
          <Grid size={{xs:12}} justifyContent={'center'} mt={{xs:2,sm:4}}><Typography className={`${classPrefix}-program-schedule-heading`}>Conference Program Schedule</Typography></Grid>
          <Grid container size={{xs:12}} justifyContent={'center'} alignItems="center" mb={{xs:2,sm:3}}>
            <Box className={`${classPrefix}-program-schedule-date`}>Event Start Date : {moment(data?.startTime)?.format('DD, MM, YYYY')}</Box>
          </Grid>
          <Grid className={`${classPrefix}-program-tabs-container`}>
            <Box className={`${classPrefix}-program-tabs-box`}>
              <Grid className={`${classPrefix}-program-tabs-list`} size={{ xs: 12, sm: 12 }}>
                {/* {Object.keys(groupedPrograms)?.map((date, index) => (
                  <CustomButton
                    key={index}
                    onClick={(event) => handleTabChange(event, date)}
                    className={`${classPrefix}-program-tabs-tab ${selectedDate === date ? `${classPrefix}-program-tabs-tab-active` : ``}`}
                    label={` Day ${index + 1}`}
                  />
                ))} */}
              </Grid>
            </Box>
          </Grid>
          <Grid  container spacing={3} className={`${classPrefix}-program-content-container`} mt={2} direction="column" alignContent={'center'} size={{ xs: 12, sm: 12 }}>
            {generalAddsOn?.map((item: any, index: number) => (
              <Grid  size={{ xs: 11 }} justifyContent={'center'}  pl={{xs:2,md:4}} p={2} key={index} 
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
              <Grid  onClick={() => handleProgramCardClick(item)} size={{ xs: 11 }} justifyContent={'center'}  pl={{xs:2,md:4}} p={2} key={index} 
                className={`${classPrefix}-program-content-item ${item?.type === 'program' ? `${classPrefix}-program-content-item-program` : `${classPrefix}-program-content-item-addon`}`}
              >
                <Grid container alignItems="center" spacing={3}>
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
          <ProgramDetailsModal/>
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
        {/* Sponsor */}
        <Grid  minHeight={"max-content"} size={12} container>
         <SponsorShip/>
        </Grid>

        {/* Footer section */}
        <FooterSection classPrefix={`${classPrefix}-footer`} data={data} />
    </Grid>
});

export default Template1;

const MobileNavbar = React.memo(({ classPrefix, data, slugInfo, handleOpenDrawer, }: { classPrefix: any, data: any, slugInfo: any, handleOpenDrawer: () => void }) => {

  const baseUrl = config.api.url;

  return (
      <>

          <Grid className={`${classPrefix}-logo`}>

              {(data?.assetId || slugInfo?.assetId) ?
                  <img
                      className={`${classPrefix}-logo-img`}
                      src={`${baseUrl}asset/${data?.assetId ?? slugInfo?.assetId ?? ''}`}
                  />
                  :
                  <Grid></Grid>
              }

          </Grid>

          <Grid >
              <MenuIcon onClick={handleOpenDrawer} className={`${classPrefix}-burger`} />
          </Grid>
      </>
  )

}
)
