/**
 * Component displays the event contributors section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import config from '../../../../config.json';
import { Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';


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


    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix} `} spacing={1} direction={'column'} justifyContent={'center'} alignItems={'center'} ref={ref}>
        <Grid className={`${classPrefix}-title`}>Meet Our Esteemed Event Contributors</Grid>
        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-item-group-container anim-container`} justifyContent={'center'} alignItems={'center'}>
            {data?.map((item: any) => {
                return <Grid size={{ xs: 12, sm: 6 }} container direction={'row'} className={`${classPrefix}-item-container slide-right`} spacing={2}>
                    <Grid size={{ xs: 12, sm: 12 }} container direction={'row'}>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            {item?.assetId ? (<img
                                src={`${baseUrl}asset/${item?.assetId}`}
                                alt={item.name}
                            />):(<Avatar>
                              <PersonIcon/>
                            </Avatar>)}
                        </Grid>
                        <Grid container size={{ xs: 12, sm: 9 }} direction={'column'}>
                            <Grid className={`${classPrefix}-item-name`}>{`${item.user?.firstName} ${item.user?.lastName}`}</Grid>
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

