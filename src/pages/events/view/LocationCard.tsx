import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { useParams } from "react-router-dom";
import { Logger } from "@/Utils/Logger";
import useStore from "@/Libs/store";

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
  const setDataById = useStore((state: any) => state.setDataById);
  /**
   * useEffect hook to handle the API call
   */
  useEffect(() => {
    fetchLocationList();
  }, []);

  // fetch the venue details
  const fetchLocationList = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`event/${id}`);
      const { status, data } = processAPIResponse(response, "locationList");

      if (status) {
        const locationsData = Array.isArray(data) ? data : [data];

        setLocations(
          locationsData.map((item) => {
            // Extract the URL from mapUrl, or set a default if unavailable
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
    }
    finally {
        setLoading(false);
      }
  };

  return (
    <Grid container spacing={4} className="location-grid">
      {loading ? (
        <div>Loading...</div>
      ) : (
        locations.map(({ mapUrl }) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={id}>
            {mapUrl ? (
              <iframe
                src={mapUrl}
                allowFullScreen
                loading="lazy"
                title={`Location ${name}`}
                width="500rem"
                height="400px"
                style={{ border: 0 }}
              />
            ) : (
              <div>No map available</div>
            )}
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default LocationCard;
