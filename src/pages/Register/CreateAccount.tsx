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
import useStore from "@/Libs/store";
import { StepperBoxes } from "./StepperBox";
import { emailRules, phoneRules } from "@/Utils/Validation";
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
/*
 * funtional componet to render create form field
 */
const CreateAccount = React.memo(() => {
    const { setDataById }: any = useStore();
    const form2 = useStore((state: any) => state?.compData?.['form2']) ?? [];
    const { handleSubmit, control, getValues } = useForm<FormData>();
    const navigate = useNavigate();
    /*
     * function to handle form submission 
     */
    const onSubmit: SubmitHandler<FormData> = () => {

    };
    /*
     * function to change the state and store form fields
     */
    const handleClick = () => {
        const values = getValues();
        if (!values.fullName || !values.lastName || !values.email || !values.phoneNumber) {
            return
        } else {
            setDataById('register', { data: 'ADD_ORGANIZATION_PAGE', field_values: values });
            setDataById('form2', { field_values: values });
        }

    };
    /*
     * Form fields used in FormData
     */
    type FormData = {
        fullName: string;
        lastName: string;
        email: string;
        phoneNumber: number;
    };
    /*
     * function to handle navigate to login page
     */
    const handleLogin = () => {
        navigate(routes.login())
    }
    return (
        <Grid>
            <Grid  container spacing={5}>
                <Grid className="left-content-wrapper">
                    <Grid className="left-inner-content">
                        <Grid container spacing={2}>
                        <Grid  alignSelf={"center"}>
                            <Typography fontWeight={800} textAlign={"center"} variant="h3" lineHeight={2} >Create Your Account</Typography>
                            <Typography className="left-description-text" textAlign={"center"} variant="h6" mb={2}>Join us and streamline your conference management today.</Typography>
                        </Grid>
                        </Grid>
                       
                        <Box className={"form-wrapper"}>
                            <form onSubmit={handleSubmit(onSubmit)} className="form">
                                <FormControl >
                                    <Grid container spacing={2}>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form2?.field_values?.fullName}
                                                placeholder="Full Name"
                                                control={control}
                                                name="fullName"
                                                type="text"
                                                rules={{ required:{value:true,message:"Name is required"} }}
                                            />
                                        </Grid>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form2?.field_values?.lastName}
                                                placeholder="Last Name"
                                                control={control}
                                                name="lastName"
                                                type="text"
                                                rules={{ required:{value:true,message:"Last Name is required"} }}
                                            />
                                        </Grid>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form2?.field_values?.email}
                                                placeholder="Email"
                                                name="email"
                                                type="email"
                                                control={control}
                                                rules={emailRules}
                                            />
                                        </Grid>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form2?.field_values?.phoneNumber}
                                                placeholder="Phone Number"
                                                control={control}
                                                name="phoneNumber"
                                                type="number"
                                                rules={phoneRules}
                                            />
                                        </Grid>
                                    </Grid>
                                </FormControl>
                                <Grid container mb={2} className="w-full" >
                                    <CustomButton
                                    type="submit"
                                        className="plan-choose-btn"
                                        onClick={handleClick}
                                        label="Next"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                    />
                                </Grid>
                            </form>
                        </Box>
                        <Grid container spacing={6} justifyContent={"center"} >
                            <Grid container spacing={1} display={"flex"}  >
                                <Typography variant="h6">Already have an account?</Typography>
                                <Grid onClick={handleLogin}>
                                    <Typography variant="h6" className="login-label cursor-container" alignContent="flex-end"> Log In</Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3} >
                                <StepperBoxes activeStep={2} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
});

export default CreateAccount;