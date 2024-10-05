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
import { phoneRules, emailRules } from '@/Utils/Validation';
import { useNavigate } from "react-router-dom";
import PaymentMethodImage from "@/assets/png/payment-method.png"
import countries from "@/Utils/country/country.json"
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
// A functional component that renders a simple greeting
const PaymentMethod = React.memo(() => {
    const { handleSubmit, control } = useForm<FormData>();

    // form submission function
    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data, 'gggg')
    };
    const navigate = useNavigate();

    // const location = useLocation();
    type FormData = {
        cardNumber: number;
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
                            <Typography fontWeight={800} textAlign={"center"} variant="h3" lineHeight={2} >Payment Method</Typography>
                            <Typography textAlign={"center"} variant="h6">Everything you might need and then some more in<br /> an accessible and intuitive package.</Typography>
                        </Grid>
                        <Box className={"form-wrapper"}>

                            <img src={PaymentMethodImage}></img>


                            <form onSubmit={handleSubmit(onSubmit)} className="form">
                                <FormControl >
                                    <CustomTextField
                                        placeholder="Enter Card Number"
                                        control={control}
                                        name="cardNumber"
                                        type="number"
                                    />
                                    <CustomTextField
                                        placeholder="Name on card"
                                        control={control}
                                        name="organizationEmail"
                                        type="text"
                                        rules={emailRules}
                                    />
                                    <Grid container spacing={2}>
                                        <Grid size={6}>
                                            <CustomTextField
                                                placeholder="CVV"
                                                control={control}
                                                name="organizationEmail"
                                                type="text"
                                                rules={emailRules}
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <CustomTextField
                                                placeholder="Name on card"
                                                control={control}
                                                name="organizationEmail"
                                                type="text"
                                                rules={emailRules}
                                            />
                                        </Grid>

                                    </Grid>
                                    <Grid>
                                        <Typography variant="h5">Billing Address</Typography>

                                        <Grid sx={{ marginBottom: "0.8rem" }}>
                                            <CustomSelect
                                                name="country"
                                                label="Select a Country"
                                                options={countries}
                                                control={control}
                                                fullWidth
                                            />
                                        </Grid>

                                    </Grid>
                                    <CustomTextField
                                        placeholder="Organization Phone"
                                        name="organizationPhone"
                                        type="number"
                                        control={control}
                                        rules={phoneRules}
                                    //  rules={}
                                    />
                                    {/* <CustomTextField
                                        placeholder="Organization Address"
                                        control={control}
                                        name="organizationAddress"
                                        type="text"
                                    /> */}
<CustomCheckbox
control={control}
name="cardNumber" 

/>
                                </FormControl>
                                <CustomButton
                                    className="plan-choose-btn"
                                    // onClick={handleClick}
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

export default PaymentMethod;