/**
 * Component displays the title section of the template
 */
import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';

type TitleSectionProps = {
    data?: any;
    classPrefix?: string;
    onScrollToTier?: any;
    temp?: any;
}

/**
 * Displays the title section
 */
const TitleSection: React.FC<TitleSectionProps> = React.memo(({ data, classPrefix,onScrollToTier }) => {

    const navigate = useNavigate();


    const eventPriceTiersPresent = data?.eventPriceTiers !== undefined && data?.eventPriceTiers !== null && data?.eventPriceTiers?.length > 0;

    
    /**
     * Handles the click event for the register button
     * @param e The event details
     */
    function handleClickRegister(e: any) {
        
        e.preventDefault();

        if (eventPriceTiersPresent) {
            
            if (onScrollToTier) {
                onScrollToTier(e) 
                return  
        }

        }
        
        navigate(routes.programSelection())
    }


    return <>
        <Grid><Typography className={`${classPrefix}-title1`}>{data?.name}</Typography></Grid>
        <Grid><CustomButton label="Register Now" className={`${classPrefix}-register-button`} onClick={(e) => handleClickRegister(e)} /></Grid>
        </>
});

export default TitleSection;
