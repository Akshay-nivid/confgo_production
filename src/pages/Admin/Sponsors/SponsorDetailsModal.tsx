import useStore, { setNonPersistedDataById } from '@/Libs/store'
import { Box, IconButton, Modal, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

/**
 * SponsorDetailsModal
 * This component renders a modal with the details of the sponsor
 * The modal is open when the user clicks on the sponsor in the sponsors list
 * @function
 * @returns {JSX.Element} The rendered JSX content for the sponsor modal
 */
const SponsorDetailsModal = () => {

    const isModalOpen = useStore(state => state.nonPersistedData.isAdminSponsorDetailsModalOpen.value)

    const sponsorDetails = useStore(state => state?.nonPersistedData?.sponsorAdminDetails?.value)




    function handleCloseModal() {
        setNonPersistedDataById('isAdminSponsorDetailsModalOpen', { value: false })
    }

    return (
        <Modal open={isModalOpen} className='sponsor__details__modal'>


            <Box className='sponsor__details__modal__content'>

                <Box className='sponsor__details__modal__content__body'>
                    <IconButton onClick={handleCloseModal} className='sponsor__details__modal__content__body__close__btn'>
                        <CloseIcon />
                    </IconButton>
                    <Typography className='sponsor__details__modal__content__body__header'>
                        Sponsor Details
                    </Typography>
                    <Box className='sponsor__details__modal__content__body__details'>
                        <Typography className='sponsor__details__modal__content__body__details__name'>
                            Name :
                            <span className='sponsor__details__modal__content__body__details__name__value'>{sponsorDetails?.name }</span>
                        </Typography>

                        <Typography className='sponsor__details__modal__content__body__details__name'>
                            Email :
                            <span className='sponsor__details__modal__content__body__details__name__value'>{sponsorDetails?.email}</span>
                        </Typography>

                        <Typography className='sponsor__details__modal__content__body__details__name'>
                            Phone Number :
                            <span className='sponsor__details__modal__content__body__details__name__value'>{ sponsorDetails?.phone}</span>
                        </Typography>

                       {sponsorDetails?.website && <Typography className='sponsor__details__modal__content__body__details__name'>
                            Website :   
                            <a href={sponsorDetails?.website} target='_blank' className='sponsor__details__modal__content__body__details__name__value'>{sponsorDetails?.website }</a>
                        </Typography>}

                       {sponsorDetails?.logoId && <Box>
                            <Typography className='sponsor__details__modal__content__body__details__logo__label'>
                                Logo
                            </Typography>
                            <Box className="sponsor__details__modal__content__body__details__logo">
                                <img src={sponsorDetails?.logoUrl || ''} alt='sponsor logo' />
                            </Box>
                        </Box>}

                        {sponsorDetails?.bannerId && <Box>
                            <Typography className='sponsor__details__modal__content__body__details__banner__label'>
                                Banner
                            </Typography>
                            <Box className="sponsor__details__modal__content__body__details__banner">
                                <img src={sponsorDetails?.bannerUrl || ''} alt='sponsor logo' />
                            </Box>
                        </Box>}
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}

export default SponsorDetailsModal