/**
 * SpeakerDetailsModal
 * This component handles the speaker and the associated program details in the template
 */
import Box from '@mui/material/Box/Box'
import './style.scss'
import { Close } from '@mui/icons-material'
import { Avatar, IconButton, Typography } from '@mui/material'
import Modal from '@mui/material/Modal';
import useStore, { POST, setNonPersistedDataById } from '@/Libs/store'
import { useEffect } from 'react';
import config from '../../../../../config.json'
import Grid from '@mui/material/Grid2';
import LocalTimeDate from '@/components/LocalTimeDate/LocalTimeDate';
import ClockIcon from "../../../../assets/svg/speaker-clock.svg";
import AmountIcon from "../../../../assets/svg/speaker-amount.svg";



const SpeakerDetailsModal = () => {

    const isModal = useStore(state => state.nonPersistedData.isSpeakerDetailsModelOpen?.value)

    const speakerDetails = useStore(state => state.nonPersistedData.speakerDetails?.value)

    const speakerInfo = useStore((state: any) => state?.compData?.['templateSpeakerDetails']?.['eventSpeaker/list']?.data) ?? [];
    const baseUrl = config.api.url;
    const currency = config.currency;



    /**
     * Method handles the closing of the modal
     */
    function handleCloseModal() {
        setNonPersistedDataById("isSpeakerDetailsModelOpen", { value: false })
        setNonPersistedDataById('speakerDetails', { value: null })
    }

    
    /**
     * to clear modal data on un mount
     */
    useEffect(() => {

        return () => setNonPersistedDataById('speakerDetails', { value: null })

    }, [])

    
    /**
     * Useeffect hook handles the api call for getting speaker program details
     */
    useEffect(() => {
        if (speakerDetails?.id) {
            POST({
                url: "eventSpeaker/list",
                id: "templateSpeakerDetails",
                body: {
                    filters: {
                        userId: speakerDetails?.userId,
                        parentEventId: speakerDetails?.parentEventId
                    }
                }
            })
        }
    }, [speakerDetails])


    return (
        <div>
            <Modal
                open={isModal}
            >
                <Box className="min-h-screen w-full flex justify-center items-center speaker-details-modal">
                    <Box className="speaker-details-modal-content">
                        <Grid container justifyContent={'space-between'}>
                            <Grid>
                                <Grid justifyItems={'center'} className="speaker-details-modal-avatar">
                                    <Avatar
                                        alt={speakerInfo?.[0]?.user?.firstName}
                                        src={speakerInfo?.[0]?.user?.assetId
                                            ? `${baseUrl}asset/${speakerInfo?.[0]?.user?.assetId}`
                                            : ""}
                                    />
                                </Grid>
                            </Grid>
                            <Grid className="speaker-details-modal-header-container" container alignItems={'flex-end'} justifyContent={'flex-end'}>

                                <IconButton onClick={handleCloseModal} className='content-header-container-close' >
                                    <Close />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }} className="speaker-details-modal-main-container">
                            <Typography className="speaker-details-modal-title">Program Schedule</Typography>
                        </Grid>
                        {
                            speakerInfo?.map((item: any) => {
                                return <Grid size={{ xs: 12, sm: 12 }} container className="speaker-details-modal-item-container">
                                    <Grid size={{ xs: 1, sm: 1 }} className="speaker-details-modal-day-container">
                                        <Grid size={{ xs: 12, sm: 12 }}><LocalTimeDate className="speaker-details-modal-day" utcDateTime={item?.event?.startTime} format="ddd" timezone="auto" fallbackText="Not Available" />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12 }}><LocalTimeDate className="speaker-details-modal-date" utcDateTime={item?.event?.startTime} format="D" timezone="auto" fallbackText="Not Available" /></Grid>
                                    </Grid>
                                    <Grid size={{ xs: 3, sm: 3 }} container direction={'column'} className="speaker-details-modal-time-container">
                                        <Grid container direction={'row'} className="speaker-details-modal-icon"><ClockIcon /><LocalTimeDate className="speaker-details-modal-time" utcDateTime={item?.event?.startTime} format="h:mm A" timezone="auto" fallbackText="Not Available" /> - <LocalTimeDate className="speaker-details-modal-time" utcDateTime={item?.event?.endTime} format="h:mm A" timezone="auto" fallbackText="Not Available" /></Grid>
                                        <Grid container direction={'row'} className="speaker-details-modal-icon">{item?.event?.amount ? <><AmountIcon /><Typography className="speaker-details-modal-time">{`${currency}${item?.event?.amount}`}</Typography></> : ''}</Grid>
                                    </Grid>
                                    <Grid size={{ xs: 8, sm: 8 }}>
                                        <Grid container direction={'column'}>
                                            <Grid><Typography className="speaker-details-modal-sub-title">{item?.event?.name}</Typography></Grid>
                                            <Grid><Typography className="speaker-details-modal-text">{item?.event?.description}</Typography></Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            })
                        }


                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default SpeakerDetailsModal
