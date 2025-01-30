import { BookIcon, BookWhite, CloseBoxWhite, EditBoxWhite, TicBoxWhite } from '@/assets/svg';
import FileUpload from '@/components/FileUpload/FileUpload';
import StatusComponent from '@/components/Status/StatusComponent';
import useStore, { POST, PUT, setDataById, snackBar } from '@/Libs/store';
import { Edit } from '@mui/icons-material';
import { Avatar, Box, IconButton, Rating, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import clsx from 'clsx';
import HTMLReactParser from 'html-react-parser/lib/index';
import moment from 'moment';
import { useEffect, useState } from 'react';
import config from '../../../../config.json';

interface CustomFile {
    id: number;
    name: string;
}
/**
 * componet used to upload the abstract file
 */
const UserUploadAbstract = ({ eventData }: any) => {
    const [uploadFiles, setUploadFiles] = useState<any>();
    const uploadedAbstractData = useStore((state: any) => state?.compData?.['fetchUserAbstract']?.['userAbstract/list']?.data) ?? [];
    const [disabled, setDisabled] = useState(false);

  const baseUrl = config.api.url;

    /**
     * function get uploaded user abstract data
     */
    const getUploadedAbstract = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            POST({
                id: 'fetchUserAbstract',
                url: `userAbstract/list`,
                body: {
                    sortBy: 'id',
                    sortDirection: 'DESC',
                    filters: {
                        userId: userId,
                        eventId: eventData?.id,
                    },
                },
                successCB: context => {
                    setUploadFiles(context.data[0]?.assetId);
                    setDisabled(context.data[0]?.assetId ? true : false);
                },
                errorCB: (context: any) => {
                    snackBar({
                        severity: 'error',
                        message: context.message || 'Something went wrong',
                    });
                },
            });
        } catch (e) {
            snackBar({ severity: 'error', message: 'Something went wrong' });
        }
    };

    /**
     * useEffect to get uploaded userAbstract data
     */
    useEffect(() => {
       
        getUploadedAbstract();
    }, [eventData?.id]);

    /**
     * Image upload handles for file upload componet
     */
    const handleImageUpload = (uploadedFile: CustomFile) => {

        const isUpdate = uploadedAbstractData?.[0]?.id;

        const requestConfig = {
            url: isUpdate ? `userAbstract/${uploadedAbstractData[0].id}` : 'userAbstract',
            id: 'userUploadedAbstract',
            body: {
                eventId: eventData?.id,
                assetId: uploadedFile?.id,
            },
            successCB: () => {
                getUploadedAbstract();
            },
            errorCB: (context: any) => {
                setDataById('snackBarInfo', {
                    open: true,
                    autoHideDuration: 2000,
                    severity: 'error',
                    message: context?.message,
                });
            },
        };

        (isUpdate ? PUT : POST)(requestConfig);
    };

    const statusArray = [
        {
            status: uploadedAbstractData?.[0]?.asset?.id ? 'uploaded' : 'default',
            title: uploadedAbstractData?.[0]?.asset?.id ? 'uploaded' : 'Abstracts Not Uploaded',
            desc: uploadedAbstractData?.[0]?.asset?.modifiedOn
            ? [`Uploaded on : ${moment.utc(uploadedAbstractData[0].asset.modifiedOn).format('Do MMM YYYY')}`]
            : []
        },
        {
            status: uploadedAbstractData?.[0]?.reviewer ? 'reviewing' : 'default',
            title:  uploadedAbstractData?.[0]?.reviewer ? 'Reviewing' : 'Pending',
            desc: [
                uploadedAbstractData?.[0]?.reviewer?.firstName || uploadedAbstractData?.[0]?.reviewer?.lastName || uploadedAbstractData?.[0]?.modifiedOn
                  ? `Reviewed by: ${
                      uploadedAbstractData?.[0]?.reviewer?.firstName || ''
                    } ${
                      uploadedAbstractData?.[0]?.reviewer?.lastName || ''
                    }`
                  : []
              ], 
            },
           {
           status: uploadedAbstractData?.[0]?.statusId === 1 
            ? 'Approved' 
             : uploadedAbstractData?.[0]?.statusId === 2 
            ? 'rejected' 
            : 'default',
    
           title: uploadedAbstractData?.[0]?.statusId === 1 
           ? 'Approved' 
           : uploadedAbstractData?.[0]?.statusId === 2 
           ? 'Rejected' 
           : 'Reviewing on process',
    
           desc: (uploadedAbstractData?.[0]?.statusId === 1 || uploadedAbstractData?.[0]?.statusId === 2|| uploadedAbstractData?.[0]?.statusId === 4) 
           ? [`Submitted by : ${moment.utc(uploadedAbstractData[0].modifiedOn).format('Do MMM YYYY')}`] 
           : []
             }
           ];

    const handleFileClick = () => {
        const href = `${baseUrl}asset/${uploadFiles}`;
         window.open(href, '_blank');
      };

    return (
        <>
            <Grid className="upload-abstract" size={12} container>
                <Grid size={{ xs: 12, sm: 8 }} className="left-grid border-r ">
                    <HeaderSection />
                    <EventInfo eventData={eventData} />

                    {uploadFiles != null && (
                        <Grid className="upload-abstract-upload-container padding-x-20 " size={12}>
                            <Typography className="upload-abstract-header">Upload Abstract</Typography>
                            <Grid onClick={() => handleFileClick()}  className="upload-abstract-upload-container-box cursor-pointer" size={8} sx={{ position: 'relative' }}>
                                <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                                    <BookIcon />
                                    <Box display={'flex'} alignItems={'center'} columnGap={1}>
                                    {!uploadedAbstractData[0]?.reviewer &&
                                        <IconButton
                                        className="edit-icon"
                                                onClick={(e) => {
                                            e.stopPropagation();
                                            setDisabled(false);
                                        }}
                                    >
                                        <Edit className='h-1 w-1' />
                                        </IconButton>
                                        }

                                        </Box>
                                </Grid>
                                <Grid className="upload-abstract-upload-container-box-gap">
                                    <Typography className="upload-abstract-upload-container-box-header">Abstract</Typography>
                                </Grid>
                                <Grid className="upload-abstract-upload-container-box-gap">
                                    <Typography className="upload-abstract-upload-container-box-fileName">
                                        {uploadFiles?.name || uploadedAbstractData[0]?.asset?.name || uploadedAbstractData[0]?.asset?.mimeType}{' '}
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Grid>
                    )}
                    {uploadedAbstractData?.length !== 0 && uploadedAbstractData[0]?.isReviewed === 1 && (
                        <Grid className="upload-abstract-comments-container border-bottom-blue padding-x-20" size={12}>
                            <Typography className="upload-abstract-comments-container-header ">Comment</Typography>
                            <Grid container className="upload-abstract-comments-container-gap" size={12} alignItems={'center'} spacing={1}>
                                <Avatar>{uploadedAbstractData[0]?.reviewer?.firstName[0] + ' ' + uploadedAbstractData[0]?.reviewer?.lastName[0]}</Avatar>
                                <Typography className="upload-abstract-comments-container-header">{uploadedAbstractData[0]?.reviewer?.firstName + ' ' + uploadedAbstractData[0]?.reviewer?.lastName}</Typography>
                            </Grid>
                            <Grid className="upload-abstract-comments-container-gap15">
                                <Rating defaultValue={uploadedAbstractData[0]?.rating} name="half-rating-read" size="large" readOnly />
                            </Grid>
                            <Grid className="upload-abstract-comments-container-gap15">
                                <Typography className="upload-abstract-comments-container-subText">{HTMLReactParser(uploadedAbstractData[0]?.comment || '')}</Typography>
                                {/* <LocalTimeDate utcDateTime={uploadedAbstractData[0]?.modifiedOn} format='' /> */}
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                {/* right section  */}
                <Grid size={{ xs: 12, sm: 4 }} className="right-grid">

                    <Box>
                        {disabled ? (
                            <></>
                        ) : (
                            <FileUpload
                                acceptedFiles={['application/pdf']}
                                trimClientSide={false}
                                resolution={{ width: 200 }}
                                onSubmit={handleImageUpload}
                                disabled={disabled}
                                maxSize={10}
                            />
                        )}
                    </Box>

                    <Typography className="status-bar-text">Status Bar</Typography>
                    <Box>
                        {statusArray.map((item, index) => {
                            return (
                                <Box className="flex gap-x-4 ">
                                    <Box className="flex flex-col items-center gap-y-3 w-max">
                                        <StatusAvatar status={item.status as 'uploaded' | 'reviewing' | 'approved' | 'rejected' | 'default'} />
                                        {index != statusArray.length - 1 && <VerticalLine />}
                                    </Box>
                                    <Title title={item.title} desc={item.desc} />
                                </Box>
                            );
                        })}
                    </Box> 
                </Grid>
            </Grid>
        </>
    );
};

export default UserUploadAbstract;

/**
 * EventInfo displays event information: name, deadline, and status.
 * @param {{ eventData: any }} props
 * @prop {any} eventData - event data
 * @returns {JSX.Element} a box with event information
 */
const EventInfo = ({ eventData }: { eventData: any }) => {
    return (
        <Box className="border-bottom-blue">
            <Grid className="upload-abstract-event-container padding-x-20" container size={12}>
                <Grid className="upload-abstract-event-container-gap" container size={12}>
                    <Grid size={6}>
                        <Typography className="upload-abstract-event-container-labelS"> Event Name</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography className="upload-abstract-event-container-labelE">{eventData?.name}</Typography>
                    </Grid>
                </Grid>
                <Grid container size={12} className="upload-abstract-event-container-gap">
                    <Grid size={6}>
                        <Typography className="upload-abstract-event-container-labelS">Deadline</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography className="upload-abstract-event-container-labelE">{eventData?.abstractDate}</Typography>
                    </Grid>
                </Grid>
                <Grid container size={12} className="upload-abstract-event-container-gap">
                    <Grid size={6}>
                        <Typography className="upload-abstract-event-container-labelS">Status</Typography>
                    </Grid>
                    <Grid size={3}>
                        <StatusComponent value={eventData?.statusId} />
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

/**
 * HeaderSection component
 *
 * This component renders the header section of the user upload abstract page, which includes the title and subtitle text.
 */
const HeaderSection = () => {
    return (
        <Grid size={12} container className="padding-x-20 header-section-container">
            <Grid size={12}>
                <Typography className="upload-abstract-header">Upload Abstract</Typography>
            </Grid>
            <Grid size={12} className="upload-abstract-gap-text">
                <Typography className="upload-abstract-sub-header">Upload your abstracts to link them to the programme.</Typography>
            </Grid>
        </Grid>
    );
};

/**
 * Displays a status avatar with a different icon based on the status provided.
 * The supported statuses are:
 *  - uploaded: <BookWhite />
 *  - reviewing: <EditBoxWhite />
 *  - approved: <TicBoxWhite />
 *  - rejected: <CloseBoxWhite />
 *  - default: <></> (empty string)
 * @param {{ status: 'uploaded' | 'reviewing' | 'approved' | 'rejected' | 'default' }} props
 * @returns {ReactElement}
 */
const StatusAvatar = ({ status }: { status: 'uploaded' | 'reviewing' | 'approved' | 'rejected' | 'default' }) => {
    const statusList = {
        uploaded: {
            icon: <BookWhite />,
        },
        reviewing: {
            icon: <EditBoxWhite />,
        },
        approved: {
            icon: <TicBoxWhite />,
        },
        rejected: {
            icon: <CloseBoxWhite />,
        },
        default: {
            icon: '',
        },
    };

    return <Avatar className={clsx('status-avatar', status)}>{statusList[status]?.icon}</Avatar>;
};

/**
 * A vertical line divider component.
 * @returns {JSX.Element} A rendered vertical line divider.
 */
const VerticalLine = () => {
    return <Box className="vertical-line"></Box>;
};

/**
 * Renders a title section with an optional description.
 * If a description is provided, it displays the description
 * with a 'Uploaded on' prefix and formats the date using 'Do MMMM YYYY'.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.title - The main title to display.
 * @param {string} [props.desc] - Optional description with a date to be formatted.
 */

const Title = ({ title, desc }: { title: string ; desc?: any }) => {
    return (
        <Box className="">
            <Typography className="stepper-title">{title}</Typography>
            {/* {desc && <Typography className="stepper-desc">{desc}</Typography>} */}
            {desc && desc.length > 0 && desc.map((item:any)=><Typography className="stepper-desc">{item}</Typography>) }
        </Box>
    );
};
