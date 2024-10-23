import { create } from "zustand";
import { persist } from 'zustand/middleware'

/**
* Define types for the state
*/
interface CompData {
    [key: string]: any; // You can specify more precise types based on your use case
}

interface StoreState {
    compData: CompData;
    userInfo: any; // Specify the type based on your user info structure
    setDataById: (id: string, data: any) => void;
    clearDataById: (id: string) => void;
    setUserInfo: (data: any) => void;
    resetStore: () => void;
}

const useStore = create<StoreState>()(
    persist(
        (set) => ({
            compData: {},
            userInfo: {},
            /**
             * Method to set data in global state using id
             * @param id :id
             * @param data :data
             */
            setDataById: (id: any, data: any) => {
                set((state: any) => ({
                    compData: {
                        ...state?.compData,
                        [id]: {
                            ...(state?.compData?.[id] || {}),
                            ...data
                        },
                    },
                }))
            },
            /**
             * Method to clear global state by id
             * @param id :state id
             */
            clearDataById: (id: any) => {
                set((state: any) => {
                    const updatedCompData = { ...state.compData };
                    delete updatedCompData[id]; // Remove the specified id
                    return { compData: updatedCompData };
                });
            },
            /**
             * Method to set User Details
             *@param data - The user data to store
             */
            setUserInfo: (data: any) => set({ userInfo: data }),

            /**
            * Method to reset the store to initial state
            */
            resetStore: () => set(() => ({
                compData: {}
            }))

        }),
        {
            name: "global-state-storage", // Unique name for local storage key
        }
    ),
);

export default useStore;