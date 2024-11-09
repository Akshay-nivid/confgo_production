import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import EventCard from "../Components/EventCard";
import React from "react";

const MyCoupons: React.FC = React.memo(() => {

    // Sample event data
    const events = [
        { datetitle: '2023-12-15', title: 'Kick', location: 'Kannur' },
        { datetitle: '2023-12-16', title: 'React Conf', location: 'San Francisco' },
        { datetitle: '2023-12-17', title: 'Vue.js Meetup', location: 'London' },
        { datetitle: '2023-12-18', title: 'Angular Workshop', location: 'Berlin' },
        { datetitle: '2023-12-19', title: 'Node.js Seminar', location: 'New York' },
        { datetitle: '2023-12-20', title: 'JavaScript Conference', location: 'Paris' },
    ];

    return (

        <Grid className="my-coupoun" container spacing={2}>
            <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} flexDirection={"row"}>
                <Grid size={{ xs: 6 }} >
                    <Typography className="my-coupoun-header">Coupons</Typography>
                </Grid>

            </Grid>
            <Grid container spacing={2}>
                {events.map((event, index) => (
                    <Grid size={{ xs: 12, sm: 4, md: 4 }} key={index}>
                        <EventCard
                            eventFullData={event}
                            Eventstatus={false}
                            viewCertificate={true}
                            viewEventRecap={true}
                            squareButton={false}
                            viewButton={true}
                            datetitle={event.datetitle}
                            title={event.title}
                            location={event.location} squareButtonLabels={[]}                           
                        />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
});
export default MyCoupons;