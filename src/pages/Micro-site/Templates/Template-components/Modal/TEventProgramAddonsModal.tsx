import Box from '@mui/material/Box/Box'
import './style.scss'
import { Close } from '@mui/icons-material'
import { Avatar, IconButton, Tooltip } from '@mui/material'
import Modal from '@mui/material/Modal';
import useStore, { setNonPersistedDataById } from '@/Libs/store'
import { getLocalTimeDate } from '@/Utils/CommonBaseClass'
import { useEffect } from 'react';
import config from '../../../../../../config.json'
import Grid from '@mui/material/Grid2';
import { ModalToolTip } from '@/pages/events/template/_components';


/**
 * TEventProgramAddonsModal Component
 * 
 * This component renders a modal dialog that displays program addon details.
 * It shows information about program addons including speakers, moderators, and other details.
 * The modal can be opened/closed through the global store state.
 * 
 * @component
 * @returns {JSX.Element} Modal component containing program addon information
 */

const TEventProgramAddonsModal = () => {

    const isModal = useStore(state => state.nonPersistedData.isProgramAddonModelOpen?.value)

    const programDetails = useStore(state => state.nonPersistedData.programAddonData?.value)

    function handleCloseModal() {
        setNonPersistedDataById("isProgramAddonModelOpen", { value: false })
        setNonPersistedDataById('programAddonData', { value: null })
    }

    /**
     * to clear modal data on un mount
     */
    useEffect(() => {

        return () => setNonPersistedDataById('programAddonData', { value: null })

    }, [])


    /**
* Checks if the given `subItem` array contains at least one moderator.
*
* @param {any[]} subItem - The list of speakers to check.
* @returns {boolean} - Returns `true` if at least one speaker is a moderator, otherwise `false`.
*/

    const hasModerator = (subItem: any): boolean => {
        return subItem?.some((speaker: any) => speaker?.speakerBios?.[0]?.isModerator) ?? false;
    };


    return (

        <Modal
            open={isModal}
            className='relative'
        >
            <Box className="absolute inset-0 p-5 min-h-screen w-full flex justify-center items-center program-details-modal">

                <Box className="content h-[800px] flex-1">
                    <Grid className="p-3" container justifyContent={"flex-end"}>
                        <IconButton onClick={handleCloseModal} className="fixed top-4 right-4">
                            <Close />
                        </IconButton>
                    </Grid>
                    <Box className="content-header-container overflow-auto h-full pb-8">
                        {(programDetails && programDetails?.length > 0) ? (
                            <>
                                {programDetails?.map((data: any, index: number) => {
                                    return <Box className="bg-slate-100 p-3 gap-2 mb-5" key={data?.id + index}>
                                        <p className='content-header-container-header'>{data?.addonId ? data?.addon?.name : data?.name}</p>
                                        <Box className="content-date-container">
                                            <p> {`${getLocalTimeDate(data?.startTime, "MMMM DD YYYY h:mm A")} - ${getLocalTimeDate(data?.endTime, "h:mm A")}`}</p>
                                        </Box>
                                        <Box className="content-description-container">
                                            <p>{data?.description}</p>
                                        </Box>
                                        {data?.eventSponsors?.length > 0 ?
                                            <Box className="content-speaker-container">
                                                <p className='content-speaker-container-header'>Sponsors</p>
                                                <Box className="content-speaker-container-speaker-list">
                                                    {
                                                        data?.eventSponsors?.map((sponsor: any) => {
                                                            return (
                                                                <Box className="tooltip-avatar">
                                                                    <Tooltip
                                                                        placement='top' className='speaker-tooltip' arrow title={<ModalToolTip data={sponsor} type='SPONSOR'></ModalToolTip>}>
                                                                        <Avatar src={config.api.url + "asset/" + sponsor?.sponsor?.logoAssetId} key={sponsor.id} className='content-speaker-container-speaker-list-avatar' >
                                                                            {sponsor?.sponsor?.name?.[0]}
                                                                        </Avatar>
                                                                    </Tooltip>
                                                                </Box>
                                                            )
                                                        })
                                                    }

                                                </Box>
                                            </Box>
                                            :
                                            <></>
                                        }
                                        {data?.eventSpeakers?.length > 0 ?
                                            <Grid className="content-speaker-container">
                                                <Grid container size={12}>
                                                    {hasModerator(data?.eventSpeakers) &&
                                                        (
                                                            <><p className='content-speaker-container-header'>Moderator</p>
                                                                <pre className='content-speaker-container-header'> | </pre>
                                                            </>
                                                        )
                                                    }
                                                    <p className='content-speaker-container-header'>Speakers</p>
                                                </Grid>
                                                <Grid className="content-speaker-container-speaker-list" container size={12}>
                                                    {data?.eventSpeakers
                                                        ?.slice().sort((_a: any, b: any) => (b?.speakerBios?.[0]?.isModerator ? 1 : -1))
                                                        .map((speaker: any) => {
                                                            const isModerator = speaker?.speakerBios?.[0]?.isModerator;
                                                            return (
                                                                <Grid className="tooltip-avatar" container size={isModerator ? 1.5 : 1}>
                                                                    <Tooltip
                                                                        placement='top' className='speaker-tooltip' arrow title={<ModalToolTip data={speaker}></ModalToolTip>}>
                                                                        {!isModerator ? (
                                                                            <Avatar src={speaker?.user?.assetId ? config.api.url + "asset/" + speaker?.user?.assetId : ''} key={speaker.id} className='content-speaker-container-speaker-list-avatar' >
                                                                                {speaker?.user?.firstName[0]}
                                                                                {speaker?.user?.lastName[0]}

                                                                            </Avatar>
                                                                        ) : (

                                                                            <Avatar src={speaker?.user?.assetId ? config.api.url + "asset/" + speaker?.user?.assetId : ''} key={speaker.id} className='content-speaker-container-speaker-list-moderators' >
                                                                                {speaker?.user?.firstName[0]}
                                                                                {speaker?.user?.lastName[0]}
                                                                            </Avatar>

                                                                        )}




                                                                    </Tooltip>

                                                                </Grid>



                                                            )
                                                        })
                                                    }

                                                </Grid>
                                            </Grid>
                                            :
                                            <></>
                                        }
                                    </Box>;

                                })}
                            </>
                        ) : (
                            <p>No data available</p> 
                        )}

                    </Box>
                </Box>
            </Box>
        </Modal >
    )
}

export default TEventProgramAddonsModal
