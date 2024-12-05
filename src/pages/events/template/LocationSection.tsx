/**
 * Component displays the location section of the template
 */
import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import { MapIframe } from './MapIFrame';

type LocationSectionProps = {
    data?: any;
    temp: number;
    onScrollToTier?: any;
}

/**
 * Displays the title section
 */
const LocationSection: React.FC<LocationSectionProps> = React.memo(({ data, temp,onScrollToTier }) => {

    const classPrefix = `event-template-location-${temp}`;
    const navigate = useNavigate();


    const eventPriceTiersPresent = data?.eventPriceTiers !== undefined && data?.eventPriceTiers !== null && data?.eventPriceTiers?.length > 0;

    
    /**
     * Handles the click event for the register button
     * @param e The event details
     */
    function handleClickRegister(e: any) {
        
        e.preventDefault();

        if (eventPriceTiersPresent) {
            onScrollToTier && onScrollToTier(e) 
            return
        }
        
        navigate(routes.programSelection())
    }


    return <Grid container size={{ xs:12, sm:12 }} className={`${classPrefix}`}>
       {data?.venue?.mapUrl? <MapIframe url={data?.venue?.mapUrl} />:
        <Grid>No map available</Grid>

        }
    </Grid>
});

export default LocationSection;
