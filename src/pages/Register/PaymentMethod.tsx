import Grid from "@mui/material/Grid2";
import React, { useEffect } from 'react';
import {
    Box,
    Typography,
} from "@mui/material";
import PaymentMethodImage from "@/assets/png/payment-method.png"
import PayPalButton from "./PayPalCompoent";
import useStore from "@/Libs/store";
/*
 * functional compoent used to render payment method 
 */
const PaymentMethod = React.memo(() => {
    const { setDataById }: any = useStore();
 
    /*
   * useEffect used to set stepper info
   */
    useEffect(() => {
        setDataById('register', { data: 'PAYMENT_METHOD_PAGE', step: 4 });
    }, [])
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
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
});

export default PaymentMethod;