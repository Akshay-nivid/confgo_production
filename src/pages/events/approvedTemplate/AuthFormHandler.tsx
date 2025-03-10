import React, { useState } from 'react'
import Grid from '@mui/material/Grid2';
import TLogin from './TLogin';
import TRegister from './TRegister';
import { Typography } from '@mui/material';
import { setDataById, snackBar } from '@/Libs/store';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import TLogout from './TLogout';

/**
 * Component handles auth section
 */
const AuthFormHandler: React.FC<any> = React.memo(({ className, data, onScrollToTier }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const eventPriceTiersPresent = data?.eventPriceTiers !== undefined && data?.eventPriceTiers !== null && data?.eventPriceTiers?.length > 0;
    const [userToken, setUserToken] = useState<any>(sessionStorage.getItem('token'));
    const userRole = sessionStorage.getItem('userRole')

    // //This function will recognize when the user log out
    const LogoutAction = () => {
      setUserToken(null);

    }

     /**
     * Handles the click event for the register button
     * @param e The event details
     */
  function handleClickRegister(e: any) {

    e.preventDefault();


    // admin user is perevented from navigating to cart
    if (userToken && userRole !== 'USER') {
      snackBar({ severity: 'error', message: 'please login using participant credentials' })
      return
    }

    if (new Date(data?.endDate).getTime() < new Date().getTime()) {
      snackBar({ severity: 'error', message: 'Event has ended' })
      return
    }
    if (eventPriceTiersPresent) {

      onScrollToTier()
      return;

    }
    navigate(routes.programSelection())
  }

      /**
    * Function navigates to the login page and stores the previous route in the store
    */
  const loginFn = () => {
    setDataById("previousRoute", { url: location.pathname });

    navigate(routes.userLogin());
  }

    return (
        <Grid size={12} className={className}>
            <Typography className={`${className}-title`}>{data?.name}</Typography>
            <Grid direction={'row'} container>
                {userToken ? <TLogout className={`${className}-login`} onBeforeLogout={LogoutAction} /> : <TLogin className={`${className}-login`} onClick={loginFn}/>}
                <TRegister buttonName='Register' className={`${className}-register`} onClick={(e: any) => handleClickRegister(e)}/>
            </Grid>
        </Grid>
    )
})

export default AuthFormHandler