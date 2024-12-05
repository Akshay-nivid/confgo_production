/**
 * Component displays the header section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import TopMenuSection from './TopMenuSection';
import Temp1PhotoIcon from '@/assets/png/template1-photo.png';
import Temp3PhotoIcon from '@/assets/png/template3-photo.png';
import TitleSection from './TitleSection';
import DetailsSection from './DetailsSection';

type HeaderSectionProps = {
    data?: any;
    temp: number | undefined;
    onScrollToProgram?: any;
    onScrollToAbout?: any;
    onScrollToContributors?: any;
    onScrollToTier?:any
}

/**
 * Component displays the header section of the template
 */
const HeaderSection: React.FC<HeaderSectionProps> = React.memo(({ data, temp, onScrollToProgram, onScrollToAbout, onScrollToContributors,onScrollToTier }) => {

    const classPrefix = `event-template-header-${temp}`;

    return <Grid container size={{ xs: 12, sm: 12 }} className={classPrefix}>
        <TopMenuSection temp={temp} data={data} onScrollToProgram={onScrollToProgram} onScrollToAbout={onScrollToAbout} onScrollToContributors={onScrollToContributors}/>
        <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} direction={'row'}>
            {(temp == 1 || temp == 3) && <><Grid container className={`${classPrefix}-title-container`} size={{ xs: 12, sm: 6 }} alignItems={'center'}><TitleSection onScrollToTier={onScrollToTier} temp={temp} data={data} /></Grid>
            <Grid className={`${classPrefix}-photo-container`} size={{ xs: 12, sm: 6 }}><img src={temp == 1? Temp1PhotoIcon: Temp3PhotoIcon} alt="Template 1 Photo" /></Grid>
            <Grid size={{ xs: 12, sm: 12 }}><DetailsSection temp={temp} data={data} /></Grid></>}
            {temp == 2 && <><Grid container className={`${classPrefix}-title-container`} size={{ xs: 12, sm: 12 }} alignItems={'center'} justifyContent={'center'}><TitleSection onScrollToTier={onScrollToTier} temp={temp} data={data} /></Grid>
            <Grid size={{ xs: 12, sm: 12 }}><DetailsSection temp={temp} data={data} /></Grid>
            </>}
        </Grid>
    </Grid>
});

export default HeaderSection;
