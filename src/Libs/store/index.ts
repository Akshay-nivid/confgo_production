import { create } from "zustand";
import { createJSONStorage, persist, devtools } from 'zustand/middleware'
import apiClient from "../Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { ApiRequestOptions, CompData, NonPersistedData } from "../types/store";
import { initialNonPersistedData } from "./initialState";

export interface IStoreState {
    compData: CompData;
    nonPersistedData: NonPersistedData;
    userInfo: any; // Specify the type based on your user info structure
    setDataById: (id: string, data: any) => void;
    clearDataById: (id: string) => void;
    setUserInfo: (data: any) => void;
    resetStore: () => void;
    setNonPersistedDataById: (
        id: string,
        data: any
    ) => void;
    POST: (params: ApiRequestOptions) => void;
    GET: (params: ApiRequestOptions) => Promise<{ status: boolean; data: any; message: string }>;
    PUT: (params: ApiRequestOptions) => Promise<{ status: boolean; data: any; message: string }>;
    DELETE: (params: ApiRequestOptions) => Promise<{ status: boolean; data: any; message: string }>;
    snackBar: ({ severity, message, autoHideDuration }: { severity: "success" | "error", message: string, autoHideDuration?: number }) => void
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

const useStore = create<IStoreState>()(
    devtools(
        persist(
            (set, get) => ({
                compData: {},
                userInfo: {},
                nonPersistedData: initialNonPersistedData,
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
                 * Method to set non persisted data in global state using id
                 * @param id :id
                 * @param data :data
                 */
                setNonPersistedDataById: (
                    id: string,
                    data: any,
                ) => {
                    set((state) => ({
                        nonPersistedData: {
                            ...state.nonPersistedData,
                            [id]: {
                                ...(state.nonPersistedData[id] || {}),
                                ...data
                            }
                        },
                    }));
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
                    get().setDataById(id, { [url]: { loading: true } });
                    // Make API call
                    const response = await apiClient.post(url, body);
                    const { status, data, message } = processAPIResponse(response, id);
                    if (status) {
                        let context = { data: data, loading: false, success: true }
                        get().setDataById(id, { [url]: { ...context }, timestamp: Date.now() });
                        successCB?.(context);
    
                    } else {
                        let context = { data: data, loading: false, message: message }
                        get().setDataById(id, { message, [url]: { ...context } });
                        errorCB?.(context)
                    }
                    return { status, data, message };
                },
                GET: async ({ url, id, successCB, errorCB }: ApiRequestOptions) => {
                    // Set loading state
                    get().setDataById(id, { [url]: { loading: true } });
                    // Make API call
                    const response = await apiClient.get(url);
                    const { status, data, message } = processAPIResponse(response, id);
                    if (status) {
                        let context = { data: data, loading: false, success: true }
                        get().setDataById(id, { [url]: { ...context }, timestamp: Date.now() });
                        successCB?.(context);
    
                    } else {
                        let context = { data: data, loading: false, message: message }
                        get().setDataById(id, { message, [url]: { ...context } });
                        errorCB?.(context)
                    }
                    return { status, data, message };
                },
                PUT: async ({ url, body, id, successCB, errorCB }: ApiRequestOptions) => {
                    // Set loading state
                    get().setDataById(id, { [url]: { loading: true } });
                    // Make API call
                    const response = await apiClient.put(url, body);
                    const { status, data, message } = processAPIResponse(response, id);
                    if (status) {
                        let context = { data: data, loading: false, success: true }
                        get().setDataById(id, { [url]: { ...context }, timestamp: Date.now() });
                        successCB?.(context);
    
                    } else {
                        let context = { data: data, loading: false, message: message }
                        get().setDataById(id, { message, [url]: { ...context } });
                        errorCB?.(context)
                    }
                    return { status, data, message };
                },
                DELETE: async ({ url, id, successCB, errorCB }: ApiRequestOptions) => {
                    // Set loading state
                    get().setDataById(id, { [url]: { loading: true } });
                    // Make API call
                    const response = await apiClient.delete(url);
                    const { status, data, message } = processAPIResponse(response, id);
                    if (status) {
                        let context = { data: data, loading: false, success: true }
                        get().setDataById(id, { [url]: { ...context }, timestamp: Date.now() });
                        successCB?.(context);
    
                    } else {
                        let context = { data: data, loading: false, message: message }
                        get().setDataById(id, { message, [url]: { ...context } });
                        errorCB?.(context)
                    }
                    return { status, data, message };
                },
                snackBar: ({ severity, message, autoHideDuration }) => {
                    get().setDataById("snackBarInfo", {
                        open: true,
                        autoHideDuration: autoHideDuration || 2000,
                        severity: severity,
                        message: message,
                    })
                }
            }),
    
            {
                name: "global-state-storage", // Unique name for local storage key
                storage: createJSONStorage(() => customStorage),
                partialize: (state) => ({
                    compData: state.compData,
                    userInfo: state.userInfo,
                }),
            }
        ),
        {
            enabled: process.env.NODE_ENV === 'development',  // Only works in development
            name: 'Global Store'  // Optional: name that appears in Redux DevTools
        }
   )
);

export const { POST, GET, PUT, DELETE, setDataById, clearDataById, resetStore, snackBar, setNonPersistedDataById } = useStore.getState();
export default useStore;