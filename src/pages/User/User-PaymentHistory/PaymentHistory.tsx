import { NoEventSvg } from "@/assets/svg";
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
    { type: "default", field: "name", headerName: "Evnet Name", width: 258, Height: 51 },
    {
      type: "dateField",
      field: "Date",
      headerName: "Date",
      width: 190,
      Height: 51,
      dateFormat: "DD/MM/YYYY",
    },
    { type: "default", field: "amount", headerName: "Amount", width: 169, Height: 51 },
    {
      type: "status",
      field: "status",
      headerName: "Status",
      width: 159,
      Height: 51,
      dateFormat: "DD/MM/YYYY",
    },
    {
      type: "default",
      field: "Receipt",
      headerName: "Receipt",
      width: 167,
      Height: 51
    },
    { type: "", field: "PaymentMethod", headerName: "Payment Method", width: 181, Height: 51 },
  ];


  /**
   * Transforms the raw data from the API to match the required format for the DataGrid component.
   * @param data - The raw data from API response
   * @returns Transformed data for DataGrid
   */
  /**
   * 
   * @param data {
    "data": [
        {
            "id": 1,
            "paymentMethodId": 1,
            "companyId": 1,
            "eventId": 1,
            "userId": 1,
            "state": "1",
            "errorMessage": "1",
            "transactionId": "1",
            "metadata": "1",
            "amount": "11.00",
            "orderId": 1,
            "createdBy": 1,
            "createdOn": "2024-11-11T13:59:34.000Z",
            "modifiedBy": 1,
            "modifiedOn": "2024-11-11T13:59:34.000Z",
            "user": {
                "id": 1,
                "firstName": "loop",
                "lastName": "poly",
                "phone": "9876549879",
                "email": "poly@gmail.com",
                "statusId": null
            },
            "event": {
                "id": 1,
                "parentId": null,
                "name": "foodball",
                "description": "<p>checking</p>",
                "startTime": "2024-10-30T00:00:00.000Z",
                "endTime": "2024-10-30T00:00:00.000Z",
                "speciality": null,
                "venueId": 1,
                "eventClass": "normal",
                "interval": null,
                "companyId": 1,
                "title": null,
                "slugName": null,
                "amount": "0.00",
                "discount": null,
                "published": false,
                "registrationDeadline": null,
                "statusId": 1
            },
            "company": {
                "id": 1,
                "phone": "9895436784",
                "email": "dude@gmail.com",
                "companyName": "texas",
                "companyAddress": "loop",
                "state": "loopo",
                "statusId": 1
            }
        }
    ],
    "pagination": {
        "total": 1,
        "limit": 5,
        "offset": 0,
        "totalPages": 1,
        "currentPage": 1
    }
}
   * @returns 
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
        payment History 
     </Typography>
     </Grid>
     {/* {
  columns !== undefined?
  <Grid container size={12}>
  <Grid  className="my-event-no-event" size={12}>
  <NoEventSvg className="my-event-no-event-image"/>
      </Grid> 
</Grid>
     : */}
     <Grid container size={12} className="paymentlist">
     <DataGridList
             dataTransformer={transformData}
             source={source}
                
              //  onRowClick={(params: any) => handleRowClick(params.id)}
              columns={columns}
              id="event-datagrid" 
              hideFooterPagination={false}/>
     </Grid>

  </Grid>
  )
})

export default PaymentHistory