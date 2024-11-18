/**
 * Component displays the program section of the template
 */
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import moment from 'moment';
import React from 'react';
import ClockIcon from '@/assets/svg/template1-clock.svg';

type ProgramSectionProps = {
    data?: any;
    temp: string;
}

const ProgramSection: React.FC<ProgramSectionProps> = React.memo(({ data, temp }) => {

    const classPrefix = `event-template-program-${temp}`;

    /**
     * Method groups the program based on date and sort based on time
     * @param programs : program data
     * @returns : grouped array based on date and sort based on time
     */
    const groupProgramsByDate = (programs: any[]) => {
        if (!programs) return {};

        const sortedPrograms = [...programs].sort((a, b) =>
            moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
        );

        const grouped = sortedPrograms.reduce((acc: any, program: any) => {
            const date = moment(program.startTime).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(program);
            return acc;
        }, {});

        return grouped;
    };

    const groupedPrograms = groupProgramsByDate(data?.programs);

    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`} spacing={1} direction={'column'} justifyContent={'center'} alignItems={'center'}>
        <Grid className={`${classPrefix}-title`}>Event Program Schedule</Grid>

        {Object.entries(groupedPrograms).map(([date, programs]: any, index: number) => (
            <Grid container size={{ xs: 12, sm: 12 }} key={date} direction={'column'} justifyContent={'center'} alignItems={'center'} spacing={2}>
                <Grid className={`${classPrefix}-item-day`}>
                    <Typography>{`Day ${String(index + 1).padStart(2, "0")} - ${moment(date).format("MMMM D, YYYY")}`}</Typography>
                </Grid>
                <Grid container spacing={2} direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    {programs?.map((program: any) => (
                        <Grid key={program.id} container className={`${classPrefix}-item-group-container`} direction={'row'}>

                            <Grid container direction={'row'} justifyContent={'center'} alignItems={'center'} >
                                <Grid container direction={'row'} justifyContent={'center'} alignItems={'center'} className={`${classPrefix}-item-time-container`}>
                                    <Grid><ClockIcon /></Grid>
                                    <Grid><Typography>{`${moment(program.startTime).format('hh:mm A')} - ${moment(program.endTime).format('hh:mm A')}`}</Typography></Grid>
                                </Grid>
                            </Grid>
                            <Grid container direction={'column'} className={`${classPrefix}-item-name-container`} >
                                <Grid>
                                    <Typography className={`${classPrefix}-item-name`}>{program.name}</Typography>
                                </Grid>
                                <Grid>
                                    <Typography className={`${classPrefix}-item-description`}>{program.description}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        ))}

    </Grid>
});

export default ProgramSection;

