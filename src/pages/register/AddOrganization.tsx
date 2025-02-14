import Grid from "@mui/material/Grid2";
import React, { useState } from 'react';
import {
    Backdrop,
    Box,
    CircularProgress,
    FormControl,
    Typography,
} from "@mui/material";
import CustomButton from "@/components/CustomButton/CustomButton";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import useStore from "@/Libs/store";
import { emailRules } from "@/Utils/Validation";
import { processAPIResponse} from "@/Utils/CommonBaseClass";
import apiClient from "@/Libs/Https/API-client";

/*
 * Organization form 
 */
const AddOrganization = React.memo(() => {
    const { handleSubmit, control } = useForm<FormData>();
    const { setDataById}: any = useStore();
    const form1 = useStore((state: any) => state?.compData?.['form1']) ?? [];
    const form2 = useStore((state: any) => state?.compData?.['form2']) ?? [];
    const form3 = useStore((state: any) => state?.compData?.['form3']) ?? [];
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const formdata2 = useStore((state:any)=>state.compData?.form2.field_values)
    /*
     * function to handle submission of the form and create new company
     */
    const onSubmit: SubmitHandler<FormData> = (data) => { 
        setDataById('form3', { field_values: data });
        createAccount(data)
        setIsButtonDisabled(true); 

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
     * Function to create a new Account for company
     *
     */
    const createAccount = async (organiztionData: FormData) => {
        try {
            const req = {
                firstName: form2.field_values.fullName,
                lastName: form2.field_values.lastName,
                email: form2.field_values.email,
                phone: form2.field_values.phoneNumber,
                companyPhone: organiztionData.organizationPhone,
                companyEmail: organiztionData.organizationEmail,
                companyName: organiztionData.organizationName,
                companyAddress: organiztionData.organizationAddress,
                planId: form1.field_values.id,
                statusId: 1
            }
            const response = await apiClient.post('company', req);
            const { status, data, message } = processAPIResponse(response, 'company create')
            if (status) {
                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: "Registration Successfully and Please Complete Payment for Completion" });
                setDataById('form3', { companyData: data });
                setDataById('register', { data: 'PAYMENT_METHOD_PAGE',step:4 });
                setIsButtonDisabled(true); 
            }
            else{
                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: message});
                setIsButtonDisabled(false); // Disable the button

            }

        } catch (error: any) {
            setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: error.response.data.message })
        }
    }

    return (
        <Grid>
             <Backdrop  open={isButtonDisabled} className="circularProgress">
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container spacing={5}  >
                <Grid className="signup-content-wrapper">
                    <Grid className="left-inner-content-add-org">
                        <Grid alignSelf={"center"}>
                            <Typography className="add-org-heading-text" textAlign={"center"} variant="h3" >Add Organization Details</Typography>
                            <Typography className="add-org-description-text" textAlign={"center"} variant="h6" mb={2}>Join us and streamline your conference<br /> management today.</Typography>
                        </Grid>
                        <Box className={"form-wrapper"}>
                            <form onSubmit={handleSubmit(onSubmit)} className="form">
                                <FormControl >
                                    <Grid container spacing={2} className="form-fields-container">
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form3?.field_values?.organizationName}
                                                placeholder="Organization Name"
                                                label="Organization Name"
                                                control={control}
                                                name="organizationName"
                                                type="text"
                                                rules={{ 
                                                    required:{value:true,message:"Organization name is required"},
                                                    pattern: {
                                                            value: /^(?=.*[a-zA-Z0-9])(?!\s*$).+$/,
                                                        message: "Organization name cannot be only spaces or special characters"
                                                    },
                                                    maxLength: {
                                                        value: 30,
                                                        message: "Organization name cannot exceed 30 characters"
                                                    }
                                                      
                                                 }}
                                            />
                                        </Grid>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form3?.field_values?.organizationEmail ? form3?.field_values?.organizationEmail : formdata2?.email}
                                                placeholder="Organization Email"
                                                label="Organization Email"
                                                control={control}
                                                name="organizationEmail"
                                                type="text"
                                                rules={emailRules}
                                            />
                                        </Grid>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form3?.field_values?.organizationPhone ? form3?.field_values?.organizationPhone : formdata2?.phoneNumber}
                                                placeholder="Organization Phone"
                                                label="Organization Phone"
                                                name="organizationPhone"
                                                type="text"
                                                control={control}
                                                //rules={phoneRules}
                                                isNumeric={true}
                                                max={10}
                                            />

                                        </Grid>
                                        <Grid container className='w-full'>
                                            <CustomTextField
                                                defaultValue={form3?.field_values?.organizationAddress}
                                                placeholder="Organization Address"
                                                label="Organization Address"
                                                control={control}
                                                name="organizationAddress"
                                                type="text"
                                                rules={{ 
                                                    required:{value:true,message:"Organization address is required"},
                                                    pattern: {
                                                        value: /^(?=.*[a-zA-Z0-9])(?!\s*$).+$/,
                                                        message: "Organization address cannot be only spaces or special characters"
                                                    }
                                                 }}
                                        
                                            />
                                        </Grid>
                                    </Grid>
                                </FormControl>
                                <Grid container className="w-full button-margin-bm" >
                                    <CustomButton
                                        type="submit"
                                        className="add-organization-btn"
                                        label="Complete Registration"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        disabled={isButtonDisabled}
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

export default AddOrganization;