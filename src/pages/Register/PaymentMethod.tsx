import Grid from "@mui/material/Grid2";
import React from 'react';
import {
    Box,
    Typography,
} from "@mui/material";
import PaymentMethodImage from "@/assets/png/payment-method.png"
import { StepperBoxes } from "./StepperBox";
import PayPalButton from "./PayPalCompoent";
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
/*
 * functional compoent used to render payment method 
 */
const PaymentMethod = React.memo(() => {
    const navigate = useNavigate();
    /*
     * function to handle navigate to login page
     */
    const handleLogin = () => {
        navigate(routes.login())
    }
    return (
        <Grid>
            <Grid container spacing={5}>
                <Grid className="left-content-wrapper">
                    <Grid className="left-inner-content">
                        <Grid alignSelf={"center"}>
                            <Typography fontWeight={800} textAlign={"center"} variant="h3" lineHeight={2} >Payment Method</Typography>
                            <Typography className="left-description-text" textAlign={"center"} variant="h6" mb={2}>Everything you might need and then some more in<br /> an accessible and intuitive package.</Typography>
                        </Grid>
                        <Box className={"form-wrapper"}>
                            <img src={PaymentMethodImage}></img>
                            {/* renders paypal button */}
                            <PayPalButton />
                        </Box>
                        <Grid container spacing={6} justifyContent={"center"} >
                            <Grid container spacing={1} display={"flex"}  >
                                <Typography variant="h6">Already have an account?</Typography>
                                <Grid onClick={handleLogin}>
                                    <Typography variant="h6" className="login-label cursor-container" alignContent="flex-end"> Log In</Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={4} >
                                <StepperBoxes activeStep={3} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
});

export default PaymentMethod;