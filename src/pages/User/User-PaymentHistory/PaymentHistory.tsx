import { NoEventSvg } from "@/assets/svg";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
/**
 * `PaymentHistory` component displays a data grid with payment history information.
 */
const PaymentHistory:React.FC = React.memo(()=>{
  /**
   *  * `columns` defines the structure of each column in the DataGridList component.
   */
  const columns = [
    { type: "default", field: "Event Name", headerName: "Evnet Name", width: 278, Height: 51 },
    {
      type: "default",
      field: "Date",
      headerName: "Date",
      width: 207,
      Height: 51,
      dateFormat: "DD/MM/YYYY",
    },
    { type: "default", field: "Amount", headerName: "Amount", width: 189, Height: 51 },
    {
      type: "default",
      field: "Status",
      headerName: "Status",
      width: 179,
      Height: 51,
      dateFormat: "DD/MM/YYYY",
    },
    {
      type: "default",
      field: "Receipt",
      headerName: "Receipt",
      width: 187,
      Height: 51
    },
    { type: "", field: "Payment Method", headerName: "Payment Method", width: 181, Height: 51 },
  ];
  return (
  <Grid container size={12} className="payment-history-container">
     <Grid className="" size={12} container>
     <Typography className="payment-history-container-heading" >
        payment History 
     </Typography>
     </Grid>
     {
  columns == undefined?
  <Grid container size={12}>
  <Grid  className="my-event-no-event" size={12}>
  <NoEventSvg className="my-event-no-event-image"/>
  <Typography>kjdekjekj</Typography>
      </Grid> 
</Grid>
     :<Grid container size={12}>
     <DataGridList
              //  source={source}
              //  onRowClick={(params: any) => handleRowClick(params.id)}
              columns={columns}
              id="event-datagrid" 
              hideFooterPagination={false}/>
              
     </Grid>
}
  </Grid>
  )
})

export default PaymentHistory