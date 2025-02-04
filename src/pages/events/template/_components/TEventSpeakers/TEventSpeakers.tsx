import useStore from '@/Libs/store'
import { IEventResponse, IEventSpeaker } from '@/Libs/types/event'
import { ElementType } from 'react';
import config from '../../../../../../config.json';
import { Box } from '@mui/material';
import { personPlaceholder } from '@/assets/png';
import Grid from '@mui/material/Grid2';
import { Arrow2Left } from '@/assets/svg';
import { ArrowRight } from '@mui/icons-material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

interface TEventSpeakersProps {
    ItemWrapper: ElementType;
    className?: string
}
const TEventSpeakers = ({  className, ItemWrapper }: TEventSpeakersProps) => {

    const event: IEventResponse = useStore(state => state.compData?.['event']?.data) || {}

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


    return (
        <>
            {event?.eventSpeakers?.length > 0 ?
                <>
                    {
                        getUniqueSpeakers(event?.eventSpeakers)?.map((speaker: Omit<IEventSpeaker, "speakerBios">, index: number) => {
                            return (
                                <ItemWrapper key={index}>
                                    {speaker?.user?.assetId ? <img className='speaker-image object-contain' src={speaker?.user?.assetId ? `${config.api.url}asset/${speaker?.user?.assetId}` : ''} alt='program speaker image' />
                                        :
                                        <img alt={'speaker-image'} src={personPlaceholder} className={`  aspect-square max-h-[18.2rem]`} />

                                    }
                                    <Box className='speaker-section-details'>
                                        <p className='speaker-section-details-name'>{speaker?.user?.firstName} {speaker?.user?.lastName}</p>
                                        <p className='speaker-section-details-designation'>{speaker?.user?.designation}</p>
                                    </Box>
                                    <Box className={'speaker-section-viewmore'}>View more <ArrowRightAltIcon className='speaker-section-viewmore-icon'/></Box>
                                </ItemWrapper>
                            )
                        })
                    }

                </>
                :
                <></>
            }
        </>
    )
}

export default TEventSpeakers