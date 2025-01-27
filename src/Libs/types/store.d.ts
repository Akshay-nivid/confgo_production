
/**
* Define types for the state
*/
export interface CompData {
    [key: string]: any;
    adminCompanyId?:{companyId:number};
    couponData?: { ["coupon/applyCoupon"]: IParticipantCoupon };
    order?: { order: IParticipantOrder };
    previousRoute?: { url: string };
    finalPrice?: { value: null | string | undefined };
    addToCart?: { cart: ICartResponse | null };
    getCart?: { [cartKey: string]: ICartData | null };
    slugName?: { value: string };
    eventSelected?: { id: number | null };
    templateId?: { id: number | null };
    checkout?: { checkout: { data: any, loading: boolean, success: boolean } };
    userEvents?: { ["participant/registered/events"]: IUserEvents }
}


export interface NonPersistedData {
    [key: string]: any;
    checkUserPaymentinitialFetchDone: { value: boolean };
    isProgramDetailsModelOpen: { value: boolean },
    programDetails: { value: any }
    isSpeakerDetailsModelOpen: { value: boolean },
    speakerDetails: { value: any }
    createSponsorModalOpen: { value: boolean },
    isAdminSponsorDetailsModalOpen: { value: boolean },
    sponsorDrawerType: { value: 'create' | 'edit' | null }
    sponsorAdminDetails: {
        value: {
            name: string | null,
            email: string | null,
            phone: string | null,
            website: string | null,
            logoUrl: string | null,
            bannerUrl: string | null,
            bannerId: number | null,
            logoId: number | null,
    }}
}

export type ApiRequestOptions = {
    url: string;
    body?: any;
    id: string;
    successCB?: (context: any) => void;
    errorCB?: (context: any) => void;
};
