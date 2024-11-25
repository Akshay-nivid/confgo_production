/**
 * Component displays the details section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import { Typography } from '@mui/material';
import LocationIcon from '@/assets/svg/template1-location.svg';
import CalendarIcon from '@/assets/svg/template1-calendar.svg';
import EmailIcon from '@/assets/svg/template1-email.svg';
import PhoneIcon from '@/assets/svg/template1-phone.svg';
import moment from 'moment';

type DetailsSectionProps = {
    data?: any;
    temp: number;
}


/**
 * Component displays the details section of the template
 */
const DetailsSection: React.FC<DetailsSectionProps> = React.memo(({ data, temp }) => {

    const classPrefix = `event-template-details-${temp}`;

    /**
     * Method transforms the start time and end time to November 20-25, 2024 like format
     * @param startTime : start time
     * @param endTime : end time
     * @returns : November 20-25, 2024 like format
     */
    const formatDateRange = (startTime: string, endTime: string) => {
        const start = moment(startTime);
        const end = moment(endTime);

        if (start.month() === end.month() && start.year() === end.year()) {
            // Same month and year
            return `${start.format('MMMM D')}-${end.format('D, YYYY')}`;
        } else if (start.year() === end.year()) {
            // Same year but different month
            return `${start.format('MMMM D')}-${end.format('MMMM D, YYYY')}`;
        } else {
            // Different year
            return `${start.format('MMMM D, YYYY')} - ${end.format('MMMM D, YYYY')}`;
        }
    };


    const itemArray = [
        { icon: <LocationIcon />, label: 'Location', value: data?.venue?.address },
        { icon: <CalendarIcon />, label: 'Date', value: formatDateRange(data?.startTime, data?.endTime) },
        { icon: <EmailIcon />, label: 'Email', value: 'infotest@test.org' },
        { icon: <PhoneIcon />, label: 'Phone', value: '+91 1234567890' }
    ]



    return (
        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}-container`}>
            <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`} justifyContent={'center'} alignItems={'center'}>
                <Grid size={{ xs: 12, sm: 12 }} container className={`${classPrefix}-item`} spacing={1}>
                    {
                        itemArray?.map((item: any) => {
                            return <Grid container size={{ xs: 12, sm: 3 }} direction={'column'} justifyContent={temp === 2? 'center': 'flex-start'} alignItems={temp === 2? 'center': 'flex-start'}><Grid>{item.icon}</Grid>
                                <Grid><Typography className={`${classPrefix}-label`}>{item.label}</Typography></Grid>
                                <Grid><Typography className={`${classPrefix}-value`} textAlign={temp === 2? 'center': 'left'}>{item.value}</Typography></Grid>
                            </Grid>
                        })
                    }

                </Grid>
            </Grid></Grid>)
});

export default DetailsSection;
