import React from "react";
import {
    //Select,
    //MenuItem,
    Box,
   // SelectChangeEvent,
    FormHelperText,
} from "@mui/material";
import CustomTextField from "../CustomTextfield/CustomTextField";
import { phoneRules } from "@/Utils/Validation";

/**
 * Interface for representing a country in the CustomPhone component.
 * This includes the country code, label (name of the country), and its flag.
 * 
 * @interface Country
 * @property {string} countryCode - The phone code of the country (e.g., "+1" for the USA, "+44" for the UK).
 * @property {string} label - The name of the country (e.g., "United States", "United Kingdom").
 * @property {string} flag - The flag emoji or image for the country (e.g., 🇺🇸 for the USA, 🇬🇧 for the UK).
 */
interface Country {
    countryCode: string;
    label: string;
    flag: string;
}

/**
 * Interface for the CustomPhone component.
 * 
 * @interface CustomPhoneProps
 * @property {Country[]} countries - List of countries with their respective codes, labels, and flags.
 * @property {string} selectedCountryCode - The currently selected country code.
 * @property {(code: string) => void} onCountryChange - Callback function triggered when the country code is changed.
 * @property {string} phoneNumber - The entered phone number.
 * @property {(phoneNumber: string) => void} onPhoneNumberChange - Callback function triggered when the phone number is updated.
 * @property {string} [placeholder] - Placeholder text for the phone number input field (default: "Phone Number").
 * @property {React.CSSProperties} [style] - Custom CSS styles applied to the component container.
 * @property {string} [maxWidth] - Maximum width for the component container (default: "500px").
 * @property {any} [error] - Error object containing validation messages or error details.
 * @property {any} [control] - React Hook Form control object for managing form state.
 */
interface CustomPhoneProps {
    countries: Country[];
    selectedCountryCode: string;
    onCountryChange: (code: string) => void;
    phoneNumber: string;
    onPhoneNumberChange: (phoneNumber: string) => void;
    placeholder?: string;
    style?: React.CSSProperties;
    maxWidth?: string;
    error?: any;
    control?: any;
}

/**
 * CustomPhone component for rendering a phone input field with a country selector.
 * 
 * @param {Object} props - The props object.
 * @param {Country[]} props.countries - List of countries with their respective codes, labels, and flags.
 * @param {string} props.selectedCountryCode - The currently selected country code.
 * @param {(code: string) => void} props.onCountryChange - Callback function triggered when the country code is changed.
 * @param {string} props.phoneNumber - The entered phone number.
 * @param {(phoneNumber: string) => void} props.onPhoneNumberChange - Callback function triggered when the phone number is updated.
 * @param {string} [props.placeholder="Phone Number"] - Placeholder text for the phone number input field.
 * @param {React.CSSProperties} [props.style={}] - Custom CSS styles applied to the component container.
 * @param {string} [props.maxWidth="48.25rem"] - Maximum width for the component container.
 * @param {any} [props.error] - Error object containing validation messages or error details.
 * @param {any} [props.control] - React Hook Form control object for managing form state.
 * 
 * @returns {JSX.Element} The rendered CustomPhone component.
 */
const CustomPhone: React.FC<CustomPhoneProps> = ({
    //countries,
    //selectedCountryCode,
   // onCountryChange,
    phoneNumber,
    onPhoneNumberChange,
    placeholder = "Phone Number",
    style = {},
    maxWidth = "48.25rem",
    error,
    control,
}) => {

   /**
   * Handles the change event for the country selector.
   * 
   * @param {SelectChangeEvent<string>} event - The change event object from the country selector dropdown.
   */
    // const handleCountryChange = (event: SelectChangeEvent<string>) => {
    //     onCountryChange(event.target.value);
    // };

    /**
     * Handles the change event for the phone number input.
     * @param event - {React.ChangeEvent<HTMLInputElement>} event - The change event object from the phone number input field.
     */
    const handlePhoneChange = (event: any) => {
        onPhoneNumberChange(event.target.value);
    };

    const errorClass = error?.message ? 'error-border'  : '';

    return (
        <>

            <Box
               className={`contact-form-phone-container ${errorClass}`}
                style={{
                    ...style,
                    maxWidth
                }}
            >

                {/* <Box className="contact-form-country-selector">
                    <Select
                        value={selectedCountryCode}
                        onChange={handleCountryChange}
                        variant="standard"
                        disableUnderline
                        renderValue={() => (
                            <Box display="flex" alignItems="center">
                                <Box component="span" className="contact-form-flagIcon">
                                    {
                                        countries.find(
                                            (country) => country.countryCode === selectedCountryCode
                                        )?.flag
                                    }
                                </Box>
                                <Box component="span" className="contact-form-countryCode">
                                    {selectedCountryCode}
                                </Box>
                            </Box>
                        )}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                    boxShadow: "none",
                                },
                            },
                        }}
                        className="contact-form-selectMenu"
                    >
                        {countries.map((country) => (
                            <MenuItem key={country.countryCode} value={country.countryCode}>
                                <Box className="contact-form-countryMenu">
                                    <Box component="span" className="contact-form-countryFlag">
                                        {country.flag}
                                    </Box>
                                    <Box component="span" className="contact-form-countryLabel">
                                        {country.label} ({country.countryCode})
                                    </Box>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </Box> */}

                <CustomTextField
                    name="phoneNumber"
                    label=""
                    placeholder={placeholder}
                    value={phoneNumber}
                    type="text"
                    control={control}
                    rules={phoneRules}
                    max={10}
                    isNumeric={true}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    showError={false}
                    className="no-border"
                />
            </Box>

            {error?.message && (
                <FormHelperText className="error-text">
                    {error.message}
                </FormHelperText>
            )}
        </>
    );
};

export default CustomPhone;
