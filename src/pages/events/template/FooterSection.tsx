/**
 * Component displays the footer section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import LogoIcon from '@/assets/svg/template1-logo.svg';
import FacebookIcon from '@/assets/svg/template1-facebook.svg';
import InstagramIcon from '@/assets/svg/template1-instagram.svg';
import TwitterIcon from '@/assets/svg/template1-twitter.svg';
import { Link } from 'react-router-dom';


type FooterSectionProps = {
    data?: any;
    temp: string;
}

const FooterSection: React.FC<FooterSectionProps> = React.memo(({ temp }) => {

    const classPrefix = `event-template-footer-${temp}`;

    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`} spacing={1}>
        <Grid size={{ xs: 12, sm: 4 }} container justifyContent={'center'} alignItems={'center'} direction={'column'}>
            <Grid className={`${classPrefix}-logo`}><LogoIcon /></Grid>
            <Grid className={`${classPrefix}-social-media`} container direction={'row'}>
                <Grid><FacebookIcon /></Grid>
                <Grid><InstagramIcon /></Grid>
                <Grid><TwitterIcon /></Grid>
            </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 3 }} container justifyContent={'center'} direction={'column'}>
            <Grid container direction={'row'} size={{ xs: 12, sm: 12}}>
                <Grid size={{ xs: 6, sm: 6}}>Torch club 18 waverly</Grid>
                <Grid size={{ xs: 6, sm: 6}}>04072701371</Grid>
            </Grid>
            <Grid container direction={'row'} size={{ xs: 12, sm: 12 }}>
                <Grid  size={{ xs: 6, sm: 6}}>Newyork, NY 10003, USA</Grid>
                <Grid  size={{ xs: 6, sm: 6}}>support@config.co</Grid>
            </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 2 }} container justifyContent={'center'} direction={'column'}>
            <Grid container direction={'row'} size={{ xs: 12, sm: 12}}>
                <Grid size={{ xs: 6, sm: 6}}><Link to={'#'}>Home</Link></Grid>
                <Grid size={{ xs: 6, sm: 6}}><Link to={'#'}>About us</Link></Grid>
            </Grid>
            <Grid container direction={'row'} size={{ xs: 12, sm: 12 }}>
                <Grid  size={{ xs: 6, sm: 6}}><Link to={'#'}>Features</Link></Grid>
                <Grid  size={{ xs: 6, sm: 6}}><Link to={'#'}>Contact</Link></Grid>
            </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 1 }}></Grid>
    </Grid>
});

export default FooterSection;

