import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useForm } from "react-hook-form";
import EventCard from "../Components/EventCard";

const MyEventScreen: React.FC = () => {
    const { control } = useForm();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    /**
  * Function to handle search API for autocomplete
  */
    const handleSearch = async (query: string) => {
        // setLoading(true);
        try {
            let req: any = {
                filters: {
                    name: query,
                },
            };
            //   const response = await await apiClient.get(`event/list`, req);
            //   const { status, data } = await processAPIResponse(response, "eventList");
            //   if (status) {
            // setSearchResults(data);
            //   }
            // Update the options based on API response
        } catch (error) {
            //   Logger.error(error, "EventList.tsx");
        } finally {
            //   setLoading(false);
        }
    };

    /**
   * Function to handle search API for autocomplete
   *  New handler for when an event is selected from autocomplete
   * @param selected
   */
    const handleAutocompleteChange = (selected: any) => {
        if (selected) {
            //   setSource({
            //     method: "GET",
            //     data: {
            //       offset: 0,
            //       limit: 5,
            //       filters: {
            //         id: selected.id, // Assuming the selected event has an 'id'
            //       },
            //     },
            //     url: `event/list`,
            //     listName: "eventList",
            //   });
        }
    };
    // Sample event data
    const events = [
        { datetitle: '2023-12-15', title: 'Kick', location: 'Kannur' },
        { datetitle: '2023-12-16', title: 'React Conf', location: 'San Francisco' },
        { datetitle: '2023-12-17', title: 'Vue.js Meetup', location: 'London' },
        { datetitle: '2023-12-18', title: 'Angular Workshop', location: 'Berlin' },
        { datetitle: '2023-12-19', title: 'Node.js Seminar', location: 'New York' },
        { datetitle: '2023-12-20', title: 'JavaScript Conference', location: 'Paris' },
    ];
    const squareButtonLabels: string[] = ["View Certificate", "Event Recap"];
    const handleButtonPress = () => {
        console.log('button pressed here>>>>>>')
    }
    const handleSquareButtonClick = (index: number) => {
        console.log('Clicked label at index:', index);
        // You can add specific logic based on the index here.
        if (index === 0) {
            console.log('First label clicked');
        } else if (index === 1) {
            console.log('Second label clicked');
        }
    };
    return (

        <Grid className="my-coupoun" container spacing={2}>
            <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} flexDirection={"row"}>
                <Grid size={{ xs: 6 }} >
                    <Typography className="my-coupoun-header">Coupons</Typography>
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
                            location={event.location}
                            buttonPress={handleButtonPress}
                            squareButtonLabels={squareButtonLabels}
                            onSquareButtonClick={handleSquareButtonClick}
                        />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};
export default MyEventScreen;