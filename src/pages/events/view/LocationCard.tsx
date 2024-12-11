import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { Logger } from "@/Utils/Logger";
//import useStore from "@/Libs/store";
// import CustomButton from "@/components/CustomButton/CustomButton";
// import CustomTextField from "@/components/CustomTextfield/CustomTextField";
// import { CloseOutlined, SearchOutlined } from "@mui/icons-material";
// import { useForm } from "react-hook-form";
// import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
// import { IconButton } from "@mui/material";
import {Typography} from "@mui/material"
// import {EditButtonIcon} from "@/assets/svg";
 import axios from "axios";
import { GoogleMap, LoadScript,Marker } from '@react-google-maps/api';
//const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as any;
import config from "../../../../config.json";
//import apiClient from "@/Libs/Https/API-client";
//import { State } from "country-state-city";
 interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  mapUrl:string;
  postalCode:string;
  country:string
}
/**
 * Interface for props
 */
interface LocationCardProps{
  data?: Venue;
}

/**
 * Define the coordinates type 
 */
interface Coordinates {
  lat : number
  lng : number
}

/**
 * Component to list the location on a map
 */
const LocationCard = ({ data }: LocationCardProps) => { 

  const [countryName, setCountryName] = useState<any>(data?.country);

  /**
   * Define an asynchronous function to fetch the country name by country code
   */
  useEffect(() => {
    const fetchCountryName = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${data?.country}`);
        const datas = await response.json();
        if (datas && datas[0]?.name?.common) {
          setCountryName(datas[0].name.common);
        }
      } catch (error) {
        Logger.error("Error fetching country name:", error);
      }
    };

    fetchCountryName();
  }, [data?.country]);

  /**
   * Fetch all states for the given country code using a library function (State.getStatesOfCountry)
   * and find the state that matches the given state code (data.state)
   */
  // const getStateNameByCode = (countryCode: any, stateCode: any) => {
  //   const states = State.getStatesOfCountry(countryCode); // Fetch all states for the given country
  //   const matchedState = states?.find((state: any) => state.isoCode === stateCode); // Find state by isoCode
  //   return matchedState?.name || null; // Return the state name or null if not found
  // };
  // const stateName = getStateNameByCode(data?.country,data?.state);
  

  /**
   * State to store map coordinates
   * Initially set to null until fetched from the Google Maps API.
   */
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  // const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const { control } = useForm();
   //const setDataById = useStore((state: any) => state.setDataById);
  /**
   *GOOGLE_API_KEY
   */
   const GOOGLE_API_KEY = config?.google_api_key; 
  
  /**
   * Function to open and close the drawer
   */
  // const openDrawer = () => setIsDrawerOpen(true);
  // const closeDrawer = () => setIsDrawerOpen(false);

  /**
   * Fetch the location data when the component mounts
   */
  useEffect(() => {
    getLocation();
  }, []);

  /**
   * Fetch the current location and update state
   */
  const getLocation = async () => {
    setLoading(true);
    try {
      // setDataById("editLocation", {data?.mapUrl });
      await fetchCoordinates(data?.mapUrl);
    } catch (error) {
      Logger.error("Error fetching location data", error);
    } finally {
      setLoading(false);
    }
  };
  
  /**
 * Extracts latitude and longitude from a Google Maps URL.
 * 
 * @param {string} url - The Google Maps URL containing coordinates.
 * @returns {object | null} - An object with latitude and longitude if found, otherwise null.
 */
  const extractLatLngFromUrl = (url:string) => {
    const match = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return null;
  };
  /**
   * Fetch coordinates from the Google Maps API
   * @param mapLocation - Location name or address to fetch coordinates for
   */
  const fetchCoordinates = async (mapLocation?: string) => {
    try {
      if (!mapLocation || mapLocation.trim() === '') {
        Logger.error("Invalid or empty mapLocation provided.");
        return;
      }
  
      const extractedLatLng = extractLatLngFromUrl(mapLocation);
      if (extractedLatLng) {
        setCoordinates(extractedLatLng);
        return;
      }
  
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(mapLocation)}&key=${GOOGLE_API_KEY}`;
      const response = await axios.get(geocodeUrl);
  
      if (response.data.status !== 'OK') {
        Logger.error(`API Error: ${response.data.error_message}`);
        return;
      }
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        setCoordinates({ lat, lng });
        //  await findNearbyPlaces({ lat, lng });
      } else {
        Logger.error("No coordinates found.");
      }
    } catch (error) {
      Logger.error("Error fetching coordinates:",error);
    }
  };
  


