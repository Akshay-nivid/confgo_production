import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Grid from '@mui/material/Grid2';
/*
 * Component used to handle paypal button 
 */
const PayPalButton: React.FC = () => {
    const initialOptions = {
        clientId: "AQ9K1hDjjXSmmQz1aBt3FDjLTkrl8DRJvnUC6H6_eXAw-wzz6eC2eoYmSOEJcdN0prPUX1hsSm8bfGtK", // Replace with your PayPal Client ID
        currency: "USD",
        intent: "capture",
    };
/*
 * functional compoent used to approve the payment functionality
*@ param
 */
    const handleApprove = async (data: any, actions: any) => {
        const details = await actions.order.capture();
        console.log('Transaction completed by ' + details.payer.name.given);
        alert('Transaction completed by ' + details.payer.name.given);
    };

    return (
        <Grid >
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons 
                style={{ layout: 'vertical' }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                currency_code: 'USD', // Required currency code
                                value: '10.00', // Replace with the desired amount
                            },
                        }],
                        intent: 'CAPTURE'
                    });
                }}
                onApprove={handleApprove}
            />
        </PayPalScriptProvider>
        </Grid>
    );
};

export default PayPalButton;
