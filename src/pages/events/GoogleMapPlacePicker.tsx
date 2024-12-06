import Grid from "@mui/material/Grid2";
import config from "../../../config.json";
import ReactGooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useState } from "react";
import { IconButton } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import CustomButton from "@/components/CustomButton/CustomButton";
import { useFormContext } from 'react-hook-form';
import { Logger } from "@/Utils/Logger";


interface GooglePlacePickerProps {
  onClose: () => void;
}

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
}

const GoogleMapPlacePicker = ({ onClose }: GooglePlacePickerProps) => {
  const { setValue } = useFormContext();
  const GOOGLE_API_KEY = config?.google_api_key;
  const [selectedPlace, setSelectedPlace] = useState<any>();
  const [latLng, setLatLng] = useState<any>();
  const [address, setAddress] = useState<AddressComponent[]>();
  const [placeName, setPlaceName] = useState<string>();
    /**
     * select the place from the dropdown
     * @param place
     */
    const handlePlaceSelect = (place: any) => {
        setSelectedPlace(place); // Set the selected place
        const placeId = place.value.place_id;
        setPlaceName(place?.value?.structured_formatting?.main_text);

        if (placeId) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ placeId }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
                    const { lat, lng } = results[0].geometry.location;
                    setLatLng({ lat: lat(), lng: lng() });
                    const addressComponents = results[0].address_components;
                    setAddress(addressComponents);
                }
            });
        }
    };
   /**
     * submit handle save the values in the respective fields
     * 
     */
    const handlePlaceSubmit = () => {
        try {
            let state = '';
            let district = '';
            let country = '';
            let postalCode = '';
            const fullAddress: any = [];
            address?.forEach((component) => {
                fullAddress.push(component.long_name);
                const types = component.types;

                if (types.includes('administrative_area_level_1')) {
                    state = component.long_name;
                    setValue('state', state);
                }

                if (types.includes('administrative_area_level_3')) {
                    district = component.long_name;
                    setValue('city', district);
                }

                if (types.includes('country')) {
                    country = component.long_name;
                    setValue('country', country);
                }

                if (types.includes('postal_code')) {
                    postalCode = component.long_name;
                    setValue('postalCode', postalCode);
                }
            });

            const formattedPlaceName = encodeURIComponent(placeName ?? "");
            const formattedLatLng = `${latLng.lat},${latLng.lng}`;
            const mapLink = `https://www.google.com/maps?q=${formattedPlaceName}&@${formattedLatLng}z`;
            setValue('mapUrl', mapLink);
            setValue('address', fullAddress);
            onClose();
        } catch (e) {
            Logger.error('GoogleMapPlacePicker.tsx');
        }
    };
  return (
    <Grid container className="create-event-map-drawer" spacing={2}>
      <Grid container size={12} justifyContent={"flex-end"}>
        <IconButton onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </Grid>
      <Grid size={12} justifyContent={"center"} m={1}>
        {/* Location choose google componet */}
        <ReactGooglePlacesAutocomplete
          apiKey={GOOGLE_API_KEY}
          selectProps={{
            value: selectedPlace,
            onChange: handlePlaceSelect,
            placeholder: "Search for a place",
          }}
        />
      </Grid>
      <Grid container size={12} spacing={2} m={1} justifyContent={"flex-end"}>
      <CustomButton
        className="create-event-choose-map"
        label="Submit"
        type="submit"
        onClick={handlePlaceSubmit}
      />
      </Grid>
    </Grid>
  );
};

export default GoogleMapPlacePicker;
