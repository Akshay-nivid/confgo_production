import React, { useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Grid from '@mui/material/Grid2';
import useStore from '@/Libs/store';

/*
 * Component used to handle PayPal button 
 */
const PayPalButton: React.FC = () => {
    const { setDataById }: any = useStore();

    const initialOptions = {
        clientId: "AQ9K1hDjjXSmmQz1aBt3FDjLTkrl8DRJvnUC6H6_eXAw-wzz6eC2eoYmSOEJcdN0prPUX1hsSm8bfGtK", // Replace with your PayPal Client ID
        currency: "USD",
        intent: "capture",
    };

    const paypalButtonRef = useRef<HTMLDivElement>(null);

    /*
     * Functional component used to approve the payment functionality
     * @param
     */
    const handleApprove = async (_data: any, actions: any) => {
         await actions.order.capture();
         setDataById('register', { data: 'REGISTRATION_SUCCESS_PAGE' });

    };

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
                                        value: '10.00',
                                    },
                                }],
                                intent: 'CAPTURE'
                            });
                        }}
                        onApprove={handleApprove}
                        onClick={handleCardButtonClick} // Add the click handler here
                    />
                </div>
            </PayPalScriptProvider>
        </Grid>
    );
};

export default PayPalButton;