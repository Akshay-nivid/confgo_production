import Grid from "@mui/material/Grid2";
import React from 'react';
import {
    Box,
    FormControl,
    Typography,
} from "@mui/material";
import CustomButton from "@/components/CustomButton/CustomButton";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { useNavigate } from "react-router-dom";
// A functional component that renders a simple greeting
const AddOrganization = React.memo(() => {
    const { handleSubmit, control } = useForm<FormData>();

    // form submission function
    const onSubmit: SubmitHandler<FormData> = () => { };
    const navigate = useNavigate();
    const handleClick = () => {
        const currentPath = window.location.pathname;
        navigate(`${currentPath}/payment`, { state: { currentPath } });
    };
    // const location = useLocation();
    type FormData = {
        organizationName: string;
        organizationEmail: string;
        organizationPhone: number;
        organizationAddress: number;
    };
    return <Box className="register-main-container">
        <Grid container className="grid-layout">
            <Grid size={{ xs: 12, sm: 6 }} className="grid-left">
                <Box className="left-content-wrapper">
                    <Box className="left-inner-content">
                        <Grid alignSelf={"center"}>
                            <Typography fontWeight={800} textAlign={"center"} variant="h3" lineHeight={2} >Add Organization Details</Typography>
                            <Typography textAlign={"center"} variant="h6">Join us and streamline your conference<br /> management today.</Typography>
                        </Grid>
                        <Box className={"form-wrapper"}>
                            <form onSubmit={handleSubmit(onSubmit)} className="form">
                                <FormControl >

                                    <CustomTextField
                                        placeholder="Organization Name"
                                        control={control}
                                        name="organizationName"
                                        type="text"
                                    />
                                    <CustomTextField
                                        placeholder="Organization Email"
                                        control={control}
                                        name="organizationEmail"
                                        type="text"
                                    />
                                    <CustomTextField
                                        placeholder="Organization Phone"
                                        name="organizationPhone"
                                        type="number"
                                        control={control}
                                    />
                                    <CustomTextField
                                        placeholder="Organization Address"
                                        control={control}
                                        name="organizationAddress"
                                        type="text"
                                    />

                                </FormControl>
                                <CustomButton
                                    className="plan-choose-btn"
                                    onClick={handleClick}
                                    label="Next"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                />
                            </form>
                        </Box>
                        <Grid container flexDirection={"row"} spacing={2}>
                            <Typography>Already have an account?  </Typography>
                            <Typography className="login-label" alignContent={"flex-end"}> Log In</Typography>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} className="grid-right">
                <Grid container className="right-content-wrapper">
                    {/* <Box sx={{}}>
                        <Typography>New Teext</Typography>
                    </Box> */}
                </Grid>
            </Grid>
        </Grid>
    </Box>
});

export default AddOrganization;