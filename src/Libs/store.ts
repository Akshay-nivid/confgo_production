import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware'
import apiClient from "./Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";

/**
* Define types for the state
*/
interface CompData {
    [key: string]: any; // You can specify more precise types based on your use case
}

type ApiRequestOptions = {
    url: string;
    body: any;
    id: string;
    successCB?: (context: any) => void;
    errorCB?: (context: any) => void;
};
interface StoreState {
    compData: CompData;
    userInfo: any; // Specify the type based on your user info structure
    setDataById: (id: string, data: any) => void;
    clearDataById: (id: string) => void;
    setUserInfo: (data: any) => void;
    resetStore: () => void;
    POST: (params: ApiRequestOptions) => void;
}

/**
 * Custom storage object that filters out snackBarInfo
 */
const customStorage = {
    getItem: (name: string) => {
        const str = localStorage.getItem(name);
        if (!str) return null;
        const state = JSON.parse(str);
        return JSON.stringify(state);
    },
    setItem: (name: string, value: string) => {
        const state = JSON.parse(value);
        if (state?.state && state?.state?.compData) {
            delete state?.state?.compData?.snackBarInfo;
        }
        localStorage.setItem(name, JSON.stringify(state));
    },
    removeItem: (name: string) => localStorage.removeItem(name),
};

const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
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
            })),

            POST: async ({ url, body, id, successCB, errorCB }: ApiRequestOptions) => {
                // Set loading state
                get().setDataById(id, { context: { loading: true } });
                // Make API call
                const response = await apiClient.post(url, body);
                const { status, data, message } = processAPIResponse(response, id);
                if (status) {
                    let context = { data: data, loading: false, success: true }
                    get().setDataById(id, { context, timestamp: Date.now() });
                    successCB?.(context);

                } else {
                    let context = { data: data, loading: false, message:message }
                    get().setDataById(id, { message, context });
                    errorCB?.(context)
                }
                return { status, data, message };
            },
            GET: async ({ url,  id, successCB, errorCB }: ApiRequestOptions) => {
                // Set loading state
                get().setDataById(id, { context: { loading: true } });
                // Make API call
                const response = await apiClient.get(url);
                const { status, data, message } = processAPIResponse(response, id);
                if (status) {
                    let context = { data: data, loading: false, success: true }
                    get().setDataById(id, { context, timestamp: Date.now() });
                    successCB?.(context);

                } else {
                    let context = { data: data, loading: false, message:message }
                    get().setDataById(id, { message, context });
                    errorCB?.(context)
                }
                return { status, data, message };
            },
            PUT: async ({ url, body, id, successCB, errorCB }: ApiRequestOptions) => {
                // Set loading state
                get().setDataById(id, { context: { loading: true } });
                // Make API call
                const response = await apiClient.put(url, body);
                const { status, data, message } = processAPIResponse(response, id);
                if (status) {
                    let context = { data: data, loading: false, success: true }
                    get().setDataById(id, { context, timestamp: Date.now() });
                    successCB?.(context);

                } else {
                    let context = { data: data, loading: false, message:message }
                    get().setDataById(id, { message, context });
                    errorCB?.(context)
                }
                return { status, data, message };
            },
            DELETE: async ({ url,  id, successCB, errorCB }: ApiRequestOptions) => {
                // Set loading state
                get().setDataById(id, { context: { loading: true } });
                // Make API call
                const response = await apiClient.delete(url);
                const { status, data, message } = processAPIResponse(response, id);
                if (status) {
                    let context = { data: data, loading: false, success: true }
                    get().setDataById(id, { context, timestamp: Date.now() });
                    successCB?.(context);

                } else {
                    let context = { data: data, loading: false, message:message }
                    get().setDataById(id, { message, context });
                    errorCB?.(context)
                }
                return { status, data, message };
            },
        }),
        {
            name: "global-state-storage", // Unique name for local storage key
            storage: createJSONStorage(() => customStorage),
        }
    ),
);

export default useStore;