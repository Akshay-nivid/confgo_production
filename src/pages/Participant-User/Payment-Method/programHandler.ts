import  { POST, setDataById } from "@/Libs/store";

/**
 * Handles the processing of the cart for the user.
 * If the grand total is 0, it will directly proceed to the event registration completed page.
 * If the grand total is not 0, it will proceed to the payment page.
 * @param {{
 *  grandTotal: string | null | undefined,
 *  orderId: string | number | null | undefined,
 *  eventId: string | number | null | undefined,
 *  helperFn: (route: '/user/payment' | '/user/event-registration-completed') => void
 * }} options
 * @returns {void}
 */
export function handleCartProcessing({ helperFn,grandTotal,orderId,eventId }: {grandTotal:string | null | undefined,orderId:string | number | null | undefined,eventId:string | number | null | undefined, helperFn: (route:'/user/payment'|'/user/event-registration-completed') => void }) {

    try {


        if (!orderId || !eventId || orderId === undefined || eventId === undefined || !grandTotal || grandTotal === undefined) throw new Error('Either order id, grand total or event id is missing')


        if (parseFloat(grandTotal) === 0 ) {


            const body = {
                "paymentStatus": "NOT_INITIATED",
                "paymentId": null,
                "registrationType": "online",
                "orderId": orderId,
                "eventId": eventId,
                "transactionid": "",
                "paymentreferencenumber": "",
            }


            POST({
                url: 'checkout',
                id: 'cartCheckout',
                body: body,
                successCB: (context: any) => {
                    console.log(context,'checkout data')
                    helperFn('/user/event-registration-completed')
                    setDataById('registrationCompleteData', context?.data)

                },
                errorCB: (error) => {
                    console.log(error)
                }
            })

        }
        helperFn('/user/payment')


    } catch (error) {
        console.log(error)
    }



}