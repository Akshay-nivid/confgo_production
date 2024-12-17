/**
 * Component displays the top menu section of the template
 */
import useStore, { resetStore, setDataById } from '@/Libs/store';
import { getUserToken, handleLogout } from '@/Utils/CommonBaseClass';
import CustomButton from '@/components/CustomButton/CustomButton';
import routes from '@/router/routes';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import config from "../../../../config.json";


type TopMenuSectionProps = {
    data?: any;
    temp: number | undefined;
    onScrollToProgram?: any;
    onScrollToAbout?: any;
    onScrollToContributors?: any;
    onScrollToLocation?:any;
}


/**
 * Component displays the top menu section of the template
 */
const TopMenuSection: React.FC<TopMenuSectionProps> = React.memo(({ data, temp, onScrollToProgram, onScrollToAbout, onScrollToContributors,onScrollToLocation }) => {

    const classPrefix = `event-template-top-menu-${temp}`;
    const navigate = useNavigate();
    const location = useLocation();
    const baseUrl = config.api.url;
    const slugName = useStore((state: any) => state?.compData?.["slugName"]?.slugName) || '';
    const slugInfo = useStore((state: any) => state?.compData?.['slugEventDetails']?.[`event/slug/${slugName}`]?.data) ?? [];


    
    
    /**
     * Function navigates to the login page and stores the previous route in the store
     */
    const  loginFn= () => {
        setDataById("previousRoute", { url: location.pathname });

       navigate(routes.userLogin());
    }

    const SignupFn = () => {
        setDataById("previousRoute", { url: location.pathname });
        navigate(routes.userRegister());
    }

    /**
     * Function handles the logout functionality
     * Calls the handleLogout from CommonBaseClass with a callback
     * The callback resets the store and navigates to the login page
     */
    function logoutFn() {
        handleLogout({
            onLogoutSuccess: () => {
                resetStore();
                navigate(routes.userLogin());
            }
        });
    }


    // useEffect(() => {
    //     clearDataById('previousRoute')
    // }, [])


    return (
        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`}>
            <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} alignItems={'center'} className={`${classPrefix}-container`}>
                <Grid className={`${classPrefix}-logo`}>{(data?.assetId || slugInfo?.assetId)? <img
                                className={`${classPrefix}-logo-img`}
                                src={`${baseUrl}asset/${data?.assetId ?? slugInfo?.assetId ?? ''}`}
                              />:<Grid></Grid>}</Grid>
               {location.pathname.startsWith('/event-link') && <Grid container spacing={2}>
                    <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={(e) => { e.preventDefault(); onScrollToAbout(e) }}> About </Link></Grid>
                    <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={(e) => { e.preventDefault(); onScrollToContributors(e) }}> Contributors </Link></Grid>
                    <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={(e) => { e.preventDefault(); onScrollToProgram(e) }}> Programs </Link></Grid>
                    <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={(e) => { e.preventDefault(); onScrollToLocation(e) }}> Location </Link></Grid>
                </Grid>}
                <Grid container spacing={2}>
                    {getUserToken() ? <Grid className={`${classPrefix}-logout-button`}><span role='button' onClick={logoutFn}> Logout </span></Grid> :
                        <><Grid className={`${classPrefix}-login-button`}><span role='button' onClick={loginFn}> Login </span></Grid>
                            <Grid className={`${classPrefix}-button-border`}></Grid>
                            <Grid className={`${classPrefix}-book-button`}><CustomButton onClick={SignupFn} label='Signup' 
                             /></Grid></>}
                </Grid>
            </Grid>
        </Grid>)
});

export default TopMenuSection;
