/**
 * Component handles the speaker event details page
 */
import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { CircularProgress, IconButton, Typography } from '@mui/material';
import UploadedIcon from "../../../assets/svg/uploaded-abstract.svg"
import RemoveIcon from "../../../assets/svg/file-remove.svg"
import useStore, { POST, PUT, setDataById} from '@/Libs/store';
import moment, { Moment } from 'moment';
import config from '../../../../config.json';
import { useNavigate, useParams } from 'react-router-dom';
import LeftArrowIcon from '@/assets/svg/left-arrow.svg';
import routes from "@/router/routes";
import { Logger } from '@/Utils/Logger';
import CustomButton from '@/components/CustomButton/CustomButton';
import { useIsMobileScreen } from '@/Utils/CommonBaseClass';
import UploadModal from './UploadModal';
import { SpeakerDashBoard, WarningIcon } from '@/assets/svg';
import CustomActionModal from '@/components/CustomActionModal/CustomActionModal';




const SpeakersEventDetails: React.FC<any> = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    const speakerData = useStore((state: any) => state?.compData?.["speakerDataList"]?.["eventSpeaker/list"]?.data) ?? [];

    const baseURL = config.api.url;

    const speakerUserId = useStore((state: any) => state?.compData?.['userDetails']?.id) ?? [];

    const loader = useStore((state: any) => state?.compData?.["speakerDataList"]?.["eventSpeaker/list"]?.loading) ?? [];
   
    const deleteModal = useStore(state => state?.compData?.['speakerStore']?.deleteModal) ?? false;

    const speakerId = useStore(state => state?.compData?.['speakerStore']?.speakerId) ?? [];

 

    /*
    * Handle UploadFile modal
    */
    const openmodal = () => {

        setDataById("speakerStore", {
            uploadModal: true
        });

    }


    /**
     * Handle delete modal
     */

    const deleteModalToggle = () => {

        setDataById("speakerStore", { deleteModal: !deleteModal });

    };

    /**
     * Useeffect hook handles the api call for getting speaker details
     */
    useEffect(() => {
        setDataById("speakerStore", {
            uploadModal: false
        });
        setDataById("speakerStore", {
            deleteModal: false
        });

        if (speakerUserId) {
            POST({
                url: `eventSpeaker/list`,
                id: "speakerDataList",
                body: {
                    filters: {

                        userId: speakerUserId,
                        parentEventId: id

                    }
                },
                errorCB: (error: any) => {
                    Logger.error("error in  eventSpeaker/list", error?.message)
                }
            })
        }

    }, [speakerUserId]);


    /**
     * Method handles the document download functionality
     * @param id : document id
     */
    const handleDownload = (id: number) => {
        const href = `${baseURL}asset/${id}`
        window.open(href, '_blank');
    };

    /**
     * Method handles the removal of the document 
     */
    const handleRemove = async (programId: string) => {
        try {
            setDataById("speakerStore", { deleteModal: !deleteModal });
            PUT({
                url: `eventSpeaker/speaker-bio/${programId}`,
                id: "savedpdf",
                body: {
                    fileId: '',
                },
                successCB: () => {

                    POST({
                        url: `eventSpeaker/list`,
                        id: "speakerDataList",
                        body: {
                            filters: {
                                userId: speakerUserId,
                                parentEventId: id
                            }
                        },
                        successCB: () => {
                            setDataById("snackBarInfo", {

                                open: true,
                                autoHideDuration: 2000,
                                severity: "success",
                                message: "Abstract Deleted Successfully",

                            });
                        },
                        errorCB: (error: any) => {
                            Logger.error("error in  eventSpeaker/list", error?.message)
                        }
                    })

                }
            })
        } catch (error: any) {
            Logger.error("Error in  handleRemove():", error?.message, error);
        }

    }

    /**
     * Get startTime and endTime 
     * @param startDate 
     * @param endDate 
     * @returns 
     */
    const formatDateRange = (startDate: Moment, endDate: Moment) => {
        const startMonth = moment(startDate).format("MMMM");
        const startDay = moment(startDate).format("D");
        const startYear = moment(startDate).format("YYYY");

        const endMonth = moment(endDate).format("MMMM");
        const endDay = moment(endDate).format("D");
        const endYear = moment(endDate).format("YYYY");
        if (startMonth === endMonth && startYear === endYear) {
            return startDay === endDay ? `${startMonth} ${startDay}` : `${startMonth} ${startDay}-${endDay}`;
        } else if (startYear === endYear) {
            return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
        } else {
            return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
        }
    }
    const isMobileScreen = useIsMobileScreen();


    return (
        <Grid className="speaker-home-container" container size={12} >
           
            <Grid container className="speaker-home" size={{ xs: 12, sm: 12 }} id={id}>


                <Grid size={12} container gap={2} >

                    <Grid container size={{ lg: 12, sm: 12 }} spacing={1} justifyContent={"flex-start"} alignItems={"center"}>

                    <Grid container alignItems="center" spacing={.3}>

                          {!isMobileScreen && (
                            <Grid > 
                                <IconButton
                                   onClick={() => navigate(routes.speakerHome())}
                                >
                                    <LeftArrowIcon />

                                </IconButton>
                            </Grid>
                        )}
                        <Grid>
                            <Typography className="speaker-home-left-section-title">Your Scheduled Sessions</Typography>
                        </Grid>
                        </Grid>
                        {
                            loader ? (

                                <Grid size={12} display={'flex'} justifyContent={'center'} alignItems={"center"} >

                                    <Loader />

                                </Grid>
                            )


                                : (speakerData.length > 0) ? (

                                    speakerData?.map((item: any, index: number) => {
                                        return (

                                            <Grid container key={index} size={{ xs: 12, sm: 12, lg: 12 }} className="speaker-home-left-section "   >

                                                <Grid size={{ lg: 12, md: 12, }} className="p-5" display={"flex"} flexDirection={"column"} gap={1} >

                                                    <Grid size={12} ><Typography className="speaker-home-left-section-value">{item?.event?.name}</Typography></Grid>

                                                    <Grid size={12}><Typography className="speaker-home-left-section-label">Description</Typography>

                                                        <Typography className="speaker-home-left-section-des">{item?.event?.description}</Typography></Grid>


                                                    <Grid size={{ xs: 12, sm: 12 }} className="speaker-home-left-section-upolodtime" container >

                                                        <Grid size={{ lg: 3, sm: 12 }} display={"flex"} flexDirection={"column"} className="speaker-home-left-section-upolodtime-box2" >

                                                            <Typography className="titles">Date</Typography>

                                                            <Typography className="content">

                                                                {
                                                                    formatDateRange(item?.event?.startTime, item?.event?.endTime)
                                                                }

                                                            </Typography>

                                                        </Grid>
                                                        <Grid size={{ lg: 3, sm: 12 }} display={"flex"} flexDirection={"column"} className="speaker-home-left-section-upolodtime-box" >

                                                            <Typography className="titles">Time</Typography>

                                                            <Typography className="content">

                                                                {`${moment(item?.event?.startTime).format("h:mm A")} - ${moment(item?.event?.endTime).format("h:mm A")}`}

                                                            </Typography>

                                                        </Grid>
                                                        {item?.event?.hall &&

                                                            <Grid size={{ lg: 3, sm: 12 }} display={"flex"} flexDirection={"column"} className="speaker-home-left-section-upolodtime-box3">

                                                                <Typography className="titles">Hall</Typography>

                                                                <Typography className="content">

                                                                    {item?.event?.hall}


                                                                </Typography>

                                                            </Grid>}


                                                    </Grid>
                                                    <Grid className="pt-2" container spacing={0} size={12} >



                                                        {
                                                            item?.speakerBios?.[0]?.fileId ? (
                                                                <Grid className="speaker-home-right-section-uploaded-container" direction={'column'} height={"max-content"} >


                                                                    <Grid className="speaker-home-right-section-uploaded-container-remove-icon"
                                                                        onClick={() => {
                                                                            setDataById("speakerStore", { speakerId: item?.speakerBios?.[0]?.id })

                                                                            deleteModalToggle()
                                                                        }}
                                                                    >

                                                                        <RemoveIcon />
                                                                    </Grid>

                                                                    <Grid container direction={'row'}>
                                                                        <UploadedIcon />
                                                                        <Typography className="speaker-home-right-section-uploaded-container-text">Presentation</Typography>
                                                                    </Grid>

                                                                    <Grid>
                                                                        <Typography className="speaker-home-right-section-uploaded-container-name" onClick={() => handleDownload(item?.speakerBios?.[0]?.fileId)}>Document.pdf</Typography>
                                                                    </Grid>




                                                                </Grid>
                                                            ) : (
                                                                <CustomButton
                                                                    className="speaker-home-upload-file"
                                                                    onClick={() => {
                                                                        setDataById('speakerBio', { item: item })
                                                                        openmodal();
                                                                    }}
                                                                    label=' Upload file'
                                                                />
                                                            )
                                                        }

                                                    </Grid>

                                                    <Grid container size={6} justifyContent={'center'} alignItems={"center"}>


                                                    </Grid>
                                                </Grid>



                                            </Grid>
                                        )
                                    })

                                ) : (

                                    <Grid container className="speaker-home-noData" size={12} height={"100vh"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>

                                        <SpeakerDashBoard />
                                        <Typography className='text'>You have no assigned programs at the moment. Stay tuned for upcoming opportunities!</Typography>


                                    </Grid>

                                )}

                    </Grid>

                </Grid>


            </Grid>

            <UploadModal />

            {/* Delete Confirmation Modal */}
            <CustomActionModal
                icon={<WarningIcon className="unpublish-modal-icon" />}
                header="Abstract Delete"
                subHeader="Are you sure you want to delete this abstract? This action cannot be undone."
                cancelLabel="Cancel"
                submitLabel="Delete"
                open={deleteModal}
                onClose={() => deleteModalToggle()}
                cancelAction={() => deleteModalToggle()}
                submitAction={() => {
                    handleRemove?.(speakerId);
                }}

            />



        </Grid>
    )
}

export default SpeakersEventDetails

/**
 * @returns Loader
 */
const Loader = () => {
    return (
        <CircularProgress color='success' size={"2rem"} />
    )
}

