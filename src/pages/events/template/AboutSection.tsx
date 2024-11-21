/**
 * Component displays the about section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import parse from 'html-react-parser';


type AboutSectionProps = {
    data?: any;
    temp: number | undefined;
}

const AboutSection: React.FC<AboutSectionProps> = React.memo(({ data, temp }) => {

    const classPrefix = `event-template-about-${temp}`;

    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`} justifyContent={'center'} alignItems={'center'} spacing={2} direction={'column'}>
        <Grid className={`${classPrefix}-title`}>{`Welcome to the ${data?.name}`}</Grid>
        {/* <Grid className={`${classPrefix}-sub-title`}>Connecting Minds, Shaping the future of Anaesthology.</Grid> */}
        <Grid container className={`${classPrefix}-content`} textAlign={'center'}>{data?.description && parse(data?.description)}</Grid>
    </Grid>
});

export default AboutSection;

