
import {Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import {useNavigate } from 'react-router-dom'
import useStore from '@/Libs/store'
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { useEffect } from 'react'
import CustomButton from '@/components/CustomButton/CustomButton'

export default function Thankyou() {
  const navigate = useNavigate()
  /**
   * zustand data
   */
  const thankYouPage = useStore((state: any) => state.compData.thankYouPageInfo);
  /**
   * useEffect for navigate to login page after 5 seconds
   */
  useEffect(() => {
    if (thankYouPage.redirectTo){
      setTimeout(() => {
        navigate(thankYouPage.redirectTo);
      }, 5000);
    }
  }, [])
  return (
    <Grid container className='thankyou-main'>
      <Grid size={{ xs: 12, lg: 5 }} className='grid-left ' container>
      </Grid>
      <Grid container size={{ xs: 6, lg: 7 }} className='grid-right' justifyContent='center' >
        <Grid className='grid-right-image' size={{ xs: 6, lg: 5 }} justifyContent='center' alignItems='center' container direction="row">
          <Grid size={{ xs: 12, lg: 12, xl: 12 }} container>
            <Typography className='grid-right-image-text' >{thankYouPage?.type}</Typography>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }} className='thankyou-icon'>
          </Grid >
          <Grid size={{ xs: 6, lg: 9 }} className='thankyou-button' >
            <CustomButton variant="text" onClick={() => navigate("/user/login")} className="button-back-to-home" startIcon={<KeyboardBackspaceRoundedIcon />} label="Back to Login" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
