import Grid from "@mui/material/Grid2";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState } from "react";
const LocationCard = (_eventData: any) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const mapContainerStyle = {
        width: '100%',
        height: '30rem',
    };

    const center = {
        lat: 10.0335616,
        lng: 76.3232256,
    };
    const onLoad = () => {
        setIsLoaded(true);
    };
    return (
        <Grid container spacing={2}>
            <Grid container size={{ xs: 12, sm: 10 }}>
                <LoadScript googleMapsApiKey="">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={10}
                        center={center}
                        onLoad={onLoad}
                    >
                        {isLoaded && <Marker position={center} />}
                    </GoogleMap>
                </LoadScript>
            </Grid>
        </Grid>
    )
}

export default LocationCard;