import useStore from "@/Libs/store";
import Grid from '@mui/material/Grid2';
import PaymentMethod from "../register/PaymentMethod";
import { useEffect, useRef } from "react";
import { Logger } from "@/Utils/Logger";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";


/**
 * PlanUpgrade Component triggers the creation of a subscription
 * and displays the `PaymentMethod` component for completing the payment.
 */
const PlanUpgrade = () => {
  const planDetails = useStore((state: any) => state?.compData?.['planDetails']) ?? [];
  const POST = useStore((state: any) => state.POST);
  const setDataById = useStore((state: any) => state.setDataById);
  const subscriptionDetails = useStore((state: any) => state?.compData?.['subscriptionDetails']) ?? null;
  const navigate = useNavigate();
  // Track if API call has already been made
  const isApiCalled = useRef(false);


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
    if (isApiCalled.current) {
      Logger.info("Subscription API already called, skipping...");
      return;
    }

    if (!planDetails?.field_values?.id) {
      Logger.warn("Plan ID is missing, subscription creation aborted.");
      return;
    }

    isApiCalled.current = true; // Mark API as called


    try {
      const successCallback = (context: any) => {
        setDataById('subscriptionDetails', { field_values: context.data });
      };

      const errorCallback = (error: any) => {
        setDataById('snackBarInfo', {
          open: true,
          autoHideDuration: 2000,
          severity: 'error',
          message: 'Something went wrong. Please try again.',
        });
        Logger.error("Error creating subscription:", error.message);
        navigate(routes.dashboard());
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
    } catch (error) {
      Logger.error("Error creating subscription:", error);
    }
  }
  return (
    <Grid container justifyContent={'center'}>
      {subscriptionDetails ? (<PaymentMethod />) : (<Grid><CircularProgress /></Grid>)}
    </Grid>
  );
  }
export default PlanUpgrade;