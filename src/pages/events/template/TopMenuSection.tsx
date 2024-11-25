/**
 * Component displays the top menu section of the template
 */
import { clearDataById, resetStore, setDataById } from '@/Libs/store';
import { getUserToken, handleLogout } from '@/Utils/CommonBaseClass';
import CustomButton from '@/components/CustomButton/CustomButton';
import routes from '@/router/routes';
import Grid from '@mui/material/Grid2';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type TopMenuSectionProps = {
    data?: any;
    temp: number | undefined;
    onScrollToProgram?: any;
    onScrollToAbout?: any;
    onScrollToContributors?: any;
}



const TopMenuSection: React.FC<TopMenuSectionProps> = React.memo(({ temp, onScrollToProgram, onScrollToAbout, onScrollToContributors }) => {

    const classPrefix = `event-template-top-menu-${temp}`;
    const navigate = useNavigate();
    const location = useLocation()

    
    const  loginFn= () => {
        setDataById("previousRoute", { url: location });

        navigate(routes.userLogin());
    }

    function logoutFn() {
        handleLogout({
            onLogoutSuccess: () => {
                resetStore();
                navigate(routes.userLogin());
            }
        });
    }


    useEffect(() => {
        clearDataById('previousRoute')
    }, [])

    return (
        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`}>
            <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} alignItems={'center'} className={`${classPrefix}-container`}>
                <Grid className={`${classPrefix}-logo`}>LOGO</Grid>
                <Grid container spacing={2}>
                    <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={(e) => { e.preventDefault(); onScrollToAbout(e) }}> About </Link></Grid>
                    <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={(e) => { e.preventDefault(); onScrollToContributors(e) }}> Contributors </Link></Grid>
                    <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={(e) => { e.preventDefault(); onScrollToProgram(e) }}> Programs </Link></Grid>
                    <Grid className={`${classPrefix}-sub-item`}><Link to={'#'}> Location </Link></Grid>
                </Grid>
                <Grid container spacing={2}>
                    {getUserToken() ? <Grid className={`${classPrefix}-logout-button`}><span role='button' onClick={logoutFn}> Logout </span></Grid> :
                        <><Grid className={`${classPrefix}-login-button`}><span role='button' onClick={loginFn}> Login </span></Grid>
                            <Grid className={`${classPrefix}-button-border`}></Grid>
                            <Grid className={`${classPrefix}-book-button`}><CustomButton label='Signup' onClick={() => navigate('/user/register')} /></Grid></>}
                </Grid>
            </Grid>
        </Grid>)
});

export default TopMenuSection;