/**
 * function for find nearby locations 
 */

// const findNearbyPlaces = async ({ lat, lng }: Coordinates) => {
//   try {
//     const radius = 5000; // Radius in meters
//     const baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

//     // Helper function to fetch places by type
//     const fetchPlaces = async (type: string) => {
//       try {
//         const response = await apiClient.get(baseUrl, {
//           params: {
//             location: `${lat},${lng}`,
//             radius,
//             type,
//             key: GOOGLE_API_KEY,
//           },
//         });

//         if (response.data.status !== "OK") {
//           throw new Error(`Error from Google API: ${response.data.status} - ${response.data.error_message || "Unknown error"}`);
//         }

//         return response.data.results;
//       } catch (error:any) {
//         Logger.error(`Error fetching places for type "${type}":`, error.message);
//         return [];
//       }
//     };

//     // Fetch different types of places in parallel
//     const [railwayStations, airports, hotels] = await Promise.all([
//       fetchPlaces("railway station"),
//       fetchPlaces("Airport"),
//       fetchPlaces("Hotel"),
//     ]);

//     // Log the results
//     console.log("Nearby Railway Stations:", railwayStations);
//     console.log("Nearby Airports:", airports);
//     console.log("Nearby Hotels:", hotels);

//     // Return the results if needed
//     return { railwayStations, airports, hotels };
//   } catch (error:any) {
//     console.error("Error fetching nearby places:", error.message);
//   }
// };

  return (
    <Grid className="main-location-Grid" container >
      <Grid size={12} direction={"row"} container gap={".3rem"} >
        <Grid>
        <Typography className="main-location-Grid-location-Text">
          Location
        </Typography>
        </Grid>
        {/* <Grid >
           <EditButtonIcon className="main-location-Grid-location-button" onClick={openDrawer}/>
        </Grid> */}
        <Grid size={12} container>
        <Grid size={12}className="main-location-Grid-address">
          <Typography className="main-location-Grid-address-title" >Address Line</Typography> 
          <Typography className="main-location-Grid-address-title-description">{data?.address} </Typography>
        </Grid>
        <Grid size={12}className="main-location-Grid-address">
        <Typography className="main-location-Grid-address-title" >City</Typography> 
          <Typography className="main-location-Grid-address-title-description">{data?.city} </Typography>
        </Grid>
        <Grid size={12}className="main-location-Grid-address">
          <Typography className="main-location-Grid-address-title" >State/Province</Typography> 
          <Typography className="main-location-Grid-address-title-description">{data?.state} </Typography>
        </Grid>
        <Grid size={12}className="main-location-Grid-address">
          <Typography className="main-location-Grid-address-title" >ZIP/Postal Code</Typography> 
          <Typography className="main-location-Grid-address-title-description">{data?.postalCode} </Typography>
        </Grid>
        <Grid size={12}className="main-location-Grid-address">
          <Typography className="main-location-Grid-address-title" >Country</Typography> 
          <Typography className="main-location-Grid-address-title-description">{countryName}  </Typography>
        </Grid>
       </Grid>
      </Grid>
      <Grid container  className="show-map">
      {loading ? (
          <div>Loading...</div>
        ) : coordinates ? (
          <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: '44.84rem', height: '14.59rem'}}
              center={coordinates}
              zoom={16}
            >
              <Marker position={coordinates}
              />
            </GoogleMap>
          </LoadScript>
        ) : (
          <div>No map available</div>
        )}
      </Grid>
      {/* <Grid size={12} container className="nearby-location-grid">
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
      </Grid> */}
      {/*edit map drawer */}
      {/* <CustomDrawer open={isDrawerOpen} type="right">
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
      </CustomDrawer> */}
    </Grid>
  );
};

export default LocationCard;


