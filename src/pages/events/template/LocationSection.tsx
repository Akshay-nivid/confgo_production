/**
 * Component displays the location section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import { MapIframe } from './MapIFrame';
import { Typography } from '@mui/material';

type LocationSectionProps = {
    data?: any;
    classPrefix?: string;
    onScrollToTier?: any;
    temp?: any;
}

/**
 * Displays the title section
 */
const LocationSection: React.FC<LocationSectionProps> = React.memo(({ data, classPrefix,onScrollToTier}) => {


    return <Grid id={"Location"} container size={{ xs:12, sm:12 }} className={`${classPrefix}`} ref={onScrollToTier}>
        <Grid size={{ xs:12, sm:12 }} container justifyContent={'center'}><Typography className={`${classPrefix}-title`}>Venue</Typography></Grid>
        <Grid size={{ xs:12, sm:12 }} container justifyContent={'center'}><Typography className={`${classPrefix}-sub-title`}>{`${data?.venue?.name}, ${data?.venue?.city}, ${data?.venue?.state}, ${data?.venue?.country}, ${data?.venue?.postalCode}`}</Typography></Grid>
       {data?.venue?.mapUrl? <MapIframe url={data?.venue?.mapUrl} />:
        <Grid>No map available</Grid>

        }
    </Grid>
});

export default LocationSection;
