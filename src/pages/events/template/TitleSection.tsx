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
    temp: number;
    onScrollToTier?: any;
}

/**
 * Displays the title section
 */
const TitleSection: React.FC<TitleSectionProps> = React.memo(({ data, temp,onScrollToTier }) => {

    const classPrefix = `event-template-title-${temp}`;
    const navigate = useNavigate();


    const eventPriceTiersPresent = data?.eventPriceTiers !== undefined && data?.eventPriceTiers !== null && data?.eventPriceTiers?.length > 0;

    
    /**
     * Handles the click event for the register button
     * @param e The event details
     */
    function handleClickRegister(e: any) {
        
        e.preventDefault();

        if (eventPriceTiersPresent) {
            console.log("onScrollToTier",onScrollToTier)
            onScrollToTier && onScrollToTier(e) 
            return

        }
        
        navigate(routes.programSelection())
    }


    return <Grid container className={`${classPrefix}`} direction={'column'} alignItems={temp === 2? 'center': 'flex-start'}>
        <Grid><Typography className={`${classPrefix}-title1`}>{data?.name}</Typography></Grid>
        {/* <Grid><Typography className={`${classPrefix}-title2`}>Annual Conference 2024</Typography></Grid>
        <Grid><Typography className={`${classPrefix}-sub-title`}>Uniting Expertise, Advance Anaesthesia Practices</Typography></Grid> */}
        <Grid><CustomButton label="Register Now" className={`${classPrefix}-register-button`} onClick={(e)=>handleClickRegister(e)}/></Grid>
    </Grid>
});

export default TitleSection;
