/**
 * Component displays the title section of the template
 */
import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import { snackBar } from '@/Libs/store';



type TitleSectionProps = {
    data?: any;
    classPrefix?: string;
    onScrollToTier?: any;
    temp?: any;
}

/**
 * Displays the title section
 */
const TitleSection: React.FC<TitleSectionProps> = React.memo(({ data, classPrefix, onScrollToTier }) => {

    const navigate = useNavigate();


    const eventPriceTiersPresent = data?.eventPriceTiers !== undefined && data?.eventPriceTiers !== null && data?.eventPriceTiers?.length > 0;


    /**
     * Handles the click event for the register button
     * @param e The event details
     */
    function handleClickRegister(e: any) {

        e.preventDefault();

        const userToken = sessionStorage.getItem('token')
        const userRole = sessionStorage.getItem('userRole')


        const endDate = new Date(data?.endTime);


        const isEventEnded = endDate < new Date() 
        


        if (isEventEnded) {
            snackBar({ severity: 'error', message: "The event has ended." })
            return
        }


        // admin user is perevented from navigating to cart
        if (userToken && userRole !== 'USER') {
            snackBar({ severity: 'error', message: 'please login using participant credentials' })
            return
        }





        if (eventPriceTiersPresent) {

            if (onScrollToTier) {
                onScrollToTier(e)
                return
            }

        }

        navigate(routes.programSelection())
    }


    return <>
        <Grid className={`title-container`}>
            <Tooltip title={data?.name}>
                <Typography className={`${classPrefix}-title1 hero-header`}> {data?.name}</Typography>
            </Tooltip>
        </Grid>

        <Grid>
            <CustomButton label="Register Now" className={`${classPrefix}-register-button`} onClick={(e) => handleClickRegister(e)} />
        </Grid>
    </>
});

export default TitleSection;


