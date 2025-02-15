import Grid from "@mui/material/Grid2";
import ReactGooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useEffect, useState } from "react";
import { IconButton, Typography } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import CustomButton from "@/components/CustomButton/CustomButton";
import { useFormContext } from 'react-hook-form';
import { Logger } from "@/Utils/Logger";


interface GooglePlacePickerProps {
  onClose: () => void;
  createEvent?: boolean; // Add createEvent prop
  randomNumber?: string;

}

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
}

const GoogleMapPlacePicker = ({ onClose, createEvent = false, randomNumber }: GooglePlacePickerProps) => {
  const { setValue } = useFormContext();
  const [selectedPlace, setSelectedPlace] = useState<any>();
  const [latLng, setLatLng] = useState<any>();
  const [address, setAddress] = useState<AddressComponent[]>();
  const [placeName, setPlaceName] = useState<string>();
  const [venueName,setVenueName]=useState<string>();
    /**
     * select the place from the dropdown
     * @param place
     */
    const handlePlaceSelect = (place: any) => {
        setSelectedPlace(place); // Set the selected place
        const placeId = place.value.place_id;
        setPlaceName(place?.value?.structured_formatting?.main_text);
        setVenueName(place?.value?.terms[0]?.value);
        if (placeId) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ placeId }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
                    const { lat, lng } = results[0].geometry.location;
                    setLatLng({ lat: lat(), lng: lng() });
                    const addressComponents = results[0].address_components;
                    setAddress(addressComponents);

                    handlePlaceSubmit();

                }
            });
        }
    };

    /**
     * Auto focus of input field
     */
    useEffect(() => {
      setTimeout(()=> {
        const googleInput = document.querySelector(".react-select__input") as HTMLInputElement;
        if (googleInput){
          googleInput.focus();
        }
      },10);
    },[randomNumber]);
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
                }else if(types.includes('locality')){
                    district=component.long_name;
                    setValue('city',district);
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
            setValue('venueName',venueName);
            const fullAddressString = fullAddress.join(' '); 
            const formattedPlaceName = encodeURIComponent(placeName ?? "");
            const formattedLatLng = `${latLng.lat},${latLng.lng}`;
            const mapLink = `https://www.google.com/maps?q=${formattedPlaceName}&@${formattedLatLng}z`;
            setValue('mapUrl', mapLink);
            setValue('address', fullAddressString);
            onClose();
        } catch (e) {
            Logger.error('GoogleMapPlacePicker.tsx');
        }
    };


  return (
    <>
    {createEvent ? (
      <Grid container className="event-location-container" spacing={1}>
      <Grid  size={{xs:10}} className="event-location-input">
        <ReactGooglePlacesAutocomplete
          selectProps={{
            value: selectedPlace,
            onChange: handlePlaceSelect,
            placeholder: "Enter location or link",
            isClearable: true,
            classNamePrefix:"react-select",
          }}
        />
      </Grid>
      <Grid  size={{xs:2}} container>
      <CustomButton
        className="create-event-map-list-button"
        label="Submit"
        type="submit"
        onClick={handlePlaceSubmit}
      />
      </Grid>
    </Grid>
  ) : (
    <Grid container className="create-event-map-drawer" spacing={2}>
      <Grid container size={12} justifyContent={"space-between"}>
      <Typography
            variant="h3"
            className="event-detail-event-info-card-title"
          >
            Choose Venue
          </Typography>
        <IconButton onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </Grid>
      <Grid size={12} justifyContent={"center"} id="event-location-search-field" >
        {/* Location choose google componet */}
        <ReactGooglePlacesAutocomplete
          selectProps={{
            value: selectedPlace,
            onChange: handlePlaceSelect,
            placeholder: "Search for a place",
            styles: {
                dropdownIndicator: (provided) => ({
                  ...provided,
                  display: 'none',  // Hide the down arrow icon
                }),
                
              },
              isClearable:true
          }}
          
        />
      </Grid>
      <Grid container size={12} spacing={2} justifyContent={"flex-end"}>
      <CustomButton
        className="create-event-choose-map"
        label="Submit"
        type="submit"
        onClick={handlePlaceSubmit}
      />
      </Grid>
    </Grid>
        )}
            </>

  );
};

export default GoogleMapPlacePicker;
