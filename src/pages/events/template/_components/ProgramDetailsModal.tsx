import Box from '@mui/material/Box/Box'
import './style.scss'
import { Close } from '@mui/icons-material'
import { Avatar, IconButton, Tooltip } from '@mui/material'
import Modal from '@mui/material/Modal';
import useStore, { setNonPersistedDataById } from '@/Libs/store'
import { getLocalTimeDate } from '@/Utils/CommonBaseClass'
import moment from 'moment'
import { useEffect } from 'react';
import config from '../../../../../config.json'
import ModalToolTip from './ModalToolTip';
import Grid from '@mui/material/Grid2';



const ProgramDetailsModal = () => {

    const isModal = useStore(state => state.nonPersistedData.isProgramDetailsModelOpen?.value)

    const programDetails = useStore(state => state.nonPersistedData.programDetails?.value)

    function handleCloseModal() {
        setNonPersistedDataById("isProgramDetailsModelOpen", { value: false })
        setNonPersistedDataById('programDetails', { value: null })
    }

    const isSameMonth = moment(programDetails?.startTime).format("M") === moment(programDetails?.startTime).format("M")

    const isSameDay = moment(programDetails?.startTime).format("D") === moment(programDetails?.startTime).format("D")

    /**
     * to clear modal data on un mount
     */
    useEffect(() => {

        return () => setNonPersistedDataById('programDetails', { value: null })

    }, [])

    function handleDate() {


        if (isSameMonth && isSameDay) {
            return `${getLocalTimeDate(programDetails?.startTime, "MMMM DD YYYY h:mm A")} - ${getLocalTimeDate(programDetails?.endTime, "h:mm A")}`

        } else if (isSameMonth && !isSameDay) {

            return `${getLocalTimeDate(programDetails?.startTime, "MMMM DD YYYY h:mm A")} - ${getLocalTimeDate(programDetails?.endTime, "MMMM DD YYYY h:mm A")}`
        }
    }



    const isAddOn = programDetails?.addonId;


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
        <div>
            <Modal
                open={isModal}
            >
                <Box className="min-h-screen w-full flex justify-center items-center program-details-modal">
                    <Box className="content">
                        <Box className="content-header-container">
                            <p className='content-header-container-header'>{isAddOn? programDetails?.addon?.name: programDetails?.name}</p>
                            <IconButton onClick={handleCloseModal} className='content-header-container-close' >
                                <Close />
                            </IconButton>
                        </Box>
                        {(isAddOn && !programDetails?.startTime) ?null :<Box className="content-date-container">
                            <p>
                                {handleDate()}
                            </p>
                        </Box>}
                        <Box className="content-description-container">
                            <p>{programDetails?.description}</p>
                        </Box>
                        {programDetails?.eventSponsors?.length > 0 ?
                            <Box className="content-speaker-container">
                                <p className='content-speaker-container-header'>Sponsors</p>
                                <Box className="content-speaker-container-speaker-list">
                                    {
                                        programDetails?.eventSponsors?.map((sponsor: any) => {
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
                        <Grid size={{ xs:12, sm:12 }}>&nbsp;</Grid> 
                        {programDetails?.eventSpeakers?.length > 0 ?
                            <Grid className="content-speaker-container">
                                <Grid container size={12}>
                                {hasModerator(programDetails?.eventSpeakers) &&
                                    (
                                        <><p className='content-speaker-container-header'>Moderator</p>
                                            <pre className='content-speaker-container-header'> | </pre>
                                        </>
                                    )
                                }
                                <p className='content-speaker-container-header'>Speakers</p>
                                </Grid>
                                <Grid className="content-speaker-container-speaker-list" container size={12}>
                                    {programDetails?.eventSpeakers
                                        ?.sort((_a: any, b: any) => (b?.speakerBios?.[0]?.isModerator ? 1 : -1)) 
                                        .map((speaker: any) => {
                                             const isModerator = speaker?.speakerBios?.[0]?.isModerator;
                                            return (
                                                <Grid className="tooltip-avatar" container size={isModerator?1.5:1}>
                                                    <Tooltip
                                                        placement='top' className='speaker-tooltip' arrow title={<ModalToolTip data={speaker}></ModalToolTip>}>
                                                        {!isModerator?(
                                                             <Avatar src={config.api.url + "asset/" + speaker?.user?.assetId} key={speaker.id} className='content-speaker-container-speaker-list-avatar' >
                                                            {speaker?.user?.firstName[0]}
                                                            {speaker?.user?.lastName[0]}
                                                        </Avatar>
                                                        ):(
                                                            
                                                            <Avatar src={config.api.url + "asset/" + speaker?.user?.assetId} key={speaker.id} className='content-speaker-container-speaker-list-moderators' >
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
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default ProgramDetailsModal
