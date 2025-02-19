import { ISource } from "@/Libs/types/type";
import Grid from "@mui/material/Grid2"
import { useCallback, useEffect, useMemo, useState } from "react";
import config from '../../../../config.json';
import { Logger } from "@/Utils/Logger";
import { CircularProgress, Typography } from "@mui/material";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import { NoPayment, PdfIcon } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import StatusComponent from "@/components/Status/StatusComponent";
import PlanBilling from "./PlanBilling";
import useStore, { POST } from "@/Libs/store";
import { getLocalTimeDate, toCamelCase } from "@/Utils/CommonBaseClass";
import moment from "moment";
import jsPDF from "jspdf";
/**
 * Componet for show Admin plan Deatils
 */
const PlanPurchaseHistory = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [source, setSource] = useState<ISource | undefined>(undefined);
    const planData = useStore((state: any) => state?.compData?.['plan-datagrid']?.data) ?? [];
    const currency = config.currency
    const [showPlan, setShowPlan] = useState(false);

    /**
     *`columns` defines the structure of each column in the DataGridList component.
     */
    const columns = [
        { type: "custom", field: "name", headerName: "Invoice", width: 230 },
        {
            type: "dateField",
            field: "Date",
            headerName: "Billing Date",
            width: 180,
            dateFormat: "DD/MM/YYYY",
        },
        { type: "default", field: "plan", headerName: "Plan", width: 180 },
        { type: "default", field: "amount", prefix: `${currency}`, headerName: "Amount", width: 180 },
        {
            type: "custom",
            field: "status",
            headerName: "Status",
            width: 180,
            sortable: false,
        },
        {
            type: "custom",
            field: "Receipt",
            headerName: "Receipt",
            width: 150,
            sortable: false,
        },
    ];
    useEffect(() => {
        payments();

    }, []);
    /**
 * Source - payment list 
 */
    const payments = useCallback(async (filters?: any) => {
        try {
            setIsLoading(true);
            const req = {
                offset: 0,
                limit: 5,
                sortBy: "id",
                sortDirection: "DESC",
                filters: filters,
            };
            setSource({
                method: "POST",
                data: req,
                url: `payment/subscription/list`,
                listName: "plan-list-id",
            });
        } catch (e) {
            Logger.error("An error occurred:", e)
        } finally {
            setIsLoading(false)
        }
    }, []);

    /**
* Transforms the raw data from the API to match the required format for the DataGrid component.
* @param data - The raw data from API response
* @returns Transformed data for DataGrid
*/
    const transformData = (data: any) => {
        if (data?.length == 0) {
            setShowPlan(true);
        }
        if (!data) return [];
        return data.map((item: any) => {
            return {
                ...item,
                name: <Grid alignItems={"center"} justifyContent={"flex-start"} container display={"flex"}><Grid mt={1.5}><PdfIcon width={25} height={25} /></Grid> <Typography className='nameField' ml={1} textAlign={"center"} mt={2} >{item?.transactionId}</Typography></Grid>,
                Date: item.createdOn,
                amount: item?.amount,
                plan: toCamelCase(item?.subscription?.plan?.name),
                status: <Grid className="payment-history-container-status" size={12} > <StatusComponent value={item?.state === "COMPLETED" ? '12' : "3"} /> </Grid>,
                createdOn: item?.createdOn,
                Receipt: <Grid container justifySelf={"center"} alignItems={"center"} mt={1.5}>
                    <CustomButton variant='outlined' label={"[Download]"} className="textButton" onClick={() => { handlePdfGenerate(item) }
                    } /></Grid>,


            };
        });
    };
    /*
    * handle showing of plan list
    */
    const handlePLanShow = () => {
        setShowPlan(!showPlan)
    }

/**
* Function used to get the details of payment by passing the id in filter
*/
    const paymentDetail = useCallback(async (paymentid: string | number | undefined) => {
        try {
            const filter = {
                filters: {
                    id: paymentid,
                }
            };
            const response: any = await POST({
                url: 'payment/list',
                body: filter,
                id: 'paymentDetailList-list',
            });
            return response?.data?.[0]; // Return the fetched details
        } catch (e) {
            Logger.error("An error occurred:", e)
            return null;
        }
    }, []);

