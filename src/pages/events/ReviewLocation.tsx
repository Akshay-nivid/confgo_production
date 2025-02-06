import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { Logger } from "@/Utils/Logger";
 import axios from "axios";
import { GoogleMap,Marker } from '@react-google-maps/api';
import config from "../../../config.json";


/**
 * Interface for props
 */
interface LocationCardProps{
  eventData?: any;
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
const ReviewLocation = ({ eventData }: LocationCardProps) => { 
const data = eventData;
  // const [_countryName, setCountryName] = useState<any>(data?.country);
  // /**
  //  * Define an asynchronous function to fetch the country name by country code
  //  */
  // useEffect(() => {
  //   const fetchCountryName = async () => {
  //     try {
  //       const response = await fetch(`https://restcountries.com/v3.1/alpha/${data?.country}`);
  //       const datas = await response.json();
  //       if (datas && datas[0]?.name?.common) {
  //         setCountryName(datas[0].name.common);
  //       }
  //     } catch (error) {
  //       Logger.error("Error fetching country name:", error);
  //     }
  //   };

  //   fetchCountryName();
  // }, [data?.country]);
  

  /**
   * State to store map coordinates
   * Initially set to null until fetched from the Google Maps API.
   */
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   *GOOGLE_API_KEY
   */
   const GOOGLE_API_KEY = config?.google_api_key; 
  

  /**
   * Fetch the location data when the component mounts
   */
  useEffect(() => {
    getLocation();
  }, [data]);

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


  return (
      <Grid container ml={2}>
      {loading ? (
          <div>Loading...</div>
        ) : coordinates ? (
          <>
            <GoogleMap
              mapContainerStyle={{ width: '32.25rem',borderRadius:"1rem"}}
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
  );
};

export default ReviewLocation;


