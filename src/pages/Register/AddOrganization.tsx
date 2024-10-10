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
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
import { emailRules, phoneRules } from "@/Utils/Validation";
/*
 * Organization form 
 */
const AddOrganization = React.memo(() => {
    const { handleSubmit, control, getValues } = useForm<FormData>();
    const { setDataById }: any = useStore();
    const form3 = useStore((state: any) => state?.compData?.['form3']) ?? [];
    const navigate = useNavigate();
    /*
     * function to handle submission of the form
     */
    const onSubmit: SubmitHandler<FormData> = () => { };
    /*
     * Component used to handle form and switching form 
     */
    const handleClick = () => {
        const values = getValues();
        if (!values.organizationName || !values.organizationAddress || !values.organizationAddress || !values.organizationEmail) {
            return 
        } else {
            setDataById('register', { data: 'PAYMENT_METHOD_PAGE' });
            setDataById('form3', { field_values: values });
        }

    };

    /*
     * FormData type 
     */
    type FormData = {
        organizationName: string;
        organizationEmail: string;
        organizationPhone: number;
        organizationAddress: number;
    };

    /*
     * function to handle navigate to login page
     */
    const handleLogin = () => {
        navigate(routes.login())
    }
    return (
        <Grid>
            <Grid container spacing={5}  >
                <Grid className="left-content-wrapper">
                    <Grid className="left-inner-content">
                        <Grid alignSelf={"center"}>
                            <Typography fontWeight={800} textAlign={"center"} variant="h3" lineHeight={2} >Add Organization Details</Typography>
                            <Typography className="left-description-text" textAlign={"center"} variant="h6" mb={2}>Join us and streamline your conference<br /> management today.</Typography>
                        </Grid>
                        <Box className={"form-wrapper"}>
                            <form onSubmit={handleSubmit(onSubmit)} className="form">
                                <FormControl >
                                    <Grid container spacing={2}>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form3?.field_values?.organizationName}
                                                placeholder="Organization Name"
                                                control={control}
                                                name="organizationName"
                                                type="text"
                                                rules={{ required:{value:true,message:"Organization name is required"} }}
                                            />
                                        </Grid>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form3?.field_values?.organizationEmail}
                                                placeholder="Organization Email"
                                                control={control}
                                                name="organizationEmail"
                                                type="text"
                                                rules={emailRules}
                                            />
                                        </Grid>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form3?.field_values?.organizationPhone}
                                                placeholder="Organization Phone"
                                                name="organizationPhone"
                                                type="number"
                                                control={control}
                                                rules={phoneRules}
                                            />

                                        </Grid>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form3?.field_values?.organizationAddress}
                                                placeholder="Organization Address"
                                                control={control}
                                                name="organizationAddress"
                                                type="text"
                                                rules={{ required:{value:true,message:"Organization address is required"} }}
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
                                <StepperBoxes activeStep={3} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    )
});

export default AddOrganization;