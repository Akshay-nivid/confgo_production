import React, { useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Grid from '@mui/material/Grid2';
import useStore from '@/Libs/store';
import apiClient from '@/Libs/Https/API-client';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
import { Logger } from '@/Utils/Logger';
import { setDataById } from '@/Libs/store';
/*
 * Component used to handle PayPal button 
 */
const PayPalParticipantButton: React.FC = () => {
    
    const paymentDetails = useStore((state: any) => state?.compData?.["addToCart"])
    
    const eventId = useStore((state: any) => state?.compData?.["eventSelected"]?.id) ?? null;
    console.log(paymentDetails,'sskjskjskj')


    const initialOptions = {
        clientId: "AQ9K1hDjjXSmmQz1aBt3FDjLTkrl8DRJvnUC6H6_eXAw-wzz6eC2eoYmSOEJcdN0prPUX1hsSm8bfGtK", 
        currency: "USD",
        intent: "capture",
    };

    const paypalButtonRef = useRef<HTMLDivElement>(null);

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
                "paymentMethodId": 1,
                "state":  paypalData?.status,
                "errorMessage": "No error",
                "transactionId": paypalData?.id,
                "metadata":JSON.stringify(paypalData) ,
                "amount":  paypalData?.purchase_units?.[0]?.amount?.value,
                "eventId": eventId
            }
            const response = await apiClient.post('payment',requestBody)
            const { status } = processAPIResponse(response, 'paymentSubscription')
            if (status) {
                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: "Registration Successfully and please check your email for further instructions" });
                setDataById('register', { data: 'REGISTRATION_SUCCESS_PAGE' });
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

    if (!paymentDetails.cart.data.finalPrice) {
        return
    }
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
                                        value: '10',
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

export default PayPalParticipantButton;
