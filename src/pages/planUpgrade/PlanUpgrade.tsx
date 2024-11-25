import useStore from "@/Libs/store";
import Grid from '@mui/material/Grid2';
import PaymentMethod from "../register/PaymentMethod";
import { useEffect } from "react";
import { Logger } from "@/Utils/Logger";


/**
 * PlanUpgrade Component triggers the creation of a subscription
 * and displays the `PaymentMethod` component for completing the payment.
 */
const PlanUpgrade = () => {
  const planDetails = useStore((state: any) => state?.compData?.['planDetails']) ?? [];
  const POST = useStore((state: any) => state.POST);
  const setDataById = useStore((state: any) => state.setDataById);

  /**
   * Initiates the subscription creation process.
   */
  useEffect(() => {
      createSubscription();
  }, [])

  /**
   * Sends a POST request to the subscription endpoint with the selected plan ID.
   * Sets the response data in the global state..
   */
  const createSubscription = async () => {

    const successCallback = (context: any) => {
      setDataById('subscriptionDetails', { field_values: context.data });
    };

    const errorCallback = (context: any) => {
      Logger.error("Error creating subscription:", context.message);
    };

    await POST({
      url: "/subscription",
      body: {
        planId: planDetails?.field_values?.id,
      },
      id: "subscriptionCreate",
      successCB: successCallback,
      errorCB: errorCallback,
    });
  }
    return (
        <Grid container justifyContent={'center'}>
          <PaymentMethod />
        </Grid>
    );
  }
export default PlanUpgrade;