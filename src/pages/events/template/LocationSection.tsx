/**
 * Component displays the location section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import { MapIframe } from './MapIFrame';

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


    return <Grid container size={{ xs:12, sm:12 }} className={`${classPrefix}`} ref={onScrollToTier}>
       {data?.venue?.mapUrl? <MapIframe url={data?.venue?.mapUrl} />:
        <Grid>No map available</Grid>

        }
    </Grid>
});

export default LocationSection;
