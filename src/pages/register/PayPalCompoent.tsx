import React, { useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Grid from '@mui/material/Grid2';
import useStore, { POST } from '@/Libs/store';
import apiClient from '@/Libs/Https/API-client';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
import { Logger } from '@/Utils/Logger';
import routes from '@/router/routes';
import { useNavigate } from 'react-router-dom';

/*
 * Component used to handle PayPal button 
 */
const PayPalButton: React.FC = () => {
    const form1 = useStore((state: any) => state?.compData?.['form1']) ?? [];
    const form3 = useStore((state: any) => state?.compData?.['form3']) ?? [];

    //data for plan upgrade
    const planDetails = useStore((state: any) => state?.compData?.['planDetails']) ?? {};
    const subscriptionDetails = useStore((state: any) => state?.compData?.['subscriptionDetails']) ?? {};

    const setDataById = useStore((state: any) => state.setDataById)

    const navigate = useNavigate();
    
    const initialOptions = {
        clientId: "AQ9K1hDjjXSmmQz1aBt3FDjLTkrl8DRJvnUC6H6_eXAw-wzz6eC2eoYmSOEJcdN0prPUX1hsSm8bfGtK", 
        currency: "USD",
        intent: "capture",
    };

    const paypalButtonRef = useRef<HTMLDivElement>(null);

    const isPlanDetailsEmpty = Object.keys(planDetails).length === 0;
    const isSubscriptionDetailsEmpty = Object.keys(subscriptionDetails).length === 0;

    const isRegister = isPlanDetailsEmpty && isSubscriptionDetailsEmpty;



    /*
     * Function used to approve the payment functionality
     * param @_data,actions
     */
    const handlePreApprove = async (_data: any, actions: any) => {
        try {
            handleApprove(_data, actions);
        } catch (error) {
            Logger.error("Pre-approval failed:", error);
        }
    };
   /*
     * Function use call function before proceeding to payment 
     * param @_data,actions
     */
    const handleApprove = async (_data: any, actions: any) => {
        let paymentInfo;
             paymentInfo = await actions.order.capture();
        if(paymentInfo){
            paymentSubscription(paymentInfo);
        }
    };

    const paymentSubscription = async (paypalData: any) => {
        try {
            const requestBody = {
                paymentMethodId: 1,
                state: paypalData?.status,
                errorMessage: "No error message",
                transactionId: paypalData?.id,
                metadata:JSON.stringify(paypalData) ,
                amount: paypalData?.purchase_units?.[0]?.amount?.value,
                discountAmount: 0,
                finalAmount: paypalData?.purchase_units?.[0]?.amount?.value,
                subscriptionId: isRegister
                  ? form3?.companyData?.subscriptionId
                  : subscriptionDetails?.field_values?.id,
                userId: isRegister
                  ? form3?.companyData?.user?.id
                  : subscriptionDetails?.field_values?.userId,
                paymentId:paypalData?.purchase_units?.[0]?.custom_id,
            }
            const response = await apiClient.post('payment/subscription',requestBody)
            const { status } = processAPIResponse(response, 'paymentSubscription')
            if (status) {
              setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: isRegister
                ?"Registration successful! Check your email for further instructions."
                :"Plan upgraded successfully!" , });
              isRegister
                ? setDataById('register', { data: 'REGISTRATION_SUCCESS_PAGE' })
                : (POST({ url: 'subscription/verify', body: {}, id: 'paymentBanner' }), navigate(routes.dashboard()));
            }
        } catch (error) {
            Logger.error('PayPalCompoent.tsx', error);
        }
    }

    const handleCardButtonClick = () => {
        if (paypalButtonRef.current) {
            paypalButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
 
    return (
        <Grid>
            <PayPalScriptProvider options={initialOptions}>
                <div ref={paypalButtonRef}>
                    <PayPalButtons
                        style={{ layout: 'vertical' }}
                        createOrder={(_data, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                      currency_code: 'USD',
                                      value: isRegister
                                        ? form1?.field_values?.amount
                                        : planDetails?.field_values?.amount,
                                    },
                                    custom_id:'test234'
                                }],
                                intent: 'CAPTURE'
                            });
                        }}
                        onApprove={handlePreApprove}
                        onClick={handleCardButtonClick}
                    />
                </div>
            </PayPalScriptProvider>
        </Grid>
    );
};

export default PayPalButton;
