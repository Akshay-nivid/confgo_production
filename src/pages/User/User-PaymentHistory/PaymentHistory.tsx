
import CustomButton from "@/components/CustomButton/CustomButton";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CircularProgress } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Logger } from "@/Utils/Logger";
import { ISource } from "@/Libs/type";
import { NoPayment } from "@/assets/svg";
/**
 * `PaymentHistory` component displays a data grid with payment history information.
 */
const PaymentHistory: React.FC = React.memo(() => {
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<ISource | undefined>(undefined);

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
    { type: "default", field: "amount", headerName: "Amount", width: 150 },
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
        name: item?.event?.name,
        Date: item.createdOn,
        amount: item?.amount,
        status: item?.event?.statusId,
        createdOn: item?.createdOn,
        Receipt: <CustomButton label={"[Download]"} className="download-Receipt" />,
        PaymentMethod: item.paymentMethodId

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