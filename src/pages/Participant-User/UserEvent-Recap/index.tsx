import { Button, Tab, Tabs, Typography, Box, Avatar, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { Logger } from '@/Utils/Logger';
import { formatDateTimeRange, toTitleCase, truncateString } from '@/Utils/CommonBaseClass';
import React from 'react';
import useStore from '@/Libs/store';
import StatusComponent from '@/components/Status/StatusComponent';
import { useLocation } from 'react-router-dom';
// import QRCode from 'qrcode';
// import jsPDF from 'jspdf';
import moment from 'moment';
import { SkeletonList } from '@/components/Skeleton';
import UserUploadAbstract from './UserUploadAbstract';
import { Mapper } from '@/components/Mapper/Mapper';
import DateRangeIcon from "@mui/icons-material/DateRange";
import config from "../../../../config.json";
import { AddOnIcon, ProgramIcon } from '@/assets/svg';
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "../UserEvent-Recap/TicketPDF";

/**
 *
 */

// interface Event {
//   event: any;
//   abstractDate?: string | null;
//   amount: string;
//   assetId?: number | null;
//   attendees: Array<any>; // Adjust `any` to a more specific type if attendees have a structure
//   companyId: number;
//   description: string;
//   discount?: number | null;
//   endTime: string;
//   eventClass: string; // Example: "OFFLINE"
//   id: number;
//   interval?: number | null;
//   isAbstract?: boolean | null;
//   name: string;
//   parentId?: number | null;
//   published: boolean;
//   registrationDeadline?: string | null;
//   slugName?: string | null;
//   specialtyId?: number | null;
//   startTime: string;
//   statusId: number;
//   templateId?: number | null;
//   title?: string | null;
//   url?: string | null;
// }

/**
 * UpcomingEvent component renders a list of upcoming events and includes a search bar
 */
const EventRecap: React.FC = React.memo(() => {
  const setDataById = useStore((state: any) => state.setDataById);
  const { eventId } = useLocation().state || {};
  const [eventLoading, setEventLoading] = useState(true);
  const eventData = useStore((state: any) => state?.compData?.['attendedPrograms']?.['event/registered/eventList']?.data) ?? [];
  const eventTicketData = useStore((state: any) => state?.compData?.['eventTicketData']?.['participant/payment/details']) ?? [];
  const POST = useStore((state: any) => state.POST);
  const userDetails = useStore(state => state?.compData?.['userDetails']) ?? {};
  const Program = useStore((state: any) => state?.compData?.['programs']?.data) ?? [];
  // const currency = config.currency;
  /**
   * attended status
   */
  const attendeeStatus = eventData[0]?.participants[0]?.eventParticipants[0]?.event?.attendees ?? [];

  const eventDataLoading = useStore((state: any) => state?.compData?.['attendedPrograms']?.['event/registered/eventList']?.loading) ?? [];


  
  /**
   * Fetch event details when the component mounts
   */
  useEffect(() => {
    EventDetails();
    eventTicketDataApi();
    setDataById('eventTab', { tabIndex: 0 });
  }, []);


  /**
   * get evenet details
   */
  const EventDetails = async () => {
    setEventLoading(true);
    try {
      const filter = {
        filters: {
          id: eventId,
        },
      };
      await POST({
        url: `event/registered/eventList`,
        body: filter,
        id: 'attendedPrograms',
        successCB: (context: any) => {
          setDataById('programs', {
            data: context?.data[0]?.participants?.[0]?.eventParticipants,
          });
        },
        errorCB: (context: any) => {
          setDataById('snackBarInfo', {
            open: true,
            autoHideDuration: 2000,
            severity: 'error',
            message: context?.message,
          });
        },
      });
    } catch (error) {
      Logger.error(error, 'EventDetails');
    } finally {
      setEventLoading(false);
    }
  };
  /**
   * get event ticket details
   */
  const eventTicketDataApi = async () => {
    try {
      await POST({
        url: `participant/payment/details`,
        body: { eventId: eventId },
        id: 'eventTicketData',
        errorCB: (context: any) => {
          setDataById('snackBarInfo', {
            open: true,
            autoHideDuration: 2000,
            severity: 'error',
            message: context?.message,
          });
        },
      });
    } catch (error) {
      Logger.error(error, 'EventDetails');
    } finally {
      setEventLoading(false);
    }
  };
  /**
   * handle to generate the pdf
   */
//   const handlePdfGenerate = async () => {
//     try {
//       const pdf = new jsPDF({
//         orientation: 'portrait', // Use landscape if needed
//         unit: 'mm',
//         format: [149.53, 268], // Custom size in mm
//       });
//       const horizontalPadding = 10; // Padding on left and right
//       const verticalPadding = 3; // Padding on top and bottom
//       const pageWidth = pdf.internal.pageSize.width;
//       const currentYPosition = verticalPadding;

//       // Fill the entire page with white (ID card size)
//       pdf.setFillColor(255, 255, 255); // White color
//       pdf.rect(0, 0, 85.6, 53.98, 'F'); // ID card dimensions
//       pdf.setFont('helvetica', 'bold');
//       pdf.setTextColor(51, 51, 51); 
//       pdf.setFontSize(19)
//       pdf.text(eventData?.[0]?.name ? toTitleCase(eventData[0]?.name) : '', horizontalPadding-4, currentYPosition + 8);
//       pdf.setTextColor(0, 0, 0); // Reset to black for the rest of the text

//       // pdf.setFontSize(8), pdf.setFont('helvetica', 'normal');


//       pdf.setFontSize(10), pdf.setFont('helvetica', 'normal');
//       // pdf.setFont('Inter','',500)
//       //   pdf.text('Your Gateway to Innovation and Technology!',horizontalPadding,currentYPosition+10)

//       // Adjust the Y position for the line to be below the text
//       const lineYPosition = currentYPosition + 15; // You can adjust this value depending on your font size and line spacing

//       // Draw the line just below the text
//       pdf.setLineWidth(0.8); // Set the line width
//       pdf.setDrawColor(4, 128, 211); 
//       pdf.setFontSize(18);
      
//       pdf.line(5, lineYPosition, 145, lineYPosition);
//       const text = 'Ticket Details';
//       pdf.setFont('helvetica', 'bold');
//       const textWidth = (pdf.getStringUnitWidth(text) * 12) / pdf.internal.scaleFactor;

      
//       const xPosition = (pageWidth - textWidth) / 2; // Center horizontally
//       pdf.text(text, xPosition-10, 28);

//       pdf.setFontSize(15), pdf.setFont('helvetica', 'bold');

//       pdf.text('Attendee Name', horizontalPadding, 48);
//       pdf.setFont('helvetica', 'normal');
//       pdf.text(userDetails?.firstName + ' ' + userDetails?.lastName, pageWidth / 2.3, 48);
//       pdf.setFont('helvetica', 'bold');
//       // pdf.text('Ticket Id',horizontalPadding,45)
//       // pdf.setFont("helvetica", "normal");
//       // pdf.text('TECH2024-12345',pageWidth/2,45)
//       // pdf.setFont('helvetica', 'bold');
//       // pdf.text('Ticket Id', horizontalPadding, 60);
//       pdf.setFont('helvetica', 'bold');
//       pdf.text('Event Name', horizontalPadding, 58);
//       pdf.setFont('helvetica', 'normal');
//       pdf.text(eventData?.[0]?.name, pageWidth / 2.3, 58);
//       pdf.setFont('helvetica', 'bold');
//       pdf.text('Event Date', horizontalPadding, 68);
//       pdf.setFont('helvetica', 'normal');
//       pdf.text(moment(eventData?.[0]?.startTime).format('MMMM D, YYYY'), pageWidth / 2.3, 68);
//       pdf.setFont('helvetica', 'bold');
//       pdf.text('Location', horizontalPadding, 78);
//       pdf.setFont('helvetica', 'normal');
//       let locationText = '';
// if (eventData[0]?.eventClass === 'OFFLINE') {
//   locationText = eventData[0]?.venue?.address || 'N/A';
// } else if (eventData[0]?.eventClass === 'HYBRID') {
//   locationText = `${eventData[0]?.venue?.address || 'N/A'}\n${eventData[0]?.url || 'N/A'}`;
// } else if (eventData[0]?.eventClass === 'ONLINE') {
//   locationText = eventData[0]?.url || 'N/A';
// }
//       // Calculate the maximum width for the text
//       const maxWidth = pageWidth / 2;

//       // Split the text into multiple lines based on the max width
//       const lines = pdf.splitTextToSize(locationText, maxWidth);

//       // Set the initial Y position for the text

//       // Loop through each line and add it to the PDF, with proper Y positioning
//       lines.forEach((line: any, index: any) => {
//         pdf.text(line, pageWidth / 2.3, 78 + index * 9); // Increment Y position for each line
//       });

//             // Draw the line just below the text
//             pdf.setLineWidth(0.8); // Set the line width
//             pdf.setDrawColor(4, 128, 211); 
//             pdf.setFontSize(18);
            
//             pdf.line(5, 108, 145, 108);
                      
            
//       const qrCodeTopRight = await QRCode.toDataURL(eventTicketData?.data?.ParticipantDetails?.qrCode);
//       // Adjust QR code size to fit nicely on the ID card
//       pdf.addImage(qrCodeTopRight, 'PNG', pageWidth / 3, 208, 50, 50); // Position (60, 10), size 20x20 mm
//       // Draw the line just below the text

//       // Draw the line just below the text
//       pdf.setLineWidth(0.8); // Set the line width
//       pdf.setDrawColor(4, 128, 211); 
//       pdf.setFontSize(18);
//       pdf.line(5, 198, 145, 198);

//       // Set line color (optional)
//       pdf.setDrawColor(4, 128, 211); // Black color (RGB)

//       // Set line width (optional)
//       pdf.setLineWidth(0.5); // Default is 0.2 mm, you can set it higher for a thicker line
//       //
//       // pdf.setFont("helvetica", "bold");
//       // pdf.text('Additional Info',horizontalPadding,125);
//       // pdf.setFont("helvetica", "normal");
//       // pdf.text('Additional Info',horizontalPadding,135);

//       pdf.setFont('helvetica', 'bold');

//       pdf.text('Payment Information', xPosition - 17, 118);
//       //   pdf.text('Ticket Price', horizontalPadding, 135)
//       //   pdf.setFont("helvetica", "normal");
//       //   pdf.text('100', pageWidth / 2, 135)
//       //   pdf.setFont("helvetica", "bold");
//       //   pdf.text('Discount Applied', horizontalPadding, 145)
//       //   pdf.setFont("helvetica", "normal");
//       //   pdf.text('20', pageWidth / 2, 145);
//       pdf.setFontSize(15), pdf.setFont('helvetica', 'bold');
//       const paymentDate = moment(eventTicketData?.data?.PaymentDetails?.createdOn).format('Do MMMM YYYY') || "N/A";
//       const transactionId = eventTicketData?.data?.PaymentDetails?.transactionId || "N/A";
//       const totalAmount =eventTicketData?.data?.PaymentDetails?.amount 
//       ? `${currency} ${eventTicketData.data.PaymentDetails.amount}` 
//       : "N/A";
//       const discountApplied = eventTicketData?.data?.PaymentDetails?.order?.couponDeduction ? `${currency} ${eventTicketData?.data?.PaymentDetails?.order?.couponDeduction}` 
//       : "N/A";
//       const subTotal = eventTicketData?.data?.PaymentDetails?.order?.subTotal ? `${currency} ${eventTicketData?.data?.PaymentDetails?.order?.subTotal}` : "N/A";
//       const tax = eventTicketData?.data?.PaymentDetails?.order?.tax ? `${currency} ${eventTicketData?.data?.PaymentDetails?.order?.tax}` : "N/A";
//       pdf.setFont('helvetica', 'bold');
//       pdf.text('Discount Applied', horizontalPadding, 138);
//       pdf.setFont('helvetica', 'normal');
//       pdf.text(discountApplied, pageWidth / 2.3, 138);
//       pdf.setFont('helvetica', 'bold');
//       pdf.text('Sub Total', horizontalPadding, 148);
//       pdf.setFont('helvetica', 'normal');
//       pdf.text(subTotal, pageWidth / 2.3, 148);
//       pdf.setFont('helvetica', 'bold');
//       pdf.text('Tax', horizontalPadding, 158);
//       pdf.setFont('helvetica', 'normal');
//       pdf.text(tax, pageWidth / 2.3, 158);
//       pdf.setFont('helvetica', 'bold');
//       pdf.text('Total Paid', horizontalPadding, 168);
//       pdf.setFont('helvetica', 'normal');
//       pdf.text(totalAmount, pageWidth / 2.3, 168);
//       pdf.setFont('helvetica', 'bold');
//       pdf.text('Payment Date', horizontalPadding, 178);
//       pdf.setFont('helvetica', 'normal');
//       pdf.text(paymentDate, pageWidth / 2.3, 178);
//       pdf.setFont('helvetica', 'bold');
//       pdf.text('Transaction Id', horizontalPadding, 188);
//       pdf.setFont('helvetica', 'normal');
//       pdf.text(transactionId, pageWidth / 2.3, 188);
//       pdf.save('my-ticket.pdf');
//     } catch (error) {
//       console.error('Error loading image or generating PDF:', error);
//     }
//   };
  const tabInfo = useStore((state: any) => state?.compData?.['eventTab'])?.tabIndex || 0;

/***
 * combines the programes from same date
 */
  const combinedItems = [
    ...Program?.map((item:any) => ({
      ...item,
      startTime: item?.event?.startTime || null,
    })),
    ...Program?.map((item:any) => ({
      ...item,
      startTime: item?.eventAddon?.startTime || null,
    })),
  ].sort((a, b) => moment(a.startTime).diff(moment(b.startTime)));
  
 const groupedData = combinedItems.reduce((acc, program) => {
    const date = moment(program?.endTime).isValid()
      ? moment(program?.startTime).format("YYYY-MM-DD")
      : "Invalid Date";

    if (date === "Invalid Date") {
      if (!acc.invalid) acc.invalid = [];
      acc.invalid.push(program);
    } else {
      if (!acc[date]) acc[date] = [];
      acc[date].push(program);
    }
    return acc;
  }, {});


  /**
   * Handles the tab change event by updating the active tab index btw account-settings and security
   */
  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setDataById('eventTab', { tabIndex: newIndex });
  };

  return (
    <>
      {eventLoading  || eventDataLoading ? (
        <SkeletonList height={20} className="mt-4" />
      ) : (
        <Grid className="event-recap" container>
          <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} flexDirection={'row'} className="padding-x-20">
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography className="event-recap-header">My Events</Typography>
            </Grid>
           
          </Grid>
          <Grid container className="padding-x-20 event-info">
            <Grid container size={12} columnSpacing={2} className="event-recap-first-grid">
              <Grid>
                <Typography className="event-recap-first-grid-text">{eventData?.[0]?.name ? toTitleCase(eventData?.[0]?.name) : ''}</Typography>
              </Grid>
              <Grid>
                <Typography className="event-recap-first-grid-status-text">
                  <StatusComponent className="event-recap-first-grid-status" value={eventData?.data?.statusId.toString()} />
                </Typography>
              </Grid>
              <Grid size={12}>
                <Typography className="event-recap-first-grid-address">
                  {formatDateTimeRange({
                    date: eventData?.[0]?.startTime,
                    format: 'MMM D, YYYY',
                  })}-{formatDateTimeRange({
                    date: eventData?.[0]?.endTime,
                    format: 'MMM D, YYYY',
                  })}
                  <span className="mx-2">|</span>
                  {formatDateTimeRange({
                    date: eventData?.[0]?.startTime,
                    format: 'h:mm A',
                  })}
                  -
                  {formatDateTimeRange({
                    date: eventData?.[0]?.endTime,
                    format: 'h:mm A',
                  })}
                  <span className="mx-2">|</span>
                  {eventData?.[0]?.eventClass === "OFFLINE" ? 
                  `${eventData?.[0]?.venue?.city}, ${eventData?.[0]?.venue?.address}`:eventData?.[0]?.eventClass}
                </Typography>
              </Grid>
              <Grid size={12} className="event-recap-first-grid-buttons">
                {/* <Button className="event-recap-first-grid-buttons-firstButton" onClick={() => handlePdfGenerate()}>
                  Download Ticket
                </Button> */}
                <PDFDownloadLink document={<MyDocument data={eventData} userDetails={userDetails} eventTicketData={eventTicketData}/>} fileName="Ticket.pdf" onClick={()=>{}} >
                <Button className="event-recap-first-grid-buttons-firstButton" onClick={() => {}}>
                  Download Ticket
                </Button>                   
                </PDFDownloadLink>,
                {/* button hiidden */}
                <Button className="event-recap-first-grid-buttons-secondButton">Cancel Event</Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Tabs value={tabInfo} className="my-event-tabs" onChange={handleTabChange}>
              <Tab label="Registered Programs" className="account-tab-title account-tabs"></Tab>
              {eventData![0]?.isAbstract === 1 && <Tab label="Upload Abstract" className="account-tab-title account-tabs"></Tab>}
            </Tabs>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} className="border-bottom "></Grid>
          {tabInfo === 0 ? (
            Object.keys(groupedData)
            .filter((date) => date !== "Invalid date")
            .map((date) => (
              <Grid size={12} key={date}>
                {/* Date Header */}
                <Box className="event-sessions-date-header" display="flex" alignItems="center">
                  <DateRangeIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    {moment(date).format("MMMM D YYYY")}
                  </Typography>
                </Box>     
               <Grid container spacing={2} className="event-sessions-session-list">
                {Array.isArray(groupedData[date]) && (
                <Mapper
                  MapperData={groupedData[date]}
                  component={RegisteredProgramCard}
                  helperData={attendeeStatus}
                  WrapperComponent={({ children }) => (
                    <Grid columnSpacing={2} rowSpacing={2} className="event-recap-second-grid padding-x-20 pb-8" container size={12}>
                      {children}
                    </Grid>
                  )}
                />
                )}
               </Grid>
              </Grid>
          ))
          ) : (
            <UserUploadAbstract eventData={eventData && eventData![0]} />
          )}
        </Grid>
      )}
    </>
  );
});
export default EventRecap;

