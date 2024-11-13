import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { Button, CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Logger } from "@/Utils/Logger";
import apiClient from "@/Libs/Https/API-client";
import { formatDateDayMonthYear, formatTimeRange, processAPIResponse } from "@/Utils/CommonBaseClass";
import React from "react";
import useStore from "@/Libs/store";
import StatusComponent from "@/components/Status/StatusComponent";
import { useLocation } from "react-router-dom";

/**
 * UpcomingEvent component renders a list of upcoming events and includes a search bar 
 */
const EventRecap: React.FC = React.memo(() => {
    const { control } = useForm();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const setDataById = useStore((state: any) => state.setDataById);
    const {eventId} = useLocation().state || {};
     const [source, setSource] = useState<any>([])
    const GET = useStore((state: any) => state.GET);
    const [eventLoading, setEventLoading] = useState(true);
    const eventData = useStore((state: any) => state?.compData?.["EventDetailsResponse"]?.[`event/${eventId}`]) ?? [];

    /**
    * Function to handle search API for autocomplete
    */
    const handleSearch = async (query: string) => {
        setLoading(true);
        try {
            let req: any = {
                filters: {
                    name: query,
                },
            };
            const response = await await apiClient.get(`event/list`, req);
            const { status, data } = await processAPIResponse(response, "eventList");
            if (status) {
                setSearchResults(data);
            }

        } catch (error) {
            Logger.error(error, "EventList.tsx");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        EventDetails(); // pass `id` to the async function
    }, []); //

    /**
   * Function to handle search API for autocomplete
   *  New handler for when an event is selected from autocomplete
   * @param selected
   */
    const handleAutocompleteChange = (selected: any) => {
        if (selected) {
            setSource({
                method: "GET",
                data: {
                    offset: 0,
                    limit: 5,
                    filters: {
                        id: selected.id,
                    },
                },
                url: `event/list`,
                listName: "eventList",
            });
        }
    };
    /**
     * get evenet details
     */
    const EventDetails = async () => {
        setEventLoading(true);
        try {
            await GET({
                url:   `event/${eventId}`,
                body: {},
                id: 'EventDetailsResponse',
                errorCB: (context: any) => {
                  setDataById("snackBarInfo", {
                    open: true,
                    autoHideDuration: 2000,
                    severity: "error",
                    message: context?.message,
                  });
                },
              });
        } catch (error) {
            Logger.error(error, "EventDetails");
        } finally {
            setEventLoading(false);
        }
    };
    return (
        <>
            {eventLoading ? (
                <CircularProgress />
            ) : (
                <Grid className="event-recap" container spacing={2}>
                    <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} flexDirection={"row"}>
                        <Grid size={{ xs: 6 }} >
                            <Typography className="event-recap-header">My Events</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <CustomAutocomplete
                                name="search"
                                className="custom-search-text-field"
                                control={control}
                                options={searchResults}
                                getOptionLabel={(option: any) => option.name || ""}
                                onSearch={handleSearch}
                                loading={loading}
                                onChange={handleAutocompleteChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid container size={12}>
                            <Grid>
                                <Typography className="event-recap-first-grid-text">
                                    {eventData?.data?.name}
                                </Typography>
                            </Grid>
                            <Grid  >
                                <Typography className="event-recap-first-grid-status-text">
                                    <StatusComponent className="event-recap-first-grid-status" value={eventData?.data?.statusId.toString()} />
                                </Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography className="event-recap-first-grid-address" >
                                    {formatDateDayMonthYear(eventData?.data?.startTime)}|{formatTimeRange(eventData?.data?.startTime, eventData?.data?.endTime)}|{eventData?.data?.venue.city + "," + eventData?.data?.venue.address}</Typography>
                            </Grid>
                            <Grid size={12} className="event-recap-first-grid-buttons">

                                <Button className="event-recap-first-grid-buttons-firstButton">
                                    View Ticket
                                </Button>
                                <Button className="event-recap-first-grid-buttons-secondButton">
                                    cansel Event
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid className="event-recap-second-grid" container size={12}>
                        <Grid size={12}>
                            <Typography className="event-recap-second-grid-text">
                                Registered Programmes
                            </Typography>
                        </Grid>
                        {eventData?.data?.programs.map((item: any) => (
                            <Grid size={4} container flexDirection={"row"} className="event-recap-second-grid-content">
                                <Grid size={6} className="event-recap-second-grid-content-time" >
                                    <Typography className="event-recap-second-grid-content-time-text">{formatTimeRange(item.startTime, item.endTime)}</Typography>
                                </Grid>
                                <Grid className="event-recap-second-grid-content-status" size={6}>
                                    <Typography className="event-recap-second-grid-content-status-text">
                                        <StatusComponent className="event-recap-first-grid-status"   value={item?.statusId.toString()} />
                                    </Typography>
                                </Grid>
                                <Grid className="event-recap-second-grid-content-title" size={12} >
                                    <Typography className="event-recap-second-grid-content-title-text">{item.name}</Typography>
                                </Grid>
                                <Grid className="event-recap-second-grid-content-location" size={12} >
                                    <Typography className="event-recap-second-grid-content-location-text">Location:{eventData.data.venue.city + "," + eventData.data.venue.country}</Typography>
                                </Grid>
                                <Grid className="event-recap-second-grid-content-speaker" size={12} >
                                    <Typography className="event-recap-second-grid-content-speaker-text">Speaker:swayer</Typography>
                                </Grid>

                            </Grid>
                        ))}

                    </Grid>

                </Grid>
            )}
        </>
    );
});
export default EventRecap;


