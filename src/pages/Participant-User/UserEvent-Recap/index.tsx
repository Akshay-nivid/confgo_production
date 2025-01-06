import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete';
import { Button, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Logger } from '@/Utils/Logger';
import { formatDateTimeRange, toTitleCase } from '@/Utils/CommonBaseClass';
import React from 'react';
import useStore from '@/Libs/store';
import StatusComponent from '@/components/Status/StatusComponent';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import moment from 'moment';
import { SkeletonList } from '@/components/Skeleton';
import UserUploadAbstract from './UserUploadAbstract';
import { Mapper } from '@/components/Mapper/Mapper';

/**
 *
 */

interface Event {
  event: any;
  abstractDate?: string | null;
  amount: string;
  assetId?: number | null;
  attendees: Array<any>; // Adjust `any` to a more specific type if attendees have a structure
  companyId: number;
  description: string;
  discount?: number | null;
  endTime: string;
  eventClass: string; // Example: "OFFLINE"
  id: number;
  interval?: number | null;
  isAbstract?: boolean | null;
  name: string;
  parentId?: number | null;
  published: boolean;
  registrationDeadline?: string | null;
  slugName?: string | null;
  specialtyId?: number | null;
  startTime: string;
  statusId: number;
  templateId?: number | null;
  title?: string | null;
  url?: string | null;
}

/**
 * UpcomingEvent component renders a list of upcoming events and includes a search bar
 */
