/**
 * Component displays the event contributors section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import config from '../../../../config.json';
import NoProfilePicture from "../../../assets/svg/NoProfilePicture.svg";

type EventContributorsSectionProps = {
    data?: any;
    classPrefix?: string;
    ref?: any;
    temp?: any;
}


/**
 * Method displays the event contributors section
 */
const EventContributorsSection = React.memo(
    React.forwardRef<HTMLDivElement, EventContributorsSectionProps>(({ data, classPrefix }, ref) => {
    

    const baseUrl = config.api.url; 


    return <Grid id={'Contributors'} container size={{ xs: 12, sm: 12 }} className={`${classPrefix} `} spacing={1} direction={'column'} justifyContent={'center'} alignItems={'center'} ref={ref}>
        <Grid className={`${classPrefix}-title`}>Meet Our Esteemed Speakers</Grid>
        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-item-group-container anim-container`} justifyContent={'center'} alignItems={'center'} spacing={4}>
            {data?.map((item: any) => {
                return <Grid alignSelf={'stretch'}  size={{ xs: 12, sm: 6 }} container direction={'row'} className={`${classPrefix}-item-container `} spacing={2}>
                    <Grid   size={{ xs: 12, sm: 12 }} container direction={'row'} className={`${classPrefix}-item-container-speaker-card `}>
                        <Grid overflow={'hidden'}  className={`${classPrefix}-item-container-speaker-card-image-container card-image-container `}>
                            {item?.user?.assetId ? (<img
                                height={'100%'}
                                width={'100%'}
                                src={`${baseUrl}asset/${item?.user?.assetId}`}
                                alt={item.name}
                            />):(
                                    <NoProfilePicture className='h-full w-full'/>
                        )}
                            
                        </Grid>
                        <Grid container  direction={'column'} >
                            <Grid className={`${classPrefix}-item-name name`}>{`${item.user?.firstName} ${item.user?.lastName}`}</Grid>
                            {/* <Grid className={`${classPrefix}-item-designation`}>{item.designation}</Grid>
                            <Grid className={`${classPrefix}-item-topic`} title={item.description}>{truncateString(item.description,30, "")}</Grid> */}
                        </Grid>
                    </Grid>
                </Grid>
            })}
        </Grid>
    </Grid>
}));

export default EventContributorsSection;

