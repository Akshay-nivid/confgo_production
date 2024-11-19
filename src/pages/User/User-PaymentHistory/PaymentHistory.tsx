import { NoPayment } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CircularProgress } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Logger } from "@/Utils/Logger";
import useStore, { setDataById } from "@/Libs/store";
/**
 * `PaymentHistory` component displays a data grid with payment history information.
 */
const PaymentHistory:React.FC = React.memo(()=>{
  const [isLoading, setIsLoading] = useState(false);
  const POST =useStore( (state: any) => state.POST);
  const paymentList=useStore((state:any)=>state?.compData?.['paymentList']?.['payment/list'])??[];
  /**
   *  * `columns` defines the structure of each column in the DataGridList component.
   */
  const columns = [
    { type: "default", field: "name", headerName: "Event Name", width: 200 },
    {
      type: "dateField",
      field: "Date",
      headerName: "Date",
      width: 190,
      dateFormat: "DD/MM/YYYY",
    },
    { type: "default", field: "amount", headerName: "Amount", width: 150},
    {
      type: "status",
      field: "status",
      headerName: "Status",
      width: 139
    },
    {
      type: "custom",
      field: "Receipt",
      headerName: "Receipt",
      width: 167,
 
    },
    { type: "default", field: "PaymentMethod", headerName: "Payment Method", width: 208 },
  ];
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
        name:item?.event?.name,
        Date:item.createdOn,
        amount: item?.amount,
        status : item?.event?.statusId,
        createdOn: item?.createdOn,
        Receipt:<CustomButton label={"[Download]"} className="download-Receipt"/>,
        PaymentMethod:item.paymentMethodId
     
      };
    });
  };
  useEffect(() => {
    payments();
  }, []);
  /**
   * 
   */
 // const [source, setSource] = useState<ISource | undefined>(undefined);
  const payments=useCallback(()=>{
    try{
    setIsLoading(true);
      const req = {
        offset: 0,
        limit: 5,
        sortBy: "id",
        sortDirection: "DESC",
      };
      POST({
        url: `payment/list`, body: req,
        id: 'paymentList',
        successCB: successCB,
        errorCB: (error: any) => Logger.error("error", error)
      })
      function successCB(_response:any){
        setDataById('snackBarInfo',
          { open: true, autoHideDuration: 2000, severity: 'success',
            message: "Payment Listed Successfully"});
      }
    }catch(e){
    Logger.error("An error occurred:",e)
    }finally{
      setIsLoading(false)
    }
    }, []);
  return (
  <Grid container size={12} className="payment-history-container">
     <Grid className="" size={12} container>
     <Typography className="payment-history-container-heading" >
        Payment History 
     </Typography>
     </Grid>
     {isLoading ? (
        <CircularProgress />
      ) : paymentList == undefined ? (  
        <Grid container size={12} justifyContent={"center"}>
          <Grid container justifyContent={"center"} className="no-event">
            <Grid>
              <NoPayment className="no-event-svg" />
            </Grid>
            <Grid size={12} flexDirection={"column"}>
              <Typography className="no-event-svg-text">No Events Found</Typography>
              <Typography className="no-event-svg-text-description">
                You haven’t registered for any events yet. Explore upcoming events and secure your spot today!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container size={12} className="paymentlist">
          <DataGridList
            dataTransformer={transformData}
            source={paymentList}
            //onRowClick={(params: any) => handleRowClick(params.id)}
            columns={columns}
            id="event-datagrid"
            hideFooterPagination={false}
          />
        </Grid>
      )}
  </Grid>
  )
})

export default PaymentHistory