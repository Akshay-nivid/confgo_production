import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import FileUpload from '@/components/FileUpload/FileUpload';
import { extractFileType } from '@/Utils/CommonBaseClass';
import UploadedIcon from "../../../assets/svg/uploaded-abstract.svg"
import RemoveIcon from "../../../assets/svg/file-remove.svg"
import useStore, { GET, POST, PUT } from '@/Libs/store';
import moment from 'moment';


interface CustomFile {
    id: number;
    name: string;
}

const SpeakerHome: React.FC<any> = () => {

    const [uploadedFile, setUploadedFile] = useState<any>()
    const speakerData = useStore((state: any) => state?.compData?.["speakerData"]?.["eventSpeaker/list"]?.data)?.[0] ?? [];
    const speakerId = sessionStorage.getItem("userId");

    /**
     * Useeffect hook handles the api call for getting speaker details
     */
    useEffect(() => {
        POST({
            url: `eventSpeaker/list`,
            id: "speakerData",
            body: {
                filters: {
                    id: speakerId
                }
            },
            successCB: (response: any) => {
                if(response?.data?.[0]?.speakerFileId){
                    GET({
                        url: `asset/${response?.data?.[0]?.speakerFileId}`,
                        id: "speakerFileSavedData",
                        successCB: (_response: any) => {
                            
                        }
                    })
                }
                
              },
        })
    }, [])

    /** 
 * image upload function for profile image
 */
    const handleImageUpload = (file: CustomFile) => {
        if(uploadedFile?.id) {
            PUT({
                url: `eventSpeaker/${speakerId}`,
                id: "speakerFileData",
                body: {
                    speakerFileId: uploadedFile?.id
                }
            })
            setUploadedFile(file);
        }
        
        
    };

    const handleRemove = () => {
    }
    return (
        <Grid container className="speaker-home" size={{ xs: 12, sm: 12 }}>
            <Grid size={{ xs: 12, sm: 12 }} className="speaker-home-banner-container">
                <Typography className="speaker-home-banner-title">{`Welcome, ${speakerData?.user?.firstName} ${speakerData?.user?.lastName}! 👋`}</Typography>
                <Typography className="speaker-home-banner-subtitle">Simplifying your tasks for the upcoming event.</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} className="speaker-home-left-section" container>
                <Grid><Typography className="speaker-home-left-section-title">Upload Your Presentation</Typography></Grid>
                <Grid container size={{ xs: 12, sm: 12 }}>
                    <Grid size={{ xs: 12, sm: 6 }}><Typography className="speaker-home-left-section-label">Event Name</Typography></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><Typography className="speaker-home-left-section-value">{speakerData?.event?.name}</Typography></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><Typography className="speaker-home-left-section-label">Upload Date</Typography></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><Typography className="speaker-home-left-section-value">{moment.utc(speakerData?.modifiedOn).format("MMM DD, YYYY")}</Typography></Grid>
                </Grid>
                <Grid container size={{ xs: 12, sm: 12 }}>
                </Grid>
                <Grid container size={{ xs: 12, sm: 12 }}>
                </Grid>
                <Grid container size={{ xs: 12, sm: 12 }}>
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }} container ></Grid>
            <Grid size={{ xs: 12, sm: 3 }} container direction={'column'} >
                <Grid>
                    <FileUpload
                        isAbstract={true}
                        acceptedFiles={["pdf",]}
                        trimClientSide={false}
                        resolution={{ width: 200, height: 200 }}
                        onSubmit={handleImageUpload}
                        height={'25rem'}
                    />
                </Grid>
                <Grid>
                    <Typography className="speaker-home-right-section-title">Uploaded Presentation</Typography>
                </Grid>
                {uploadedFile && <Grid className="speaker-home-right-section-uploaded-container" direction={'column'}>
                    <Grid className="speaker-home-right-section-uploaded-container-remove-icon" onClick={handleRemove}>
                        <RemoveIcon />
                    </Grid>
                    <Grid container direction={'row'}>
                        <UploadedIcon />
                        <Typography className="speaker-home-right-section-uploaded-container-text">Presentation</Typography>
                    </Grid>
                    <Grid>
                        <Typography className="speaker-home-right-section-uploaded-container-name">{`${uploadedFile?.name}.${extractFileType(uploadedFile)}`}</Typography>

                    </Grid>
                </Grid>}
            </Grid>
        </Grid>
    )
}

export default SpeakerHome

