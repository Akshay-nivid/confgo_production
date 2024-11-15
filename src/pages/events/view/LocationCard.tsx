import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
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
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
interface LocationCardProps {
  data?: string;
}
/**
 * used to list the location in map
 */
const LocationCard = ({ data }: LocationCardProps) => {
  console.log(data,'mapppppppp')
  /**
   * Define the coordinates type
    */ 
interface Coordinates {
  lat: number;
  lng: number;
}

  /**
   * State to store map coordinates
   * Initially set to null until fetched from the Google Maps API.
   */
const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
 
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
  // const compData = useStore((state: any) => state.compData.editLocation);

  const [loading, setLoading] = useState(false);

const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';  // Replace with your actual API key
  const { control } = useForm();
  useEffect(() => {
    getLocation();
  }, []);
 /**
  * get current location
  */
  const getLocation = async () => {
    setLoading(true);
    try {
      setDataById("editLocation", { data: data });
      await fetchCoordinates(data);
    } catch (error) {
      Logger.error("User Set Password Error", error);
    } finally {
      setLoading(false);
    }
  };

   /**
   * Function to fetch coordinates from the Google Maps API
   * @param mapLocation - Location name or address to fetch coordinates for
   */
  const fetchCoordinates = async (mapLocation?:string) => {
    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        mapLocation??""
      )}&key=${GOOGLE_API_KEY}`;

      const response = await axios.get(geocodeUrl);
      console.log("kdjwkjwkres",response);
      
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        setCoordinates({ lat, lng });
      } else {
        console.error("No coordinates found for the link");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };


  return (
    <Grid className="main-location-Grid" container >
      <Grid size={12} direction={"row"} container gap={".3rem"} >
       
        <Grid>
        <Typography className="main-location-Grid-location-Text">
          Location
        </Typography>
        </Grid>
        <Grid >
           <EditButtonIcon className="main-location-Grid-location-button" onClick={openDrawer}/>
        </Grid>
        <Grid size={12} container>
        <Grid size={12}className="main-location-Grid-address">
          <Typography className="main-location-Grid-address-title" >Address Line</Typography> 
          <Typography className="main-location-Grid-address-title-description">here i am </Typography>
        </Grid>
        <Grid size={12}className="main-location-Grid-address">
        <Typography className="main-location-Grid-address-title" >City</Typography> 
          <Typography className="main-location-Grid-address-title-description">here i am </Typography>
        </Grid>
        <Grid size={12}className="main-location-Grid-address">
          <Typography className="main-location-Grid-address-title" >State/Province</Typography> 
          <Typography className="main-location-Grid-address-title-description">here i am </Typography>
        </Grid>
        <Grid size={12}className="main-location-Grid-address">
          <Typography className="main-location-Grid-address-title" >ZIP/Postal Code</Typography> 
          <Typography className="main-location-Grid-address-title-description">here i am </Typography>
        </Grid>
        <Grid size={12}className="main-location-Grid-address">
          <Typography className="main-location-Grid-address-title" >Country</Typography> 
          <Typography className="main-location-Grid-address-title-description">here i am </Typography>
        </Grid>
        
    
       </Grid>
      </Grid>
      <Grid container spacing={4} className="location-grid">
      {loading ? (
          <div>Loading...</div>
        ) : coordinates ? (
          <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={coordinates}
              zoom={12}
            >
              <Marker position={coordinates}/>
            </GoogleMap>
          </LoadScript>
        ) : (
          <div>No map available</div>
        )}
      </Grid>
      <Grid size={12} container className="nearby-location-grid">
        <Grid flexDirection={"row"} container >
          <Typography className="title">Nearby Landmarks Section</Typography>
          <EditButtonIcon className="main-location-Grid-location-button" onClick={openDrawer}/>
        </Grid>
        <Grid size={12} container>
        <Grid size={12}className="address">
          <Typography className="main-location-Grid-address-title">Nearest Railway Station</Typography> 
          <Grid container flexDirection={"column"} className="nearby-location-description">
          <Typography className="main-location-Grid-address-title-description">here i am </Typography>
          <Typography className="main-location-Grid-address-title-description">here too </Typography>
          </Grid>
        </Grid>
        <Grid size={12}className="address">
        <Typography className="main-location-Grid-address-title" >Nearest Airport</Typography> 
        <Grid container flexDirection={"column"} className="nearby-location-description">
          <Typography className="main-location-Grid-address-title-description">here i am </Typography>
          <Typography className="main-location-Grid-address-title-description">here too </Typography>
          </Grid>
        </Grid>
        <Grid size={12}className="address">
          <Typography className="main-location-Grid-address-title" >Recommended Hotels</Typography> 
          <Grid container flexDirection={"column"} className="nearby-location-description">
          <Typography className="main-location-Grid-address-title-description">here i am </Typography>
          <Typography className="main-location-Grid-address-title-description">here too </Typography>
          </Grid>
        </Grid>
        <Grid size={12}className="address">
          <Typography className="main-location-Grid-address-title" >Local Transit</Typography> 
          <Grid container flexDirection={"column"} className="nearby-location-description">
          <Typography className="main-location-Grid-address-title-description">here i am </Typography>
          <Typography className="main-location-Grid-address-title-description">here too </Typography>
          </Grid>
        </Grid>
        
    
       </Grid>
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
          <Grid className="edit-location-container-edit-map-grid">
          {coordinates ?(
              <iframe
                className="edit-location-container-edit-map"
                src={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`}
                loading="lazy"
              />
            ) : (
              <div>No map available</div>
            )}
                    </Grid>
          <Grid container justifyContent={"flex-end"} size={10}>
            <CustomButton className="edit-location-container-edit-location-button" label={"Submit"} />
          </Grid>
        </Grid>
      </CustomDrawer>
    </Grid>
  );
};

export default LocationCard;


