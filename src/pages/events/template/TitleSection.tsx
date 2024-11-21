/**
 * Component displays the title section of the template
 */
import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type TitleSectionProps = {
    data?: any;
    temp: number;
}

const TitleSection: React.FC<TitleSectionProps> = React.memo(({ data, temp }) => {

    const classPrefix = `event-template-title-${temp}`;
    const navigate = useNavigate();

    return <Grid container className={`${classPrefix}`} direction={'column'} alignItems={temp === 2? 'center': 'flex-start'}>
        <Grid><Typography className={`${classPrefix}-title1`}>{data?.name}</Typography></Grid>
        {/* <Grid><Typography className={`${classPrefix}-title2`}>Annual Conference 2024</Typography></Grid>
        <Grid><Typography className={`${classPrefix}-sub-title`}>Uniting Expertise, Advance Anaesthesia Practices</Typography></Grid> */}
        <Grid><CustomButton label="Register Now" className={`${classPrefix}-register-button`} onClick={() => navigate('/participant/home')}/></Grid>
    </Grid>
});

export default TitleSection;