/**
 * Function used to generate the pdf
 */
    const handlePdfGenerate = useCallback(async (paymentDetails: any) => {
        try {
            if (paymentDetails) {
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                });

                // const companyName = paymentDetails?.company?.companyName || "N/A";
                // const companyAddress = paymentDetails?.company?.companyAddress || "N/A";
                // const clientName = paymentDetails?.user?.name || "N/A";
                // const clientEmail = paymentDetails?.user?.email || "N/A";
                // const clientPhone = paymentDetails?.user?.phone || "N/A";


                const name = paymentDetails?.user?.firstName
                    ? `${paymentDetails.user.firstName} ${paymentDetails.user.lastName || ""}`
                    : "N/A";
                const userEmail = paymentDetails?.user?.email || "N/A"

                const paymentDate = paymentDetails?.createdOn
                    ? moment(paymentDetails.createdOn).format("DD-MM-YYYY")
                    : "N/A";
                const transactionId = paymentDetails?.transactionId || "N/A";
                const refNumber = paymentDetails?.paymentReferenceNumber || "N/A";
                const ticketPrice = paymentDetails?.amount || "N/A";
                const discount = paymentDetails?.discountAmount || "N/A";
                const finalPrice = paymentDetails?.finalAmount || "N/A";

                // General settings
                const pageWidth = pdf.internal.pageSize.width;
                const horizontalMargin = 15;
                const headerHeight = 50; // Increased height for the header

                // Invoice Header
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(14);
                // pdf.text(companyName, horizontalMargin, 15);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                // pdf.text(companyAddress, horizontalMargin, 20);

                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(16);
                pdf.text('Invoice', pageWidth - horizontalMargin - 30, 15);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                pdf.text(transactionId, pageWidth - horizontalMargin - 30, 20);

                pdf.setDrawColor(200, 200, 200);
                pdf.line(horizontalMargin, headerHeight - 10, pageWidth - horizontalMargin, headerHeight - 10);

                // Client Information Section
                const clientInfoY = headerHeight; // Start Y position for Client Information
                pdf.setFont('helvetica', 'bold');
                // pdf.text('Event Contact Info:', horizontalMargin, clientInfoY);
                pdf.setFont('helvetica', 'normal');
                // pdf.text(clientName, horizontalMargin, clientInfoY + 8);
                // pdf.text(clientEmail, horizontalMargin, clientInfoY + 16);
                // pdf.text(clientPhone, horizontalMargin, clientInfoY + 24);

                pdf.setFont('helvetica', 'bold');
                pdf.text('Bill To:', horizontalMargin , clientInfoY);
                pdf.setFont('helvetica', 'normal');
                pdf.text(name, horizontalMargin , clientInfoY + 8);
                pdf.text(userEmail, horizontalMargin , clientInfoY + 16);
                // pdf.text('Palo Alto, CA, 54321', horizontalMargin + 70, clientInfoY + 15);


                // Align Client Name, Issue Date, Due Date, and Amount Due properly
                const rightColumnX = pageWidth - horizontalMargin - 55; // Align the right column
                const valueOffset = 5; // Horizontal offset for the values
                pdf.setFont('helvetica', 'normal');
                pdf.text('Client Name:', rightColumnX - valueOffset, clientInfoY); // Label
                pdf.setFont('helvetica', 'normal');
                pdf.text(name, rightColumnX + 24, clientInfoY); // Value

                pdf.setFont('helvetica', 'normal');
                pdf.text('Payment Date:', rightColumnX - valueOffset, clientInfoY + 8); // Label
                pdf.setFont('helvetica', 'normal');
                pdf.text(paymentDate, rightColumnX + 24, clientInfoY + 8); // Value
                pdf.setFont('helvetica', 'normal');
                pdf.text('transaction Id:', rightColumnX - valueOffset, clientInfoY + 16); // Label
                pdf.text(transactionId, rightColumnX + 24, clientInfoY + 16); // Value
                pdf.text('Ref Number:', rightColumnX - valueOffset, clientInfoY + 24); // Label
                pdf.text(refNumber, rightColumnX + 24, clientInfoY + 24); // Value


                // Divider line
                pdf.setDrawColor(200, 200, 200);
                pdf.line(horizontalMargin, clientInfoY + 40, pageWidth - horizontalMargin, clientInfoY + 40);

                // Charges Section
                const chargesInfoY = headerHeight + 50; // Start Y position for Client Information
                pdf.setFont('helvetica', 'bold');
                pdf.text('Charges', horizontalMargin, chargesInfoY);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                pdf.text('Subscription Amount', horizontalMargin, chargesInfoY + 9);
                pdf.text(ticketPrice, rightColumnX + 24, chargesInfoY + 9);
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
                // pdf.text('Questions:', horizontalMargin, footerY);
                // pdf.text(companyName, horizontalMargin, footerY + 5);
                // pdf.text(paymentDetails?.company?.email, horizontalMargin, footerY + 10);
                // pdf.text(paymentDetails?.company?.phone, horizontalMargin, footerY + 15);

                // Save PDF
                pdf.save('invoice.pdf');
            }
        } catch (error) {
            Logger.error('Error generating PDF:', error);
        }

    }, [paymentDetail]);
    /**
    * Render Expiration date here.
    * @returns Transformed Date
    */
    const expirationDate = useMemo(() => {
        const localDate = getLocalTimeDate(planData?.[0]?.subscription?.startDate, 'YYYY-MM-DD HH:mm:ss')
        const targetDate = new Date(localDate);
        // Add 365 days to the start date to calculate the expiration date
        targetDate.setDate(targetDate.getDate() + planData?.[0]?.subscription?.validityDay);

        return moment(targetDate).format('MMMM D, YYYY');;
    }, [planData?.[0]?.subscription?.startDate]);

    return (<Grid className="plan-billing" container >
        <Grid container className="container" size={{ xs: 12, sm: 12 }}>
            {planData?.[0] && <>
                <Grid container size={12} >
                    <Typography textAlign={'left'} className="title">Subscription and Billing</Typography>
                </Grid>
                <Grid className="plan-box" container size={12} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} mb={4}>
                    <Grid size={10} container flexDirection={"row"} gap={{ xs: 1, md: 9, sm: 3 }}>
                        <Grid >
                            <Typography className="header">Current Plan</Typography>
                            <Typography className="header-value">{toCamelCase(planData?.[0]?.subscription?.plan?.name)}</Typography>
                        </Grid>
                        <Grid className="divider" />
                        <Grid >
                            <Typography className="header">Cost</Typography>
                            <Typography className="header-value">${planData?.[0]?.finalAmount}</Typography>
                        </Grid>
                        <Grid className="divider" />
                        <Grid >
                            <Typography className="header">Next Billing Date</Typography>
                            <Typography className="header-value">{planData?.[0]?.subscription?.startDate && expirationDate}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container size={2} justifyContent={"flex-end"}>
                        <CustomButton className="upgrade-btn" label="upgrade" onClick={handlePLanShow} />
                    </Grid>
                </Grid>
            </>}
            {showPlan && <PlanBilling />}

            {isLoading ? (
                <CircularProgress />
            ) : (<>
                {
                    <Grid size={12} mt={4}  >
                        <Typography textAlign={'left'} className="title">Billing History</Typography>
                        <DataGridList
                            noRecordIcon={<NoPayment className="icon" />}
                            noRecordSubtitle="It looks like you haven’t made any payments. Once you start registering for events, your payment history will appear here."
                            dataTransformer={transformData}
                            source={source}
                            title="Sponsor List"
                            hideFooterPagination={false}
                            columns={columns}
                            id="plan-datagrid"
                            key={'plan-list-datagrid'}
                        />
                    </Grid>}
            </>)}
        </Grid>
    </Grid>);
}

export default PlanPurchaseHistory;