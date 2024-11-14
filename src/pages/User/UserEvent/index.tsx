import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import EventCard from "../Components/EventCard";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import apiClient from "@/Libs/Https/API-client";
import { NoEvent } from "@/assets/svg"
import { Logger } from "@/Utils/Logger";
import React from "react";
import useStore from '@/Libs/store';
import routes from "@/router/routes";
import { useNavigate } from "react-router-dom";
import CustomModel from "@/components/CustomModel/CustomModel";
import CustomButton from "@/components/CustomButton/CustomButton";
import { CloseOutlined } from "@mui/icons-material";
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
  eventAddons: any[]; 
}

/**
 * component for show the events
 */
const MyEventScreen: React.FC = () => {
  const { control } = useForm();
  const [searchResults, setSearchResults] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const events = useStore((state: any) => state?.compData?.["userEvents"]?.['event/list']) ?? [] as Program[];
  const POST = useStore((state: any) => state.POST);
  const setDataById = useStore((state: any) => state.setDataById);
  const navigate = useNavigate();
  /**
   * model for view certificate
   */
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const closeDrawer = () => setOpen(false);
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
      const response = await await apiClient.post(`event/list`, req);
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
  const handleAutocompleteChange = async (selected: any) => {
    if (selected) {
      try {
        await POST({
          url: "event/list",
          body: {
            offset: 0,
            sortBy: "id",
            sortDirection: "DESC",
            filters: {id: selected.id},
          },
          id: 'userEvents',
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
        id: 'userEvents',
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
  const handleSquareButtonClick = (index: number, eventId: number) => {
    /**
     * You can add specific logic based on the index here.
     */
    if (index === 0) {
      setOpen(true);
    } else if (index === 1) { 
         eventRecap(eventId);
    }
  };
  /**
   * component for show the events details
   */
  const eventRecap=(eventId: number)=>{
    navigate(routes.userEventRecap(),{state:{eventId:eventId}});
  }
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
        events == undefined ? (
          <Grid container size={12} justifyContent={"center"}>
          <Grid  container justifyContent={"center"}  className="no-event" >
          <Grid>
          <NoEvent className="no-event-svg"/>
          </Grid>
          <Grid size={12} flexDirection={"column"}>
            <Typography className="no-event-svg-text">No Events Found</Typography>
            <Typography className="no-event-svg-text-description">You haven’t registered for any events yet. Explore upcoming events and secure your spot today!</Typography>
          </Grid>
              </Grid> 
        </Grid>
        ) : (
          <Grid container size={12} spacing={2}>
            {events.data && events.data.map((event: Program, index:number) => (
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
                  onSquareButtonClick={(btnIndex: number) => handleSquareButtonClick(btnIndex, event.id)}
                />
              </Grid>
            ))}
          </Grid>
        )
      }
      {/* Modal for viewing certificates  and need to add pdf after getting APi*/}
      <CustomModel
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid container className="outer-grid" size={8}>
          <Grid size={8} className="view-certificate-grid-content">
            <Grid container size={12}>
              <Grid container size={12}>
                <IconButton onClick={closeDrawer}>
                  <CloseOutlined />
                </IconButton>
              </Grid>
              <Grid size={10} alignItems={"center"} container justifyContent={"center"}>
                <Typography variant="h1" component="h2">
                  Text in a model
                </Typography>
              </Grid>
              <Grid size={2} container alignItems={"center"} justifyContent={"flex-end"}>
                <Grid>
                  <CustomButton label="Download" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CustomModel>
    </Grid>
  );
};
export default MyEventScreen;