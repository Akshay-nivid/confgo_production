/**
 * Component displays the title section of the template
 */
import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Typography } from '@mui/material';

type TitleSectionProps = {
    data?: any;
    temp: string;
}

const TitleSection: React.FC<TitleSectionProps> = React.memo(({ data, temp }) => {

    const classPrefix = `event-template-title-${temp}`;

    return <Grid container className={`${classPrefix}`} direction={'column'} alignItems={temp === 'temp2'? 'center': 'flex-start'}>
        <Grid><Typography className={`${classPrefix}-title1`}>{data?.name}</Typography></Grid>
        {/* <Grid><Typography className={`${classPrefix}-title2`}>Annual Conference 2024</Typography></Grid>
        <Grid><Typography className={`${classPrefix}-sub-title`}>Uniting Expertise, Advance Anaesthesia Practices</Typography></Grid> */}
        <Grid><CustomButton label="Register Now" className={`${classPrefix}-register-button`} /></Grid>
    </Grid>
});

export default TitleSection;
