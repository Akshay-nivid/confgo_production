import React from "react";
import Grid from '@mui/material/Grid2';
import { Tooltip, Typography } from "@mui/material";
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
    return (
        <Grid className="dashboard-left-profile-card-container">
            <Grid size={12}>
                <Typography className="dashboard-left-profile-accounttitle">
                    {event?.name}
                </Typography>
            </Grid>
            <Grid size={12} mt={2} className="dashboard-left-profile-card-status" >
                Status  <StatusComponent className="status-componenet" value={event?.statusId.toString()} />
            </Grid>
            <Grid size={12} mt={2} className="dashboard-left-profile-card-block">

                <Grid size={4} className="dashboard-left-profile-card-block-date">
                    <Typography className="dashboard-left-profile-card-block-title">
                        Start Date
                    </Typography>
                    <Typography className="dashboard-left-profile-card-block-content">
                        {moment(event?.startTime).format('MMMM D, YYYY HH:MM')}
                    </Typography>
                </Grid>
                <Grid size={4} className="dashboard-left-profile-card-block-date">
                    <Typography className="dashboard-left-profile-card-block-title">
                        End Date
                    </Typography>
                    <Typography className="dashboard-left-profile-card-block-content">
                        {moment(event?.endTime).format('MMMM D, YYYY HH:MM')}
                    </Typography>
                </Grid>
                <Grid size={4}>
                    <Typography className="dashboard-left-profile-card-block-title">
                        Location
                    </Typography>
                    <Tooltip
                        title={`${event?.venue.address}, ${event?.venue.city}`}
                        arrow
                        placement="top"
                    >
                        <Typography className="dashboard-left-profile-card-block-content">
                            {`${event?.venue.address}, ${event?.venue.city}`.length > 35
                                ? `${`${event?.venue.address}, ${event?.venue.city}`.substring(0, 35)}...`
                                : `${event?.venue.address}, ${event?.venue.city}`}
                        </Typography>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    )

});

export default DashboardEventCards;