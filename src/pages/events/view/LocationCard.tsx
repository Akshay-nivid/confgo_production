import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { useParams } from "react-router-dom";
import { Logger } from "@/Utils/Logger";
import useStore from "@/Libs/store";

import CustomButton from "@/components/CustomButton/CustomButton";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { CloseOutlined, SearchOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import { IconButton, Typography } from "@mui/material";
import {EditButtonIcon} from "@/assets/svg";
interface Location {
  mapUrl: string;
}

/**
 * used to list the location in map
 */
const LocationCard = () => {
  const { id } = useParams();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * useEffect hook to handle the API call
   */
  useEffect(() => {
    fetchLocationList();
  }, []);


  /**
   * fetch the venue details
   */
  const fetchLocationList = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`event/${id}`);
      const { status, data } = processAPIResponse(response, "locationList");
      if (status) {
        const locationsData = Array.isArray(data) ? data : [data];
            /**
             * Extract the URL from mapUrl, or set a default if unavailable
             */
        setLocations(
          locationsData.map((item) => {
            const mapUrl = item.venue?.mapUrl || "https://maps.google.com";
            return { mapUrl };
          })
        );
      } else {
        // If `status` is false, display an error message
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "failed",
          message: "Error in fetchinglocation",
        });
      }
    } catch (error) {
      Logger.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };
  /**
   * drawer state
   */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /**
   *   Functions to open and close the drawer.
   */
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const setDataById = useStore((state: any) => state.setDataById);
  const compData = useStore((state: any) => state.compData.event);
 

  const { control } = useForm();
  useEffect(() => {
    getLocation();
  }, []);
 /**
  * get current location
  */
  const getLocation = async () => {
    try {
      const response = await apiClient.get(`event/${id}`);
      const { data } = processAPIResponse(response, "locationList");
      const mapLocation = data.venue?.mapUrl || "https://maps.google.com";
      setDataById("editLocation", { data: mapLocation });
    } catch (error) {
      Logger.error("User Set Password Error", error);
    }
  };

  return (
    <Grid className="main-location-Grid" container >
      <Grid size={12} direction={"row"} container gap={".3rem"} >
        <Grid>
        <Typography className="location-Text">
          Location
        </Typography>
        </Grid>
        <Grid >
           <EditButtonIcon className="location-button" onClick={openDrawer}/>
        </Grid>
       
      </Grid>
      <Grid container spacing={4} className="location-grid">
        {loading ? (
          <div>Loading...</div>
        ) : (
          locations.map(({ mapUrl }) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={id}>
              {mapUrl ? (
                <iframe
                className="show-map"
                  src={mapUrl}
                  loading="lazy"
                  title={`Location ${name}`}
                />
              ) : (
                <div>No map available</div>
              )}
            </Grid>
          ))
        )}
      </Grid>
      {/*edit map drawer */}
      <CustomDrawer open={isDrawerOpen} type="right">
        <Grid container className="edit-location-container">
          <Grid container size={12}>
            <IconButton onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Grid>
          <Grid
            className="edit-location-search-container"
            container
            justifyContent={"center"}
            alignContent={"center"}
            size={10}
            marginTop={"7.1875rem"}
          >
            <CustomTextField
              className="edit-location-searchBar"
              prefixIcon={<SearchOutlined />}
              prefixIconButton={true}
              handleToggleprefixIcon={() => console.log("clicked")}
              name="Search Location"
              label="Location"
              placeholder="Enter location"
              control={control}
            />
          </Grid>
          <Grid className="edit-map-grid">
            {compData.data ? (
              <iframe
                className="edit-map"
                src={compData.data}
                loading="lazy"
              />
            ) : (
              <Grid>No map available</Grid>
            )}
          </Grid>
          <Grid container justifyContent={"flex-end"} size={10}>
            <CustomButton className="edit-location-button" label={"Submit"} />
          </Grid>
        </Grid>
      </CustomDrawer>
    </Grid>
  );
};

export default LocationCard;
