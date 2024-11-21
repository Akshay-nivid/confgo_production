/**
 * Component displays the ticketing section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Typography } from '@mui/material';


type TicketingSectionProps = {
    data?: any;
    temp: number | undefined;
}

const TicketingSection: React.FC<TicketingSectionProps> = React.memo(({ temp }) => {

    const classPrefix = `event-template-ticketing-${temp}`;

    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`} justifyContent={'center'} alignItems={'center'} spacing={2} direction={'column'}>
            <Grid className={`${classPrefix}-title`}><Typography>Registration & Ticketing</Typography></Grid>



        {/* <Grid className={`${classPrefix}-title`}>{`Welcome to the ${data?.name}`}</Grid>
        {/* <Grid className={`${classPrefix}-sub-title`}>Connecting Minds, Shaping the future of Anaesthology.</Grid> */}
        {/* <Grid container className={`${classPrefix}-content`} textAlign={'center'}>{data?.description && parse(data?.description)}</Grid>  */}
    </Grid>
});

export default TicketingSection;

