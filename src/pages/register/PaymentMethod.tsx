import Grid from "@mui/material/Grid2";
import React from 'react';
import {
    Box,
    Typography,
} from "@mui/material";
import PaymentMethodImage from "@/assets/png/payment-method.png"
import PayPalButton from "./PayPalCompoent";
/*
 * functional compoent used to render payment method 
 */
const PaymentMethod = React.memo(() => {

    return (
        <Grid>
            <Grid container >
            <Grid container size={12} justifyContent={"flex-end"} >
                </Grid>
                <Grid className="signup-content-wrapper">
                    <Grid className="left-inner-content">
                        <Grid alignSelf={"center"}>
                            <Typography  className="left-plan-text" textAlign={"center"} variant="h3" lineHeight={2} >Payment Method</Typography>
                            <Typography className="left-description-text" textAlign={"center"} variant="h6" mb={2}>Everything you might need and then some more in<br /> an accessible and intuitive package.</Typography>
                        </Grid>
                        <Box className={"form-wrapper"}>
                            <img src={PaymentMethodImage}></img>
                            <PayPalButton />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
});

export default PaymentMethod;