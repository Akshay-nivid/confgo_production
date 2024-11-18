/**
 * Component displays the header section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import TopMenuSection from './TopMenuSection';
import PhotoIcon from '@/assets/png/template1-photo.png';
import TitleSection from './TitleSection';
import DetailsSection from './DetailsSection';

type HeaderSectionProps = {
    data?: any;
    temp: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = React.memo(({ data, temp }) => {

    const classPrefix = `event-template-header-${temp}`;

    return <Grid container size={{ xs: 12, sm: 12 }} className={classPrefix}>
        <TopMenuSection temp={temp} data={data} />
        <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} direction={'row'}>
            <Grid container className={`${classPrefix}-title-container`} size={{ xs: 12, sm: 6 }} alignItems={'center'}><TitleSection temp={temp} data={data} /></Grid>
            <Grid className={`${classPrefix}-photo-container`} size={{ xs: 12, sm: 6 }}><img src={PhotoIcon} alt="Template 1 Photo" /></Grid>
            <Grid size={{ xs: 12, sm: 12 }}><DetailsSection temp={temp} data={data} /></Grid>
        </Grid>
    </Grid>
});

export default HeaderSection;