const EventRecap: React.FC = React.memo(() => {
  const { control } = useForm();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const setDataById = useStore((state: any) => state.setDataById);
  const { eventId } = useLocation().state || {};
  const [eventLoading, setEventLoading] = useState(true);
  const eventData = useStore((state: any) => state?.compData?.['attendedPrograms']?.['event/registered/eventList']?.data) ?? [];
  const eventTicketData = useStore((state: any) => state?.compData?.['eventTicketData']?.['participant/payment/details']) ?? [];
  const POST = useStore((state: any) => state.POST);
  const userDetails = useStore(state => state?.compData?.['userDetails']) ?? {};
  const Program = useStore((state: any) => state?.compData?.['programs']);

  /**
   * attended status
   */
  const attendeeStatus = eventData[0]?.participants[0]?.eventParticipants[0]?.event.attendees;

  /**
   * Event program details
   */
  const eventProgram = eventData?.[0]?.participants?.[0]?.eventParticipants;
  /**
   * Function to handle search API for autocomplete
   */
  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      // let req: any = {
      //     filters: {
      //         name: query,
      //     },
      // };
      // const response = await await apiClient.post(`event/registered/eventList`, req);
      // const { status, data } = await processAPIResponse(response, "eventList");
      const filteredEvents = eventProgram.filter((item: any) => item.event?.name?.toLowerCase().includes(query.toLowerCase()));
      if (filteredEvents) {
        const data = filteredEvents.map((item: Event) => item.event);
        setSearchResults(data);
      }
    } catch (error) {
      Logger.error(error, 'EventList.tsx');
    } finally {
      setLoading(false);
    }
  };
  /**
   * Fetch event details when the component mounts
   */
  useEffect(() => {
    EventDetails();
    eventTicketDataApi();
  }, []);

  /**
   * Function to handle search API for autocomplete
   *  New handler for when an event is selected from autocomplete
   * @param selected
   */
  const handleAutocompleteChange = async (selected: any) => {
    if (selected) {
      try {
        // await POST({
        //   url: "event/list",
        //   body: {
        //     filters: {id: selected.id},
        //   },
        // id: 'userLatestEvents',
        // errorCB: (context: any) => {
        //     setDataById("snackBarInfo", {
        //       open: true,
        //       autoHideDuration: 2000,
        //       severity: "error",
        //       message: context?.message,
        //     });
        //   },
        // });
        const selectedData = eventProgram.find((program: any) => program.event.id === selected.id);
        if (selectedData) {
          setDataById('programsNew', { data: [selectedData] });
        }
      } catch (error) {
        Logger.error('An error occurred:', error);
      }
    }
  };
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
  const handlePdfGenerate = async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait', // Use landscape if needed
        unit: 'mm',
        format: [149.53, 204.17], // Custom size in mm
      });
      const horizontalPadding = 10; // Padding on left and right
      const verticalPadding = 3; // Padding on top and bottom
      const pageWidth = pdf.internal.pageSize.width;
      const currentYPosition = verticalPadding;
      // Fill the entire page with white (ID card size)
      pdf.setFillColor(255, 255, 255); // White color
      pdf.rect(0, 0, 85.6, 53.98, 'F'); // ID card dimensions
      pdf.setFont('helvetica', 'bold');
      // Generate the QR code image URL
      pdf.text(eventData?.[0]?.name ? toTitleCase(eventData[0]?.name) : '', horizontalPadding, currentYPosition + 2);
      pdf.setFontSize(10), pdf.setFont('helvetica', 'normal');
      // pdf.setFont('Inter','',500)
      //   pdf.text('Your Gateway to Innovation and Technology!',horizontalPadding,currentYPosition+10)

      // Adjust the Y position for the line to be below the text
      const lineYPosition = currentYPosition + 15; // You can adjust this value depending on your font size and line spacing

      // Draw the line just below the text
      pdf.setLineWidth(0.5); // Set the line width
      pdf.setDrawColor(4, 128, 211); // Set the line color (black)
      pdf.line(5, lineYPosition, 145, lineYPosition);
      const text = 'Ticket Details';
      pdf.setFont('helvetica', 'bold');
      const textWidth = (pdf.getStringUnitWidth(text) * 12) / pdf.internal.scaleFactor;

      const xPosition = (pageWidth - textWidth) / 2; // Center horizontally
      pdf.text(text, xPosition, 25);

      pdf.text('Attendee Name', horizontalPadding, 35);
      pdf.setFont('helvetica', 'normal');
      pdf.text(userDetails?.firstName + ' ' + userDetails?.lastName, pageWidth / 2, 35);
      pdf.setFont('helvetica', 'bold');
      // pdf.text('Ticket Id',horizontalPadding,45)
      // pdf.setFont("helvetica", "normal");
      // pdf.text('TECH2024-12345',pageWidth/2,45)
      pdf.setFont('helvetica', 'bold');
      pdf.text('Event Name', horizontalPadding, 45);
      pdf.setFont('helvetica', 'normal');
      pdf.text(eventData?.[0]?.name, pageWidth / 2, 45);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Event Date', horizontalPadding, 55);
      pdf.setFont('helvetica', 'normal');
      pdf.text(moment(eventData?.[0]?.startTime).format('MMMM D, YYYY'), pageWidth / 2, 55);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Location', horizontalPadding, 65);
      pdf.setFont('helvetica', 'normal');
      const address =
        eventData[0]?.venue?.address +
        ',' +
        eventData?.[0]?.venue?.city +
        ',' +
        eventData?.[0]?.venue?.state +
        ',' +
        eventData?.[0]?.venue?.country +
        ',' +
        eventData?.[0]?.venue?.postalCode;
      // Calculate the maximum width for the text
      const maxWidth = pageWidth / 2;

      // Split the text into multiple lines based on the max width
      const lines = pdf.splitTextToSize(address, maxWidth);

      // Set the initial Y position for the text

      // Loop through each line and add it to the PDF, with proper Y positioning
      lines.forEach((line: any, index: any) => {
        pdf.text(line, pageWidth / 2, 65 + index * 10); // Increment Y position for each line
      });
      const qrCodeTopRight = await QRCode.toDataURL(eventTicketData?.data?.ParticipantDetails?.qrCode);
      // Adjust QR code size to fit nicely on the ID card
      pdf.addImage(qrCodeTopRight, 'PNG', pageWidth / 2 - 20, currentYPosition + 75, 30, 30); // Position (60, 10), size 20x20 mm
      // Draw the line just below the text

      const startX = 5; // Start of the line (x1)
      const startY = currentYPosition + 115; // Y position of the line (y1)
      const endX = 145; // End of the line (x2)
      const endY = currentYPosition + 115; // Y position of the line (y2), same as startY for horizontal line

      // Set line color (optional)
      pdf.setDrawColor(4, 128, 211); // Black color (RGB)

      // Set line width (optional)
      pdf.setLineWidth(0.5); // Default is 0.2 mm, you can set it higher for a thicker line

      // Draw the line
      pdf.line(startX, startY, endX, endY);

      //
      // pdf.setFont("helvetica", "bold");
      // pdf.text('Additional Info',horizontalPadding,125);
      // pdf.setFont("helvetica", "normal");
      // pdf.text('Additional Info',horizontalPadding,135);

      pdf.setFont('helvetica', 'bold');

      pdf.text('Payment Details', xPosition, 125);
      //   pdf.text('Ticket Price', horizontalPadding, 135)
      //   pdf.setFont("helvetica", "normal");
      //   pdf.text('100', pageWidth / 2, 135)
      //   pdf.setFont("helvetica", "bold");
      //   pdf.text('Discount Applied', horizontalPadding, 145)
      //   pdf.setFont("helvetica", "normal");
      //   pdf.text('20', pageWidth / 2, 145);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Paid', horizontalPadding, 135);
      pdf.setFont('helvetica', 'normal');
      pdf.text(eventTicketData?.data?.PaymentDetails?.amount, pageWidth / 2, 135);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Payment Date', horizontalPadding, 145);
      pdf.setFont('helvetica', 'normal');
      pdf.text(moment(eventTicketData?.data?.PaymentDetails?.createdOn).format('DD-MM-YYYY hh:mm A'), pageWidth / 2, 145);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Payment Reference Id', horizontalPadding, 155);
      pdf.setFont('helvetica', 'normal');
      pdf.text(eventTicketData?.data?.PaymentDetails?.paymentReferenceNumber, pageWidth / 2, 155);
      pdf.save('my-ticket.pdf');
    } catch (error) {
      console.error('Error loading image or generating PDF:', error);
    }
  };
  const tabInfo = useStore((state: any) => state?.compData?.['eventTab'])?.tabIndex || 0;



  /**
   * Handles the tab change event by updating the active tab index btw account-settings and security
   */
  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setDataById('eventTab', { tabIndex: newIndex });
  };

  return (
    <>
      {eventLoading ? (
        <SkeletonList height={20} className="mt-4" />
      ) : (
        <Grid className="event-recap" container>
          <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} flexDirection={'row'} className="padding-x-20">
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Typography className="event-recap-header">My Events</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 5, md: 5 }}>
              <CustomAutocomplete
                name="search"
                className="custom-search-event-text-field"
                control={control}
                options={searchResults}
                getOptionLabel={(option: any) => option.name || ''}
                onSearch={handleSearch}
                loading={loading}
                placeholder="Search"
                onChange={handleAutocompleteChange}
              />
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
                    format: 'MMMM D, YYYY',
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
                  {eventData?.[0]?.venue?.city + ', ' + eventData?.[0]?.venue?.address}
                </Typography>
              </Grid>
              <Grid size={12} className="event-recap-first-grid-buttons">
                <Button className="event-recap-first-grid-buttons-firstButton" onClick={() => handlePdfGenerate()}>
                  View Ticket
                </Button>
                {/* button hiidden */}
                <Button className="event-recap-first-grid-buttons-secondButton">Cancel Event</Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Tabs value={tabInfo} className="my-event-tabs" onChange={handleTabChange}>
              <Tab label="Registered Programmes" className="account-tab-title account-tabs"></Tab>
              {eventData![0]?.isAbstract === 1 && <Tab label="Upload Abstract" className="account-tab-title account-tabs"></Tab>}
            </Tabs>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} className="border-bottom "></Grid>
          {tabInfo === 0 ? (
            <Mapper
              MapperData={Program?.data}
              component={RegisteredProgramCard}
              helperData={attendeeStatus}
              WrapperComponent={({ children }) => (
                <Grid columnSpacing={2} rowSpacing={2} className="event-recap-second-grid padding-x-20 pb-8" container size={12}>
                  {children}
                </Grid>
              )}
            />
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
  return (
    <Grid size={{ lg: 4, sm: 12 }} rowSpacing={1} container className="event-recap-second-grid-content">
      <Grid container size={12} className="daate_time " columnSpacing={8}>
        <Grid size={6} className="event-recap-second-grid-content-time">
          <Typography className="event-recap-second-grid-content-time-text">
            {formatDateTimeRange({
              date: item.event?.startTime,
              format: 'h:mm A',
            })}
            ,{formatDateTimeRange({ date: item.endTime, format: 'h:mm A' })}
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
          Location:
          {item?.event?.venue?.city + ',' + item?.event?.venue?.country}
        </Typography>
      </Grid>
      <Grid className="event-recap-second-grid-content-speaker" size={12}>
        <Typography className="event-recap-second-grid-content-speaker-text">Speaker:swayer</Typography>
      </Grid>
    </Grid>
  );
};
