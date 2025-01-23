import Box from '@mui/material/Box/Box'
import './style.scss'
import { Close } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import Modal from '@mui/material/Modal';
import useStore, {  setNonPersistedDataById } from '@/Libs/store'
import {  getLocalTimeDate } from '@/Utils/CommonBaseClass'
import moment from 'moment'

const ProgramDetailsModal = () => {

    const isModal = useStore(state => state.nonPersistedData.isProgramDetailsModelOpen?.value)

    const programDetails = useStore(state => state.nonPersistedData.programDetails?.value)

    function handleCloseModal() {
        setNonPersistedDataById("isProgramDetailsModelOpen", { value: false })
        setNonPersistedDataById('programDetails', { value: null })
    }

    console.log(programDetails)
   
    const isSameMonth = moment(programDetails?.startTime).format("M") === moment(programDetails?.startTime).format("M")

    const isSameDay = moment(programDetails?.startTime).format("D") === moment(programDetails?.startTime).format("D")

    console.log(isSameDay)

    
    function handleDate() {
        if (isSameMonth && isSameDay) {
            return `${getLocalTimeDate(programDetails?.startTime, "MMMM DD YYYY h:mm A")} - ${getLocalTimeDate(programDetails?.endTime, "h:mm A")}`
        } else if (isSameMonth && !isSameDay) {
            return `${getLocalTimeDate(programDetails?.startTime, "MMMM DD YYYY h:mm A")} - ${getLocalTimeDate(programDetails?.endTime, "MMMM DD YYYY h:mm A")}`
        }
    }
        
    return (
        <div>
            <Modal
                open={isModal}
            >
                <Box className="min-h-screen w-full flex justify-center items-center program-details-modal">
                    <Box className="content">
                        <Box className="content-header-container">
                            <p className='content-header-container-header'>{programDetails?.name || 'Unknown Program'}</p>
                            <IconButton onClick={handleCloseModal} className='content-header-container-close' >
                                <Close />
                            </IconButton>
                        </Box>
                        <Box className="content-date-container">
                            <p>
                               {handleDate()}
                            </p>
                        </Box>
                        <Box className="content-description-container">
                            <p>{programDetails?.description || 'Unknown Description'}</p>
                        </Box>
                        <Box className="content-speaker-container">
                            <p className='content-speaker-container-header'>Speakers</p>
                            <Box className="content-speaker-container-speaker-list">
                                <Avatar className='content-speaker-container-speaker-list-avatar' />
                                <Avatar className='content-speaker-container-speaker-list-avatar' />
                                <Avatar className='content-speaker-container-speaker-list-avatar' />
                                <Avatar className='content-speaker-container-speaker-list-avatar' />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default ProgramDetailsModal
