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
import {IconButton, Tooltip, Typography} from "@mui/material"
import EditIcon from "@/assets/svg/event-edit.svg";
// import {EditButtonIcon} from "@/assets/svg";
 import axios from "axios";
import { GoogleMap,Marker } from '@react-google-maps/api';
//const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as any;
import config from "../../../../config.json";
import { setDataById } from "@/Libs/store";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { CloseOutlined } from "@mui/icons-material";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import { FormProvider, useForm } from "react-hook-form";
import LocationSearch from "../LocationSearch";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import apiClient from "@/Libs/Https/API-client";
import { useParams } from "react-router-dom";
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
  published?: boolean;
  onSubmitHandler?: any;
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
const LocationCard = ({ data, published, onSubmitHandler }: LocationCardProps) => { 

  const [countryName, setCountryName] = useState<any>(data?.country);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const methods = useForm<any>();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
  } = methods;
  // Functions to open and close the drawer.
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [originalData, setOriginalData] = useState(data)
  
  const {id} = useParams<{id:string}>()
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

/**
 * useEffect hook to reset the form with formatted data when `Data` changes.
 */
useEffect(() => {
  if(data){
    const formattedData =  {
      ...data
    };
    reset(formattedData);
    setValue('venueName',data?.name);
    setValue('country',data?.country);
    setValue("address",data?.address);
    setValue("city",data?.city);
    setValue("postalCode",data?.postalCode);
    setValue("state",data?.state);
    setValue("mapUrl",data?.mapUrl);
    setOriginalData(data)
  }
},[data, reset])

/**
 * Function check weather the event is published or not
 */
const locationEdit=()=>{
  if(published){
    setDataById("snackBarInfo", {
      open: true,
      autoHideDuration: 2000,
      severity: "error",
      message: "Event is Already Published !",
    });
  }else{
    openDrawer()
  }
}

/**
 * Function used in cancel button 
 */
const restore = () => {
  if (originalData) {
    const formattedOriginalData = {
      ...originalData,
    };
    reset(formattedOriginalData);
    closeDrawer();
  }
};

/**
 * Form submission handler that sends the updated location data to the API.
 * @param data 
 */
const onSubmit = async (data:any) => {
    const formattedData = {
      venue:{
        name: data?.venueName,
        mapUrl: data?.mapUrl,
        address: data?.address,
        city: data?.city,
        state: data?.state,
        country: data?.country,
        postalCode: data?.postalCode
      }
    }

    const response = await apiClient.put(`event/update/${id}`, formattedData);
    const { status, message } = await processAPIResponse(
      response,
      "location-update"
    );

    if (status) {
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "success",
        message: "Location updated",
      });
      reset();
      closeDrawer();
      onSubmitHandler();
    } else {
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: message || "Failed to update the event. Please try again.",
      });
    }
}
  return (
    <Grid className="main-location-Grid" container >
      <Grid size={12} direction={"row"} container gap={".3rem"} >
      <Grid container size={{xs: 12}} alignItems="center">
        <Grid>
        <Typography className="main-location-Grid-location-Text">
          Location
        </Typography>
        </Grid>
         <Grid >
         <IconButton onClick={locationEdit}  className="main-location-Grid-edit-btn">
         <EditIcon />
         </IconButton>
         </Grid> 
         </Grid>
        <Grid size={12} container>
        <Grid size={12}className="main-location-Grid-address">
          <Typography className="main-location-Grid-address-title" >Venue</Typography> 
          <Typography className="main-location-Grid-address-title-description">{data?.name} </Typography>
        </Grid>
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
          <>
            <GoogleMap
              mapContainerStyle={{ width: '44.84rem', height: '14.59rem'}}
              center={coordinates}
              zoom={16}
            >
              <Marker position={coordinates}
              />
            </GoogleMap>
          </>
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
       <CustomDrawer open={isDrawerOpen} type="right">
       <Grid container spacing={2} padding={2} className="event-information-custom-drawer">
       <Grid
            size={{ xs: 12 }}
            container
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography className="event-information-edit-heading">
              Edit Location
            </Typography>
            <IconButton onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Grid>
          
          <Grid  size={{ xs: 12 }} mt={2} >
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} >
                <Grid container spacing={1}>
              <Grid size={12} container justifyContent={"flex-start"} alignItems={"center"}>
              <CustomButton
                      className="create-event-choose-map"
                        label="Choose Venue"
                        onClick={()=>setDrawerOpen(true)}
                        />
                        <Tooltip title="Location details fills up on once choose desired location" arrow>
                            <IconButton className="add-program-warning-msg"
                            >
                              <ErrorOutlineIcon />
                            </IconButton>
                          </Tooltip>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                          placeholder="Location URL (must be a Google Maps link with latitude and longitude)"
                          control={control}
                          name="mapUrl" 
                          type="text" 
                          rules={{
                            required: false,                                
                          }}
                          readOnly
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                          placeholder="Venue Name"
                          control={control}
                          name="venueName"
                          type="text"
                          rules={{ required: watch("type") === "OFFLINE" }}
                          shrink={watch('venueName')!==''&&watch('venueName')!==undefined?true:undefined}
                          readOnly
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                          placeholder="Address"
                          control={control}
                          name="address"
                          type="text"
                          rules={{ required: watch("type") === "OFFLINE" }}
                          shrink={watch('address')!==''&&watch('address')!==undefined?true:undefined}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }}>
                      <CustomTextField
                          placeholder="Country"
                          name="country"
                          control={control}
                          type="text"
                          shrink={watch('country')!==''&&watch('country')!==undefined?true:undefined}
                          readOnly
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }}>
                         <CustomTextField
                            name="state"
                            label="State"
                            control={control}
                            type="text"
                            shrink={watch('state')!==''&&watch('state')!==undefined?true:undefined}
                            readOnly
                          />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                          placeholder="City"
                          control={control}
                          name="city"
                          type="text"
                          rules={{ required: watch("eventClass") === "OFFLINE" }}
                          shrink={watch('city')!==''&&watch('city')!==undefined?true:undefined}
                          readOnly
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                          placeholder="Pin Code"
                          control={control}
                          name="postalCode"
                          type="text"
                          rules={{
                            required: watch("type") === "OFFLINE",
                            pattern: {
                              value: /(^\d{5}(-\d{4})?$)|(^\d{6}$)/,
                              message: "Enter a valid postal code (e.g., '12345', '12345-6789', or '123456')",
                            },
                          }}
                          shrink={watch('postalCode')!==''&&watch('postalCode')!==undefined?true:undefined}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }} mt={2}>
                  <Grid
                    container
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid>
                      <CustomButton
                        className="event-information-restore-btn"
                        label="Cancel"
                        variant="outlined"
                        size="large"
                        onClick={restore}
                      />
                    </Grid>
                    <Grid>
                      <CustomButton
                        className="event-information-edit-btn"
                        label="Submit"
                        variant="contained"
                        size="large"
                        type="submit"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                        
              </Grid>
              <CustomDrawer open={drawerOpen} type="right" children={
                    <LocationSearch onClose={()=>setDrawerOpen(false)}/>
                  } />
              </form>
            
            </FormProvider>
          </Grid>
        </Grid>
      </CustomDrawer> 
    </Grid>
  );
};

export default LocationCard;


