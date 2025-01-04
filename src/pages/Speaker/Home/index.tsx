/**
 * Component handles the speaker dashboard
 */
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import FileUpload from '@/components/FileUpload/FileUpload';
import { extractFileType } from '@/Utils/CommonBaseClass';
import UploadedIcon from "../../../assets/svg/uploaded-abstract.svg"
import RemoveIcon from "../../../assets/svg/file-remove.svg"
import useStore, { POST, PUT } from '@/Libs/store';
import moment from 'moment';
import config from '../../../../config.json';

interface CustomFile {
    id: number;
    name: string;
}

const SpeakerHome: React.FC<any> = () => {

    const [uploadedFile, setUploadedFile] = useState<any>()
    const speakerData = useStore((state: any) => state?.compData?.["speakerData"]?.["eventSpeaker/list"]?.data)?.[0] ?? [];
    const speakerUserId = useStore((state: any) => state.compData?.["participantUserData"])?.id;
    const speakerName = sessionStorage.getItem("name");
    const baseURL = config.api.url;


    /**
     * Useeffect hook handles the api call for getting speaker details
     */
    useEffect(() => {
        if(speakerUserId){
            POST({
                url: `eventSpeaker/list`,
                id: "speakerData",
                body: {
                    filters: {
                        userId: speakerUserId
                    }
                },
                successCB: (response: any) => {
                    if (response?.data?.[0]?.speakerFileId) {
                        setUploadedFile(response?.data?.[0]?.speakerFile);
                    }
    
                },
            })
        }
    }, [speakerUserId])

    /** 
 * image upload function for profile image
 */
    const handleImageUpload = (file: CustomFile) => {
        if (file?.id) {
            PUT({
                url: `eventSpeaker/${speakerData?.id}`,
                id: "speakerFileData",
                body: {
                    speakerFileId: file.id
                }
            })
            setUploadedFile(file);
        }


    };

    /**
     * Method handles the document download functionality
     * @param id : document id
     */
    const handleDownload = (id: any) => {
        const href = `${baseURL}asset/${id}`
        window.open(href, '_blank')
    };

    /**
     * Method handles the removal of the document 
     */
    const handleRemove = () => {
        PUT({
            url: `eventSpeaker/${speakerData?.id}`,
            id: "speakerFileData",
            body: {
                speakerFileId: null
            }
        })
        setUploadedFile({});
    }


    return (
        <Grid container className="speaker-home" size={{ xs: 12, sm: 12 }}>
            <Grid size={{ xs: 12, sm: 12 }} className="speaker-home-banner-container">
                <Typography className="speaker-home-banner-title">{`Welcome, ${speakerName}! 👋`}</Typography>
                <Typography className="speaker-home-banner-subtitle">Simplifying your tasks for the upcoming event.</Typography>
            </Grid>


            {speakerData?.eventId ? <><Grid size={{ xs: 12, sm: 6 }} className="speaker-home-left-section" container>
                <Grid><Typography className="speaker-home-left-section-title">Upload Your Presentation</Typography></Grid>
                <Grid container size={{ xs: 12, sm: 12 }}>
                    <Grid size={{ xs: 12, sm: 6 }}><Typography className="speaker-home-left-section-label">Event Name</Typography></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><Typography className="speaker-home-left-section-value">{speakerData?.event?.name}</Typography></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><Typography className="speaker-home-left-section-label">Upload Date</Typography></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><Typography className="speaker-home-left-section-value">{speakerData?.modifiedOn ? moment.utc(speakerData?.modifiedOn).format("MMM DD, YYYY") : ''}</Typography></Grid>
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
                    {uploadedFile?.id && <Grid>
                        <Typography className="speaker-home-right-section-title">Uploaded Presentation</Typography>
                    </Grid>}
                    {uploadedFile?.id && <Grid className="speaker-home-right-section-uploaded-container" direction={'column'}>
                        <Grid className="speaker-home-right-section-uploaded-container-remove-icon" onClick={() => handleRemove()}>
                            <RemoveIcon />
                        </Grid>
                        <Grid container direction={'row'}>
                            <UploadedIcon />
                            <Typography className="speaker-home-right-section-uploaded-container-text">Presentation</Typography>
                        </Grid>
                        <Grid>
                            <Typography className="speaker-home-right-section-uploaded-container-name" onClick={() => handleDownload(uploadedFile?.id)}>{`${uploadedFile?.name}.${extractFileType(uploadedFile)}`}</Typography>
                        </Grid>
                    </Grid>}
                </Grid></> :
                <Grid size={{ xs: 12, sm: 12 }}>
                    <Typography className="speaker-home-left-section-title">No event is assigned.</Typography>
                </Grid>
            }
        </Grid>
    )
}

export default SpeakerHome

