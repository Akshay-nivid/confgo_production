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
/*
 * Organization form 
 */
const AddOrganization = React.memo(() => {
    const { handleSubmit, control,getValues } = useForm<FormData>();
    const { setDataById} :any= useStore();
    const pageSwitch = useStore((state: any) => state?.compData?.['register']) ?? [];
    const form3=useStore((state: any) => state?.compData?.['form3']) ?? [];
    // form submission function
    const onSubmit: SubmitHandler<FormData> = () => { };
/*
 * Component used to handle form and switching form 
 */
    const handleClick = () => {
        const values = getValues();
        if(!values.organizationName||!values.organizationAddress||!values.organizationAddress||!values.organizationEmail){
            return
        }else{
            setDataById('register',{data:'four'});
            setDataById('form3',{field_values:values});
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
 * function handle back of function 
 */
    const handleBack=()=>{
        if(pageSwitch.data=='three'){
            setDataById('register',{data:'two'});    
        }
       }
    return (
        <Box className="left-content-wrapper">
            <Box className="left-inner-content">
            <Grid  container flexDirection={"row"} spacing={2} alignSelf={"start"} onClick={handleBack}>
            <ArrowBackIcon />
            <Typography>Back</Typography>
            </Grid>
                <Grid alignSelf={"center"}>
                    <Typography fontWeight={800} textAlign={"center"} variant="h3" lineHeight={2} >Add Organization Details</Typography>
                    <Typography textAlign={"center"} variant="h6">Join us and streamline your conference<br /> management today.</Typography>
                </Grid>
                <Box className={"form-wrapper"}>
                    <form onSubmit={handleSubmit(onSubmit)} className="form">
                        <FormControl >
                            <CustomTextField
                            defaultValue={form3?.field_values?.organizationName}
                              requiredField={true}
                              showHeader={true}
                                placeholder="Organization Name"
                                control={control}
                                name="organizationName"
                                type="text"
                            />
                            <CustomTextField
                            defaultValue={form3?.field_values?.organizationEmail}
                              requiredField={true}
                              showHeader={true}
                                placeholder="Organization Email"
                                control={control}
                                name="organizationEmail"
                                type="text"
                            />
                            <CustomTextField
                            defaultValue={form3?.field_values?.organizationPhone}
                              requiredField={true}
                              showHeader={true}
                                placeholder="Organization Phone"
                                name="organizationPhone"
                                type="number"
                                control={control}
                            />
                            <CustomTextField
                              defaultValue={form3?.field_values?.organizationAddress}
                              requiredField={true}
                              showHeader={true}
                                placeholder="Organization Address"
                                control={control}
                                name="organizationAddress"
                                type="text"
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
                <StepperBoxes activeStep={3}/>
            </Box>
        </Box>
    )
});

export default AddOrganization;