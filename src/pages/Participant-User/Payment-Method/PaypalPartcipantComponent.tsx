import React, { useEffect, useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Grid from '@mui/material/Grid2';
import useStore, { IStoreState, POST, snackBar } from '@/Libs/store';
import { setDataById } from '@/Libs/store';
import {  useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import { Backdrop, CircularProgress } from '@mui/material';
import { OrderSummary } from '@/Libs/types/type';

enum enumPaymentState {
    INITIATED = 'INITIATED',
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELED = 'CANCELED',
}

interface IPayment {
    paymentMethodId: number;
    state: string;
    errorMessage: string;
    transactionId?: string;
    metadata: string;
    amount: number;
    eventId: number;
    paymentReferenceNumber: string;
    orderId: number;
}

interface IPaymentResponse {
    status: string;
    message: string;
    data: {
        id: number;
        paymentMethodId: number;
        state: enumPaymentState;
        errorMessage: string;
        transactionId: string;
        paymentReferenceNumber: string;
        metadata: string;
        amount: number;
    };
}


interface IPayPalOrder {
    id: string;
    intent: string;
    status: enumPaymentState;
    purchase_units: PurchaseUnit[];
    payer: Payer;
    create_time: string;
    update_time: string;
    links: Link[];
}

interface PurchaseUnit {
    reference_id: string;
    amount: Amount;
    payee: Payee;
    custom_id: string;
    soft_descriptor: string;
    shipping: Shipping;
    payments: Payments;
}

interface Amount {
    currency_code: string;
    value: string;
}

interface Payee {
    email_address: string;
    merchant_id: string;
}

interface Shipping {
    name: ShippingName;
    address: Address;
}

interface ShippingName {
    full_name: string;
}

interface Address {
    address_line_1: string;
    address_line_2?: string;
    admin_area_2: string;
    admin_area_1: string;
    postal_code: string;
    country_code: string;
}

interface Payments {
    captures: Capture[];
}

interface Capture {
    id: string;
    status: string;
    amount: Amount;
    final_capture: boolean;
    seller_protection: SellerProtection;
    create_time: string;
    update_time: string;
}

interface SellerProtection {
    status: string;
    dispute_categories: string[];
}

interface Payer {
    name: PayerName;
    email_address: string;
    payer_id: string;
    address: PayerAddress;
}

interface PayerName {
    given_name: string;
    surname: string;
}

interface PayerAddress {
    country_code: string;
}

interface Link {
    href: string;
    rel: string;
    method: string;
}


/*
 * Component used to handle PayPal button 
 */
const PayPalParticipantButton: React.FC = () => {

    const initialOptions = {
        clientId: "AQ9K1hDjjXSmmQz1aBt3FDjLTkrl8DRJvnUC6H6_eXAw-wzz6eC2eoYmSOEJcdN0prPUX1hsSm8bfGtK",
        currency: "USD",
        intent: "capture",
        "disable-funding": "card"
    };


    const eventId = useStore((state: any) => state?.compData?.["eventSelected"]?.id) ?? null;

    const paypalButtonRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const orderData:OrderSummary = useStore((state) => state?.compData?.["order"]?.["order"]?.data) ?? null

    const paymentLoading = useStore((state: any) => state?.compData?.["payment"]?.["payment"]?.loading) ?? false

    const paymentReferenceNumber = useStore((state: any) => state?.compData?.["paymentReferenceNumber"]?.value) ?? null

    const checkoutLoading = useStore((state: IStoreState) => state?.compData?.checkout?.checkout?.loading) ?? false



    useEffect(() => {
        setDataById('paymentReferenceNumber', { value: orderData?.id + JSON.stringify(Date.now()) })
    }, [orderData?.id])


    useEffect(() => {


        if (!orderData?.id || !orderData?.finalPrice || orderData?.id === undefined || orderData?.finalPrice === undefined) {

            navigate(routes.programSelection())
            setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: 'Could not find order. Please try again' })
            return;

        }


        if (orderData?.finalPrice === 0) {
            const body = {
                "orderId": orderData?.id,
                "registrationType": "online"
            }

            POST({
                url: 'partcipant', id: 'participant', body, successCB: () => {
                    snackBar({ severity: 'success', message: 'successfully registered' })
                    navigate(routes.userEventRegistrationCompleted())
                    return
                }, errorCB: () => {
                    snackBar({ severity: 'error', message: 'Something went wrong. Please try again' })
                    navigate(routes.programSelection())
                    return
                }
            })
        }

    }, [orderData?.id, orderData?.finalPrice])




    /**
     * Function to handle payment completion
     * @param _data - data received from paypal
     * @param actions - actions to be performed
     * @returns {Promise<void>}
     */
    const handleApprove = async (_data: any, actions: any) => {

        if (!orderData?.id || !orderData?.finalPrice || orderData?.id === undefined || orderData?.finalPrice === undefined) {

            setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: 'Could not find order. Please try again' });

            navigate(routes.programSelection())

            return
        }


        const body: IPayment = {
            "paymentMethodId": 1,
            "state": enumPaymentState.INITIATED,
            "errorMessage": "No error",
            "metadata": '{}',
            "amount": orderData?.finalPrice,
            "eventId": eventId,
            "paymentReferenceNumber": paymentReferenceNumber,
            "orderId": orderData.id
        }

        POST({
            id: 'payment',
            url: 'payment',
            body: body,
            successCB: async (paymentResponse: IPaymentResponse) => {

                setDataById('checkout', { checkout: { loading: true } })

                const paymentSuccessInfo: IPayPalOrder = await actions.order.capture();


                if (paymentSuccessInfo) {

                    POST({
                        url: 'checkout',
                        id: 'checkout',
                        body: {
                            orderId: orderData?.id,
                            registrationType: "online",
                            eventId: eventId,
                            status: paymentSuccessInfo?.status,
                            paymentStatus: paymentSuccessInfo?.status,
                            paymentId: paymentResponse?.data?.id,
                            state: "COMPLETED",
                            errorMessage: "No error",
                            transactionId: paymentSuccessInfo?.id,
                            paymentreferencenumber: paymentReferenceNumber,
                            metadata: JSON.stringify(paymentSuccessInfo),
                            amount: paymentSuccessInfo?.purchase_units?.[0]?.amount?.value || orderData?.finalPrice,
                        },
                        successCB: (context:any) => {
                            navigate(routes.userEventRegistrationCompleted())
                            setDataById('registrationCompleteData', context?.data)
                            
                        }, errorCB: (errorResponse) => {
                            snackBar({ severity: 'error', message: errorResponse?.message })
                        }
                    })
                }
            }, errorCB: (errorResponse) => {


                snackBar({ severity: 'error', message: errorResponse?.message || 'something went wrong' })
                if (errorResponse?.message.trim() === 'Payment has already been completed.') {
                    navigate(routes.userHome(),{replace:true})
                }

            }

        })
    };




    /**
     * Handles cancel event of paypal. Shows error message and navigates user to payment method page.
     */
    function handleCancel() {
        snackBar({ severity: 'error', message: 'Payment Cancelled' })

    }


    /**
     * Handles the error event of paypal. Shows error message .
     * @param data - The error data returned by paypal.
     */
    function handleError() {
        snackBar({ severity: 'error', message: 'Something went wrong. Please try again' })
    }




    if (!orderData?.id) {
        navigate(routes.programSelection())
        return
    }


    return (
        <Grid>
            {(checkoutLoading || paymentLoading) && <Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>}
            <PayPalScriptProvider options={initialOptions}>
                <div ref={paypalButtonRef}>
                    <PayPalButtons
                        disabled={checkoutLoading || paymentLoading}
                        style={{ layout: 'vertical' }}
                        createOrder={(_data, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        currency_code: 'USD',
                                        value: JSON.stringify(orderData?.finalPrice),
                                    },
                                    custom_id: paymentReferenceNumber
                                }],
                                intent: 'CAPTURE'
                            });
                        }}
                        onApprove={handleApprove}
                        onCancel={handleCancel}
                        onError={handleError}

                    />

                </div>

            </PayPalScriptProvider>
        </Grid>
    );
};

export default PayPalParticipantButton;
