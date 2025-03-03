import useStore from '@/Libs/store';

const useValidateEventData = () => {
    const eventData = useStore(state => state.compData?.event?.data) ?? null;

    const isSpeakers = Boolean(Array.isArray(eventData?.eventSpeakers) && eventData.eventSpeakers.length);
    const isSponsors = Boolean(Array.isArray(eventData?.eventSponsors) && eventData.eventSponsors.length);
    const isLocation = Boolean((eventData?.eventClass === "OFFLINE" || eventData?.eventClass === "HYBRID") && eventData?.venue?.mapUrl
    );
    const isEventPriceTiers = Boolean(Array.isArray(eventData?.eventPriceTiers) && eventData.eventPriceTiers.length);


    return { isEventPriceTiers, isSpeakers, isSponsors, isLocation };
};

export default useValidateEventData;
