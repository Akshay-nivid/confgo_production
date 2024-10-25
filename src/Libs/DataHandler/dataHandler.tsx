import { useEffect } from 'react';
import useStore from "../store";

interface Props {
    id: string;
    source?: ISourceProps;
    [key: string]: any;
}

type ISourceProps = {
    url: string;
    method: string;
    data?: any;
    [key: string]: any;
}

export function registerComponent(props: Props) {
    const state = useStore((state: any) => state.compData?.[props?.id]);
    const POST = useStore((state: any) => state.POST);
    const setDataById = useStore((state: any) => state.setDataById);

    /**
     * Initialize component state if it doesn't exist
     */
    useEffect(() => {
        if (!state) {
            setDataById(props.id, { props,  timestamp: Date.now() });
        }
    }, [props.id, setDataById, state]);

     /**
     * Check if stored data is expired
     * @param timestamp 
     * @param expiry 
     */
     const isDataExpired = (timestamp: number, expiry: number): boolean => {
        const now = Date.now();
        const expiryTime = timestamp + (expiry * 60 * 1000);
        return now > expiryTime;
    };

    /**
     * Method to load API
     * @param source 
     */
    const loadApi = async (source: ISourceProps) => {
         // Check if we should use persisted data
        if (source.expiry) {
            const storedData = state?.context;
            if (storedData && !isDataExpired(state.timestamp, source.expiry)) {
                // Use stored data if it's not expired
                setDataById(props.id, {
                    props,
                    context: storedData
                });
                return;
            }
        }

        switch (source.method) {
            case "POST":
                await POST({url: source?.url, body : source?.data, id: props?.id});
                break;
            case "PUT":
                // apiResponse = yield putAPI(source.url, source.data, source.header);
                break;
            case "GET":
            default:
                // apiResponse = yield getAPI(source.url, source.header, source);
                break;
        }
    };

    /**
     * Handle API calls using useEffect
     */
    useEffect(() => {
        if (props?.source) {
            loadApi(props.source);
        }
    }, [props.source?.url, props.source?.method, JSON.stringify(props.source?.data)]);

    return { props: props, context: state?.context };
};