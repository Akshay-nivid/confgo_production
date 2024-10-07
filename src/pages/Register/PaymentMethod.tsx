import Grid from "@mui/material/Grid2";
import React from 'react';
import {
    Box,
    Typography,
} from "@mui/material";
import CustomButton from "@/components/CustomButton/CustomButton";
import PaymentMethodImage from "@/assets/png/payment-method.png"
import useStore from "@/Libs/store";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { StepperBoxes } from "./StepperBox";
import PayPalButton from "./PayPalCompoent";
// A functional component that renders payment method screen
const PaymentMethod = React.memo(() => {
    const { setDataById }: any = useStore();
    const pageSwitch = useStore((state: any) => state?.compData?.['register']) ?? [];

    /*
     * function to handle the state and render new compoent
     */
    const handleClick = () => {
        setDataById('register', { data: 'five' });
    };

    /*
     * function to render prevoius componet while updating state
     */
    const handleBack = () => {
        if (pageSwitch.data == 'four') {
            setDataById('register', { data: 'three' });
        }
    }
    return (
        <Grid className="left-content-wrapper">
            <Grid className="left-inner-content">
                <Grid container flexDirection={"row"} spacing={2} alignSelf={"start"} onClick={handleBack}>
                    <ArrowBackIcon />
                    <Typography>Back</Typography>
                </Grid>
                <Grid alignSelf={"center"}>
                    <Typography fontWeight={800} textAlign={"center"} variant="h3" lineHeight={2} >Payment Method</Typography>
                    <Typography textAlign={"center"} variant="h6">Everything you might need and then some more in<br /> an accessible and intuitive package.</Typography>
                </Grid>
                <Box className={"form-wrapper"}>
                    <img src={PaymentMethodImage}></img>
                    {/* renders paypal button */}
                    <PayPalButton />
                    {/* temporary button navigate to success page */}
                    <CustomButton
                        className="plan-choose-btn"
                        onClick={handleClick}
                        label="Next"
                        variant="contained"
                        color="primary"
                        size="large"
                    />
                </Box>
                <Grid container flexDirection={"row"} spacing={2}>
                    <Typography>Already have an account?  </Typography>
                    <Typography className="login-label" alignContent={"flex-end"}> Log In</Typography>
                </Grid>
                <StepperBoxes activeStep={4} />
            </Grid>
        </Grid>

    )
});

export default PaymentMethod;