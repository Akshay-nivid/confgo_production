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
import { emailRules, phoneRules } from "@/Utils/Validation";
/*
 * funtional componet to render create form field
 */
const CreateAccount = React.memo(() => {
    const { setDataById }: any = useStore();
    const form2 = useStore((state: any) => state?.compData?.['form2']) ?? [];
    const { handleSubmit, control } = useForm<FormData>();
    /*
     * function to handle form submission 
     */
    const onSubmit: SubmitHandler<FormData> = (data) => {
        setDataById('register', { data: 'ADD_ORGANIZATION_PAGE', field_values: data, step: 3 });
        setDataById('form2', { field_values: data });
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

    return (
        <Grid>
            <Grid  container spacing={5}  >
                <Grid className="signup-content-wrapper">
                    <Grid className="left-inner-content-add-create">
                        <Grid container spacing={2}>
                        <Grid  alignSelf={"center"}>
                            <Typography className="left-plan-text" textAlign={"center"} variant="h3" lineHeight={2} >Create Your Account</Typography>
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
                                                label="Full Name *"
                                                control={control}
                                                name="fullName"
                                                type="text"
                                                rules={{ 
                                                    required:{value:true,message:"Name is required"},
                                                    pattern: {
                                                        value: /^(?!\s*$)(?!\s+$).+/,
                                                    message: "Name cannot be only spaces"
                                                },
                                                 }}
                                            />
                                        </Grid>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form2?.field_values?.lastName}
                                                placeholder="Last Name"
                                                label="Last Name *"
                                                control={control}
                                                name="lastName"
                                                type="text"
                                                rules={{ 
                                                    required:{value:true,message:"Last Name is required"},
                                                    pattern: {
                                                        value: /^(?!\s*$)(?!\s+$).+/,
                                                    message: "Last name cannot be only spaces"
                                                },
                                                 }}
                                            />
                                        </Grid>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form2?.field_values?.email}
                                                placeholder="Email"
                                                label="Email *"
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
                                                label="Phone Number *"
                                                control={control}
                                                name="phoneNumber"
                                                type="text"
                                                rules={phoneRules}
                                                isNumeric={true}
                                                max={10}
                                            />
                                        </Grid>
                                    </Grid>
                                </FormControl>
                                <Grid container mb={2} className="w-full" >
                                    <CustomButton
                                    type="submit"
                                        className="add-organization-btn"
                                        label="Proceed to Company Details"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                    
                                    />
                                </Grid>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
});

export default CreateAccount;