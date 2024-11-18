/**
 * Component displays the event contributors section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import config from '../../../../config.json';


type EventContributorsSectionProps = {
    data?: any;
    temp: string;
}

const EventContributorsSection: React.FC<EventContributorsSectionProps> = React.memo(({ data, temp }) => {

    const classPrefix = `event-template-event-contributors-${temp}`;
    const baseUrl = config.api.url;

    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`} spacing={1} direction={'column'} justifyContent={'center'} alignItems={'center'}>
        <Grid className={`${classPrefix}-title`}>Meet Our Esteemed Event Contributors</Grid>
        {/* <Grid className={`${classPrefix}-sub-title`}>Gain insights from leading experts in anaesthesiology as they share groundbreaking practices, innovations and advancements</Grid> */}
        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-item-group-container`} justifyContent={'center'} alignItems={'center'}>
            {data?.map((item: any) => {
                return <Grid size={{ xs: 12, sm: 6 }} container direction={'row'} className={`${classPrefix}-item-container`} spacing={2}>
                    <Grid size={{ xs: 12, sm: 12 }} container direction={'row'}>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <img
                                src={`${baseUrl}asset/${item?.assetId}`}
                                alt={item.name}
                            />
                        </Grid>
                        <Grid container size={{ xs: 12, sm: 9 }} direction={'column'}>
                            <Grid className={`${classPrefix}-item-name`}>{item.name}</Grid>
                            <Grid className={`${classPrefix}-item-designation`}>{item.programType}</Grid>
                            <Grid className={`${classPrefix}-item-topic`}>{item.topic}</Grid>
                        </Grid>
                    </Grid>
                </Grid>
            })}
        </Grid>
    </Grid>
});

export default EventContributorsSection;

