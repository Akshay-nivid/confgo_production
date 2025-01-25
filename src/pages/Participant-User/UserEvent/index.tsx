import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import EventCard from "../Components/EventCard";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import apiClient from "@/Libs/Https/API-client";
import { Logger } from "@/Utils/Logger";
import React from "react";
import useStore, {IStoreState } from '@/Libs/store';
import CustomModel from "@/components/CustomModel/CustomModel";
import CustomButton from "@/components/CustomButton/CustomButton";
import { CloseOutlined } from "@mui/icons-material";
import NoEvents from "../No-Event/NoEvent";
import { IEvent } from "@/Libs/type";
import { SkeletonList } from "@/components/Skeleton";


/**
 * component for show the events
 */
const MyEventScreen = () => {
  const { control } = useForm();
  const [searchResults, setSearchResults] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const POST = useStore((state: any) => state.POST);
  const setDataById = useStore((state: any) => state.setDataById);
  const events = useStore((state: IStoreState) => state?.compData.usersEvents?.["event/registered/eventList"]?.data) ?? []
  const dataLength =useStore((state: IStoreState) => state?.compData.usersEvents?.["event/registered/eventList"]?.data?.length) //seperate variable because even if there is data the page first shows no event component first 
  /**
  *  events shown on screen descending order of date
  */
 const validEvents = events?.filter((event: any) => event.startTime && !isNaN(new Date(event.startTime).getTime()));
  const sortedData = [...validEvents]?.sort((a: any, b: any) => {
    const dateA = new Date(a.startTime).getTime();
    const dateB = new Date(b.startTime).getTime();
    return dateB - dateA;
  });
 
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
        setLoading(true);
        await POST({
          url: "event/registered/eventList",
          body: {
            offset: 0,
            sortBy: "id",
            sortDirection: "DESC",
            filters: {id: selected.id},
          },
          id: 'usersEvents',
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
      finally{
        setLoading(false);
      }
    }
  };
  /**
   * Fetch participant event details
   */
  const participantEventDetails = async () => {
    try {
      setLoading(true);
      await POST({
        url: "event/registered/eventList",
        id: 'usersEvents',
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
    finally{
      setLoading(false);
    }
  }
  /**
    * Labels for the square buttons on each event card
    */
  const squareButtonLabels: string[] = ["View Certificate"];
  /**
    * Function to handle button presses on the event cards.
    */
  const handleButtonPress = () => {
  }
  /**
    * @param index  Function to handle the event selection from the autocomplete input.
    * It updates the API request configuration based on the selected event.
    */
  const handleSquareButtonClick = () => {
      setOpen(true);
  };
  return (
    <Grid className="my-event" spacing={1} container >
      <Grid container  size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} flexDirection={"row"} >
        <Grid size={{ xs: 5 }} alignContent={"center"} container>
          <Typography className="my-event-header">My Events</Typography>
        </Grid>
        <Grid size={{ xs: 5}} className="autocomplete-border">
          <CustomAutocomplete
            name="search"
            className="custom-search-event-text-field"
            control={control}
            options={searchResults}
            getOptionLabel={(option: any) => option.name || ""}
            onSearch={handleSearch}
            loading={loading}
            placeholder="Search"
            onChange={handleAutocompleteChange}
          />
        </Grid>
      </Grid>
      {loading ? (
      <SkeletonList height={20} className="mt-4" />
      ):
      !loading && dataLength === 0  ? (
       <NoEvents description="You haven’t registered for any events yet. Explore upcoming events and secure your spot today!"  title="No Events Found"/>
        ) : (
          <Grid container size={12} mt={2} spacing={2}>
            {sortedData?.map((event: IEvent, index:number) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <EventCard
                  eventFullData={event}
                  Eventstatus={true}
                  viewCertificate={true}
                  viewEventRecap={true}
                  squareButton={true}
                  viewButton={false}
                  datetitle={{ startTime: event?.startTime, endTime: event?.endTime }}
                  title={event?.name}
                  location={`${event?.venue?.city}, ${event?.venue?.country}`}
                  buttonPress={handleButtonPress}
                  squareButtonLabels={squareButtonLabels}
                  id={event.id}
                  onSquareButtonClick={(_btnIndex: number) => handleSquareButtonClick()}
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