import { convertUTCToUserTimeZone, formatDateTimeRange } from "@/Utils/CommonBaseClass"
import { Document, Page, Text, View,Image, StyleSheet } from "@react-pdf/renderer"
import QRCode from 'qrcode';
import { useEffect, useState } from "react";
import config from "../../../../config.json";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight:"bold",
    marginBottom: 4,
    color: "#333333",

  },
  subtitle: {
    fontSize: 14,
    fontWeight:"medium",
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 4,
    borderBottomColor: "#0480D3",
    marginVertical: 10,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center", 
    marginBottom:20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: "40%",
    fontSize: 17,
    fontWeight: "normal",
  },
  boldDetails: {
    width: "40%",
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    width: "60%",
    fontSize: 16,
    fontWeight:1000,
  },
  paymentSection: {
    marginTop: 20,
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  qrCode: {
    marginTop: 20,
    alignItems: "center",
  },
  qrImage:{
    width: "144px",
    height: "144px",
  }
})

/**
 * design of pdf for ticket in user event recap
 */
const EventTicketPDF = ({ data,userDetails,eventTicketData }: any) => {

    const EventData = data?.[0]
    const PaymentData = eventTicketData?.data
    const [qrCode, setQrCode] = useState<string | null>(null);
    const currency = config.currency;

   /*
    * used to generate qrCode image
    */
useEffect(() => {
  async function generateQRCode() {
      if (PaymentData?.ParticipantDetails?.qrCode) {
          try {
              const qrCodeDataUrl = await QRCode.toDataURL(PaymentData.ParticipantDetails.qrCode);
              setQrCode(qrCodeDataUrl);
          } catch (err) {
              console.error("Error generating QR code:", err);
          }
      }
  }
  generateQRCode();
}, [PaymentData]);

    const EventName = EventData?.name || "N/A"
    const UserName = `${userDetails?.firstName} ${userDetails?.lastName}`
    const startTime = convertUTCToUserTimeZone(EventData?.startTime, "MMM DD, YYYY") || "N/A"
    const Location = EventData?.venue?.name || "N/A"
    const SubTotal = PaymentData?.PaymentDetails?.order?.subTotal || "N/A"
    const DiscountAmount = PaymentData?.PaymentDetails?.order?.discountAmount || "N/A"
    const TaxAmount = PaymentData?.PaymentDetails?.order?.tax || "N/A"
    const TotalAmount = PaymentData?.PaymentDetails?.order?.finalPrice || "N/A"
    const PaymentDate = convertUTCToUserTimeZone(PaymentData?.PaymentDetails?.order?.orderDate, "MMM DD, YYYY") || "N/A"
    const TransactionId = PaymentData?.PaymentDetails?.transactionId || "N/A"


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{EventName}</Text>
          <Text style={styles.subtitle}>
            Your Gateway to Innovation and Technology!
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Ticket Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ticket Details</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Attendee Name</Text>
            <Text style={styles.value}>{UserName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Event Name</Text>
            <Text style={styles.value}>{EventName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Event Date</Text>
            <Text style={styles.value}>{startTime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Event Time</Text>
            <Text style={styles.value}>
              {formatDateTimeRange({
                date: EventData?.startTime,
                format: "h:mm A",
              })}
              -
              {formatDateTimeRange({
                date: EventData?.endTime,
                format: "h:mm A",
              })}
            </Text>
          </View>

          {EventData?.venue && (
            <View style={styles.row}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{Location}</Text>
            </View>
          )}
        </View>

        
        <View style={styles.divider} />
        {/* Payment Information */}
        {SubTotal >0  && (
          <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Information</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Sub Total</Text>
            <Text style={styles.value}>{`${currency} ${SubTotal}`}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tax</Text>
            <Text style={styles.value}>{`${currency} ${TaxAmount}`}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Discount Applied</Text>
            <Text style={styles.value}>{`-${currency} ${DiscountAmount}`}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total Paid</Text>
            <Text style={styles.boldDetails}>{`${currency} ${TotalAmount}`}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Payment Date</Text>
            <Text style={styles.boldDetails}>{PaymentDate}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID</Text>
            <Text style={styles.boldDetails}>{TransactionId}</Text>
          </View>
        </View>
       
         )} 
      
       {SubTotal > 0 && <View style={styles.divider} />}
        
        <View>
          {qrCode && (
            <View style={styles.qrCode}>
              <Image
                src={qrCode}
                style={styles.qrImage}
              />
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

export default EventTicketPDF

