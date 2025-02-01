import { Box, FormLabel, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2"
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import FileUpload from "@/components/FileUpload/FileUpload";
import useStore, { POST, snackBar } from "@/Libs/store";
import CustomButton from "@/components/CustomButton/CustomButton";
import { z } from "zod";
import config from "../../../../config.json";

interface NewSpeakerDrawerProps {
    onSuccess?: () => void;
    closeDrawer?: () => void;
}
const DrawerCreateSponosor: React.FC<NewSpeakerDrawerProps> = ({ onSuccess, closeDrawer }: NewSpeakerDrawerProps) => {
    const isLoading = useStore((state: any) => state.compData?.['createSponsor']?.['sponsor']?.loading) || false
    const baseUrl = config.api.url;
    const schema = z.object({
        name: z.string({ message: "Name is required" }).min(3, { message: "Name is required" }),
        email: z.string({ message: "Email is required" }).email({ message: "Please enter a valid email" }),
        phone: z.string({ message: "Phone is required" }).regex(/^\+?[0-9\s\-()]+$/, {
            message: "Please enter a valid phone number",
        }),
        website: z.string().optional(),
        logoId: z.union([z.string(), z.number()]).optional(),
        bannerId: z.union([z.string(), z.number()]).optional(),
    })

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            website: '',
            logoId: '',
            bannerId: ''
        },
        resolver: zodResolver(schema),
        reValidateMode: "onChange"
    })

    function onSubmit(data: any) {

        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        const website = data?.website?.trim();

        if (website) {
            const isUrlValid = urlRegex.test(website);
            if (!isUrlValid) {
                form.setError('website', { message: 'Please enter a valid URL' });
                return;
            }
        } else {
            form.clearErrors('website');
        }
        const body = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            ...(data.logoId && { logoAssetId: data.logoId }),
            ...(data.bannerId && { bannerImgAssetId: data.bannerId }),
            companyId: sessionStorage.getItem('companyId'),
            ...(website && { website })
        }

        POST({
            url: 'sponsor', body: body, id: 'createSponsor', successCB: () => {
                form.reset();

                closeDrawer && closeDrawer()

                onSuccess && onSuccess()

                snackBar({ severity: 'success', message: 'Sponsor created successfully' })

            }, errorCB: (error) => {
                snackBar({ severity: 'error', message: error?.message || 'something went wrong' })
            }
        })
    }
    function handleFileUpload(file: any, key: 'logoId' | 'bannerId') {

        form.setValue(key, file?.id)
    }
    const bannerId = form.watch('bannerId')
    const logoId = form.watch('logoId')
    /**
     * Handles removing the logo or banner image from the sponsor form.
     * @param {React.MouseEvent} e The event that triggered the function.
     * @param {'logoId' | 'bannerId'} type The type of image to remove.
     */
    function handleRemoveImage(e: React.MouseEvent, type: 'logoId' | 'bannerId') {
        e.preventDefault()
        e.stopPropagation()
        form.setValue(type, '')
    }
    return <Grid>
        <Box className="sponsor-drawer-content">
            <Box className="header-container">
                <Typography className="header-container-label">Create new sponsor</Typography>
                <IconButton onClick={closeDrawer}>
                    <CloseIcon className='header-container-close' />
                </IconButton>
            </Box>
            <Box>
                <form className='form' onSubmit={form.handleSubmit(onSubmit)}>
                    <CustomTextField control={form.control} name='name' placeholder='Sponsor Name' />
                    <CustomTextField control={form.control} name='email' placeholder='Email' />
                    <CustomTextField control={form.control} name='phone' placeholder='Phone Number' />
                    <CustomTextField control={form.control} name='website' placeholder='(e.g., https://www.example.com)' label='Website Url' />
                    <Box className="form-file-upload">
                        <FormLabel className='form-file-upload-label'>Please upload the sponsor logo</FormLabel>
                        { logoId ? (
                        <Box className="form-file-upload-image-logo" >
                            <Box className='relative w-max flex gap-x-1'>
                                <img src={`${baseUrl}/asset/${logoId}`} alt='' />
                                <IconButton onClick={(e) => handleRemoveImage(e, 'logoId')} className='form-file-upload-image-logo-close'>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box> 
                        ) : 
                        ( <FileUpload onFileSelect={() => { }} onSubmit={(file) => handleFileUpload(file, 'logoId')} className='form-file-upload-input' /> )}
                    </Box>
                    <Box className="form-file-upload">
                        <FormLabel className='form-file-upload-label'>Please upload the sponsor banner</FormLabel>
                       { bannerId ?  (
                        <Box className="form-file-upload-image-banner" >
                            <Box className='relative w-max flex gap-x-1'>
                                <img src={`${baseUrl}/asset/${bannerId}`} alt='' />
                                <IconButton onClick={(e) => handleRemoveImage(e, 'bannerId')} className='form-file-upload-image-logo-close'>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>
                        ) :
                       ( <FileUpload onSubmit={(file) => handleFileUpload(file, 'bannerId')} className='form-file-upload-input' /> )}             
                    </Box>
                    <Box className="form-button-container">
                        <CustomButton isLoading={isLoading} disabled={isLoading} label='Submit' type='submit' />
                    </Box>
                </form>
            </Box>
        </Box>
    </Grid>
}

export default DrawerCreateSponosor;