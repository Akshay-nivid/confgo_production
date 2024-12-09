import { Typography, Button, TextareaAutosize, Box } from '@mui/material';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { SubmitHandler, useForm } from "react-hook-form";
import { useRef, useState } from 'react';
import { phoneRules, validateEmail,  validateRequiredField } from '@/Utils/Validation';
import ReCAPTCHA from 'react-google-recaptcha';
import Grid from '@mui/material/Grid2';
import useStore from '@/Libs/store';
import { CallIcon } from '@/assets/svg';
import { LocatioIcon } from '@/assets/svg';
import { MessageIcon } from '@/assets/svg';
import { Logger } from '@/Utils/Logger';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import CustomPhone from '@/components/CustomPhone/CustomPhone';
import { countries } from '@/Utils/country/country';


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
    const { handleSubmit, control, formState: { errors }} = useForm<FormData>();
    const [recapcha, setRecapcha] = useState(true)
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const POST = useStore((state: any) => state.POST);
    const setDataById = useStore((state: any) => state.setDtaById);
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedCountryCode, setSelectedCountryCode] = useState("+91");

    const handleCountryChange = (code: string) => {
        setSelectedCountryCode(code);
    };

    const handlePhoneNumberChange = (number: string) => {
        setPhoneNumber(number);
    };

/**
 * change state of recapcha
 * @param value 
 */
    const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
    const validateReCAPTCHA = (value: string | null) => {
        if (value) {
            setRecapcha(false);
            setRecaptchaError(null);
        } else {
            setRecapcha(true);
            setRecaptchaError('Please complete the reCAPTCHA');
        }
    };

    /**
     * submit handler
     * @param data 
     */
    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        const fullPhoneNumber = `${selectedCountryCode}` + data.phoneNumber;
        const body = {
            firstName: data.name,
            lastName: data.lastName,
            companyName: data.companyName,
            gRecaptcha: recaptchaRef.current?.getValue() || '',
            phone: fullPhoneNumber,
            email: data.email,
            message: data.message
        }
        
        /**
         * function to make api call
         */
        POST({
            url: 'notification/contact', body: body,
            id: 'contact',
            successCB: successCB,
            errorCB: (error: any) => Logger.error("error", error)
        })
        /**
         * success callback function
         */
        function successCB(_context: any) {
            setDataById("thankYouPageInfo", { type: "Submitted sucessfully", redirectTo: routes.userLogin() });
            navigate(routes.thankyou());
        }
    };
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
                        <form noValidate onSubmit={handleSubmit(onSubmit)} >
                            <Grid container size={{ lg: 12, xs: 12 }} spacing={3} justifyContent='center' alignItems='center'>
                                <Grid size={{ lg: 6, xs: 12 }} >
                                    <CustomTextField
                                        name='name'
                                        label={"First Name"}
                                        type='text'
                                        control={control}
                                        rules={
                                            {
                                                required: validateRequiredField({})
                                            }
                                        }
                                    /></Grid>
                                <Grid size={{ lg: 6, xs: 12 }}>
                                    <CustomTextField
                                        name='lastName'
                                        label={"Last Name"}
                                        type='text'
                                        control={control}
                                        rules={
                                            {
                                                required: validateRequiredField({})
                                            }
                                        }
                                    />
                                </Grid>
                                <Grid size={{ lg: 12, xs: 12 }}>
                                    <CustomTextField
                                        control={control}
                                        name="email"
                                        label={"Email Address"}
                                        type="email"
                                        rules={
                                            {
                                                required: validateRequiredField({}),
                                                pattern: validateEmail({})
                                            }
                                        }
                                    />
                                </Grid>
                                <Grid size={{ lg: 12, xs: 12 }}>
                                    <CustomPhone
                                        countries={countries}
                                        selectedCountryCode={selectedCountryCode}
                                        onCountryChange={handleCountryChange}
                                        phoneNumber={phoneNumber}
                                        control={control}
                                        onPhoneNumberChange={handlePhoneNumberChange}
                                        placeholder="Phone Number"
                                        removeBorder={true}
                                        error={errors.phoneNumber}
                                        
                                    />
                                </Grid>
                                <Grid size={{ lg: 12, xs: 12 }}>
                                    <CustomTextField
                                        name='companyName'
                                        label="Company Name"
                                        type='text'
                                        control={control}
                                        rules={{
                                            required: validateRequiredField({})
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ lg: 12, xs: 12 }}>
                                    <TextareaAutosize
                                        className='contact-form-textarea'
                                        aria-label=""
                                        placeholder="Type here....."
                                        name='message'
                                    />
                                </Grid>
                                <Grid className='contact-form-recaptcha'>
                                    <ReCAPTCHA
                                        onChange={validateReCAPTCHA}
                                        ref={recaptchaRef}
                                        sitekey="6LdXx0YqAAAAAM2CU9b3Q0F-w4AtEwvHRbyb8j4C"
                                    />
                                    {recaptchaError && (
                                        <Typography color="error" variant="caption">
                                            {recaptchaError}
                                        </Typography>
                                    )}
                                </Grid>
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