import { Avatar, Box, Chip, IconButton, Modal, Typography } from "@mui/material"
import useStore, { setNonPersistedDataById } from "@/Libs/store"
import CloseIcon from '@mui/icons-material/Close';
import { getLocalTimeDate } from "@/Utils/CommonBaseClass";
import config from '../../../../config.json';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import Grid from '@mui/material/Grid2';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
const ProgramDetailsModal = ({ className }: { className: string }) => {

    const isModalOpen = useStore(state => state.nonPersistedData.isProgramDetailsModelOpen?.value)

    const programDetails = useStore(state => state.nonPersistedData.programDetails?.value)
    /**
     * Method handles the closing of the program details modal
     * by setting the isProgramDetailsModelOpen state to false
     */
    function handleCloseModal() {
        setNonPersistedDataById("isProgramDetailsModelOpen", { value: false })
        setNonPersistedDataById('programDetails', { value: null })
    }

    return (
        <Modal open={isModalOpen} className={className}>
            <Box className="content-wrapper ">
                <Box className="content ">

                    <Box className="modal-header">
                        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} className="mb-3">
                            <Chip label={programDetails?.eventClass} className="modal-header-chip"></Chip>
                            <IconButton className="modal-close" onClick={handleCloseModal}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Typography className="modal-header-name">{programDetails?.name || "NA"}</Typography>
                        <Typography className="modal-header-description">{programDetails?.description || "NA"}</Typography>

                    </Box>
                    <Grid columnSpacing={6} rowGap={3} container className="modal-content-wrapper">


                        <Grid size={{ xs: 12, md: 6 }} className="modal-group">
                            <Box display={'flex'} columnGap={.4} alignItems={"center"}>
                                <CalendarMonthOutlinedIcon className="icon" />
                                <Typography className="label">Date</Typography>
                            </Box>
                            <Typography className="value">{getLocalTimeDate(programDetails?.startTime, "MMMM DD YYYY")} - {getLocalTimeDate(programDetails?.endTime, "MMMM DD YYYY")}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} className="modal-group">
                            <Box display={'flex'} columnGap={.4} alignItems={"center"}>
                                <TimerOutlinedIcon className="icon" />
                                <Typography className="label">Time</Typography>
                            </Box>
                            <Typography className="value">{getLocalTimeDate(programDetails?.startTime, "h:mm A")} - {getLocalTimeDate(programDetails?.endTime, "h:mm A")}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} className="modal-group">
                            <Box display={'flex'} columnGap={.4} alignItems={"center"}>
                                <LanguageIcon className="icon" />
                                <Typography className="label">Event Type</Typography>
                            </Box>
                            <Typography className="value">{programDetails?.eventClass}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} className="modal-group">
                            <Box display={'flex'} columnGap={.4} alignItems={"center"}>
                                <LocalOfferOutlinedIcon className="icon" />
                                <Typography className="label">Price</Typography>
                            </Box>
                            <Typography className="value">{Math.trunc(Number(programDetails?.amount)) === 0 ? "Free" : programDetails?.amount}</Typography>
                        </Grid>

                        <Box className="modal-divider"></Box>

                        <Box className="modal-group">
                            <Box display={'flex'} columnGap={.4} alignItems={"center"}>
                                <PeopleOutlineOutlinedIcon className="icon" />
                                <Typography className="label">Speakers</Typography>
                            </Box>

                            <Box className="speakers">

                                {
                                    programDetails?.eventSpeakers?.length > 0 ? programDetails?.eventSpeakers?.map((speaker: any) => (
                                        <Avatar key={speaker?.user?.id} className="speakers-avatar" src={speaker?.user?.assetId ? config.api.url + "asset/" + speaker?.user?.assetId : ''}>{speaker?.user?.name?.[0]}</Avatar>
                                    )) : <Typography>No Speakers Found</Typography>
                                }
                            </Box>

                        </Box>
                        

                    </Grid>


                </Box>
            </Box>
        </Modal>
    )
}

export default ProgramDetailsModal