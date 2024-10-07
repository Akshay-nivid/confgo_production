import { setFormValues } from '@/Utils/CommonBaseClass';
import CustomButton from '@/components/CustomButton/CustomButton';
import CustomRadio from '@/components/CustomRadio/CustomRadio';
import CustomSelect from '@/components/CustomSelectBox/CustomSelect';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { Box, FormControl, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';


const ConferenceDetails: React.FC = React.memo(() => {
    



    return <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'center'} alignItems={'center'} className="custom-stepper-conference-details">
        <Grid size={{ xs: 12, sm: 12 }}>
            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="create-event-title">Conference Details</Typography>
        </Grid>
        <Grid container direction={'column'} justifyContent={'flex-start'} alignItems={'flex-start'}  size={{ xs: 12, sm: 12 }} className="custom-stepper-conference-details-content-container" >
            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-title">Katcon 2024</Typography>
            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-sub-title">Online</Typography>
            <span>&bull; August 25,2024 Sunday.</span><br />
            <span>&bull; Govt Medical College Thrissur.</span><br />
            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-sub-title">Programmes</Typography>
            <span>&bull; August 25,2024 Sunday.</span><br />
            <span>&bull; Govt Medical College Thrissur.</span><br />

            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="custom-stepper-conference-details-content-sub-title">Add-Ons</Typography>
            <span>&bull; August 25,2024 Sunday.</span><br />
            <span>&bull; Govt Medical College Thrissur.</span><br />
        </Grid>


    </Grid>
});
  
  export default ConferenceDetails;