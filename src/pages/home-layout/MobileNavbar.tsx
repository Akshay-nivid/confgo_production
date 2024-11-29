import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { AppThemeLogo, CloseIcon, HamburgerIcon } from '@/assets/svg';
import CustomDrawer from '@/components/CustomDrawer/CustomDrawer';
import routes from '@/router/routes';
import { useNavigate } from 'react-router-dom';
import CustomButton from '@/components/CustomButton/CustomButton';
import clsx from 'clsx';

/**
 * Component used to draw nav bar for mobile
 */
const MobileNavbar: React.FC<any> = React.memo(() => {
    const [openDrawer, setDrawerOpen] = useState(false);

    /**
     * Method used to handle hamburger icon click
     */
    const handleIconClick = () => {
        setDrawerOpen(!openDrawer)
    }
    return (
        <>
            <Grid container size={12} className="mobile-navbar">
                <Grid container alignItems={'center'} className="logo-container" size={10}>
                    <AppThemeLogo className='logo' />
                </Grid>
                <Grid container alignItems={'center'} onClick={handleIconClick}>
                    <HamburgerIcon className='hamburger-icon' />
                </Grid>
            </Grid>
            <CustomDrawer
                open={openDrawer}
                className='mobile-drawer'
                type="right"
                children={<Drawer />}
                onClose={handleIconClick}
            />
        </>
    )
})

export default MobileNavbar;

/**
 * Drawer component
 */
export const Drawer: React.FC<any> = React.memo(() => {
    const navigate = useNavigate();

    const options = [
        { title: 'Home', link: routes.home() },
        { title: 'Pricing', link: routes.pricing() },
        { title: 'Contact Us', link: routes.contact() }
    ]

    /**
     * Method used to handle navigate
     * @param link 
     */
    const handleNavigate = (link: string) => {
        navigate(link)
    }
    return (
        <Grid container size={12}>
            <Grid container size={12} justifyContent={'flex-end'} alignItems={'center'} alignContent={'center'} className='drawer-close-icon'>
                <CloseIcon />
            </Grid>
            <Grid className='drawer-container'>
                {options?.map((item: any) => {
                    return (
                        <Grid onClick={() => handleNavigate(item?.link)} className="drawer-link">
                            {item?.title}
                        </Grid>
                    )
                })}
                <Grid container size={12} spacing={3} className="button-container">
                    <CustomButton
                        label={'Login'}
                        className={clsx("login-button")}
                        onClick={() => handleNavigate(routes.loginOrg())}
                    />
                    <CustomButton
                        label={'Sign up'}
                        className={clsx('signup-button')}
                        onClick={() => handleNavigate(routes.register())}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
})
