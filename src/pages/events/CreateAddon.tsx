import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import useStore from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import { validateRequiredField } from '@/Utils/Validation';

type FormData = {
    title: string;
    description: string
}
interface createAddonProps {
    closeDrawer: () => void
    submitHandler: (data: any) => void
}

const CreateAddon: React.FC<createAddonProps> = React.memo(({ closeDrawer, submitHandler }: createAddonProps) => {
    const { handleSubmit, control } = useForm<FormData>({});
    const POST = useStore((state: any) => state.POST);
    const setDataById = useStore((state: any) => state.setDataById);
    const [loading, setLoading] = useState(false); // Added loading state
    /**
     * Method to handle form submission
     */
    const onSubmit = (data: any) => {
        data && handleCreateAddOn(data);

    };
    /**
     * method to create a new Addon 
     * @param formData:FormData 
     */
    const handleCreateAddOn = async (formData: FormData) => {
        try {
            setLoading(true);
            const requestBody = {
                name: formData?.title,
                description: formData?.description

            }
            await POST({
                url: 'addon',
                body: requestBody,
                successCB: (response: any) => {
                    submitHandler(response?.data);
                    setDataById("snackBarInfo", {
                        open: true,
                        autoHideDuration: 2000,
                        severity: "success",
                        message: "New Addon Created",
                    });
										closeDrawer();
                },
                errorCB: (error: any) => {
                    setDataById("snackBarInfo", {
                        open: true,
                        autoHideDuration: 2000,
                        severity: "error",
                        message: error.message,
                    })
                }
            });
        } catch (error) {
            Logger.error(error, 'CreateAddon.tsx')
        } finally{
          setLoading(false)
        }
    }
    return (
        <>
            <Grid className="add-on-create" container spacing={2}>
                <Grid container display={"flex"} justifyContent={"space-between"} size={12}>
                    <Typography className='add-on-create-header'>Create New Addon </Typography>
                    <IconButton onClick={closeDrawer} >
                        <CloseIcon />
                    </IconButton>
                </Grid>
                <Grid flexDirection={"column"} size={12} spacing={2}>
                    <Grid>
                        <Grid className="add-on-create-form-wrap">
                            <CustomTextField placeholder='Add-on name' name='title' control={control} rules={{required:validateRequiredField({ fieldName: 'Add-on Name' })}}/>
                        </Grid>
                        <Grid className="add-on-create-form-wrap" >
                            <CustomTextField placeholder='Add-on description' name='description' control={control} />
                        </Grid>
                        <Grid container spacing={2} justifyContent={"flex-end"}>
                            <CustomButton
                                className='add-on-create-btn'
                                label='Submit'
                                onClick={handleSubmit(onSubmit)}
                                isLoading={loading}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
});



export default CreateAddon;
