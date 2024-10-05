import CustomButton from '@/components/CustomButton/CustomButton';
import CustomRadio from '@/components/CustomRadio/CustomRadio';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { Box, FormControl, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@/assets/svg/edit-program-icon.svg';
import DeleteIcon from '@/assets/svg/delete-program-icon.svg';


type FormData = {
    programs: {
        programName: string;
        programDescription: string;
        sessionStartTime: string;
        sessionEndTime: string;
        speaker: string; // Define speakers as an array of objects
        type: string;
        price: string;
        location: string;
    }[];
    savedPrograms: {
        id?: string;
        programName: string;
        programDescription: string;
        sessionStartTime: string;
        sessionEndTime: string;
        speaker: string; // Define speakers as an array of objects
        type: string;
        price: string;
        location: string;
    }[];
};

const AddProgram = React.memo(() => {
    const navigate = useNavigate();
    const { handleSubmit, control, watch, setValue } = useForm<FormData>({
        defaultValues: {
            programs: [
                {
                    programName: '',
                    programDescription: '',
                    sessionStartTime: '',
                    sessionEndTime: '',
                    speaker: '', // Initialize with one empty speaker
                    type: 'PAID', // Default type
                    price: '',
                    location: '',
                },
            ],
        },
    });
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'programs', // Manage the array of programs
    });
    const [programIndex, setProgramIndex] = useState(0);
    
    const typeArray = [ 
        { label: 'Paid', value: 'PAID' },
        { label: 'Free', value: 'FREE' }
    ];
    const onSubmit: SubmitHandler<FormData> = () => { };
    const handleSaveNewPrograms = () => {
        setValue('savedPrograms',watch('programs'))
        
    }

    const handleAddNewPrograms = () => {
        setValue('programs',watch('savedPrograms'))
        append({
            programName: '',
            programDescription: '',
            sessionStartTime: '',
            sessionEndTime: '',
            speaker: '', 
            type: 'PAID', 
            price: '',
            location: '',
        })
        setProgramIndex(watch('savedPrograms').length)
    }

    const handleEdit = (index: number) => {
        setValue('programs',watch('savedPrograms'))
        setProgramIndex(index);
    }

    const handleDelete = (index: number) => {
        setValue('programs',watch('savedPrograms'))
        setProgramIndex(index);
        const programsCopy = [...watch('savedPrograms')]
        programsCopy.splice(index, 1);
        setValue('savedPrograms',programsCopy)
 
        remove(index)
        if((index === programsCopy.length)){
            if(index === 0){
                append({
                    programName: '',
                    programDescription: '',
                    sessionStartTime: '',
                    sessionEndTime: '',
                    speaker: '', 
                    type: 'PAID', 
                    price: '',
                    location: '',
                })
            }
            else{
                setProgramIndex(index-1)
            }
            
        }
        
    }

    return <Box className="add-program-container">
        <Grid container className="">
            <Grid container size={{ xs: 12, sm: 12 }} direction={'row'} className="">
                <Grid size={{ xs: 12, sm: 8 }}>
                <Box className="">
                    <Box className="">
                        <Grid alignSelf={"center"}>
                            <Typography textAlign={"center"} variant="h3" lineHeight={2} >Add Programmes</Typography>
                        </Grid>
                        <Box className={"form-wrapper1"}>
                            <form onSubmit={handleSubmit(onSubmit)} className="form1">
                            {fields.map((field, index) => {
                                
                                if(index === programIndex){
                                return <Box key={field.id} mb={2}>
                                {/* <FormControl > */}
                                <Grid container size={{ xs: 12, sm: 12 }} spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Program Name"
                                        control={control}
                                        name={`programs.${index}.programName`}
                                        type="text"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Program Description"
                                        control={control}
                                        name={`programs.${index}.programDescription`}
                                        type="text"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Session Start Time"
                                        control={control}
                                        name={`programs.${index}.sessionStartTime`}
                                        type="date"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Session End Time"
                                        control={control}
                                        name={`programs.${index}.sessionEndTime`}
                                        type="date"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Speaker(s)"
                                        control={control}
                                        name={`programs.${index}.speaker`}
                                        type="text"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Location"
                                        control={control}
                                        name={`programs.${index}.location`}
                                        type="text"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12 }} >
                                        <CustomRadio
                                            control={control}
                                            name={`programs.${index}.type`}
                                            label=""
                                            options={typeArray}
                                            row={true}
                                            value={'PAID'}
                                        />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Price"
                                        control={control}
                                        name={`programs.${index}.price`}
                                        type="text"
                                    />
                                </Grid>


                                
                                    <Grid container direction={'row'}
                                    justifyContent="center" 
                                    alignItems="center"  
                                    style={{ width: '100%' }} 
                                    size={{ xs: 12, sm: 12 }}
                                    >
                                        <Grid>
                                            <CustomButton
                                                className="create-event-back-btn"
                                                onClick={handleAddNewPrograms}
                                                label="Add New Programmes"
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                            />
                                        </Grid>
                                        <Grid>
                                            <CustomButton
                                                className="create-event-next-btn"
                                                onClick={handleSaveNewPrograms}
                                                label="Save New Programmes"
                                                variant="contained"
                                                size="large"
                                            />
                                        </Grid>
                                    </Grid>
                                   
                                
                                
                                </Grid>
                                </Box>
                                }
})}
                                
                            </form>
                        </Box>
                    </Box>
                </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }} spacing={2}>
                {watch('savedPrograms')?.map((field, index) => (
                    field.programName && (<Box key={field.id} mb={2}>

                        <Grid container className='add-program-display-item' size={{ xs: 12, sm: 12 }}>
                            <Grid size={{ xs: 9, sm: 9 }}>
                                {field.programName}
                            </Grid>

                            <Grid size={{ xs: 3, sm: 3 }}>
                                <IconButton onClick={() => handleEdit(index)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>

                        </Grid>
                    </Box>)
                ))}
                   
                </Grid>
            </Grid>
        </Grid>
    </Box>
  });
  
  export default AddProgram;