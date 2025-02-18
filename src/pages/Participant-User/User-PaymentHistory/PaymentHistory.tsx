
import CustomButton from "@/components/CustomButton/CustomButton";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CircularProgress } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Logger } from "@/Utils/Logger";
import { ISource } from "@/Libs/types/type";
import { NoPayment } from "@/assets/svg";
import { POST } from "@/Libs/store";
import StatusComponent from "@/components/Status/StatusComponent";
import confgo  from "../../../../config.json"
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "@/pages/Participant-User/User-PaymentHistory/Invoice";


/**
 * `PaymentHistory` component displays a data grid with payment history information.
 */
const PaymentHistory: React.FC = React.memo(() => {
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<ISource | undefined>(undefined);
  const currency=confgo.currency
 
  /**
   *  * `columns` defines the structure of each column in the DataGridList component.
   */
  const columns = [
    { type: "default", field: "name", headerName: "Event Name", width: 250 },
    {
      type: "dateField",
      field: "Date",
      headerName: "Date",
      width: 140,
      dateFormat: "DD/MM/YYYY",
    },
    { type: "default", field: "amount",prefix:`${currency}`, headerName: "Amount", width: 130 },
    {
      type: "custom",
      field: "status",
      headerName: "Status",
      width: 120,
      sortable: false,
    },
    {
      type: "custom",
      field: "Receipt",
      headerName: "Receipt",
      width: 167,
      sortable: false,
    },
    { type: "default", field: "PaymentMethod", headerName: "Payment Method", width: 208,sortable: false, },
  ];

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
   * Transforms the raw data from the API to match the required format for the DataGrid component.
   * @param data - The raw data from API response
   * @returns Transformed data for DataGrid
   */
  const transformData = (data: any) => {
    if (!data) return [];
    return data.map((item: any) => {
      return {
        ...item,
        name: item?.event?.name,
        Date: item.createdOn,
        amount: item?.amount,
        status: <Grid  className="payment-history-container-status" size={12} > <StatusComponent  value={item?.state ==="COMPLETED"?'12':"3"}  /> </Grid> ,
        createdOn: item?.createdOn,
        
        Receipt:<PDFDownloadLink document={<MyDocument data={data} />} fileName="Invoice.pdf"  onClick={()=>paymentDetail(item?.id)}>
               
                    
          <CustomButton label={"[Download]"} className="download-Receipt" onClick={() => {
          }}/>,
                  
              </PDFDownloadLink>,
      
        PaymentMethod: item.paymentMethod.handler

      };
    });
  };
  useEffect(() => {
    payments();
  }, []);
  /**
   * Source - payment list 
   */
  const payments = useCallback(async () => {
    try {
      setIsLoading(true);
       const req = {
        offset: 0,
        limit: 5,
        sortBy: "id",
        sortDirection: "DESC",
      };
        setSource({
          method: "POST",
          data: req,
          url: `payment/list`,
          listName: "paymentList-list-id",
        });
    } catch (e) {
      Logger.error("An error occurred:", e)
    } finally {
      setIsLoading(false)
    }
  }, []);
  return (
    <Grid container size={12} justifyContent="center" className="payment-history-container">
      <Grid className="" size={12} container>
        <Typography className="payment-history-container-heading" >
          Payment History
        </Typography>
      </Grid>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid  size={12} justifyContent="center" className="paymentlist">
          <DataGridList
            isTargetGrid={true}
            noRecordIcon={<NoPayment className="paymentlist-no-payment-icon"/>}
            noRecordSubtitle="It looks like you haven’t made any payments. Once you start registering for events, your payment history will appear here."
            dataTransformer={transformData}
            source={source}
            title="Payment History"
            id="payment-datagrid"
            columns={columns}
            hideFooterPagination={false}
          />
        </Grid>
      )}

    </Grid>
  )
})

export default PaymentHistory