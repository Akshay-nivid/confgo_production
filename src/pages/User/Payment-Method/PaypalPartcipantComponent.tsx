import React, { useEffect, useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Grid from '@mui/material/Grid2';
import useStore, { POST, PUT, snackBar } from '@/Libs/store';
import { setDataById } from '@/Libs/store';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import { Backdrop, CircularProgress } from '@mui/material';

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
    };


    const eventId = useStore((state: any) => state?.compData?.["eventSelected"]?.id) ?? null;

    const paypalButtonRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const orderData = useStore((state: any) => state?.compData?.["order"]?.["order"]?.data) ?? null

    const paymentId = useStore((state: any) => state?.compData?.["payment"]?.["payment"]?.data?.id) ?? null

    const paymentLoading = useStore((state: any) => state?.compData?.["payment"]?.["payment"]?.[`update/${paymentId}`]?.loading) ?? false

    const paymentReferenceNumber = useStore((state: any) => state?.compData?.["paymentReferenceNumber"]?.value) ?? null

    const participantLoading = useStore((state: any) => state?.compData?.["participant"]?.["participant"]?.loading) ?? false

    const orderLoading = useStore((state: any) => state?.compData?.["orderUpdate"]?.[`order/update/${orderData.id}`]?.loading) ?? false

    // const paypalLoading = useStore((state: any) => state?.compData?.["paypalLoading"]?.value) ?? false

    useEffect(() => {
        setDataById('paymentReferenceNumber', { value: orderData?.id + JSON.stringify(Date.now()) })
    }, [])





    /**
     * trigger an early return if orderData is undefined
     */
    if (!orderData?.id || !orderData?.finalPrice || orderData?.id === undefined || orderData?.finalPrice === undefined) {

        navigate(routes.programSelection())
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: 'Could not find order. Please try again' })
        return;

    }

    /**
     * Updates the participant record in the database
     * @param {} 
     * @returns 
     */
    function updateForm() {
        PUT({

            url: "registrationRecord/participant/1",
            id: "participant",

            body: {
                "participantId": 1,
                "eventId": eventId
            },

            successCB: () => {

                setDataById('paypalLoading', { value: false })
                navigate(routes.userHome())

            },

            errorCB() {
                setDataById('paypalLoading', { value: false })


            },
        })
    }

    /**
     * Updates the order record in the database with the latest status from paypal
     * @param paypalData - latest paypal order data
     * @returns {void}
     */
    function updateOrderStatus(paypalData: IPayPalOrder) {

        // const orderStatusKey = paypalData?.status as keyof typeof ORDERSTATUS;

        const orderBody = {

            status: paypalData?.status,
            // paymentStatus: paypalData?.status
        }

        POST({
            url: `order/update/${orderData.id}`,
            body: orderBody,
            id: 'orderUpdate',
            successCB: () => {

                // 5 - call update form api
                updateForm()

            },
            errorCB: () => {
                setDataById('paypalLoading',{value:false})
            }
        })

    }


    /**
     * Updates the payment record in the database with the latest information from PayPal.
     * 
     * Logs the provided PayPal data and constructs a payment body with relevant details.
     * Sends a PUT request to update the payment using the specified payment ID.
     * On successful update, logs the payment response and triggers the order status update.
     *
     * @param paypalData - The latest data received from PayPal for the order.
     * @param paymentId - The ID of the payment record to update.
     * @returns {void}
     */
    function updatePaymentStatus(paypalData: IPayPalOrder, paymentId: string | number) {


        const paymentBody = {
            "state": paypalData?.status,
            "errorMessage": "No Error",
            "transactionId": paypalData?.id,
            "paymentReferenceNumber": paymentReferenceNumber,
            "metadata": JSON.stringify(paypalData),
            "amount": paypalData.purchase_units?.[0]?.amount?.value || orderData?.finalPrice,
        }

        PUT({
            url: `payment/update/${paymentId}`,
            id: 'payment',
            body: paymentBody,
            successCB: () => {

                // 5 - call order update api
                updateOrderStatus(paypalData)

            },
              errorCB: () => {
                setDataById('paypalLoading',{value:false})
                  
              }
        })


    }






    /**
     * Function to handle payment completion
     * @param _data - data received from paypal
     * @param actions - actions to be performed
     * @returns {Promise<void>}
     */
    const handleApprove = async (_data: any, actions: any) => {

        if (!orderData.id || !orderData.finalPrice || orderData.id === undefined || orderData.finalPrice === undefined) {

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
            "paymentReferenceNumber": paymentReferenceNumber
        }

        const participantBody = {
            orderId: orderData?.id,
            registrationType: "online",
        }

        setDataById('paypalLoading', { value: true }) // set loading to true while making the request
        
        // 1 - call payment creation api

        POST({
            id: 'payment',
            url: 'payment',
            body: body,
            successCB: async (paymentResponse: IPaymentResponse) => {


                // 2 - call payment capture paypal api 
                const paymentSuccessInfo = await actions.order.capture();


                if (paymentSuccessInfo) {

                    // 3 - call participant creation api

                    POST({
                        url: 'participant',
                        body: participantBody,
                        id: 'participant',

                        successCB: async () => {

                            // 4 - call payment update api
                            updatePaymentStatus(paymentSuccessInfo, paymentResponse.data.id);

                        },
                        errorCB: () => {

                            setDataById('paypalLoading', { value: false })
                            snackBar({ severity: 'error', message: 'Something went wrong while creating participant. Please try again' })
                        }
                    })

                    snackBar({ severity: 'success', message: 'payment successful' })

                    


                }


            },
            errorCB: () => {

                setDataById('paypalLoading', { value: false })

                snackBar({ severity: 'error', message: 'Something went wrong while creating payment. Please try again' })


                navigate(routes.userPaymentMethod())


                return
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
     * Handles the error event of paypal. Shows error message and logs the error in the console.
     * @param data - The error data returned by paypal.
     */
    function handleError() {
        snackBar({ severity: 'error', message: 'Something went wrong. Please try again' })
    }



    if (paymentLoading || participantLoading || orderLoading) {
        return (
            <Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
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
                                        value: orderData?.finalPrice,
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
