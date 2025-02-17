import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import moment from "moment";

/**
 * Css style of pdf
 */
const styles = StyleSheet.create({
  hr: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    marginVertical: 10,
  },
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  companyInfo: {
    fontSize: 10,
  },
  invoiceNumber: {
    fontSize: 14,
    textAlign: "right",
  },
  contactSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  contactInfo: {
    width: "50%",
  },
  billTo: {
    width: "40%",
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 10,
    marginBottom: 4,
  },
  billToRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    marginBottom: 4,
  },
  chargesSection: {
    marginTop: 20,
  },
  chargesHeader: {
    fontSize: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.3,
    borderBottomColor: "#000",
  },
  rowText: {
    fontSize: 10,
  },
  amount: {
    fontSize: 10,
    textAlign: "right",
    paddingRight: 3,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#000",
    marginTop: 10,
  },

  totalText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    flexDirection: "row",
    gap: 1,
    borderTopWidth: 0.5,
    borderTopColor: "#000",
    paddingTop: 10,
    width: "100%"
  },
  footerSection: {
    width: "40%",
    paddingHorizontal: 10,
  },
  footerTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "left",
  },
  footerText: {
    fontSize: 10,
    textAlign: "left",
  },
  cost: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  }

})

/**
 * This component generates a PDF invoice using @react-pdf/renderer.
 * It displays company information, event details, billing information,
 * charges breakdown, and a footer with payment details.
 * 
 * Props:
 * @param {Object} data - The invoice data containing company, event, user, and order details.
 * 
 */

const MyDocument = ({ data }: any) => {

  console.log(">>Data",data);
  
  
  // Company Info
  const companyName = data[0]?.company?.companyName || "N/A";

  const companyAddress = `${data[0]?.company?.companyAddress || "N/A"}, ${data[0]?.company?.state || ""}`;
  const companyEmail = data[0]?.company?.email || "N/A";
  const companyPhone = data[0]?.company?.phone || "N/A";

  //event
  const eventName = data[0]?.event?.name || "N/A";
  const eventEmail = data[0]?.event?.eventContacts[0]?.email || "N/A";
  const eventPhone = data[0]?.event?.eventContacts[0]?.phone || "N/A";
  const eventTotal = data[0]?.event?.amount || "N/A";

  const discountAmount = data[0]?.order?.discountAmount || "N/A";

  const invoiceNumber = data[0]?.transactionId || "N/A";

  const clientName = data[0]?.user?.firstName
    ? `${data[0]?.user.firstName} ${data[0]?.user.lastName || ""}`
    : "N/A";
  const orderDate = data[0]?.order?.orderDtae;

  const clientphone=  data[0]?.user?.phone || "N/A";


  const couponDiscount = data[0]?.order?.couponDeduction || "N/A";

  const tax = data[0]?.order?.tax || "0.00";

  const finalAmount = data[0]?.order?.finalPrice || "N/A";


  // Total
  const grandTotal = Number(finalAmount) - (Number(discountAmount) + Number(couponDiscount));



  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyInfo}>{companyName}</Text>
            <Text style={styles.companyInfo}>{companyAddress}</Text>
            <Text style={styles.companyInfo}>{companyEmail}</Text>
          </View>
          <View>
            <Text style={styles.invoiceNumber}>Invoice</Text>
            <Text style={styles.invoiceNumber}>#{invoiceNumber}</Text>
          </View>
        </View>

        <View style={styles.hr}>

        </View>
        {/* Contact Section */}
        <View style={styles.contactSection}>

          <View style={styles.contactInfo}>
            <Text style={styles.sectionTitle}>Event Contact Info:</Text>
            <Text style={styles.contactText}>{eventName}</Text>
            <Text style={styles.contactText}>{eventEmail}</Text>
            <Text style={styles.contactText}>{eventPhone}</Text>
          </View>

          <View style={styles.billTo}>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            <View style={styles.billToRow}>
              <Text>Client Name</Text>
              <Text>{clientName}</Text>
            </View>

            <View style={styles.billToRow}>
              <Text>Client phone</Text>
              <Text>{clientphone}</Text>
            </View>

            <View style={styles.billToRow}>
              <Text>Payment Date</Text>
              <Text>{moment(orderDate).format('DD MMM YYYY, hh:mm A')}</Text>
            </View>


          </View>
        </View>

        {/* Charges Section */}
        <View style={styles.chargesSection}>
          <Text style={styles.chargesHeader}>Charges</Text>

          <View style={styles.row}>
            <Text style={styles.rowText}>Event Total</Text>
            <Text style={styles.amount}>${eventTotal}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Tier Discount</Text>
            <Text style={styles.amount}>${discountAmount}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Coupon Discount</Text>
            <Text style={styles.amount}>${couponDiscount}</Text>
          </View>

          <View style={styles.total}>
            <Text style={styles.rowText}>Tax</Text>
            <Text style={styles.amount}>${tax}</Text>
          </View>

          <View style={styles.cost}>
            <Text style={styles.rowText}>Grand Total</Text>
            <Text style={styles.amount}>${grandTotal}</Text>
          </View>

        </View>
        <View style={styles.footer}>

          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Payments:</Text>
            <Text style={styles.footerText}>Make checks payable to:</Text>
            <Text style={styles.footerText}>{companyName}</Text>
            <Text style={styles.footerText}>{companyAddress}</Text>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Questions:</Text>
            <Text style={styles.footerText}>{companyName}</Text>
            <Text style={styles.footerText}>{companyEmail}</Text>
            <Text style={styles.footerText}>{companyPhone}</Text>
          </View>

        </View>
      </Page>
    </Document>
  )
}

export default MyDocument



