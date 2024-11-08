import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import EventCard from "../Components/EventCard";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import apiClient from "@/Libs/Https/API-client";
import {NoEventSvg} from "@/assets/svg"
import { Logger } from "@/Utils/Logger";
/**
 * 
 * @returns response interface
 */
interface EventResponse {
        details: {
            id: number;
            registrationType: string;
            eventId: number;
            amountPaid: string;
            qrCode: string | null;
            userId: number;
            participantTypeId: number;
            createdBy: number;
            createdOn: string;
            modifiedBy: number;
            modifiedOn: string;
            user: {
                id: number;
                firstName: string;
                lastName: string;
                phone: string;
                email: string;
                phoneVerified: boolean;
                isSsoUser: boolean;
                ssoMetadata: string | null;
                statusId: number | null;
                acceptedTerms: boolean | null;
            };
        };
        programs: Program[];
}

interface Program {
    id: number;
    eventId: number;
    participantId: number;
    roleName: string;
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
            mapUrl: string;
        };
        eventProgramSchedules: any[];
    };
}

const MyEventScreen: React.FC = () => {
    const { control } = useForm();
    const [searchResults, setSearchResults] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [event,setEvent]=useState<Program[]>([]);

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
             const UserId = sessionStorage.getItem("userId");
              const response = await await apiClient.get(`participant/${(query)}`, req);
              const { status, data } = await processAPIResponse(response, "eventList");
              console.log(data);
              if (status) {
            setSearchResults(data.programs);
            console.log(searchResults,"search");
            
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
            console.log(selected,'777777777777')
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
    const participantEventDetails=async()=>{
        const UserId = sessionStorage.getItem("userId");
        const response = await apiClient.get(`participant/${Number(UserId)}`);
        
        const { data } = await processAPIResponse(response, 'eventData');
        setEvent(data.programs)
    }
    const squareButtonLabels: string[] = ["View Certificate", "Event Recap"];
    const handleButtonPress = () => {
        console.log('button pressed here>>>>>>');
    }
    const handleSquareButtonClick = (index: number) => {
        console.log('Clicked label at index:', index);
        /**
         * You can add specific logic based on the index here.
         */
        if (index === 0) {
            console.log('First label clicked');
        } else if (index === 1) {
            console.log('Second label clicked');
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
  event==undefined? (
    <Grid container size={12}>
        <Grid  className="my-event-no-event" size={12}>
        <NoEventSvg className="my-event-no-event-image"/>
            </Grid> 
    </Grid>
  ) : (
    <Grid container spacing={2}>
      {event.map((event: Program, index) => (
        <Grid size={{ xs: 12, sm: 4, md: 4 }} key={index}>
          <EventCard
            eventFullData={event}
            Eventstatus={true}
            viewCertificate={true}
            viewEventRecap={true}
            squareButton={true}
            viewButton={false}
            datetitle={event.event.startTime}
            title={event?.event?.name}
            location={`${event?.event?.venue?.city}, ${event?.event?.venue?.country}`}
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