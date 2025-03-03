import useStore, { setNonPersistedDataById } from "@/Libs/store";
import { IEventAddonProperty } from "@/Libs/types/event";

const useProgramAddonToggle = () => {


    const cart = useStore((state) => state?.nonPersistedData?.cart)

    /**
    * Handles the click event on the program card
    * If the program is already in the cart, it removes it
    * If the program is not in the cart, it adds it
    * @param {IProgram} program program object
    */


    function handleProgramClick(programId: number) {

        const targetIndex = cart?.programIds?.findIndex((item: any) => item === programId)

        if (targetIndex !== -1) {

            const updatedCart = [...cart?.programIds?.filter((item: any) => item !== programId)];

            setNonPersistedDataById('cart', { ...cart, programIds: updatedCart });
        } else {
            const updatedCart = [...cart?.programIds, programId];

            setNonPersistedDataById('cart', { ...cart, programIds: updatedCart });
        }

    }

    /**
     * Checks if a program is in the cart
     * @param {number} programId
     * @returns {boolean}
     */
    const isProgramInCart = (programId: number) => {
        return cart?.programIds?.includes(programId);
    }



    /**
   * Function checks if the given addon property is already selected in the cart.
   * It loops through the cart and checks if the addonId of the property matches
   * any of the addonId in the cart. If it does, it then checks if the propertyId
   * of the given addon property is present in the array of propertyIds of the
   * matching addon in the cart. If it is, it returns true, otherwise it returns false.
   * @param {IEventAddonProperty} addonProp - The addon property to be checked.
   * @returns {boolean} - True if the addon property is selected in the cart, false otherwise.
   */
    const isAddonProp = (addonProp: IEventAddonProperty) => {
        const index = cart?.addons?.findIndex((item: any) => item?.addonId === addonProp?.eventAddonId)

        if (index === -1) return

        return cart?.addons?.[index]?.propertyIds?.some((item: any) => item === addonProp?.id)

    }


    /**
 * Toggles the selection of an add-on property in the cart.
 * If the add-on property is already selected, it will be removed.
 * If it is not selected, it will be added.
 * If no properties remain selected for an add-on, the add-on itself is removed from the cart.
 * 
 * @param {IEventAddonProperty} addonProp - The add-on property to toggle.
 */

    function handleClickAddonProp(addonProp: IEventAddonProperty) {


        const target = cart.addons?.findIndex((item: any) => {
            return item?.addonId === addonProp?.eventAddonId
        })

        if (target !== -1) {

            const currentData = cart?.addons?.[target];

            const index = currentData?.propertyIds?.findIndex((item: any) => item === addonProp?.id)

            const addonProperties = index !== -1 ? [...currentData?.propertyIds?.filter((item: any) => item !== addonProp?.id)] : [...currentData?.propertyIds, addonProp?.id]


            if (addonProperties.length === 0) {
                setNonPersistedDataById('cart', { ...cart, addons: [...cart?.addons?.filter((item: any) => item?.addonId !== addonProp?.eventAddonId)] });

            } else {
                setNonPersistedDataById('cart', { ...cart, addons: [...cart?.addons?.filter((item: any) => item?.addonId !== addonProp?.eventAddonId), { ...currentData, propertyIds: addonProperties }] });

            }


        } else {
            const data = { addonId: addonProp?.eventAddonId, propertyIds: [addonProp?.id] }

            setNonPersistedDataById('cart', { ...cart, addons: [...cart?.addons, data] });
        }

    }



    /**
     * Handles the click event on the add-on card.
     * If the add-on is already in the cart, it removes it.
     * If the add-on is not in the cart, it adds it.
     * @param {number} addonId - The id of the add-on to be added or removed.
     */
    function handleAddonClick(addonId: number) {

        const targetIndex = cart.addons?.findIndex((item: any) => item?.addonId === addonId)



        if (targetIndex !== -1) {
            const updatedCart = [...cart?.addons?.filter((item: any) => item?.addonId !== addonId)];

            setNonPersistedDataById('cart', { ...cart, addons: updatedCart });
        } else {

            const updatedCart = [...(cart?.addons || []), { addonId }];
            setNonPersistedDataById('cart', { ...cart, addons: updatedCart });
        }

    }

    /**
     * Checks if an add-on is in the cart.
     * @param {number} addonId - The id of the add-on to check.
     * @returns {boolean} - True if the add-on is in the cart, false otherwise.
     */
    function isAddonInCart(addonId: number) {
        return cart?.addons?.some((item: any) => item?.addonId === addonId)
    }


    return { handleProgramClick, isProgramInCart, isAddonProp, handleClickAddonProp, handleAddonClick, isAddonInCart }


}



export default useProgramAddonToggle
