import React from "react";
import Grid from '@mui/material/Grid2';
import { Box, Typography } from "@mui/material";
import StatusComponent from "@/components/Status/StatusComponent";
import moment from 'moment';

interface DashboardEventCardProps {
    event: {
        id: number;
        parentId: number | null;
        name: string;
        description: string;
        startTime: string;
        endTime: string;
        venueId: number;
        eventClass: string;
        interval: string | null;
        companyId: number;
        title: string | null;
        amount: string;
        discount: string | null;
        statusId: number;
        published: boolean;
        slugName: string | null;
        registrationDeadline: string | null;
        venue: {
            id: number;
            name: string;
            address: string;
            city: string;
            state: string;
            country: string;
            postCode: string | null;
            totalCapacity: number | null;
            mapUrl: string | null;
        };
        eventAddons: any[];
    } | null;
}
/**
 * dashbard - event details
 * @author Neethu
 */
const DashboardEventCards: React.FC<DashboardEventCardProps> = React.memo(({ event }) => {
    if (!event) {
        return (
            <Box>
                <Grid size={12}>
                    <Typography className="dashboard-left-profile-accounttitle" variant="body1">No Attended Events</Typography>
                </Grid>
                <Grid size={12}>
                    <Typography >
                        It looks like you haven’t registered for any upcoming events. Don’t miss out on exciting opportunities!
                    </Typography>
                </Grid>
            </Box>
        );
    }
    return (
        <Grid className="dashboard-left-profile-card-container">
            <Grid size={12}>
                <Typography className="dashboard-left-profile-accounttitle">
                    {event.name}
                </Typography>
            </Grid>
            <Grid size={12} mt={2} className="dashboard-left-profile-card-block" >
                Status  <StatusComponent className="status-componenet" value={event?.statusId.toString()} />
            </Grid>
            <Grid size={12} mt={2}  className="dashboard-left-profile-card-block">

                <Grid size={8} className="dashboard-left-profile-card-block-date">
                    <Typography className="dashboard-left-profile-card-block-title">
                        Date
                    </Typography>
                    <Typography className="dashboard-left-profile-card-block-content">
                        {moment(event.startTime).format('MMMM D, YYYY')} - {moment(event.endTime).format('MMMM D, YYYY')} 
                    </Typography>
                </Grid>
                <Grid size={4}>
                    <Typography className="dashboard-left-profile-card-block-title">
                        Location
                    </Typography>
                    <Typography className="dashboard-left-profile-card-block-content">
                        {event.venue.address},  {event.venue.city}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )

});

export default DashboardEventCards;