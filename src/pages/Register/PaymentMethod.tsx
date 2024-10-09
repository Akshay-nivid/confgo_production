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
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
/*
 * functional compoent used to render payment method 
 */
const PaymentMethod = React.memo(() => {
    const { setDataById }: any = useStore();
    const pageSwitch = useStore((state: any) => state?.compData?.['register']) ?? [];
    const navigate = useNavigate();


    /*
     * function to render prevoius componet while updating state
     */
    const handleBack = () => {
        if (pageSwitch.data == 'four') {
            setDataById('register', { data: 'three' });
        }
    }
/*
 * function to handle navigate to login page
 */
    const handleLogin = () => {
        navigate(routes.login())
    }

    const handleClick=()=>{
        setDataById('register', { data: 'five' });
    }
    return (
        <Grid>
            <Grid container spacing={5}>
            <Grid container columnSpacing={2} alignItems={"center"} display={"flex"} className="cursor-container" size={{ xs: 2 }} onClick={handleBack}>
                    <Grid display={"flex"} alignItems={"center"}>
                         <ArrowBackIcon />
                    <Typography variant="h6">Back</Typography>
                    </Grid>
                </Grid>  
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