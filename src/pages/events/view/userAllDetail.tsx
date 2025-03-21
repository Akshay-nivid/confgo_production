/**
 * all the details of user for an event
 * @author Nevin
 * view the programs and other informations of the user
 */
import { useState } from "react";
import { Box, Modal, Tab, Tabs, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import "./userdetail.scss";
import React from "react";
import {  formatDateTimeRange } from "@/Utils/CommonBaseClass";
import NoEvents from "../../Participant-User/No-Event/NoEvent"
import UserUploadedFileCard from "./UserUploadedFileCard";
import config from "../../../../config.json";
import jsPDF from "jspdf";
import moment from "moment";
import QRCode from 'qrcode';
import backgroundImage from "../../../assets/png/Cert Template.png"
import signature from "../../../assets/png/signature.png"
import { Logger } from "@/Utils/Logger";
import  CloseIcon  from "../../../assets/svg/CloseModal.svg";
import DownloadModal from "../../../assets/svg/DownloadModal.svg"
import confgo  from "../../../../config.json"
import SessionCard from "./sessionCard";

interface DetailProps {
  userdetail: any;
}

/**
 * it contains all the information reguarding the user
 */
const UserAllDetail: React.FC <DetailProps> = ({ userdetail }) => { 
  const [tabValue, setTabValue] = useState(userdetail?.formData?.length !=0 ? 1 : 2); // Default to tab 1
  const [isModalOpen, setModalOpen] = useState(false); // State to control modal
  const [selectedFile, setSelectedFile] = useState<any>(null); // State for selected file
  const baseUrl = config.api.url;
  const [isIdproof, setisIdproof] = useState(false);
  const [isPass, setIsPass] = useState(false);
  const [isInvoice,setIsInvoice] = useState(false);
  const [isCertificate, setIsCertificate] = useState(false)
  const [certificatePdfUrl, setCertificatePdfUrl] = useState('');


  const currency=confgo.currency;
  //stores the customform data
  const cleanedFormData = userdetail?.formData?.map((item:any) => {
    const parsedResponse = JSON.parse(item.response);
    delete parsedResponse.fieldType; // Remove the fieldType key
    return parsedResponse; // Return the cleaned object
  });

  // Extracting the array dynamically, regardless of key name  
  let files: any[] = []; ;
  cleanedFormData?.forEach((dataItem: any) => {
    const dynamicKeyData = Object.values(dataItem)[0]; // Extract the first key's value (array of files)
    if (Array.isArray(dynamicKeyData)) {
      files = [...files, ...dynamicKeyData]; // Add all files to the 'files' array
    }
  });
  const details = userdetail?.details;

  //stores the payment informations
  const PaymentDetails = userdetail.payment;

  //stores the attendees informations 
  const attendanceDetails = userdetail?.attendanceDetails;
  /**
   * transform Attandence details
   */
  const transformAttendanceData = (attendanceDetails: any) => {
    // Extract relevant keys that may contain program data
    const possibleKeys = ["attendedPrograms", "upcomingPrograms", "absentPrograms"];
  
    // Find the first available key that contains data
    const activeKey = possibleKeys.find((key) => Array.isArray(attendanceDetails?.[key]));
  
    // If no valid data array is found, return an empty array
    if (!activeKey) return [];
  
    return attendanceDetails[activeKey]?.map(({ program, attendeeData }: any) => ({
      ...program,
      // speaker: program.speakers, // Replace with actual speakers if available
      // sponsor: program.sponsors, // Replace with actual sponsors if available
      checkInTime: attendeeData?.scanTime || "N/A",
      paymentStatus: PaymentDetails.state, 
    }));
  };

  const categories = [
    { label: "Event Sessions Attended", key: "attendedPrograms" },
    { label: "Upcoming Event Sessions", key: "upcomingPrograms" },
    { label: "Not Attended Events", key: "absentPrograms" },
  ];

  const handleTabChange = (newValue: any) => {
    setTabValue(newValue);
  };

  const handleOpenModalImage = (file: any) => {
    setSelectedFile(file);
    setModalOpen(true);
    setisIdproof(true);
  };

  // const handleOpenModalPass = () => {
  //   setModalOpen(true);
  //   setIsPass(true)
  // }

  // const handleopenModeInvoice =() => {
  //   setModalOpen(true);
  //   setIsInvoice(true);
  // }

  const handleOpenModalCertificate =() => {
    setModalOpen(true);
    setIsCertificate(true);

  }
  const handleCloseModal = () => {
    setModalOpen(false); 
    setSelectedFile(null);
    setisIdproof(false);
    setIsPass(false);
    setIsInvoice(false);
    setIsCertificate(false);
  };

  /**
   * Function to generate the invoice of payment
   */
  const handlePdfGenerateInvoice = async () => {
    try {    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4', // Standard page size for invoices
    });

    const companyName = userdetail?.details?.event?.company?.companyName || "N/A";
    const companyAddress = userdetail?.details?.event?.company?.companyAddress || "N/A";
    const companyEmail = userdetail?.details?.event?.company?.email || "N/A";
    const eventPhone = userdetail?.details?.event?.eventContacts?.[0]?.phone || "N/A";
    const clientName =userdetail?.details?.event?.name || "N/A";
    const clientEmail =userdetail?.details?.event?.eventContacts?.[0]?.email || "N/A";


    const name = userdetail?.details?.user?.firstName
      ? `${userdetail?.details?.user.firstName} ${userdetail.details.user.lastName || ""}`
      : "N/A";
      const userEmail = userdetail?.details?.user?.email ||"N/A"

    const paymentDate = userdetail?.payment?.createdOn
      ? moment(userdetail.createdOn).format("DD-MM-YYYY")
      : "N/A";
    const transactionId = userdetail?.payment?.transactionId || "N/A";
    const refNumber = userdetail?.payment?.paymentReferenceNumber || "N/A";
    const discount = userdetail?.payment?.order?.discountAmount || "N/A";
    const finalPrice = userdetail?.payment?.order?.finalPrice || "N/A";
    const addonTotal = userdetail?.payment?.order?.addonTotalAmount || "N/A";
    const programTotal = userdetail?.payment?.order?.programTotalAmount || "N/A";
    const tax = userdetail?.payment?.order?.tax || "N/A";
    const tierDiscount = userdetail?.payment?.order?.priceTierDiscount || "N/A";
    const subTotal = userdetail?.payment?.order?.subTotal || "N/A";
    const eventAmount = userdetail?.details?.event?.amount || "N/A";
    // General settings
    const pageWidth = pdf.internal.pageSize.width;
    const horizontalMargin = 15;
    const headerHeight = 50; 

    // Invoice Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text(companyName, horizontalMargin, 15);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(companyAddress, horizontalMargin, 20);
    pdf.setFont('helvetica', 'normal');
    pdf.text(companyEmail, horizontalMargin, 25);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('Invoice', pageWidth - horizontalMargin - 30, 15);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('#101020', pageWidth - horizontalMargin - 30, 20);
  
    pdf.setDrawColor(200, 200, 200);
    pdf.line(horizontalMargin, headerHeight -10, pageWidth - horizontalMargin, headerHeight-10);

    const maxWidth = 50; // Adjust based on PDF width
    // Client Information Section
    const clientInfoY = headerHeight; // Start Y position for Client Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('Event Contact Info:', horizontalMargin, clientInfoY);
    pdf.setFont('helvetica', 'normal');
    const wrappedEmail = pdf.splitTextToSize(clientEmail, maxWidth);

    pdf.text(clientName, horizontalMargin, clientInfoY + 8);
    pdf.text(wrappedEmail, horizontalMargin, clientInfoY + 16); 
    const emailHeight = wrappedEmail.length * 6; // 8px per line

    pdf.text(eventPhone, horizontalMargin, clientInfoY + 16 + emailHeight);
  
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bill To:', horizontalMargin + 60, clientInfoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(name, horizontalMargin + 60, clientInfoY + 8);
    const wrappedUserEmail = pdf.splitTextToSize(userEmail, maxWidth);
    pdf.text(wrappedUserEmail, horizontalMargin + 60, clientInfoY + 16);
  

    // Align Client Name, Issue Date, Due Date, and Amount Due properly
    const rightColumnX = pageWidth - horizontalMargin - 55; // Align the right column
    const valueOffset = 5; // Horizontal offset for the values
    pdf.setFont('helvetica', 'normal');
    pdf.text('Client Name:', rightColumnX - valueOffset, clientInfoY); 
    pdf.setFont('helvetica', 'normal');
    pdf.text(name, rightColumnX + 24, clientInfoY);

    pdf.setFont('helvetica', 'normal');
    pdf.text('Payment Date:', rightColumnX - valueOffset, clientInfoY + 8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(paymentDate, rightColumnX + 24, clientInfoY + 8); 
    pdf.setFont('helvetica', 'normal');
    pdf.text('transaction Id:', rightColumnX - valueOffset, clientInfoY + 16); 
    pdf.text(transactionId, rightColumnX + 24, clientInfoY + 16); 
    pdf.text('Ref Number:', rightColumnX - valueOffset, clientInfoY + 24);
    pdf.text(refNumber, rightColumnX + 24, clientInfoY + 24);

  
    // Divider line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(horizontalMargin, clientInfoY + 40, pageWidth - horizontalMargin, clientInfoY + 40);
  
    // Charges Section
    const chargesInfoY = headerHeight + 50; // Start Y position for Client Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('Charges', horizontalMargin, chargesInfoY);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Sub Total', horizontalMargin, chargesInfoY + 9);
    pdf.text(subTotal, rightColumnX + 24, chargesInfoY +9);
    pdf.text('Tier Discount', horizontalMargin, chargesInfoY + 18);
    pdf.text(tierDiscount, rightColumnX + 24, chargesInfoY + 18);
    pdf.text('Discount Amount', horizontalMargin, chargesInfoY + 27);
    pdf.text(discount, rightColumnX + 24, chargesInfoY + 27);
    pdf.text('Event Amount', horizontalMargin, chargesInfoY + 36);
    pdf.text(eventAmount, rightColumnX + 24, chargesInfoY + 36);
    pdf.text('Program Total Amount', horizontalMargin, chargesInfoY + 45);
    pdf.text(programTotal, rightColumnX + 24, chargesInfoY + 45);
    pdf.text('Addon Total Amount', horizontalMargin, chargesInfoY + 54);
    pdf.text(addonTotal, rightColumnX + 24, chargesInfoY + 54);
    // pdf.text('Tax(Inclusive)', horizontalMargin, chargesInfoY + 63);
    pdf.text(userdetail?.payment?.order?.taxInclusive ? 'Tax(Inclusive)' : 'Tax(Exclusive)', horizontalMargin, chargesInfoY + 63);
   
    pdf.text(tax, rightColumnX + 24, chargesInfoY + 63);

  
    // Total
    pdf.setFont('helvetica', 'bold');
    pdf.text('Grand Total', horizontalMargin, chargesInfoY + 72);
    pdf.text(finalPrice, rightColumnX + 24, chargesInfoY + 72);
  
    // Footer
    const footerY = pdf.internal.pageSize.height - 30;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(horizontalMargin, footerY - 5, pageWidth - horizontalMargin, footerY - 5);
  
    // pdf.setFont('helvetica', 'normal');
    // pdf.setFontSize(8);
    // pdf.text('Questions:', horizontalMargin, footerY);
    // pdf.text(companyName, horizontalMargin, footerY + 5);
  
    // Save PDF
    const pdfBlob = pdf.output('blob'); // Generate the PDF as a blob
        const pdfUrl = URL.createObjectURL(pdfBlob); // Create a blob URL
        window.open(pdfUrl, '_blank'); // Open in a new tab

  } catch (error) {
    Logger.error('Error generating PDF:', error);
  }
  
};

  /**
   * Function to generate the pass
  */
  const handlePdfGeneratePass = async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
  
      const pageWidth = pdf.internal.pageSize.width;
      let currentY = 20;
      const paddingX = 15;
  
      // Title Section
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(28);
      const maxTitleWidth = pageWidth - (2 * paddingX);  
      const titleLines = pdf.splitTextToSize(userdetail?.details?.event?.name, maxTitleWidth);
      pdf.text(titleLines, paddingX - 4, currentY);
      currentY += titleLines.length * 10; 
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'italic');

      // pdf.text('Your Gateway to Innovation and Technology!', pageWidth / 2, currentY + 8, { align: 'center' });
      pdf.setDrawColor(0);
      pdf.line(10, currentY + 14, pageWidth - 10, currentY + 14);
      currentY += 30;
      
      // Ticket Details Section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text('Ticket Details', pageWidth / 2, currentY, { align: 'center' });
      currentY += 12;
  
      const ticketDetails = [
        { label: 'Attendee Name:', value: `${userdetail?.details?.user?.firstName} ${userdetail?.details?.user?.lastName}` },
        { label: 'Event Name:', value: userdetail?.details?.event?.name || "N/A" },
        { label: 'Event Date:', value: `${moment(userdetail?.details?.event?.eventStartTime).format('MMMM D YYYY')} - ${moment(userdetail?.details?.event?.eventEndTime).format('MMMM D YYYY')}`  },
        { label: 'Event Time:', value:  `${moment(userdetail?.details?.event?.eventStartTime).format('hh:mm A')} - ${moment(userdetail?.details?.event?.eventEndTime).format('hh:mm A')}`  },
        { label: 'Location:', value: userdetail?.programs?.[0]?.event?.venue?.name || "N/A" }
      ];
  
      pdf.setFontSize(13);
      ticketDetails.forEach(detail => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(detail.label, paddingX, currentY);
        pdf.setFont('helvetica', 'normal');
        pdf.text(detail.value, paddingX + 65, currentY, { maxWidth: pageWidth - paddingX - 65 });
        currentY += 8;
      });
      
      currentY += 6;
      pdf.line(10, currentY, pageWidth - 10, currentY);
      currentY += 12;
  
      // Payment Information Section

      const amountPaid = userdetail?.payment?.order?.finalPrice || 0;
      if (amountPaid > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text('Payment Information', pageWidth / 2, currentY, { align: 'center' });
      currentY += 12;
  
      const paymentDetails = [
        { label: 'Sub Total:', value: userdetail?.payment?.order?.subTotal || "N/A"  },
        { label: 'Tax:', value: userdetail?.payment?.order?.tax || "N/A" },
        { label: 'Discount Applied:', value: userdetail?.payment?.order?.discountAmount || "N/A" },
        { label: 'Total Paid:', value: userdetail?.payment?.order?.finalPrice || "N/A" },
        { label: 'Payment Date:', value: moment(userdetail?.payment?.createdOn).format('MMMM D YYYY hh:mm:A') || "N/A"},
        { label: 'Transaction ID:', value: userdetail?.payment?.transactionId || "N/A" }
      ];
  
      pdf.setFontSize(13);
      paymentDetails.forEach(detail => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(detail.label, paddingX, currentY);
        pdf.setFont('helvetica', 'normal');
        pdf.text(detail.value, paddingX + 65, currentY);
        currentY += 8;
      });
      
      currentY += 6;
      pdf.line(10, currentY, pageWidth - 10, currentY);
      currentY += 12;
    }
      // QR Code Section
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      // pdf.text('Scan QR Code for Verification', pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;
      
      const qrCodeUrl = await QRCode.toDataURL(userdetail?.details?.qrCode, { margin: 1, scale: 10 });
      pdf.addImage(qrCodeUrl, 'PNG', pageWidth / 2 - 25, currentY, 50, 50);
      currentY += 60;
  
      // Generate and open the PDF
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  

