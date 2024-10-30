import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { useParams } from "react-router-dom";

interface Location {
  mapUrl: string;
}

const LocationCard = () => {
  const { id } = useParams();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocationList = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`event/${id}`);
        const { status, data } = processAPIResponse(response, "locationList");

        const locationsData = status
          ? Array.isArray(data)
            ? data
            : [data]
          : [];

        setLocations(
          locationsData.map((item) => {
            // Extracts the actual URL from mapUrl using regex, defaulting to Google Maps if unavailable
            const mapUrl = item.venue?.mapUrl || "https://maps.google.com";
            return {
              id: item.id,
              name: item.name,
              mapUrl,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocationList();
  }, [id]);

  return (
    <Grid container spacing={4} className="location-grid">
      {loading ? (
        <div>Loading...</div>
      ) : (
        locations.map(({ mapUrl }) => (
          <Grid item xs={12} sm={6} md={3} key={id}>
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
