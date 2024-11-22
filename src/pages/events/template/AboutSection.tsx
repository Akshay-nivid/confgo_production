/**
 * Component displays the about section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import parse from 'html-react-parser';


type AboutSectionProps = {
    data?: any;
    temp: number | undefined;
    ref?: any;
}

const AboutSection = React.memo(
    React.forwardRef<HTMLDivElement, AboutSectionProps>(({ data, temp }, ref) => {
    

    const classPrefix = `event-template-about-${temp}`;

    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`} justifyContent={'center'} alignItems={'center'} spacing={2} direction={'column'} ref={ref}>
        <Grid className={`${classPrefix}-title`}>{`Welcome to the ${data?.name}`}</Grid>
        {/* <Grid className={`${classPrefix}-sub-title`}>Connecting Minds, Shaping the future of Anaesthology.</Grid> */}
        <Grid container className={`${classPrefix}-content`} textAlign={'center'}>{data?.description && parse(data?.description)}</Grid>
    </Grid>
}));

export default AboutSection;

