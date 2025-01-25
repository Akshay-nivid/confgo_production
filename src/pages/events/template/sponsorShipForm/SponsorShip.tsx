import { Typography, TextareaAutosize } from '@mui/material';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from 'react';
import { validateEmail, validateRequiredField } from '@/Utils/Validation';
import ReCAPTCHA from 'react-google-recaptcha';
import Grid from '@mui/material/Grid2';
import useStore, { setDataById } from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import CustomButton from '@/components/CustomButton/CustomButton';
import CustomPhone from '@/components/CustomPhone/CustomPhone';
import { countries } from '@/Utils/country/country';


interface FormData {
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    companyName: string;
    message: string;
    validateReCAPTCHA: Boolean | string
}

const SponsorShip = () => {

    const { handleSubmit, control, formState: { errors }, setValue, register } = useForm<FormData>({
        reValidateMode: "onSubmit"
    });
    const [recapcha, setRecapcha] = useState(true)
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const POST = useStore((state: any) => state.POST);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedCountryCode, setSelectedCountryCode] = useState("+91");

    const isLoading = useStore(state => state.compData?.['sponsorContact']?.['notification/contact']?.loading) || false

    const handleCountryChange = (code: string) => {
        setSelectedCountryCode(code);
    };

    const handlePhoneNumberChange = (number: string) => {
        setPhoneNumber(number);
    };


    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            setValue("name", '')
            setValue("lastName", '')
            setValue("companyName", '')
            setValue("phoneNumber", '')
            setValue("email", '')
            setValue("validateReCAPTCHA", '')
            setValue("message", '')
        }, 100)

        return () => clearTimeout(timer)
    }, [refreshKey])

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
            id: 'sponsorContact',
            successCB: (context: any) => {
                console.log(context)

                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: "Form Submitted Successfuly " });
                // snackBar({ severity: 'success', message:context?.message});
                setRefreshKey((prev) => prev + 1)
            },
            errorCB: (error: any) => {
                console.log(error)
                Logger.error("error", error)
            }
        })
    }
    return (
        <Grid container className='sponsor-page' size={{ lg: 12 }}>
            <Grid container className='sponsor-container ' size={{ lg: 12, xs: 12 }} spacing={0} justifyContent='center' alignItems='center'>
                <Grid className='sponsor-header-content' paddingInline={2} size={{ lg: 12, xs: 12 }} container >
                    <Typography className='sponsor-header-title'>Partner with Us as a Sponsor </Typography>
                    <Grid container size={8}>
                        <Typography className='sponsor-header-description'>Unlock unique opportunities to showcase your brand and connect with our audience. Fill out the form below to explore sponsorship possibilities tailored to your goals.</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container className='sponsor-content' size={12} spacing={2} >
                <Grid container className='sponsor-content-wrapper' size={{ lg: 12, xs: 12 }} spacing={3} justifyContent='center' >
                    <Grid container size={{ lg: 5, xs: 12, sm: 10, md: 6 }} paddingInline={1.6} spacing={0} className='sponsor-form' sx={{ order: { xs: 1, lg: 2 } }}  >
                        <form className='w-full' noValidate onSubmit={handleSubmit(onSubmit)} >
                            <Grid container size={{ lg: 12, xs: 12 }} spacing={3} justifyContent='center' alignItems='center'>
                                <Grid size={{ lg: 6, xs: 12 }}  >
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
                                <Grid size={{ lg: 6, xs: 12 }}  >
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
                                <Grid size={{ lg: 12, xs: 12 }}  >
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
                                <Grid size={{ lg: 12, xs: 12 }}  >
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
                                <Grid size={{ lg: 12, xs: 12 }}  >
                                    <CustomPhone
                                        countries={countries}
                                        selectedCountryCode={selectedCountryCode}
                                        onCountryChange={handleCountryChange}
                                        phoneNumber={phoneNumber}
                                        control={control}
                                        onPhoneNumberChange={handlePhoneNumberChange}
                                        placeholder="Phone Number"
                                        error={errors.phoneNumber}


                                    />
                                </Grid>

                                <Grid size={{ lg: 12, xs: 12 }}>
                                    <TextareaAutosize
                                        className='sponsor-form-textarea'
                                        aria-label=""
                                        placeholder="Type here....."
                                        {...register("message", {
                                            required: "Message is required",
                                        })}
                                    />
                                    {errors.message && <Typography className="error-message">{errors.message.message}</Typography>}
                                </Grid>
                                <Grid className='sponsor-form-recaptcha'>
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
                                <Grid size={{ lg: 12, xs: 12 }} container justifyContent={"center"} alignItems={"center"}>
                                    <Grid container size={4}>
                                        <CustomButton
                                            isLoading={isLoading}
                                            size='large' fullWidth type='submit' className='sponsor-form-submit-button' disabled={recapcha} label='Submit'></CustomButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}


export default SponsorShip;