import { create } from "zustand";

const useStore = create((set) => ({
    compData: {},
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
     */
    userInfo: {},
    
    setUserInfo: (data: any) => set({ userInfo: data }),

    /**
    * Method to reset the store to initial state
    */
    resetStore: () => set(() => ({
        compData: {}
    }))
    
}));

export default useStore;