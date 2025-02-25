import { NoPayment } from '@/assets/svg';
// import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete';
import CustomButton from '@/components/CustomButton/CustomButton';
import { DataGridList } from '@/components/DataGrid/DataGridList';
import { Filter } from '@/components/Filter';
import StatusComponent from '@/components/Status/StatusComponent';
import  { POST } from '@/Libs/store';
import { ISource } from '@/Libs/types/type';
import { Logger } from '@/Utils/Logger';
import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import jsPDF from 'jspdf';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
import config from '../../../../config.json';
/**
 * componet for payment list
 */
const AdminPaymentList: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [source, setSource] = useState<ISource | undefined>(undefined);
    const [eventvalueList,setEventList]=useState<any>([]);
    const currency=config.currency
    const baseUrl = config.api.url;
    // const paymentListData=useStore(state => state.compData?.['payment-datagrid']) || {}
    // const listData = paymentListData?.data || []
  /**
   *  * `columns` defines the structure of each column in the DataGridList component.
   */
  const columns = [
    { type: "custom", field: "name", headerName: "Name", width: 220 },
    {
      type: "dateField",
      field: "Date",
      headerName: "Date",
      width: 180,
      dateFormat: "DD/MM/YYYY",
    },
    { type: "default", field: "amount",prefix:`${currency}`, headerName: "Amount", width: 130 },
    {
      type: "custom",
      field: "status",
      headerName: "Status",
      width: 130,
      sortable: false,
    },
    {
      type: "custom",
      field: "Receipt",
      headerName: "Receipt",
      width: 130,
      sortable: false,
    },
    { type: "default", field: "PaymentMethod", headerName: "Reference No ", width: 208,sortable: false, },
  ];
    // const { control } = useForm();

    useEffect(() => {
        payments();
        eventList();

      }, []);

  /**
   ** event list api 
   */
    const eventList = () => {
        POST({
            url: 'event/list', body: {}, id: 'eventFilterList', successCB: (_context) => {
                const data = _context.data.map((item: any) => {
                    return {
                        value: item?.id,
                        label: item?.name
                    };
                });
                setEventList(data);
            }, errorCB: (_error) => {
            }
        })
    }
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
              url: `payment/list`,
              listName: "adminpaymentList-list-id",
            });
        } catch (e) {
          Logger.error("An error occurred:", e)
        } finally {
          setIsLoading(false)
        }
      }, []);

    const filterFields: any = [
        {
          type: 'select',
          fieldName: 'eventId',
          label: 'Events',
          heading: 'Filter with Event',
          options: eventvalueList
        },
        {
          type: 'date',
          fieldName: 'startTime',
          label: 'Date',
          heading: 'Filter with Date'
        },
      ]
 /**
   * Transforms the raw data from the API to match the required format for the DataGrid component.
   * @param data - The raw data from API response
   * @returns Transformed data for DataGrid
   */
  const transformData = (data: any) => {
    if (!data) return [];
    return data.map((item: any) => {
      return {
        ...item,
          name: <Grid  alignItems={"center"} justifyContent={"flex-start"} container display={"flex"}><Avatar className='top-2' src={item?.user?.assetId ? `${baseUrl}/asset/${item?.user?.assetId}` : ''} >{item?.user?.name?.slice(0, 2)}</Avatar> <Typography className='nameField' ml={1} textAlign={"center"} mt={2} >{item?.user?.firstName + item?.user?.lastName}</Typography></Grid>,
        Date: item.createdOn,
        amount: item?.amount,
        status: <Grid  className="payment-history-container-status" size={12} > <StatusComponent  value={item?.state ==="COMPLETED"?'12':"3"}  /> </Grid> ,
        createdOn: item?.createdOn,
        Receipt: <Grid container  className="payment-history-container-receipt" justifySelf={"center"}><CustomButton variant='outlined' label={"[Download]"} className="textButton" onClick={() => {
          handlePdfGenerate(item.id);
        }}/></Grid>,
        PaymentMethod: item.paymentReferenceNumber

      };
    });
  };

    /**
   * Function used to get the details of payment by passing the id in filter
   */
    const paymentDetail = useCallback(async (paymentid: string | number |undefined) => {
        try {
          const filter = {
            filters:{
            id: paymentid,
          }};
          const response:any = await POST({
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
      const handlePdfGenerate = useCallback(async (paymentDetailId: string | number | undefined) => {
        try {
        const paymentDetails = await paymentDetail(paymentDetailId); // Fetch specific details
        if (paymentDetails) {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4', // Standard page size for invoices
        });
    
        const companyName = paymentDetails?.company?.companyName || "N/A";
        const companyAddress = paymentDetails?.company?.companyAddress || "N/A";
        const clientName =paymentDetails?.event?.name || "N/A";
        const clientEmail =paymentDetails?.event.eventContacts[0]?.email || "N/A";
        const clientPhone = paymentDetails?.event?.eventContacts[0]?.phone || "N/A";
    
    
        const name = paymentDetails?.user?.firstName
          ? `${paymentDetails.user.firstName} ${paymentDetails.user.lastName || ""}`
          : "N/A";
          const userEmail = paymentDetails?.user?.email ||"N/A"
    
        const paymentDate = paymentDetails?.createdOn
          ? moment(paymentDetails.createdOn).format("DD-MM-YYYY")
          : "N/A";
        const transactionId = paymentDetails?.transactionId || "N/A";
        const refNumber = paymentDetails?.paymentReferenceNumber || "N/A";
        const ticketPrice = paymentDetails?.event?.amount || "N/A";
        const discount = paymentDetails?.order?.discountAmount || "N/A";
        const finalPrice = paymentDetails?.order?.finalPrice || "N/A";
        
        // General settings
        const pageWidth = pdf.internal.pageSize.width;
        const horizontalMargin = 15;
        const headerHeight = 50; // Increased height for the header
    
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
        pdf.text(paymentDetails?.company?.email, horizontalMargin, footerY + 10);
        pdf.text(paymentDetails?.company?.phone, horizontalMargin, footerY + 15);
      
        // Save PDF
        pdf.save('invoice.pdf');
      }
      } catch (error) {
        Logger.error('Error generating PDF:', error);
      }
      
    },[paymentDetail]);


    /**
    * Method handles the filter transformer
    * @param filters : filters request data
    * @returns : transformed filter request
    */
  const handleFilterTransformer = (filters: any) => {
    for (let key in filters) {
      if (key === "startTime") {
        filters["startDate"] = filters[key]; // Convert startTime to startDate
        delete filters["startTime"];
      } else if (key === "endTime") {
        filters["endDate"] = filters[key]; // Convert endTime to endDate
        delete filters["endTime"];
      }
    }

    // Ensure endDate gets startDate's value if missing
    if (!filters["endDate"]) {
      filters["endDate"] = filters["startDate"];
    }

    return filters;
  };
    

    return (
        <Grid container className="adminpayment">
            <Grid size={12} className='title-filter-container'>
                <Typography className='title-filter-container-title'>Payment History</Typography>
                <Box className='title-filter-container-filter-container'>
                    {/* <Box className="auto-complete">
                        <CustomAutocomplete
                            name='sponsors'
                            className='auto-complete-input'
                            placeholder='search payment ID'
                            control={control} 
                            loading={false}
                            options={listData}
                            getOptionLabel={(option: any) => option?.user.firstName}
                            onSearch={(_query: string) => { payments({name:_query}) }}
                            onChange={() => { }}
                            clearable={false}

                        />
                    </Box> */}
                    {/* <Box className="filter-button"
                    <Filter datagridId='coupon-datagrid filter-button' fields={filterFields} />
                    </Box> */}
                    <Box className="button-container">
                    <Filter datagridId='payment-datagrid' fields={filterFields} filterTransformer={handleFilterTransformer}/>
                    </Box>
                </Box>
            </Grid>
            {isLoading ? (
        <CircularProgress />
      ) : (
            <Grid size={12} className="sponsor-datagrid sahdow-app mt-8">
                <DataGridList
                  noRecordIcon={<NoPayment className="icon"/>}
                    noRecordSubtitle="It looks like you haven’t made any payments. Once you start registering for events, your payment history will appear here."
                    dataTransformer={transformData}
                    source={source}
                    // onRowClick={onRowClick}
                    title="Sponsor List"
                    hideFooterPagination={false}
                    columns={columns}
                    id="payment-datagrid"
                    key={'payment-list-datagrid'}
                />
            </Grid>)}
        </Grid>
    );
}

export default AdminPaymentList;
