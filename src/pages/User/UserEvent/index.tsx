import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import EventCard from "../Components/EventCard";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import apiClient from "@/Libs/Https/API-client";
import { NoEventSvg } from "@/assets/svg"
import { Logger } from "@/Utils/Logger";
import React from "react";
import useStore from '@/Libs/store';
/**
 * Interface for a Program, which contains the event details
 */
interface Program {
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
  eventAddons: any[]; // Change this field based on actual data structure
}

/**
 * component for show the events
 */
const MyEventScreen: React.FC = () => {
  const { control } = useForm();
  const [searchResults, setSearchResults] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Program[]>([]);
  const POST = useStore((state: any) => state.POST);
  const setDataById = useStore((state: any) => state.setDataById);
  /**
   *  Fetch event details when the component mounts
   */
  useEffect(() => {
    participantEventDetails();
  }, []);
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
        setSearchResults(data.programs);

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
      //   method: "GET",
      //   data: {
      //     offset: 0,
      //     limit: 5,
      //     filters: {
      //       id: selected.id,
      //     },
      //   },
      //   url: `event/list`,
      //   listName: "eventList",
      // });
    }
  };
  /**
   * Fetch participant event details
   */
  const participantEventDetails = async () => {
    try {
      await POST({
        url: "event/list",
        body: {
          offset: 0,
          sortBy: "id",
          sortDirection: "DESC",
          filters: {},
        },
        id: 'userLatestEvents',
        successCB: (context: any) => {
          console.log("contec ",context)
          setEvent(context.data);
        },
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
      Logger.error("An error occurred:", error);
    }
  }
  /**
    * Labels for the square buttons on each event card
    */
  const squareButtonLabels: string[] = ["View Certificate", "Event Recap"];
  /**
    * Function to handle button presses on the event cards.
    */
  const handleButtonPress = () => {
  }
  /**
    * @param index  Function to handle the event selection from the autocomplete input.
    * It updates the API request configuration based on the selected event.
    */
  const handleSquareButtonClick = (index: number) => {
    /**
     * You can add specific logic based on the index here.
     */
    if (index === 0) {
    } else if (index === 1) {
    }
  };
  return (

    <Grid className="my-event" container spacing={2}>
      <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} flexDirection={"row"}>
        <Grid size={{ xs: 6 }} >
          <Typography className="my-event-header">My Events</Typography>
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
      {
        event == undefined ? (
          <Grid container size={12}>
            <Grid justifyContent={"center"} alignContent={"center"} display={"flex"} size={12}>
              <NoEventSvg className="my-event-no-event-image" />
            </Grid>
          </Grid>
        ) : (
          <Grid container size={12} spacing={2}>
            {event.map((event: Program, index) => (
              <Grid size={{ xs: 12, sm: 4, md: 4 }} key={index}>
                <EventCard
                  eventFullData={event}
                  Eventstatus={true}
                  viewCertificate={true}
                  viewEventRecap={true}
                  squareButton={true}
                  viewButton={false}
                  datetitle={event.startTime}
                  title={event?.name}
                  location={`${event?.venue?.city}, ${event?.venue?.country}`}
                  buttonPress={handleButtonPress}
                  squareButtonLabels={squareButtonLabels}
                  onSquareButtonClick={handleSquareButtonClick}
                />
              </Grid>
            ))}
          </Grid>
        )
      }
    </Grid>
  );
};
export default MyEventScreen;