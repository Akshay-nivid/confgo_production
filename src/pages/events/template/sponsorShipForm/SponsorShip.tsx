import { Typography, TextareaAutosize } from '@mui/material';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { SubmitHandler, useForm } from "react-hook-form";
import { useRef, useState } from 'react';
import { validateEmail, validateRequiredField } from '@/Utils/Validation';
import ReCAPTCHA from 'react-google-recaptcha';
import Grid from '@mui/material/Grid2';
import useStore, { setDataById } from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import CustomButton from '@/components/CustomButton/CustomButton';

interface FormData {
    name: string;
    lastName: string;
    jobTitle: string;
    email: string;
    phoneNumber: string;
    companyName: string;
    message: string;
    validateReCAPTCHA: Boolean | string
}
/**
 * SponsorShip Component
 * 
 * This functional component renders the sponsorship form, 
 * allowing users to fill in their details and submit sponsorship requests.
 * It includes fields for user input, validation messages, and a ReCAPTCHA 
 * for additional security.
 * 
 * @returns {JSX.Element} The rendered JSX content for the sponsorship form.
 */

const SponsorShip = (Id: any) => {
    const eventId = Id?.eventId;
    const { handleSubmit, control, formState: { errors }, setValue, register } = useForm<FormData>({
        reValidateMode: "onSubmit"
    });
    const [recapcha, setRecapcha] = useState(true)
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const POST = useStore((state: any) => state.POST);

    /**
     * Button loder
     */
    const isLoading = useStore(state => state.compData?.['sponsorContact']?.['notification/contact']?.loading) || false

    /**
    * Function to reset the form fields after successful validation and integration.
    */
    type FormFields =
        | "name"
        | "lastName"
        | "jobTitle"
        | "email"
        | "phoneNumber"
        | "companyName"
        | "message"
        | "validateReCAPTCHA";

    const resetFormValues = () => {
        const defaultValues: Record<FormFields, string> = {
            name: '',
            lastName: '',
            jobTitle: '',
            companyName: '',
            phoneNumber: '',
            email: '',
            validateReCAPTCHA: '',
            message: '',
        };

        Object.entries(defaultValues).forEach(([key, value]) => {
            setValue(key as FormFields, value);
        });
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
        const body = {
            firstName: data.name,
            lastName: data.lastName,
            jobTitle: data.jobTitle,
            companyName: data.companyName,
            gRecaptcha: recaptchaRef.current?.getValue() || '',
            phone: data.phoneNumber,
            email: data.email,
            message: data.message,
            eventId: eventId,
        }

        /**
         * function to make api call
         */
        POST({
            url: 'notification/sponsorshipInterest', body: body,
            id: 'sponsorContact',
            successCB: (_context: any) => {
                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: "Form Submitted Successfuly " });
                resetFormValues();
            },
            errorCB: (error: any) => {
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
                                    <Typography className="sponsor-form-label">
                                        First Name<span className="star">*</span>
                                    </Typography>
                                    <CustomTextField
                                        className="sponsor-form-label-input"
                                        name='name'
                                        placeholder={" First Name"}
                                        type='text'
                                        showOutlinedText={false}
                                        control={control}
                                        rules={
                                            {
                                                required: validateRequiredField({}),
                                                pattern: {
                                                    value: /^[A-Za-z\s]+$/,
                                                    message: "First name must contain only alphabetic characters and spaces.",
                                                },
                                            }
                                        }
                                    /></Grid>
                                <Grid size={{ lg: 6, xs: 12 }}  >
                                    <Typography className="sponsor-form-label">
                                        Second Name<span className="star">*</span>
                                    </Typography>
                                    <CustomTextField
                                        className="sponsor-form-label-input"
                                        name='lastName'
                                        placeholder={"Last Name"}
                                        type='text'
                                        showOutlinedText={false}
                                        control={control}
                                        rules={{
                                            required: validateRequiredField({}),
                                            pattern: {
                                                value: /^[A-Za-z\s]+$/,
                                                message: "Last name must contain only alphabetic characters and spaces.",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ lg: 6, xs: 12 }}  >
                                    <Typography className="sponsor-form-label">
                                        Job Title<span className="star">*</span>
                                    </Typography>
                                    <CustomTextField
                                        className="sponsor-form-label-input"
                                        name='jobTitle'
                                        showOutlinedText={false}
                                        placeholder="Job Title"
                                        type='text'
                                        control={control}
                                    />
                                </Grid>
                                <Grid size={{ lg: 6, xs: 12 }}  >
                                    <Typography className="sponsor-form-label">
                                        Organisation Name<span className="star">*</span>
                                    </Typography>
                                    <CustomTextField
                                        className="sponsor-form-label-input"
                                        name='companyName'
                                        showOutlinedText={false}
                                        placeholder="Company Name"
                                        type='text'
                                        control={control}
                                        rules={{
                                            required: validateRequiredField({})
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ lg: 6, xs: 12 }} >
                                    <Typography className="sponsor-form-label">
                                        Email<span className="star">*</span>
                                    </Typography>
                                    <CustomTextField
                                        className="sponsor-form-label-input"
                                        control={control}
                                        name="email"
                                        showOutlinedText={false}
                                        placeholder={"Email Address"}
                                        type="email"
                                        rules={
                                            {
                                                required: validateRequiredField({}),
                                                pattern: validateEmail({})
                                            }
                                        }
                                    />
                                </Grid>
                                <Grid size={{ lg: 6, xs: 12 }} >
                                    <Typography className="sponsor-form-label">
                                        Phone Number<span className="star">*</span>
                                    </Typography>
                                    <CustomTextField
                                        className="sponsor-form-label-input"
                                        placeholder="Phone"
                                        control={control}
                                        name="phoneNumber"
                                        showOutlinedText={false}
                                        type="text"
                                        isNumeric={true}
                                        rules={{
                                            required: 'Phone is required',
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ lg: 12, xs: 12 }}>
                                    <Typography className="sponsor-form-label">
                                        Message<span className="star">*</span>
                                    </Typography>
                                    <TextareaAutosize
                                        className='sponsor-form-textarea'
                                        aria-label=""
                                        placeholder="Enter message"
                                        {...register("message")}
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