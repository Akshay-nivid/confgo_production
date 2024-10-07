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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { StepperBoxes } from "./StepperBox";
import { emailRules, phoneRules } from "@/Utils/Validation";
// A functional component to render create account form 
const CreateAccount = React.memo(() => {
    const { setDataById }: any = useStore();
    const pageSwitch = useStore((state: any) => state?.compData?.['register']) ?? [];
    const form2 = useStore((state: any) => state?.compData?.['form2']) ?? [];
    const { handleSubmit, control, getValues } = useForm<FormData>();
    // form submission function
    const onSubmit: SubmitHandler<FormData> = () => {

    };

    const handleClick = () => {
        const values = getValues();
        if (!values.fullName || !values.lastName || !values.email || !values.phoneNumber) {
            return
        } else {
            setDataById('register', { data: 'three', field_values: values });
            setDataById('form2', { field_values: values });
        }

    };

    type FormData = {
        fullName: string;
        lastName: string;
        email: string;
        phoneNumber: number;
    };

    const handleBack = () => {
        if (pageSwitch.data == 'two') {
            setDataById('register', { data: 'one' });
        }
    }
    return (
        <Box className="left-content-wrapper">
            <Box className="left-inner-content">
                <Grid container flexDirection={"row"} spacing={2} alignSelf={"start"} onClick={handleBack}>
                    <ArrowBackIcon />
                    <Typography>Back</Typography>
                </Grid>
                <Grid alignSelf={"center"}>
                    <Typography fontWeight={800} textAlign={"center"} variant="h3" lineHeight={2} >Create Your Account</Typography>
                    <Typography textAlign={"center"} variant="h6">Join us and streamline your conference management today.</Typography>
                </Grid>
                <Box className={"form-wrapper"}>
                    <form onSubmit={handleSubmit(onSubmit)} className="form">
                        <FormControl >
                            <CustomTextField
                                defaultValue={form2?.field_values?.fullName}
                                requiredField={true}
                                showHeader={true}
                                placeholder="Full Name"
                                control={control}
                                name="fullName"
                                type="text"
                                rules={{required: true}}
                            />
                            <CustomTextField
                                defaultValue={form2?.field_values?.lastName}
                                requiredField={true}
                                showHeader={true}
                                placeholder="Last Name"
                                control={control}
                                name="lastName"
                                type="text"
                                rules={{required: true}}
                            />
                            <CustomTextField
                                defaultValue={form2?.field_values?.email}
                                requiredField={true}
                                showHeader={true}
                                placeholder="Email"
                                name="email"
                                type="email"
                                control={control}
                                rules={emailRules}
                            />
                            <CustomTextField
                                defaultValue={form2?.field_values?.phoneNumber}
                                requiredField={true}
                                showHeader={true}
                                placeholder="Phone Number"
                                control={control}
                                name="phoneNumber"
                                type="number"
                                rules={phoneRules}
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
                <StepperBoxes activeStep={2} />
            </Box>
        </Box>
    )
});

export default CreateAccount;