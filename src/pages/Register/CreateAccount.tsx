import Grid from "@mui/material/Grid2";
import React from 'react';
import {
    Box,
    Button,
    FormControl,
    Typography,
} from "@mui/material";
import CustomButton from "@/components/CustomButton/CustomButton";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { useLocation, useNavigate } from "react-router-dom";
// A functional component that renders a simple greeting
const CreateAccount = React.memo(() => {
    const { handleSubmit, control } = useForm<FormData>();
    const navigate = useNavigate();
    // form submission function
    const onSubmit: SubmitHandler<FormData> = () => { };

    const handleClick = () => {
        const currentPath = window.location.pathname;
        navigate(`${currentPath}/organization`,{state:{currentPath}});
    };
    const location = useLocation();
    const userData = location.state;
    console.log(userData, 'rrrrrr')
    type FormData = {
        fullName: string;
        lastName: string;
        email: string;
        phoneNumber: number;
    };
    return <Box className="register-main-container">
        <Grid container className="grid-layout">
            <Grid size={{ xs: 12, sm: 6 }} className="grid-left">
                <Box className="left-content-wrapper">
                    <Box className="left-inner-content">
                        <Grid alignSelf={"center"}>
                            <Typography fontWeight={800} textAlign={"center"} variant="h3" lineHeight={2} >Create Your Account</Typography>
                            <Typography textAlign={"center"} variant="h6">Join us and streamline your conference management today.</Typography>
                        </Grid>
                        <Box className={"form-wrapper"}>
                            <form onSubmit={handleSubmit(onSubmit)} className="form">
                                <FormControl >
                                    <CustomTextField
                                        placeholder="Full Name"
                                        control={control}
                                        name="fullName"
                                        type="text"
                                    />
                                    <CustomTextField
                                        placeholder="Last Name"
                                        control={control}
                                        name="lastName"

                                        // label={"Email Address"}
                                        type="text"
                                    />
                                    <CustomTextField
                                        placeholder="Email"
                                        name="email"
                                        type="email"
                                        control={control}
                                    />
                                    <CustomTextField
                                        placeholder="Phone Number"
                                        control={control}
                                        name="phoneNumber"
                                        type="number"
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
                        {/* <Typography className="left-description-text">
            Create your account and take the first step towards seamless
            event management.
          </Typography> */}

                    </Box>
                </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} className="grid-right">
                <Grid container className="right-content-wrapper">
                    <Box sx={{}}>
                        <Typography>New Teext</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    </Box>
});

export default CreateAccount;