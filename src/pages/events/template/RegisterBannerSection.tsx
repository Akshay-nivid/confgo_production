/**
 * Component displays the Register Banner section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import CustomButton from '@/components/CustomButton/CustomButton';
import { Typography } from '@mui/material';
import { snackBar } from '@/Libs/store/store';

type RegisterBannerSectionProps = {
  data?: any;
  classPrefix?: string;
  onScrollToTier?: any;
  temp?: any;
}

/**
 * Displays the Register Banner section
 */
const RegisterBannerSection: React.FC<RegisterBannerSectionProps> = React.memo(({ data, classPrefix, onScrollToTier }) => {

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
    
    
            const startData = new Date(data?.startDate);


            const isEventEnded = startData < new Date() 
    
    
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

  return <Grid size={{ xs: 12, sm: 12 }} className={`${classPrefix}`}>
    <Grid size={{ xs: 12 }}><Typography className={`${classPrefix}-title`}>Register for the Event</Typography></Grid>
    <Grid size={{ xs: 12 }} ><Typography className={`${classPrefix}-subtitle`}>Secure your spot now and be part of the experience. Don’t miss out!</Typography></Grid>
    <Grid container size={{ xs: 12 }} justifyContent={'center'}><CustomButton label="Register Now" className={`${classPrefix}-button`} onClick={(e) => handleClickRegister(e)} /></Grid>
  </Grid>
});

export default RegisterBannerSection;
