

import { Box, IconButton, Modal, Typography } from "@mui/material"
import useStore, { setNonPersistedDataById } from "@/Libs/store"
import CloseIcon from '@mui/icons-material/Close';
import { getLocalTimeDate } from "@/Utils/CommonBaseClass";

import LanguageIcon from '@mui/icons-material/Language';
import Grid from '@mui/material/Grid2';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';


/**
 * Component displays the sponsor details modal of the template
 * The modal displays the details of the sponsor 
 * The details include the sponsor's name, email, phone number, website, 
 * created and modified date, logo and banner
 */

const SponsorDetailsModal = ({ className }: { className?: string }) => {

    const isModalOpen = useStore(state => state.nonPersistedData.isAdminSponsorDetailsModalOpen.value)

    const sponsorDetails = useStore(state => state?.nonPersistedData?.sponsorAdminDetails?.value)
    /**
     * Method handles the closing of the program details modal
     * by setting the isProgramDetailsModelOpen state to false
     */
    function handleCloseModal() {
        setNonPersistedDataById("isAdminSponsorDetailsModalOpen", { value: false })
        setNonPersistedDataById('sponsorAdminDetails', { value: null })
    }


    return (
        <Modal open={isModalOpen} className={className}>
            <Box className="content-wrapper ">
                <Box className="content ">

                    <Box className="modal-header">
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} className="mb-2">
                            <Typography className="modal-header-name">{sponsorDetails?.name || "NA"}</Typography>

                            <IconButton className="modal-close" onClick={handleCloseModal}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <a href={sponsorDetails?.website || ''}>
                            <Typography className="modal-header-description">{sponsorDetails?.website || " "}</Typography>
                        </a>

                    </Box>
                    <Grid columnSpacing={6} rowGap={3} container className="modal-content-wrapper">


                        <Grid size={{ xs: 12, md: 6 }} className="modal-group">
                            <Box display={'flex'} columnGap={.4} alignItems={"center"}>
                                <EmailOutlinedIcon className="icon" />
                                <Typography className="label">Email</Typography>
                            </Box>
                            <Typography className="value">{sponsorDetails?.email || " "}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} className="modal-group">
                            <Box display={'flex'} columnGap={.4} alignItems={"center"}>
                                <LocalPhoneOutlinedIcon className="icon" />
                                <Typography className="label">Phone Number</Typography>
                            </Box>
                            <Typography className="value">{sponsorDetails?.phone || "NA"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} className="modal-group">
                            <Box display={'flex'} columnGap={.4} alignItems={"center"}>
                                <LanguageIcon className="icon" />
                                <Typography className="label">WebSite</Typography>
                            </Box>
                            <a href="{sponsorDetails?.website}">
                                <Typography className="value">{sponsorDetails?.website || " "}</Typography>
                            </a>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} className="modal-group">
                            <Box display={'flex'} columnGap={.4} alignItems={"center"}>
                                <DateRangeOutlinedIcon className="icon" />
                                <Typography className="label">Created On</Typography>
                            </Box>
                            <Typography className="value">{getLocalTimeDate(sponsorDetails?.createdOn, "MM-DD-YY HH:mm A") || "NA"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} className="modal-group">
                            <Box display={'flex'} columnGap={.4} alignItems={"center"}>
                                <DateRangeOutlinedIcon className="icon" />
                                <Typography className="label">Modified On</Typography>
                            </Box>
                            <Typography className="value">{getLocalTimeDate(sponsorDetails?.modifiedOn, "MM-DD-YY HH:mm A") || "NA"}</Typography>
                        </Grid>

                        <Box className="modal-divider"></Box>
                    {sponsorDetails?.logoUrl && (
                        <Grid size={{ xs: 12, md: 5 }} className="modal-group">
                            <Box display={'flex'} columnGap={.4} alignItems={"center"}>
                                <ImageOutlinedIcon className="icon" />
                                <Typography className="label">Sponsor Logo</Typography>
                            </Box>
                            <Box className="max-w-[100px] mt-4">
                                <img className="h-full w-full rounded-sm" src={sponsorDetails?.logoUrl ? sponsorDetails?.logoUrl : ''} alt='sponsor logo' />
                            </Box>
                        </Grid>
                        )}
                        {sponsorDetails?.bannerUrl && sponsorDetails.bannerUrl !== "https://api.confgo.com/api//asset/null" && (
                        <Grid size={{ xs: 12, md: 7 }} className="modal-group">
                            <Box display={'flex'} columnGap={.4} alignItems={"center"}>
                                <ImageOutlinedIcon className="icon" />
                                <Typography className="label">Sponsor Banner</Typography>
                            </Box>
                            <Box className="mt-4">
                                <img className="h-full w-full rounded-sm" src={sponsorDetails?.bannerUrl ? sponsorDetails?.bannerUrl : ''} alt='sponsor logo' />
                            </Box>
                        </Grid>
                            )} 
                    </Grid>

                </Box>
            </Box>
        </Modal>
    )
}

export default SponsorDetailsModal