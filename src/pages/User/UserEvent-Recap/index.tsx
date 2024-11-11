import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useForm } from "react-hook-form";
import EventCard from "../Components/EventCard";
import { Logger } from "@/Utils/Logger";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import React from "react";
import CustomButton from "@/components/CustomButton/CustomButton";
/**
 * UpcomingEvent component renders a list of upcoming events and includes a search bar 
 */
const UpcomingEvents: React.FC = React.memo(() => {
    const { control } = useForm();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [source, setSource] = useState<any>([])
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

    /**
   * Function to handle search API for autocomplete
   *  New handler for when an event is selected from autocomplete
   * @param selected
   */
    const handleAutocompleteChange = (selected: any) => {
        if (selected) {
            // setSource({
            //     method: "GET",
            //     data: {
            //         offset: 0,
            //         limit: 5,
            //         filters: {
            //             id: selected.id,
            //         },
            //     },
            //     url: `event/list`,
            //     listName: "eventList",
            // });
        }
    };
    /**
     *  * Sample event data for testing or demonstration purposes.
     */
    const events = [
        { datetitle: '2023-12-15', title: 'Kick', location: 'Kannur' },
        { datetitle: '2023-12-16', title: 'React Conf', location: 'San Francisco' },
        { datetitle: '2023-12-17', title: 'Vue.js Meetup', location: 'London' },
        { datetitle: '2023-12-18', title: 'Angular Workshop', location: 'Berlin' },
        { datetitle: '2023-12-19', title: 'Node.js Seminar', location: 'New York' },
        { datetitle: '2023-12-20', title: 'JavaScript Conference', location: 'Paris' },
    ];
  
    return (

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
            <Grid container spacing={2}>
               <Grid className="event-recap-first-grid">
           <Typography className="event-recap-first-grid-text">
           Green Energy Summit
           </Typography>
               </Grid>
               <Grid className="event-recap-first-grid-status" justifyContent={"centre"} alignItems={"center"}>
               <Typography className="event-recap-first-grid-status-text">register</Typography>
               </Grid>
               <Grid size={12}>
                <Typography className="event-recap-first-grid-address" >
                    March 5, 2024 | 9:00 AM - 5:00 PM | Grand City Convention Center</Typography>
               </Grid>
               <Grid size={12} className="event-recap-first-grid-buttons">
               <Button className="event-recap-first-grid-buttons-firstButton">
                  View Ticket
               </Button>
               </Grid>
            </Grid>
        </Grid>
    );
});
export default UpcomingEvents;