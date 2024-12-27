import { BookIcon, CloseCircle } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import FileUpload from "@/components/FileUpload/FileUpload";
import StatusComponent from "@/components/Status/StatusComponent";
import useStore, { POST, setDataById } from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import { Avatar, Rating, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
interface CustomFile {
    id: number;
    name: string;
}
/**
 * componet used to upload the abstract file
 */
const UserUploadAbstract = ({ eventData }: any) => {
/**
 * useEffect to get uploaded userAbstract data
 */
    useEffect(() => {
        getUploadedAbstract();
    }, [])
    const [uploadFiles, setUploadFiles] = useState<any>();
    const uploadedAbstractData = useStore((state: any) => state?.compData?.["userUploadedAbstract"]?.["userAbstract/list"]?.data) ?? []
    const uploadedAssetFile = useStore((state: any) => state?.compData?.['assetUpload']?.asset?.data) ?? []
   /**
   * function get uploaded user abstract data
   */
    const getUploadedAbstract = async () => {
        const userId = sessionStorage.getItem('userId');
        try {
            await POST({
                url: `userAbstract/list`,
                body: {
                    filters: {
                        userId: userId
                    }
                },
                id: 'userUploadedAbstract',
                successCB: (context: any) => {
                    setUploadFiles(context.data[0]?.assetId)
                },
                errorCB: (context: any) => {
                    setDataById("snackBarInfo", {
                        open: true,
                        autoHideDuration: 2000,
                        severity: "error",
                        message: context?.message,
                    });
                },
            });

        } catch (e) {
            Logger.error('UserUploadAbstract.tsx');
        }
    }

    /** 
     * Image upload handles for file upload componet
     */
    const handleImageUpload = (uploadedFile: CustomFile) => {
        setUploadFiles(uploadedFile?.id)
    };

    /** 
     * Upload user Abstract data
     */
    const uploadUserAbstract = async () => {
        try {
            await POST({
                url: `userAbstract`,
                body: {
                    eventId: eventData?.id,
                    assetId: uploadFiles
                },
                id: 'userUploadedAbstract',
                successCB: (context: any) => {
                    setDataById("snackBarInfo", {
                        open: true,
                        autoHideDuration: 2000,
                        severity: "sucess",
                        message: context?.message,
                    });
                },
                errorCB: (context: any) => {
                    setDataById("snackBarInfo", {
                        open: true,
                        autoHideDuration: 2000,
                        severity: "error",
                        message: context?.message,
                    });
                },
            });
        } catch (e) {
            Logger.error('UserUploadAbstract.tsx');
        }
    }

    return (
        < >
            <Grid className="upload-abstract" size={12} container >
                <Grid size={{ xs: 12, sm: 8 }} >
                    <Grid size={12}>
                        <Typography className="upload-abstract-header">Upload Abstract</Typography>
                    </Grid>
                    <Grid size={12} className="upload-abstract-gap-text">
                        <Typography className="upload-abstract-sub-header">Upload your abstracts to link them to the programme.</Typography>
                    </Grid>
                    <Grid className="upload-abstract-event-container" container size={12} >
                        <Grid className="upload-abstract-event-container-gap" container size={12}>
                            <Grid size={6}>
                                <Typography className="upload-abstract-event-container-labelS"> Event Name</Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography className="upload-abstract-event-container-labelE">{eventData?.name}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container size={12} className='upload-abstract-event-container-gap'>
                            <Grid size={6}>
                                <Typography className="upload-abstract-event-container-labelS">Deadline</Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography className="upload-abstract-event-container-labelE">{eventData?.abstractDate}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container size={12} className='upload-abstract-event-container-gap'>
                            <Grid size={6}>
                                <Typography className="upload-abstract-event-container-labelS">Status</Typography>
                            </Grid>
                            <Grid size={3}>
                                <StatusComponent value={eventData?.statusId} />
                            </Grid>
                        </Grid>
                    </Grid>
                    {uploadFiles != null &&
                        <Grid className="upload-abstract-upload-container" size={12} >
                            <Typography className="upload-abstract-header">Upload Abstract</Typography>
                            <Grid className="upload-abstract-upload-container-box" size={8} sx={{ position: 'relative' }} >
                                <Grid onClick={() => setUploadFiles(null)} sx={{ position: 'absolute', top: -10, right: -6 }}>
                                    <CloseCircle />
                                </Grid>
                                <Grid>
                                    <BookIcon />
                                </Grid>
                                <Grid className="upload-abstract-upload-container-box-gap">
                                    <Typography className="upload-abstract-upload-container-box-header">Abstract</Typography>
                                </Grid>
                                <Grid className="upload-abstract-upload-container-box-gap">
                                    <Typography className="upload-abstract-upload-container-box-fileName">{uploadedAssetFile?.name}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent={"flex-end"} size={8}>
                                <CustomButton label="Submit file" onClick={uploadUserAbstract} />
                            </Grid>
                        </Grid>}
                    {uploadedAbstractData.length != 0 && uploadedAbstractData[0].comments != null &&
                        <Grid className="upload-abstract-comments-container" size={12}>
                            <Typography className="upload-abstract-comments-container-header">Comments</Typography>
                            <Grid container className="upload-abstract-comments-container-gap" size={4} alignItems={"center"} spacing={1}>
                                <Avatar sx={{ bgcolor: 'skyblue' }}>N</Avatar>
                                <Typography className="upload-abstract-comments-container-header">uploadedAbstractData[0]?.reviewerId</Typography>
                            </Grid>
                            <Grid className="upload-abstract-comments-container-gap15">
                                <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
                            </Grid>
                            <Grid className="upload-abstract-comments-container-gap15">
                                <Typography className="upload-abstract-comments-container-subText">uploadedAbstractData[0]?.comments</Typography>
                            </Grid>
                        </Grid>}
                </Grid>
                {/* right section  */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    {/* <Grid container className="upload-abstract-upload-box" justifyContent={"center"} flexDirection={"column"} alignContent={"center"}> */}
                    {/* <Grid alignSelf={"center"}>
                            <UploadIcon />
                        </Grid>
                        <Grid alignSelf={"center"} className="upload-abstract-upload-box-gap">
                            <Typography className="upload-abstract-upload-box-header">Attach Abstract</Typography>
                        </Grid>
                        <Grid alignSelf={"center"} className="upload-abstract-upload-box-gap">
                            <Typography>Choose a file (PDF, DOCX), Max file size: 50MB. </Typography>
                        </Grid> */}
                    <FileUpload
                        className="upload-abstract-upload-box"
                        acceptedFiles={["application/pdf",]}
                        trimClientSide={false}
                        resolution={{ width: 200, height: 200 }}
                        onSubmit={handleImageUpload}
                    />
                    {/* </Grid> */}
                </Grid>
            </Grid>
        </>
    );

}

export default UserUploadAbstract;