/**
 * RegisteredProgramCard component displays detailed information about a registered program.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.item - The program item containing event details such as name, start time, end time, and venue.
 * @param {Object} [props.helperData] - Optional helper data used to determine the status component value.
 *
 * @returns {JSX.Element} A grid layout containing the program's name, time, status, location, and speaker.
 */

const RegisteredProgramCard = ({ item, helperData }: { item: any; helperData?: any }) => {


   /**
    * Compares the given end date with today's date.
    * Compares the given start date with today's date.
    * This is used for checking the status of the program and addons
    */
    const today = moment().startOf('day');
    const endDate = moment(item?.endTime);
    const startDate = moment(item?.startTime);
    const isEndDatePast = endDate.isBefore(today, 'day');
    const isStartDatePast = startDate.isBefore(today,'day');
    
  const baseUrl = config.api.url;

  return (
    <>
      {item?.event ? (
       
          <Grid
            container
            spacing={0}
            size={{
              xs: 12,
              sm: 4,
              md: 3,
            }}
            flexDirection={"row"}
          >
            <Grid size={12} container className="event-sessions-session-card">
            <Grid container size={12} className="card-header">
            <Grid container size={12} className="card-header" justifyContent="space-between" alignItems="center">
            <Grid container size={10} gap={0} alignItems="center">
            {item?.eventAddon?.length> 0 ? (
       <>
      <AddOnIcon className="svg-icon"/>
      <Grid container ><Typography className="card-header-tag">Add-On</Typography></Grid>
      </>
      ):(
      <>
      <ProgramIcon  className="svg-icon"/>
      <Grid container > <Typography className="card-header-tag">Program</Typography></Grid>
      </>
       )}
       </Grid>

        <Grid size={2} container justifyContent="flex-end">
            <Typography className="event-recap-second-grid-content-status-text" justifySelf={'flex-end'}>
            {isEndDatePast ? ( <StatusComponent value="11" />) : isStartDatePast ? (
                                helperData?.length === 0 ? (<StatusComponent value="7" />
                                ) : (<StatusComponent value="8" /> )) : (<StatusComponent value="14" />
                                )}
          </Typography>
          </Grid>
              </Grid>


            </Grid>
            <Grid className="card-content"    size={12} >

            <Grid container size={12}>
        <Typography className="card-content-heading">
        {truncateString(item.event?.name ? toTitleCase(item.event?.name) : '',25)}
        </Typography>
       </Grid>
       <Grid container size={12}>
        <Typography className="card-content-description">
          {item.event?.eventClass==="OFFLINE"?(
          <>
          Location:{item?.event?.venue?.city + ',' + item?.event?.venue?.country}
          </>
          ):(<>Mode:{item.event?.eventClass}</>)}
              </Typography>
       </Grid>

       <Grid className="card-content-devider">
        <Divider/>
       </Grid>
       <Grid className="card-content-heading" >
       {item?.event?.eventSpeakers?.length > 0 && (

       <Grid className="card-content-heading"  gap={1}minHeight="5rem" display={"flex"}direction={"column"}>
       {item?.event?.eventSpeakers?.map((speaker: any, index: number) => (
                    <Grid key={index} display="flex" alignItems="center" gap={1}>
                        {speaker?.user?.assetId ? (
                      <Avatar
                         src={`${baseUrl}asset/${speaker?.user?.assetId}`}
          
                            alt={`${speaker.name || "User Profile"}`}
                              variant="circular"
                        />
                        ) : (
                     <Avatar className="session-speaker-avatar">
                    {`${speaker?.user?.firstName[0]}${speaker?.user?.lastName[0]}`}
                    </Avatar>
                   )}
                    </Grid>
                        ))}
        </Grid>
       )}
        <Grid className="card-content-timeBox"  >
         <Typography className="time" >
         {formatDateTimeRange({
              date: item.event?.startTime,
              format: 'h:mm A',
            })}-
            {formatDateTimeRange({ date: item?.event?.endTime, format: 'h:mm A' })}
        </Typography>
        </Grid>
        </Grid>
        </Grid>
            </Grid>
          </Grid>
      ):item.eventAddon?(<Grid
        container
        spacing={0}
        size={{
          xs: 12,
          sm: 4,
          md: 3,
        }}
        flexDirection={"row"}
      >
        <Grid size={12} container className="event-sessions-session-card">
          {/* Card Header */}
          <Grid container size={12} className="card-header" justifyContent="space-between" alignItems="center">
            {/* Icon and Tag */}
            <Grid container size={10} gap={0} alignItems="center">
              <AddOnIcon className="svg-icon" />
              <Grid container>
                <Typography className="card-header-tag">Add-On</Typography>
              </Grid>
            </Grid>

            {/* Status Component */}
            <Grid size={2} container justifyContent="flex-end">
              <Typography className="event-recap-second-grid-content-status-text" justifySelf={'flex-end'}>
              {isEndDatePast ? ( <StatusComponent value="11" />) : isStartDatePast ? (
                                helperData?.length === 0 ? (<StatusComponent value="7" />
                                ) : (<StatusComponent value="8" /> )) : (<StatusComponent value="14" />
                                )}
              </Typography>
            </Grid>
          </Grid>

          {/* Card Content */}
          <Grid className="card-content" size={12}>
            {/* Name */}
            <Grid container size={12}>
              <Typography className="card-content-heading">
                {truncateString(item.eventAddon?.addon?.name ? toTitleCase(item.eventAddon?.addon?.name) : '', 25)}
              </Typography>
            </Grid>

            {/* Description */}
            <Grid container size={12}>
              <Typography className="card-content-description">
              {truncateString(item.eventAddon?.addon?.description ? toTitleCase(item.eventAddon?.addon?.description) : '', 25)}
              </Typography>
            </Grid>

            {/* Divider */}
            <Grid className="card-content-devider" size={12}>
              <Divider />
            </Grid>
            <Grid className="card-content-heading" >
                <Typography className="card-content-description" >
                  {`Items: ${item?.eventAddonProperty?.name}`}-
                  {`Price: ${item?.eventAddonProperty?.amount}`}
                </Typography>
            </Grid>
            {/* Time */}
            <Grid className="card-content-timeBox">
              <Typography className="time">
                {formatDateTimeRange({
                  date: item.eventAddon?.startTime,
                  format: 'h:mm A',
                })}
                -
                {formatDateTimeRange({
                  date: item.eventAddon?.endTime,
                  format: 'h:mm A',
                })}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    ) : null}
    </>
  );
  
};


