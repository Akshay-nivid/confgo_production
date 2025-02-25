export const initialNonPersistedData = {

    checkUserPaymentinitialFetchDone: { value: false },

    isProgramDetailsModelOpen: { value: false },
    
    programDetails: { value: null },

    isSpeakerDetailsModelOpen: { value: false },

    speakerDetails: { value: null },

    createSponsorModalOpen: { value: false },

    isAdminSponsorDetailsModalOpen: { value: false },

    sponsorDrawerType: { value: null },

    sponsorId: { value: null },

    cart: {
        programIds: [],
        addons: [],
    }
    ,
    sponsorAdminDetails: {
        value: {
            name: null,
            email: null,
            phone: null,
            website: null,
            logoUrl: null,
            bannerUrl: null,
            bannerId: null,
            logoId: null,
            createdOn: null,
            modifiedOn: null
        }
    }
}