/**
 * Function to generate the certificate
 */
const generateCertificatePDF = async () => {
  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

     // Certificate dimensions
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const name = `${userdetail?.details?.user?.firstName} ${userdetail?.details?.user?.lastName}`.toUpperCase();
  pdf.addImage(backgroundImage, 'PNG', 0, 0, pageWidth, pageHeight);


  // Certificate title
  pdf.setFont('Bahnschrift', 'bold');
  pdf.setFontSize(46);
  pdf.setTextColor(0,0,0); // Green title
  pdf.text('CERTIFICATE', pageWidth / 2, 50, { align: 'center' });

  pdf.setFont('Bahnschrift', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(105,105,105); // Green title
  pdf.text('OF APPRICIATION', pageWidth / 2, 60, { align: 'center' });

  // Subtitle
  pdf.setFont('Cera Round Pro DEMO','normal');
  pdf.setFontSize(30);
  pdf.setTextColor(59, 129, 144); // Black subtitle
  pdf.text('This certificate is Presented To:', pageWidth / 2, 95, { align: 'center' });

  // Recipient's Name
  pdf.setFont('times', 'bold');
  pdf.setFontSize(28);
  pdf.setTextColor(0, 0, 128); // Dark blue
  pdf.text(name, pageWidth / 2, 110, { align: 'center' });

// Add a long underscore below the recipient's name
const textWidth = pdf.getTextWidth('Recipient Name'); // Get the width of the text
const startX = (pageWidth / 2) - (textWidth / 2); // Start position for the line
const lineY = 112; // Position below the text
pdf.setDrawColor(0, 0, 0); // Black color for the line
pdf.setLineWidth(0.5); // Thin line
pdf.line(startX - 10, lineY, startX + textWidth + 10, lineY); // Add padding of 10 on both sides
  // Award Reason
  pdf.setFont('times', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(59, 129, 144); // Black text
  pdf.text(
    'In Recognition For a Record of Outstanding Accomplishments.',
    pageWidth / 2,
    130,
    { align: 'center' }
  );
const date = moment(userdetail?.details?.createdOn).format('DD-MM-YYYY') || 'N/A'
  // Date and Signature placeholders
  pdf.setFont('times', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(0,0,0);
  pdf.text(date,60,pageHeight-48, {align:'center'})
  pdf.text('Date', 60, pageHeight - 40, { align: 'center' });
  pdf.text('Signature', pageWidth - 70, pageHeight - 40, { align: 'center' });

  // Signature and date lines
  pdf.setDrawColor(0, 0, 0); // Black lines
  pdf.setLineWidth(0.5);
  pdf.line(40, pageHeight - 45, 80, pageHeight - 45); // Date line
  pdf.line(pageWidth - 90, pageHeight - 45, pageWidth - 50, pageHeight - 45); // Signature line

  // Signature Image Positioning
  const signatureX = pageWidth - 100; // X position
  const signatureY = pageHeight - 65; // Y position
  const signatureWidth = 50; // Width of the signature image
  const signatureHeight = 20; // Height of the signature image
  pdf.addImage(signature, 'PNG', signatureX, signatureY, signatureWidth, signatureHeight);


  // Decorative elements
  pdf.setFontSize(12);
  pdf.setTextColor(105, 105, 105); // Gray decorative text
  pdf.text('Presented by [Organization Name]', pageWidth / 2, pageHeight - 20, {
    align: 'center',
  });

  // Output the PDF
  const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  setCertificatePdfUrl(pdfUrl);
  handleOpenModalCertificate();

  } catch (error) {
    Logger.error('Error generating certificate PDF:', error);
  }
};

/**
 * Function to downloading the pdf while clicking the download icon
 */
const handleDownloadPdf = () => {
 if (certificatePdfUrl) {
    const link = document.createElement('a');
    link.href = certificatePdfUrl; 
    link.click(); 
  } 
   else {
    Logger.error('PDF URL is not available.');
  }
};

  return (
    <Grid>
      <Tabs value={tabValue} className="main-account-tabs" onChange={(_event, newValue) => handleTabChange(newValue)}>
        {userdetail?.formData?.length && <Tab value={1} label="User Information" className="main-account-tab-title account-tabs"/>}
        <Tab value={2} label="Payment Details" className="main-account-tab-title account-tabs"/>
        <Tab value={3} label="Attendance Details" className="main-account-tab-title account-tabs"/>
        <Tab value={4} label="Documents" className="main-account-tab-title account-tabs"/>
      </Tabs>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        
        <Box className="modal-box">
         
          {isIdproof && (
             <>
             <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
               {/* Title Section */}
               <Grid>
                 <Typography variant="h6" paddingBottom={1}>
                   {selectedFile?.name || "Untitled"} {/* Title displayed */}
                 </Typography>
               </Grid>
           
               {/* Icons Section */}
               <Grid>
                 <Grid container alignItems="center" spacing={1}>
                   <Grid>
                     <a
                       href={`${baseUrl}asset/${selectedFile?.id}`}
                       download={selectedFile?.name}
                     >
                       <DownloadModal className="modal-box-close-icon" />
                     </a>
                   </Grid>
                   <Grid>
                     <CloseIcon
                       className="modal-box-close-icon"
                       onClick={handleCloseModal}
                     />
                   </Grid>
                 </Grid>
               </Grid>
             </Grid>
           
             {/* Image Section */}
             <img
               src={`${baseUrl}asset/${selectedFile?.id}`}
               alt={selectedFile?.name}
               style={{
                 width: "100%",
                 height: "90%",
                 objectFit: "contain",
               }}
             />
           </>
           
          )}
          {isPass &&(
            <>
            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
              {/* Title Section */}
              <Grid>
                <Typography variant="h6" paddingBottom={1}>
                  {`Qr_code_${details?.user?.firstName || "Unknown User"}.pdf`} {/* Title displayed */}
                </Typography>
              </Grid>
          
              {/* Icons Section */}
              <Grid>
                <Grid container alignItems="center" spacing={1}>
                  <Grid>
                    <DownloadModal
                      className="modal-box-close-icon"
                      onClick={handleDownloadPdf}
                    />
                  </Grid>
                  <Grid>
                    <CloseIcon
                      className="modal-box-close-icon"
                      onClick={handleCloseModal}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          
            {/* PDF Preview Section */}
            {/* <iframe
              src={`${pdfUrl}#toolbar=0`}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{
                border: "none",
              }}
            ></iframe> */}
          </>
          
          )
          }
          {isInvoice &&(
            <>
            {/* Header Section */}
              <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                <Grid>
                  <Typography variant="h6" paddingBottom={1}>
                    {`${details?.user?.firstName || "Unknown User"}.pdf`} 
                  </Typography>
                </Grid>
                <Grid>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid>
                      <DownloadModal
                        className="modal-box-close-icon"
                        onClick={handleDownloadPdf}
                      />
                    </Grid>
                  <Grid>
                  <CloseIcon
                    className="modal-box-close-icon"
                    onClick={handleCloseModal}
                  />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

           {/* PDF Preview Section */}
          {/* <iframe
            src={`${invoicePdfurl}#toolbar=0`}
            title="PDF Preview"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          ></iframe> */}
      </>
          )}
          {isCertificate &&(
             <>
             {/* Header Section */}
             <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
               <Grid>
                 <Typography variant="h6" paddingBottom={1}>
                 {`${details?.user?.firstName || "Unknown User"}.pdf`} 
                 </Typography>
               </Grid>
               <Grid>
                 <Grid container alignItems="center" spacing={1}>
                   <Grid>
                     <DownloadModal
                       className="modal-box-close-icon"
                       onClick={handleDownloadPdf}
                     />
                   </Grid>
                   <Grid>
                     <CloseIcon
                       className="modal-box-close-icon"
                       onClick={handleCloseModal}
                     />
                   </Grid>
                 </Grid>
               </Grid>
             </Grid>
           
             {/* PDF Preview Section */}
             <iframe
               src={`${certificatePdfUrl}#toolbar=0`}
               title="PDF Preview"
               width="100%"
               height="100%"
               style={{ border: 'none' }}
             ></iframe>
           </>
          )} 
        </Box>
      </Modal>
      
      {tabValue === 1 ? (
        <Grid container direction="column" spacing={2} className="all-details-attendance-grid">
          <Grid>
            <Typography className="all-details-title">
              Personal Details
            </Typography>
          </Grid>
          {cleanedFormData.length !==0?cleanedFormData.map((data: any, index: any) => (
        <Grid key={index}>
          {Object.entries(data).map(([key, value]) => (
              <Grid container key={index}>
             <Grid size={3}>
             <Typography className="all-details-data-title">{key}</Typography>
           </Grid>
            <Grid size={8}>
            <Typography className="all-details-data">{String(value)}</Typography>
          </Grid>
          </Grid>
          ))}
        </Grid>
      ))
    :
    <NoEvents description="No personal details  found" />
    }

  </Grid>
      ) : tabValue === 2 ? (
        <Grid container direction="column" className="all-details-attendance-grid" spacing={2}>
          <Grid>
            <Typography className="all-details-title">
              Payment Information
            </Typography>
          </Grid>
          <Grid container>
        <Grid size={3}>
          <Typography className="all-details-data-title">Transcation ID</Typography>
          </Grid>
          <Grid size={8}>
          <Typography className="all-details-data">{PaymentDetails?.transactionId ? PaymentDetails.transactionId : "Not Available"}</Typography>
          </Grid>
      </Grid>
      <Grid container>
        <Grid size={3}>
          <Typography className="all-details-data-title">Total Amount</Typography>
          </Grid>
          <Grid size={8}>
          <Typography className="all-details-data">{currency}{PaymentDetails?.amount ? PaymentDetails?.amount : 0 }</Typography>
          </Grid>
      </Grid>
      <Grid container>
        <Grid size={3}>
          <Typography className="all-details-data-title">Payment Method</Typography>
          </Grid>
          <Grid size={8}>
          <Typography className="all-details-data">{PaymentDetails?.paymentMethod?.name}</Typography>
          </Grid>
      </Grid>
      <Grid container>
        <Grid size={3}>
          <Typography className="all-details-data-title">Payment Date</Typography>
          </Grid>
          <Grid size={8}>
          <Typography className="all-details-data"> {formatDateTimeRange({ date: PaymentDetails?.createdOn,format: "DD/MM/YYYY",})}</Typography>
          </Grid>
      </Grid>
        </Grid> 
      ) : tabValue === 3 ? (
        <Grid className="all-details-attendance-grid">
        <Typography className="all-details-title">
        Attendance Overview
      </Typography>

      <Grid>
    {categories?.map(({ label, key }) => (
      attendanceDetails?.[key]?.length > 0 && ( 
        <Grid key={key}>
          <Typography className="all-details-attendence-label">
            {label} 
          </Typography>
          <Grid container spacing={2}>
            <Grid container spacing={2} size={8} className="event-sessions-session-list">
            {transformAttendanceData(attendanceDetails)?.map((program: any, index: number) => { 
              return (
                <SessionCard
                  key={index}
                  index={index + 1}
                  item={program} // Pass entire object
                  timeCorrection={true}
                  titleField={"name"}
                  startTimeField="startTime"
                  endTimeField="endTime"
                  fields={[]}
                  hasAddOns={program?.eventAddonId ? true : false}
                />
              );
            })}


            </Grid>
            {/* {attendanceDetails?.[key]?.map((program: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={program?.id}>
                <Grid className="userdetail-event-card">
                  <Grid container direction="row" className="userdetail-time-status">
                    <Typography className="userdetail-time">
                      {formatDateTimeRange({ date: program?.startTime, format: "h:mm A" })}-
                      {formatDateTimeRange({ date: program?.endTime, format: "h:mm A" })}
                    </Typography>
                    {program?.statusId && (
                      <StatusComponent className="user-status" value={program?.statusId} />
                    )}
                  </Grid>
                  <Typography className="userdetail-name">
                    {program?.name} 
                  </Typography>
                  <Typography className="userdetail-card-data">
                    Location:{ `${program?.venue?.city},${program?.venue?.country}`}
                  </Typography>
                </Grid>
              </Grid>
            ))} */}
          </Grid>
        </Grid>
      )
    ))}
  </Grid>
        </Grid> 
      ) : tabValue === 4 ? (
        <Grid spacing={2} className="all-details-attendance-grid">
          <Typography className="all-details-title">Uploaded Files</Typography>
          <Grid container size={{xs:12}} spacing={2} alignItems="center" direction="row">
          {Array.isArray(files) && files?.length > 0 && 
          files.map((file: any) => (
           <Grid key={file?.id}>
          <button
           style={{
           all: "unset", // Resets all default button styles
            display: "inline-block", // Keeps the button element inline
           cursor: "pointer", // Adds a pointer cursor for interactivity
          }}
          onClick={() => handleOpenModalImage(file)} // Open modal on click
        >
        <UserUploadedFileCard uploadedFile={file} title="Identity Proof" />
      </button>
    </Grid>
  ))
}
    {details && (
      <Grid >
               <button
        style={{
        all: "unset", 
        display: "inline-block", 
        cursor: "pointer", 
        }}
        onClick={() => handlePdfGeneratePass()}
        >
        <UserUploadedFileCard
          uploadedFile={{
            id: details?.event?.id || "",
            name: `Qr_code_${details?.user?.firstName || "Unknown User"}.pdf`,
          }}
          title="Event Pass"
        />
        </button>
      </Grid>
    )}
    {userdetail?.payment?.id &&(
      <Grid >
       <button
        style={{
        all: "unset", 
        display: "inline-block",
        cursor: "pointer", 
        }}
        onClick={() => handlePdfGenerateInvoice()}
        >
      <UserUploadedFileCard
        uploadedFile={{
          id: userdetail?.payment?.id || "",
          name: `${details?.user?.firstName || "Unknown User"}.pdf`,
        }}
        title="Invoice"
      />
       </button>
    </Grid>
   
    )}
    {userdetail?.attendanceDetails?.attendedPrograms?.[0]?.id&&(
      <Grid >
       <button
        style={{
        all: "unset",
        display: "inline-block",
        cursor: "pointer",
        }}
        onClick={() => generateCertificatePDF()}
        >
      <UserUploadedFileCard
        uploadedFile={{
          id: userdetail?.details?.user?.id || "",
          name: `${details?.user?.firstName || "Unknown User"}.pdf`,
        }}
        title="Certificate"
      />
       </button>
    </Grid>
   
    )}
  </Grid>
        </Grid> 
      ) : null}

    </Grid>

  );
};

export default UserAllDetail;
