import { NoPayment } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import { ISource } from "@/Libs/type";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useCallback, useEffect, useState } from "react";
/**
 * `PaymentHistory` component displays a data grid with payment history information.
 */
const PaymentHistory:React.FC = React.memo(()=>{
  /**
   *  * `columns` defines the structure of each column in the DataGridList component.
   */
  const columns = [
    { type: "dateField", field: "name", headerName: "Event Name", width: 258 },
    {
      type: "dateField",
      field: "Date",
      headerName: "Date",
      width: 190,
      Height: 51,
      dateFormat: "DD/MM/YYYY",
    },
    { type: "default", field: "amount", headerName: "Amount", width: 169},
    {
      type: "status",
      field: "status",
      headerName: "Status",
      width: 139,

      dateFormat: "DD/MM/YYYY",
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
        Receipt:<CustomButton label={"[Download]"} className="downlod-receipt"/>,
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
  const [source, setSource] = useState<ISource | undefined>(undefined);
  const payments=useCallback(()=>{
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
        listName: "paymentlist",
      });
      return;
    }, []);
  return (
  <Grid container size={12} className="payment-history-container">
     <Grid className="" size={12} container>
     <Typography className="payment-history-container-heading" >
        Payment History 
     </Typography>
     </Grid>
     {
  columns == undefined?
  <Grid container size={12} justifyContent={"center"}>
  <Grid  container justifyContent={"center"}  className="no-event" >
  <Grid>
  <NoPayment className="no-event-svg"/>
  </Grid>
  <Grid size={12} flexDirection={"column"}>
    <Typography className="no-event-svg-text">No Events Found</Typography>
    <Typography className="no-event-svg-text-description">You haven’t registered for any events yet. Explore upcoming events and secure your spot today!</Typography>
  </Grid>
      </Grid> 
</Grid>
     :
     <Grid container size={12} className="paymentlist">
     <DataGridList
             dataTransformer={transformData}
             source={source}
              //onRowClick={(params: any) => handleRowClick(params.id)}
              columns={columns}
              id="event-datagrid" 
              hideFooterPagination={false}/>
     </Grid>
}
  </Grid>
  )
})

export default PaymentHistory