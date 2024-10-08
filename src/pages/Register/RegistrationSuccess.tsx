import Grid from "@mui/material/Grid2";
import React from 'react';
import {
    Box,
    Typography,
} from "@mui/material";
import CustomButton from "@/components/CustomButton/CustomButton";
import useStore from "@/Libs/store";
import SuccessTickImage from '@/assets/png/sucess-tick.png'
// A functional component that renders a simple greeting
const RegistrationSuccess = React.memo(() => {

    const { setDataById }: any = useStore();
    const pageSwitch = useStore((state: any) => state?.compData?.['register']) ?? [];

    const handleClick = () => {
        setDataById('register', { data: 'four' });
    };
    const handleBack = () => {
        if (pageSwitch.data == 'four') {
            setDataById('register', { data: 'three' });
        }
    }
    return (
        <Box className="left-content-wrapper">
            <Box className="left-inner-content">
                <Grid container alignSelf={'center'}>
                    <img src={SuccessTickImage}></img>
                </Grid>
                <Grid alignSelf={"center"}>
                    <Typography fontWeight={800} textAlign={"center"} variant="h4" lineHeight={2} >Login and Payment Successful</Typography>
                    <Typography className="checkbox-text-grey" textAlign={"center"} variant="h6">Check your email to set your password and access your dashboard.</Typography>
                </Grid>
                <Box className={"form-wrapper"}>
                    <Grid >
                        <Typography variant="h5">What’s Next?</Typography>
                    </Grid>
                    <Grid container justifyContent={"space-between"}>
                        <Typography>Check Your Email: </Typography>
                        <Typography>Look for the password setup link in your inbox.</Typography>
                    </Grid>
                    <Grid container justifyContent={"space-between"}>
                        <Typography>Check Your Email: </Typography>
                        <Typography>Look for the password setup link in your inbox.</Typography>
                    </Grid>
                    <CustomButton
                        className="plan-choose-btn"
                        // onClick={handleClick}
                        label="Set Password"
                        variant="contained"
                        color="primary"
                        size="large"
                    />
                    {/* </form> */}

                </Box>
                <Grid container flexDirection={"row"} spacing={2}>
                    <Typography>Already have an account?  </Typography>
                    <Typography className="login-label" alignContent={"flex-end"}> Log In</Typography>
                </Grid>
                {/* <StepperBoxes activeStep={4}/> */}
            </Box>

        </Box>

    )
});

export default RegistrationSuccess;