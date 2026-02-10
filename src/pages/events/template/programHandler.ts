import { GET, setDataById, setNonPersistedDataById, snackBar } from "@/Libs/store"
import { handleGroupData } from "@/pages/Participant-User/Program-Selection/programsHandlers"



/**
 * Method to get user cart from the api, used in the initial state of the program selection page
 * @param helperFn - function to be called after the data is fetched from the api
 * @param cartID - user cart id, if not provided, it will be fetched from the session storage
 */
export const getUserCart = ({ helperFn, cartID }: { helperFn: (response?:any) => void, cartID?: String | null | undefined }) => {

    try {

        setNonPersistedDataById('getCartLoading', { value: true })

        const cartId = cartID ? cartID : sessionStorage.getItem('cartId')

        if (!cartId || cartId === undefined) return

        GET({
            url: `cart/${cartId}`,
            id: 'getCart',
            successCB: (response: any) => {

                const formatedData = handleGroupData({
                    addons: response?.data?.addons,
                    programs: response?.data?.programs,
                    // calculateTotal: true
                    
                })


                setDataById("finalPrice", { value: response?.data?.cart?.finalPrice })

                setDataById("formatedCartData", { formatedData: formatedData }) // storing data after formatting for mapping in ui

                helperFn(response?.data)

                setNonPersistedDataById('getCartLoading', { value: false })


            },
            errorCB: (error: any) => {
                setNonPersistedDataById('getCartLoading', { value: false })
                setDataById("snackBarInfo", {
                    open: true,
                    autoHideDuration: 2000,
                    severity: "error",
                    message: error?.message || 'something went wrong',
                })

            }
        })


    } catch (error:any) {
        snackBar({ severity: 'error', message: error?.message || 'something went wrong' })
        setNonPersistedDataById('getCartLoading', { value: false })
        
    }

}



