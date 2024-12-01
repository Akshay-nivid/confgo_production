import React from "react";
import {
    Select,
    MenuItem,
    Box,
    SelectChangeEvent,
    FormHelperText,
} from "@mui/material";
import CustomTextField from "../CustomTextfield/CustomTextField";
import { phoneRules } from "@/Utils/Validation";

interface Country {
    countryCode: string;
    label: string;
    flag: string;
}

interface CustomPhoneProps {
    countries: Country[];
    selectedCountryCode: string;
    onCountryChange: (code: string) => void;
    phoneNumber: string;
    onPhoneNumberChange: (phoneNumber: string) => void;
    placeholder?: string;
    style?: React.CSSProperties;
    maxWidth?: string;
    removeBorder?: boolean;
    error?: any;
    control?: any;
}

const CustomPhone: React.FC<CustomPhoneProps> = ({
    countries,
    selectedCountryCode,
    onCountryChange,
    phoneNumber,
    onPhoneNumberChange,
    placeholder = "Phone Number",
    style = {},
    maxWidth = "500px",
    removeBorder,
    error,
    control,
}) => {
    const handleCountryChange = (event: SelectChangeEvent<string>) => {
        onCountryChange(event.target.value);
    };

    const handlePhoneChange = (event: any) => {
        onPhoneNumberChange(event.target.value);
    };

    return (
        <>
           
            <Box
                className="contact-form-phone-container"
                style={{
                    ...style,
                    maxWidth,
                    border: error?.message ? "1px solid #f1a7b8" : "",
                }}
            >
               
                <Box className="contact-form-country-selector">
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
                </Box>

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
                    removeBorder={removeBorder}
                    showError={false}
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
