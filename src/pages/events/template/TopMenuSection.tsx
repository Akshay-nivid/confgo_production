/**
 * Component displays the top menu section of the template
 */
import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Link } from 'react-router-dom';

type TopMenuSectionProps = {
    data?: any;
    temp: string;
}

const TopMenuSection: React.FC<TopMenuSectionProps> = React.memo(({ temp }) => {

    const classPrefix = `event-template-top-menu-${temp}`;

    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`}>
        <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} alignItems={'center'} className={`${classPrefix}-container`}>
            <Grid className={`${classPrefix}-logo`}>LOGO</Grid>
            <Grid container spacing={2}>
                <Grid className={`${classPrefix}-sub-item`}><Link to={'#'}> Speakers </Link></Grid>
                <Grid className={`${classPrefix}-sub-item`}><Link to={'#'}> Sponsors </Link></Grid>
                <Grid className={`${classPrefix}-sub-item`}><Link to={'#'}> Programmes </Link></Grid>
                <Grid className={`${classPrefix}-sub-item`}><Link to={'#'}> Location </Link></Grid>
                <Grid className={`${classPrefix}-sub-item`}><Link to={'#'}> FAQ </Link></Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid className={`${classPrefix}-login-button`}><Link to={'#'}> Login </Link></Grid>
                <Grid className={`${classPrefix}-button-border`}></Grid>
                <Grid className={`${classPrefix}-book-button`}><CustomButton label='Book Now' /></Grid>
            </Grid>
        </Grid>
    </Grid>
});

export default TopMenuSection;
