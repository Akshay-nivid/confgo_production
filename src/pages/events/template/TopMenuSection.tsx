/**
 * Component displays the top menu section of the template
 */
import useStore, { clearDataById, resetStore, setDataById } from '@/Libs/store/store';
import { getUserToken, handleLogout, useIsMobileOrTabletScreen } from '@/Utils/CommonBaseClass';
import CustomButton from '@/components/CustomButton/CustomButton';
import routes from '@/router/routes';
import Grid from '@mui/material/Grid2';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import config from "../../../../config.json";
import { Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { CloseIcon } from '@/assets/svg';

type TopMenuSectionProps = {
    data?: any;
    classPrefix?: string;
    onScrollToProgram?: any;
    onScrollToAbout?: any;
    onScrollToContributors?: any;
    onScrollToLocation?: any;
    temp?: any;
}



/**
 * Component displays the top menu section of the template
 */
const TopMenuSection: React.FC<TopMenuSectionProps> = React.memo(({ data, classPrefix, onScrollToProgram, onScrollToAbout, onScrollToContributors, onScrollToLocation }) => {

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const baseUrl = config.api.url;
    const slugName = useStore((state: any) => state?.compData?.["slugName"]?.value) || '';
    const slugInfo = useStore((state: any) => state?.compData?.['slugEventDetails']?.[`event/slug/${slugName}`]?.data) ?? [];

    const currentLink = useStore((state: any) => state?.compData?.['currentLink']?.value) || ''

    const isMobileOrTabletScreen = useIsMobileOrTabletScreen();



    function scrollToTargetLink(link: 'About' | 'Program' | 'Contributors' | 'Location') {

        if (link === 'About') {
            onScrollToAbout()
            return
        }
        if (link === 'Program') {
            onScrollToProgram()
            return
        }
        if (link === 'Contributors') {
            onScrollToContributors()
            return
        }
        if (link === 'Location') {
            onScrollToLocation()
            return
        }
    }


    useEffect(() => {
        if (currentLink) {
          const timer = setTimeout(() => {
            const element = document.getElementById(currentLink);
            if (element) {
                scrollToTargetLink(currentLink);
                clearDataById('currentLink')
                
            }
          }, 100);
      
            return () => {
                clearTimeout(timer)
            };
        }
        // ...
      }, [location, currentLink]);





    /**
     * Opens the drawer component
     */
    function handleOpenDrawer() {
        setDrawerOpen(true);
    }


    /**
     * Closes the drawer component
     */
    function handleCloseDrawer() {
        setDrawerOpen(false);
    }


    /**
     * Function navigates to the login page and stores the previous route in the store
     */
    const loginFn = () => {
        setDataById("previousRoute", { url: location.pathname });

        navigate(routes.userLogin());
    }

    /**
     * Function navigates to the signup page and stores the previous route in the store
     */
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

    /**
     * Handles the click event on a link, prevents the default anchor behavior,
     * and triggers the scroll to the "About" section.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} e - The mouse event triggered by the link click.
     */

    function handleLinkClick(value: 'About' | 'Program' | 'Contributors' | 'Location') {


        if (location?.pathname?.startsWith('/event-link')) {
            scrollToTargetLink(value)

        } else {
            setDataById('currentLink', { value: value });

            const targetRoute = `/event-link/${slugName}`

            navigate(targetRoute);


        }
        handleCloseDrawer()
    }


  



    return (
        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`}>
            <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} alignItems={'center'} className={`${classPrefix}-container`}>



                {
                    isMobileOrTabletScreen ? (
                        <>
                            <MobileNavbar classPrefix={classPrefix} data={data} slugInfo={slugInfo} handleOpenDrawer={handleOpenDrawer} />
                        </>
                    )
                        :
                        <>
                            <Grid className={`${classPrefix}-logo`}>{(data?.assetId || slugInfo?.assetId) ? <img
                                className={`${classPrefix}-logo-img`}
                                src={`${baseUrl}asset/${data?.assetId ?? slugInfo?.assetId ?? ''}`}
                            /> : <Grid></Grid>}</Grid>
                            <Grid container spacing={4}>
                                <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={() => handleLinkClick('About')}> About </Link></Grid>
                                {data?.eventSpeakers?.length > 0 && <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={() => { handleLinkClick('Contributors') }}> Contributors </Link></Grid>}
                                <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={() => { handleLinkClick('Program') }}> Programs </Link></Grid>
                                <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={() => { handleLinkClick('Location') }}> Location </Link></Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                {getUserToken() ? <Grid className={`${classPrefix}-book-button`}><CustomButton label='Logout' onClick={logoutFn} /></Grid> :
                                    <><Grid className={`${classPrefix}-login-button`}><span role='button' onClick={loginFn}> Login </span></Grid>
                                        <Grid className={`${classPrefix}-button-border`}></Grid>
                                        <Grid className={`${classPrefix}-book-button`}><CustomButton onClick={SignupFn} label='Signup'
                                        /></Grid></>}
                            </Grid>
                        </>
                }
            </Grid>

            {isMobileOrTabletScreen && <Drawer

                PaperProps={{
                    sx: {
                        width: '100%', // Makes the drawer take full width
                        maxWidth: '100%', // Ensures it doesn't exceed viewport width

                    }
                }}
                anchor="right"
                open={drawerOpen}>

                <CloseIcon onClick={handleCloseDrawer} className={`${classPrefix}-container-close-icon`} />

                <Grid container flexDirection={'column'} height={'100vh'} className={`${classPrefix}-container-drawer`} >


                    <Grid container flexDirection={'column'} rowSpacing={4}>
                        <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={() => handleLinkClick('About')}> About </Link></Grid>
                        {data?.eventSpeakers?.length > 0 && <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={() => handleLinkClick('Contributors')}> Contributors </Link></Grid>}
                        <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={() => handleLinkClick('Program')}> Programs </Link></Grid>
                        <Grid className={`${classPrefix}-sub-item`}><Link to={'#'} onClick={() => handleLinkClick('Location')}> Location </Link></Grid>
                    </Grid>

                    <Grid container spacing={2} flexDirection={'column'} marginTop={"auto"}>

                        {getUserToken() ?
                            <Grid className={`${classPrefix}-book-button`}><CustomButton fullWidth label='Logout' onClick={logoutFn} /></Grid>
                            :
                            <>
                                <Grid className={`${classPrefix}-book-button login`}><CustomButton fullWidth onClick={loginFn} label='Login' /> </Grid>
                                <Grid className={`${classPrefix}-book-button`}><CustomButton fullWidth onClick={SignupFn} label='Signup' /></Grid>
                            </>
                        }

                    </Grid>
                </Grid>

            </Drawer>}

        </Grid>)
});

export default TopMenuSection;



const MobileNavbar = React.memo(({ classPrefix, data, slugInfo, handleOpenDrawer, }: { classPrefix: any, data: any, slugInfo: any, handleOpenDrawer: () => void }) => {

    const baseUrl = config.api.url;

    return (
        <>

            <Grid className={`${classPrefix}-logo`}>

                {(data?.assetId || slugInfo?.assetId) ?
                    <img
                        className={`${classPrefix}-logo-img`}
                        src={`${baseUrl}asset/${data?.assetId ?? slugInfo?.assetId ?? ''}`}
                    />
                    :
                    <Grid></Grid>
                }

            </Grid>

            <Grid >
                <MenuIcon onClick={handleOpenDrawer} className={`${classPrefix}-burger`} />
            </Grid>
        </>
    )

}
)