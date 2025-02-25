import useStore, { setNonPersistedDataById } from '@/Libs/store'
import { IEventResponse, IEventSpeaker, IProgram } from '@/Libs/types/event'
import { ElementType } from 'react';
import config from '../../../../../../config.json';
import { Avatar, Box, Modal } from '@mui/material';
import { personPlaceholder } from '@/assets/png';

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import "./TEventspeakers.scss";
import ClockIcon from "../../../../../assets/svg/speaker-clock.svg";
import AmountIcon from "../../../../../assets/svg/speaker-amount.svg"
import { getLocalTimeDate } from '@/Utils/CommonBaseClass';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
interface TEventSpeakersProps {
    ItemWrapper?: ElementType;
    usageType?: "DEFAULT" | "CUSTOM",
    children?: (props: { data: IEventSpeaker[], handleModalOpen: (speaker: IEventSpeaker) => void }) => React.ReactNode;

}
const TEventSpeakers = ({ ItemWrapper = 'div', usageType, children }: TEventSpeakersProps) => {

    const event: IEventResponse = useStore(state => state.compData?.['event']?.data) || {}



    // const speakerDetails = useStore(state => state.nonPersistedData.speakerDetails?.value) || {}

    /**
* Extracts unique speakers from a given list based on their `userId`.
* 
* @param {any[]} speakers - An array of speaker objects. Each object is expected to have a `userId` property.
* @returns {any[]} An array of unique speaker objects, ensuring no duplicate `userId`s.
* 
* This function uses a Map to track speakers by their `userId`. 
* It ensures that only one speaker per `userId` is included in the returned array.
*/
    function getUniqueSpeakers(speakers: any) {
        const uniqueSpeakersMap = new Map<number, any>();

        speakers.forEach((speaker: any) => {
            if (!uniqueSpeakersMap.has(speaker.userId)) {
                uniqueSpeakersMap.set(speaker.userId, speaker);
            }
        });

        return Array.from(uniqueSpeakersMap.values());
    }



    const groupedObj: { [key: number]: IProgram[] } = {}


    event?.programs?.forEach((program: IProgram) => {

        if (program?.eventSpeakers) {
            program?.eventSpeakers?.forEach((speaker: IEventSpeaker) => {

                if (!groupedObj[speaker.userId]) {
                    groupedObj[speaker.userId] = [program]
                } else {
                    groupedObj[speaker.userId].push(program)
                }
            })
        }

    })


    function handleModalOpen(speaker: IEventSpeaker) {
        setNonPersistedDataById('isSpeakerDetailsModelOpen', { value: true })
        setNonPersistedDataById('speakerDetails', { value: { speaker, programs: groupedObj[speaker.userId] } })
    }



    if (usageType === "CUSTOM") {
        const speakers = getUniqueSpeakers(event?.eventSpeakers);
        if (!children) return <></>
        return children({ data: speakers, handleModalOpen });
    }




    return (
        <>
            {event?.eventSpeakers?.length > 0 ?
                <>
                    {
                        getUniqueSpeakers(event?.eventSpeakers)?.map((speaker: IEventSpeaker, index: number) => {
                            return (
                                <ItemWrapper key={index}>
                                    <Box className="speaker-image-wrapper w-full bg-black">
                                        {speaker?.user?.assetId ? <img className='speaker-img ' src={speaker?.user?.assetId ? `${config.api.url}asset/${speaker?.user?.assetId}` : ""} alt='program speaker image' />
                                            :
                                            <img alt={'speaker-image'} src={personPlaceholder} className={`  aspect-square max-h-[18.2rem]`} />

                                        }
                                    </Box>
                                    <Box className='speaker-section-details mt-10'>
                                        <p className='speaker-name'>{speaker?.user?.firstName} {speaker?.user?.lastName}</p>
                                        <p className='speaker-designation'>{speaker?.user?.designation}</p>
                                    </Box>
                                    <Box onClick={() => handleModalOpen(speaker)} className={'speaker-section-viewmore'}>View more <ArrowRightAltIcon className='speaker-section-viewmore-icon' /></Box>
                                </ItemWrapper>
                            )
                        })
                    }
                    <TEventSpeakerModal />

                </>
                :
                <></>
            }
        </>
    )
}

