import React, { useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Grid from '@mui/material/Grid2';
import useStore from '@/Libs/store';
import apiClient from '@/Libs/Https/API-client';

/*
 * Component used to handle PayPal button 
 */
const PayPalButton: React.FC = () => {
    const form1 = useStore((state: any) => state?.compData?.['form1']) ?? [];
    const form2 = useStore((state: any) => state?.compData?.['form2']) ?? [];
    const form3 = useStore((state: any) => state?.compData?.['form3']) ?? [];
    console.log(form1,'form1',form2,'form2',form3,'form3');
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
         CreateAccount();
    };
    /*
     * Functional create a new Account 
     *
     */    
    const CreateAccount = async () => {

        try {
            const req = {
                firstName: form2.field_values.fullName,
                lastName: form2.field_values.lastName,
                email: form2.field_values.email,
                companyPhone: form3.field_values.organizationPhone,
                companyEmail: form3.field_values.organizationEmail,
                companyName: form3.field_values.organizationName,
                companyAddress: form3.field_values.organizationAddress,
                planId: 2,
                password: 'Abcd@1234'
            }
            console.log(req, 'req');
            const response = await apiClient.post('company', req);
            if (response.status === 200) {
                setDataById('register', { data: 'REGISTRATION_SUCCESS_PAGE' });
                console.log('Account created successfully');
            } else {
                console.log('Account creation failed');
            }

        } catch (error) {
            console.log(error)
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
                                        // value: form1.field_values.price,
                                        value:'1'
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