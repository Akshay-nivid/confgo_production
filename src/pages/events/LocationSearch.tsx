import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete';
import CustomButton from '@/components/CustomButton/CustomButton';
import { Logger } from '@/Utils/Logger';
import Grid from '@mui/material/Grid2';
import { IconButton, Typography } from '@mui/material';
import { CloseOutlined } from "@mui/icons-material";

interface GooglePlacePickerProps {
  onClose: () => void;
}

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

interface Place {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
  };
  terms: { value: string }[];
}

/**
 * component for searching location and saving location details in the form
 */
const LocationSearch = ({ onClose }: GooglePlacePickerProps) => {
  const { setValue } = useFormContext();
  const [options, setOptions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<AddressComponent[]>();

  const onSearch = (query: string) => {
    if (query.length < 3) {
      setOptions([]);
      return;
    }

    // setLoading(true);
    const autocompleteService = new window.google.maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions({ input: query }, (predictions, status) => {
      // setLoading(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setOptions(predictions?.map((prediction) => ({
          ...prediction,
          reference: prediction.place_id,
        })) || []);
      } else {
        setOptions([]);
      }
    });
  };

  const handlePlaceSelect = (place: Place) => {
    const placeId = place.place_id;
    setPlaceName(place.structured_formatting.main_text);
    setVenueName(place.terms[0]?.value);

    if (placeId) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ placeId }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          setLatLng({ lat: lat(), lng: lng() });
          setAddress(results[0].address_components);
        }
      });
    }
  };

  const onSubmit = () => {
    try {
      let state = '';
      let district = '';
      let country = '';
      let postalCode = '';
      const fullAddress: string[] = [];
      address?.forEach((component) => {
        fullAddress.push(component.long_name);
        const types = component.types;

        if (types.includes('administrative_area_level_1')) {
          state = component.long_name;
          setValue('state', state);
        }

        if (types.includes('administrative_area_level_3') || types.includes('locality')) {
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

      setValue('venueName', venueName);
      const fullAddressString = fullAddress.join(' ');
      const formattedPlaceName = encodeURIComponent(placeName ?? "");
      const formattedLatLng = `${latLng?.lat},${latLng?.lng}`;
      const mapLink = `https://www.google.com/maps?q=${formattedPlaceName}&@${formattedLatLng}z`;
      setValue('mapUrl', mapLink);
      setValue('address', fullAddressString);
      onClose();
    } catch (e) {
      Logger.error('LocationSearch.tsx');
    }
  };

  return (
    <Grid container className="create-event-map-drawer" spacing={2}>
      <Grid container size={12} justifyContent={"space-between"}>
        <Typography variant="h3" className="event-detail-event-info-card-title">
          Choose Location
        </Typography>
        <IconButton onClick={onClose}>
          <CloseOutlined />
        </IconButton>
      </Grid>
      <Grid size={12}>
        <CustomAutocomplete
          clearable
          name="location"
          options={options}
          getOptionLabel={(option) => option.description}
          onSearch={onSearch}
          loading={loading}
          placeholder="Search for a location"
          rules={{ required: 'Location is required' }}
          onChange={(value: Place | null) => {
            if (value) {
              handlePlaceSelect(value);
            }
          }}
        />
      </Grid>
      <Grid container justifyContent={"flex-end"} size={12}>
        <CustomButton className="create-event-choose-map" onClick={onSubmit} label="Submit" />
      </Grid>
    </Grid>
  );
};

export default LocationSearch;
