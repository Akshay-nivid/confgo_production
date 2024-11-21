/**
 * Component displays the top menu section of the template
 */
import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

type TopMenuSectionProps = {
    data?: any;
    temp: number | undefined;
}

const TopMenuSection: React.FC<TopMenuSectionProps> = React.memo(({ temp }) => {

    const classPrefix = `event-template-top-menu-${temp}`;
    const navigate = useNavigate();

    

    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`}>
        <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} alignItems={'center'} className={`${classPrefix}-container`}>
            <Grid className={`${classPrefix}-logo`}>LOGO</Grid>
            <Grid container spacing={2}>
                <Grid className={`${classPrefix}-sub-item`}><Link to={'#'}> About </Link></Grid>
                <Grid className={`${classPrefix}-sub-item`}><Link to={'#'}> Contributors </Link></Grid>
                <Grid className={`${classPrefix}-sub-item`}><Link to={'#'}> Programs </Link></Grid>
                <Grid className={`${classPrefix}-sub-item`}><Link to={'#'}> Location </Link></Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid className={`${classPrefix}-login-button`}><Link to={'/user/login'}> Login </Link></Grid>
                <Grid className={`${classPrefix}-button-border`}></Grid>
                <Grid className={`${classPrefix}-book-button`}><CustomButton label='Book Now' onClick={() => navigate('/participant/home')}/></Grid>
            </Grid>
        </Grid>
    </Grid>
});

export default TopMenuSection;