export default TEventSpeakers


export const TEventSpeakerModal = () => {

    function handleCloseModal() {
        setNonPersistedDataById('isSpeakerDetailsModelOpen', { value: false })
    }

    const isSpeakerModalOpen = useStore(state => state.nonPersistedData?.isSpeakerDetailsModelOpen?.value)

    const speakerDetails: { speaker: IEventSpeaker, programs: IProgram[] } = useStore(state => state.nonPersistedData?.speakerDetails?.value) || {}


    return (
        <Modal className='TEventSpeakers-speaker-details-modal' open={isSpeakerModalOpen}>
            <Box onClick={handleCloseModal} className="TEventSpeakers-speaker-details-modal__overlay">
                <Box className="TEventSpeakers-speaker-details-modal__content">

                    <Box className="TEventSpeakers-speaker-details-modal__content__details">
                        <CloseRoundedIcon onClick={handleCloseModal} className='icon' />

                        <Avatar className='TEventSpeakers-speaker-details-modal__content__details__img'></Avatar>
                        <Box className="TEventSpeakers-speaker-details-modal__content__details__info">
                            <h3 className='TEventSpeakers-speaker-details-modal__content__details__info__name'>{speakerDetails?.speaker?.user?.firstName || 'Unknown'}</h3>
                            <p className='TEventSpeakers-speaker-details-modal__content__details__info__designation'>{speakerDetails?.speaker?.user?.designation || 'Unknown'}</p>
                            <p className='TEventSpeakers-speaker-details-modal__content__details__info__description'>{speakerDetails?.speaker?.user?.userDescription || 'Unknown'}</p>
                        </Box>
                    </Box>

                    <Box className="TEventSpeakers-speaker-details-modal__content__program">
                        <p className='TEventSpeakers-speaker-details-modal__content__program__title'>Program Schedule</p>
                        <Box className="TEventSpeakers-speaker-details-modal__content__programs__list">

                            {
                                speakerDetails?.programs?.map((item: IProgram, index: number) => {
                                    return (
                                        <>
                                            <ProgramCard data={item} className='event-speakers-program-card' />
                                            {index !== speakerDetails?.programs?.length - 1 && <HorizonatalDivider className='horizontal-divider ' />}
                                        </>
                                    )
                                })
                            }


                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal >
    )
}



const ProgramCard = ({ className, data }: { className: string, data: IProgram }) => {

    return (
        <Box className={className}>
            <Box className="event-speakers-program-card__date-container" display={"flex"} flexDirection={"column"} alignItems={"center"} paddingRight={2}>
                <p className="event-speakers-program-card__date-container__day">{getLocalTimeDate(data.startTime, 'ddd')}</p>
                <p className="event-speakers-program-card__date-container__month">
                    {getLocalTimeDate(data.startTime, 'D')}
                </p>
            </Box>
            <Box className="event-speakers-program-card__vertical-divider">

            </Box>

            <Box className=" event-speakers-program-card__date-price">
                <Box className=" event-speakers-program-card__date-price__time">
                    <ClockIcon className='event-speakers-program-card__date-price__time__icon' />
                    <p className='event-speakers-program-card__date-price__time__value'>
                        {getLocalTimeDate(data.startTime, 'h:mm A')}
                    </p>
                </Box>
                <Box className=" event-speakers-program-card__date-price__price">
                    <AmountIcon className='event-speakers-program-card__date-price__price__icon' />
                    <p className='event-speakers-program-card__date-price__price__value'>{Math.trunc(Number(data?.amount)) === 0 ? "Free" : `${Number(data?.amount).toFixed(0)}`}</p>
                </Box>
            </Box>
            <Box className="event-speakers-program-card__vertical-divider">

            </Box>

            <Box className="event-speakers-program-card__name-container ">
                <p className="event-speakers-program-card__name-container__name ">{data?.name}</p>
                <p className="event-speakers-program-card__name-container__description ">{data?.description}</p>
            </Box>

        </Box>
    )
}



const HorizonatalDivider = ({ className }: { className: string }) => {
    return (
        <Box className={className}>

        </Box>
    )
}