{/* 
<Grid container size={12} className="daate_time " columnSpacing={8}>
        <Grid size={6} className="event-recap-second-grid-content-time">
          <Typography className="event-recap-second-grid-content-time-text">
            {formatDateTimeRange({
              date: item.event?.startTime,
              format: 'h:mm A',
            })}-
            {formatDateTimeRange({ date: item?.event?.endTime, format: 'h:mm A' })}
          </Typography>
        </Grid>
        <Grid className="event-recap-second-grid-content-status">
          <Typography className="event-recap-second-grid-content-status-text">
            <StatusComponent value={helperData?.length == 0 ? '7' : '8'} />
          </Typography>
        </Grid>
      </Grid>
      <Grid className="event-recap-second-grid-content-title" size={12}>
        <Typography className="event-recap-second-grid-content-title-text">{item.event?.name ? toTitleCase(item.event?.name) : ''}</Typography>
      </Grid>
      <Grid className="event-recap-second-grid-content-location" size={12}>
        <Typography className="event-recap-second-grid-content-location-text">
          {item.event?.eventClass==="OFFLINE"?(
          <>
          Location:{item?.event?.venue?.city + ',' + item?.event?.venue?.country}
          </>
          ):(<>Mode:{item.event?.eventClass}</>)}
        </Typography>
      </Grid>
      {item?.event?.eventSpeakers?.length > 0 &&
      <Grid className="card-content-heading" minHeight={"5rem"}>
           <Grid>
                   <Typography className="event-recap-second-grid-content-location-text">
                   Speakers  
                   </Typography>
            </Grid>
                <Grid className="card-content-heading"  gap={1}minHeight="5rem" display={"flex"}direction={"column"} >
                   {item?.event?.eventSpeakers?.map((speaker: any, index: number) => (
                    <Grid key={index} display="flex" alignItems="center" gap={1}>
                        {speaker?.user?.assetId ? (
                      <Avatar
                         src={`${baseUrl}asset/${speaker?.user?.assetId}`}
          

                            alt={`${speaker.name || "User Profile"}`}
                              variant="circular"
                        />
                        ) : (
                          //className="main-user-profile main-user-profile-text"
                     <Avatar className="session-speaker-avatar">
                    {`${speaker?.user?.firstName[0]}${speaker?.user?.lastName[0]}`}
                    </Avatar>
                   )}
                    <Typography>
                     { speaker?.user?.firstName}{ speaker?.user?.lastName}
                    </Typography>
                    </Grid>
                        ))}
                    </Grid>
                    </Grid>}
    </Grid> */}