/**
 * all the details of user for an event
 * @author Nevin
 * view the programs and other informations of the user
 */
import { useState } from "react";
import { Box, Modal, Tab, Tabs, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import StatusComponent from "@/components/Status/StatusComponent";
import "./userdetail.scss";
import React from "react";
import { formatDateTimeRange, toTitleCase } from "@/Utils/CommonBaseClass";
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

interface DetailProps {
  userdetail: any;
}

/**
 * it contains all the information reguarding the user
 */
const UserAllDetail: React.FC <DetailProps> = ({ userdetail }) => { 
  const [tabValue, setTabValue] = useState(1); // Default to tab 1
  const [isModalOpen, setModalOpen] = useState(false); // State to control modal
  const [selectedFile, setSelectedFile] = useState<any>(null); // State for selected file
  const baseUrl = config.api.url;
  const [isIdproof, setisIdproof] = useState(false);
  const [isPass, setIsPass] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [invoicePdfurl, setInvoicePdfUrl] = useState('');
  const [isInvoice,setIsInvoice] = useState(false);
  const [isCertificate, setIsCertificate] = useState(false)
  const [certificatePdfUrl, setCertificatePdfUrl] = useState('');


  //stores the customform data
  const cleanedFormData = userdetail.formData.map((item:any) => {
    const parsedResponse = JSON.parse(item.response);
    delete parsedResponse.fieldType; // Remove the fieldType key
    return parsedResponse; // Return the cleaned object
  });

  // Extracting the array dynamically, regardless of key name  
  let files: any[] = []; ;
  cleanedFormData.forEach((dataItem: any) => {
    const dynamicKeyData = Object.values(dataItem)[0]; // Extract the first key's value (array of files)
    if (Array.isArray(dynamicKeyData)) {
      files = [...files, ...dynamicKeyData]; // Add all files to the 'files' array
    }
  });
  const details = userdetail?.details;

  //stores the payment informations
  const PaymentDetails = userdetail.payment;

  //stores the attendees informations 
  const attendanceDetails = userdetail.attendanceDetails
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

  const handleOpenModalPass = () => {
    setModalOpen(true);
    setIsPass(true)
  }

  const handleopenModeInvoice =() => {
    setModalOpen(true);
    setIsInvoice(true);
  }

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
    const clientName =userdetail?.details?.user?.name || "N/A";
    const clientEmail =userdetail?.details?.user?.email || "N/A";
    const clientPhone = userdetail?.details?.user?.phone || "N/A";


    const name = userdetail?.details?.user?.firstName
      ? `${userdetail?.details?.user.firstName} ${userdetail.details.user.lastName || ""}`
      : "N/A";
      const userEmail = userdetail?.details?.user?.email ||"N/A"

    const paymentDate = userdetail?.payment?.createdOn
      ? moment(userdetail.createdOn).format("DD-MM-YYYY")
      : "N/A";
    const transactionId = userdetail?.payment?.transactionId || "N/A";
    const refNumber = userdetail?.payment?.paymentReferenceNumber || "N/A";
    const ticketPrice = userdetail?.details?.event?.amount || "N/A";
    const discount = userdetail?.payment?.order?.discountAmount || "N/A";
    const finalPrice = userdetail?.payment?.order?.finalPrice || "N/A";
    
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

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('Invoice', pageWidth - horizontalMargin - 30, 15);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('#101020', pageWidth - horizontalMargin - 30, 20);
  
    pdf.setDrawColor(200, 200, 200);
    pdf.line(horizontalMargin, headerHeight -10, pageWidth - horizontalMargin, headerHeight-10);

    // Client Information Section
    const clientInfoY = headerHeight; // Start Y position for Client Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('Event Contact Info:', horizontalMargin, clientInfoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(clientName, horizontalMargin, clientInfoY + 8);
    pdf.text(clientEmail, horizontalMargin, clientInfoY + 16);
    pdf.text(clientPhone, horizontalMargin, clientInfoY + 24);
  
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bill To:', horizontalMargin + 60, clientInfoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(name, horizontalMargin + 60, clientInfoY + 8);
    pdf.text(userEmail, horizontalMargin + 60, clientInfoY + 16);
  

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
    pdf.text('Ticket Price', horizontalMargin, chargesInfoY + 9);
    pdf.text(ticketPrice, rightColumnX + 24, chargesInfoY +9);
    pdf.text('Discount', horizontalMargin, chargesInfoY + 18);
    pdf.text(discount, rightColumnX + 24, chargesInfoY + 18);
  
    // Total
    pdf.setFont('helvetica', 'bold');
    pdf.text('Total', horizontalMargin, chargesInfoY + 27);
    pdf.text(finalPrice, rightColumnX + 24, chargesInfoY + 27);
  
    // Footer
    const footerY = pdf.internal.pageSize.height - 30;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(horizontalMargin, footerY - 5, pageWidth - horizontalMargin, footerY - 5);
  
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Questions:', horizontalMargin, footerY);
    pdf.text(companyName, horizontalMargin, footerY + 5);
  
    // Save PDF
    const pdfBlob = pdf.output('blob'); // Generate the PDF as a blob
        const pdfUrl = URL.createObjectURL(pdfBlob); // Create a blob URL
        setInvoicePdfUrl(pdfUrl);
  handleopenModeInvoice();
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
          orientation: 'portrait', // Use landscape if needed
          unit: 'mm',
          format: [149.53, 204.17],
        });
        const horizontalPadding = 10; 
        const verticalPadding = 3; 
        const pageWidth = pdf.internal.pageSize.width;
        const currentYPosition = verticalPadding;
        // Fill the entire page with white (ID card size)
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, 85.6, 53.98, 'F');
        pdf.setFont('helvetica', 'bold');
        // Generate the QR code image URL
        pdf.text(userdetail?.details?.event?.name ? toTitleCase(userdetail?.details?.event?.name) : '', horizontalPadding, currentYPosition + 2);
  
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
        pdf.text(userdetail?.details?.user?.firstName + ' ' + userdetail?.details?.user?.lastName, pageWidth / 2, 35);
        pdf.setFont('helvetica', 'bold');
        pdf.setFont('helvetica', 'bold');
        pdf.text('Event Name', horizontalPadding, 45);
        pdf.setFont('helvetica', 'normal');
        pdf.text(userdetail?.details?.event?.name, pageWidth / 2, 45);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Event Date', horizontalPadding, 55);
        pdf.setFont('helvetica', 'normal');
        pdf.text(moment(userdetail?.details?.event?.starttime).format('MMMM D, YYYY'), pageWidth / 2, 55);
  
        // Split the text into multiple lines based on the max width
        const qrCodeTopRight = await QRCode.toDataURL(userdetail?.details?.qrCode);
        // Adjust QR code size to fit nicely on the ID card
        pdf.addImage(qrCodeTopRight, 'PNG', pageWidth / 2 - 20, currentYPosition + 75, 30, 30); // Position (60, 10), size 20x20 mm
        // Set line color (optional)
        pdf.setDrawColor(4, 128, 211); // Black color (RGB)
  
        // Set line width (optional)
        pdf.setLineWidth(0.5); // Default is 0.2 mm, you can set it higher for a thicker line
  
       
        const pdfBlob = pdf.output('blob'); // Generate the PDF as a blob
        const pdfUrl = URL.createObjectURL(pdfBlob); // Create a blob URL
        setPdfUrl(pdfUrl); // Set the blob URL to state
        handleOpenModalPass()     
      } catch (error) {
        Logger.error('Error loading image or generating PDF:', error);
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
  if (pdfUrl) {
    const link = document.createElement('a');
    link.href = pdfUrl; 
    link.click(); 
  } else if (certificatePdfUrl) {
    const link = document.createElement('a');
    link.href = certificatePdfUrl; 
    link.click(); 
  } else if (invoicePdfurl) {
    const link = document.createElement('a');
    link.href = invoicePdfurl; 
    link.click(); 
  }
   else {
    Logger.error('PDF URL is not available.');
  }
};

  return (
    <Grid>
      <Tabs value={tabValue} className="main-account-tabs" onChange={(_event, newValue) => handleTabChange(newValue)}>
        <Tab value={1} label="User Information" className="main-account-tab-title account-tabs"/>
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
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{
                border: "none",
              }}
            ></iframe>
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
          <iframe
            src={`${invoicePdfurl}#toolbar=0`}
            title="PDF Preview"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          ></iframe>
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
          <Typography className="all-details-data">{PaymentDetails.transactionId ? PaymentDetails.transactionId : "Not Available"}</Typography>
          </Grid>
      </Grid>
      <Grid container>
        <Grid size={3}>
          <Typography className="all-details-data-title">Total Amount</Typography>
          </Grid>
          <Grid size={8}>
          <Typography className="all-details-data">{PaymentDetails.amount}</Typography>
          </Grid>
      </Grid>
      <Grid container>
        <Grid size={3}>
          <Typography className="all-details-data-title">Payment Method</Typography>
          </Grid>
          <Grid size={8}>
          <Typography className="all-details-data">{PaymentDetails.paymentMethod.name}</Typography>
          </Grid>
      </Grid>
      <Grid container>
        <Grid size={3}>
          <Typography className="all-details-data-title">Payment Date</Typography>
          </Grid>
          <Grid size={8}>
          <Typography className="all-details-data"> {formatDateTimeRange({ date: PaymentDetails.createdOn,format: "DD/MM/YYYY",})}</Typography>
          </Grid>
      </Grid>
        </Grid> 
      ) : tabValue === 3 ? (
        <Grid className="all-details-attendance-grid">
        <Typography className="all-details-title">
        Attendance Overview
      </Typography>

      <Grid>
    {categories.map(({ label, key }) => (
      attendanceDetails[key].length > 0 && ( 
        <Grid key={key}>
          <Typography className="all-details-attendence-label">
            {label}
          </Typography>
          <Grid container spacing={2}>
            {attendanceDetails[key].map((program: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={program.id}>
                <Grid className="userdetail-event-card">
                  <Grid container direction="row" className="userdetail-time-status">
                    <Typography className="userdetail-time">
                      {formatDateTimeRange({ date: program.startTime, format: "h:mm A" })}-
                      {formatDateTimeRange({ date: program.endTime, format: "h:mm A" })}
                    </Typography>
                    {program.statusId && (
                      <StatusComponent className="user-status" value={program.statusId} />
                    )}
                  </Grid>
                  <Typography className="userdetail-name">
                    {program.name}
                  </Typography>
                  <Typography className="userdetail-card-data">
                    Location:{ `${program.venue?.city},${program.venue?.country}`}
                  </Typography>
                </Grid>
              </Grid>
            ))}
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
          {Array.isArray(files) && files.length > 0 && 
          files.map((file: any) => (
           <Grid key={file.id}>
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
    {userdetail.payment.id &&(
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
    {userdetail.attendanceDetails?.attendedPrograms?.[0]?.id&&(
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
