import { Typography, Button, TextareaAutosize, Box } from '@mui/material';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { SubmitHandler, useForm } from "react-hook-form";
import { useRef, useState } from 'react';
import { validateEmail, validatePhoneNumber, validateRequiredField } from '@/Utils/Validation';
import ReCAPTCHA from 'react-google-recaptcha';
import Grid from '@mui/material/Grid2';
import useStore from '@/Libs/store';    
import { CallIcon } from '@/assets/svg';
import { LocatioIcon } from '@/assets/svg';
import { MessageIcon } from '@/assets/svg';

import apiClient from '@/Libs/Https/API-client';
import { Logger } from '@/Utils/Logger';



interface FormData {
    name: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    companyName: string;
    message: string;
    validateReCAPTCHA: Boolean
}

/**
 * mapping for icons
 */
const boxArray = [

    {
        id: 1,
        icon: <CallIcon className='contact-page-icon' ></CallIcon>,
        label: 'Call us',
        info: '0497 2701371'
    },
    {
        id: 2,
        icon: <LocatioIcon className='contact-page-icon' ></LocatioIcon>,
        label: 'Visit us',
        info: 'Torch Club 18'
    }, {
        id: 3,
        icon: <MessageIcon className='contact-page-icon'></MessageIcon>,
        label: 'Message us',
        info: 'Support@confgo.com'
    }]

/*
 * componenet used to display contact page
 * @returns 
 */
const Contact = () => {
    const { handleSubmit, control } = useForm<FormData>();
    const [recapcha, setRecapcha] = useState(true)
    const recaptchaRef = useRef<ReCAPTCHA>(null);
     const { setDataById }: any = useStore();
   
     /**
    //**
     * change state of recapcha
     * @param value 
     */
    const validateReCAPTCHA = (value: any) => {
        console.log("validate", value);
        const token = value;
        console.log("token", token);
        
        setRecapcha(false);
    };
    /**
     * submit handler
     * @param data 
     */
    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        try {
           
            
            const request = {
                 firstName: data.name,
                lastName: data.lastName,
                companyName: data.companyName,
                gRecaptcha: recaptchaRef.current?.getValue() || '',
                phone: data.phoneNumber,
                email: data.email,
                message: data.message
            }
             const response = await apiClient.post('notification/contact',  request)
           if(response.data.status === 'success'){
            setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message:"Form submitted successfully"})
           }
            console.log('Form submitted successfully:', response.data);
           
        } catch (error) {
            Logger.error('Error submitting form:', error);
               }
    }
    return (

        <Grid container className='contact-page' size={{ lg: 12 }}   >
            
            <Grid container className='contact-container ' size={{ lg: 12, xs: 12 }} spacing={0} justifyContent='center' alignItems='center' >
                <Grid className='contact-header-content'>
                    <Typography className='contact-header-title'>Contact Our Team</Typography>
                    <Typography className='contact-header-description'>Everything you might need and then some more in an accessible and intuitive package.</Typography>
                </Grid>
            </Grid>

            <Grid container className='contact-content' size={12} spacing={2} >
                <Grid container className='contact-content-wrapper' size={{ lg: 12, xs: 12 }} spacing={3} justifyContent='center' >
                    <Grid container size={{ lg: 4, xs: 10 }} className='contact-info' sx={{ order: { xs: 2, lg: 1 } }}>
                        <Box>
                            <Grid container size={{ lg: 12, xs: 12 }} spacing={2} >
                                <Grid size={{ lg: 10, xs: 12 }} className='contact-info_header'>
                                    <Typography className='contact-info_title'>Get in Touch </Typography>
                                    <Typography className='contact-info_description'>Everything you might need and then some more in an accessible and intuitive package.</Typography>
                                </Grid ><Box />

                                <Grid size={{ lg: 6, xs: 12 }} className='contact-info_details'>

                                    {boxArray.map((item) => (

                                        <Grid key={item.id} container className='contact-info_item'>
                                            <Grid size={{ lg: 3 }} className='contact-info_icon'>
                                                {item.icon}
                                            </Grid>
                                            <Grid size={{ lg: 8 }} >
                                                <Typography className='contact-info-label'>{item.label}</Typography>
                                                <Typography className='contact-info-value'>{item.info}</Typography>
                                            </Grid>
                                        </Grid>
                                    ))}

                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid container size={{ lg: 4, xs: 9.5 }} spacing={0} className='contact-form' sx={{ order: { xs: 1, lg: 2 } }}  >

                        <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }} >
                            <Grid container size={{ lg: 12, xs: 12 }} spacing={3} justifyContent='center' alignItems='center'>
                                <Grid size={{ lg: 6, xs: 12 }} >
                                    <CustomTextField
                                        name='name'
                                        label={"First Name"}
                                        type='text'
                                        control={control}
                                        placeholder='First Name'
                                        rules={
                                            {
                                                required: validateRequiredField({})
                                            }
                                        }
                                    /></Grid>
                                <Grid size={{ lg: 6, xs: 12 }}>
                                    <CustomTextField
                                        name='lastName'
                                        label={"Last Nmae"}
                                        placeholder='Last Name'
                                        type='text'
                                        control={control}
                                        rules={
                                            {
                                                required: validateRequiredField({})
                                            }
                                        }
                                    />
                                </Grid>
                                <Grid size={{ lg: 6, xs: 12 }}>
                                    <CustomTextField
                                        control={control}
                                        name="email"
                                        label={"Email Address"}
                                        type="email"
                                        placeholder='Email Address'
                                        rules={
                                            {
                                                required: validateRequiredField({}),
                                                pattern: validateEmail({})
                                            }
                                        }

                                    />
                                </Grid>
                                <Grid size={{ lg: 6, xs: 12 }}>
                                    <CustomTextField
                                        name='phoneNumber'
                                        label="Phone Number"
                                        type='Number'
                                        placeholder='Phone Number'
                                        control={control}
                                        rules={{
                                            required: validateRequiredField({}),
                                            pattern: validatePhoneNumber({})
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ lg: 12, xs: 12 }}>
                                    <CustomTextField
                                        name='companyName'
                                        label="company Name"
                                        type='text'
                                        control={control}
                                        placeholder='Company Name'
                                        rules={{
                                            required: validateRequiredField({})
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ lg: 12, xs: 12 }}>
                                    <TextareaAutosize
                                        className='contact-form-textarea'
                                        aria-label="Message"
                                        placeholder="message....."
                                        name='message'
                                    />
                                </Grid>
                                <Grid className='contact-form-recaptcha'>
                                    <ReCAPTCHA
                                        onChange={validateReCAPTCHA}
                                        ref={recaptchaRef}
                                        sitekey="6LdXx0YqAAAAAM2CU9b3Q0F-w4AtEwvHRbyb8j4C"
                                    /></Grid>
                                <Grid size={{ lg: 12, xs: 12 }} >
                                    <Button fullWidth type='submit' className='contact-form-submit-button' disabled={recapcha}>Submit</Button>
                                </Grid>

                            </Grid>
                        </form>


                    </Grid>

                </Grid>

            </Grid>
        </Grid>

    )
}

export default Contact