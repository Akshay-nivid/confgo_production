/**
 * AddProgram component handles the program addition for event
 */
import CustomButton from '@/components/CustomButton/CustomButton';
import CustomRadio from '@/components/CustomRadio/CustomRadio';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { Box, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import AddIcon from '@/assets/svg/program-add.svg';
import EditIcon from '@/assets/svg/edit-program-icon.svg';
import DeleteIcon from '@/assets/svg/delete-program-icon.svg';
import CustomSelect from '@/components/CustomSelectBox/CustomSelect';


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
        food: string;
        beverage: string;
        attendees: string;
        mealTime: string;

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
        food: string;
        beverage: string;
        attendees: string;
        mealTime: string;
    }[];
};
type ProgramProps = {
    formSubmit: boolean;
    onSubmitHandler: (event: any, type: string) => void;
    onSaveHandler: (event: any) => void;
    data: any;
}
const typeArray = [
    { label: 'Paid', value: 'PAID' },
    { label: 'Free', value: 'FREE' }
];

const foodArray = [
    { label: 'Food 1', value: 'FOOD1' },
    { label: 'Food 2', value: 'FOOD2' },
    { label: 'Food 3', value: 'FOOD3' }
];
const beverageArray = [
    { label: 'Beverage 1', value: 'BEVERAGE1' },
    { label: 'Beverage 2', value: 'BEVERAGE2' },
    { label: 'Beverage 3', value: 'BEVERAGE3' }
];

const AddProgram: React.FC<ProgramProps> = React.memo(({ formSubmit, onSubmitHandler, data, onSaveHandler }) => {
    const { handleSubmit, control, watch, setValue } = useForm<FormData>({
        defaultValues: {
            programs: [
                {
                    programName: '',
                    programDescription: '',
                    sessionStartTime: '',
                    sessionEndTime: '',
                    speaker: '',
                    type: 'PAID',
                    price: '',
                    location: '',
                    food: '',
                    beverage: '',
                    attendees: '',
                    mealTime: ''
                },
            ],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'programs',
    });
    const [programIndex, setProgramIndex] = useState(0);

    /**
     * Useeffect hook submits the form based on the formSubmit variable
     */
    useEffect(() => {
        if (formSubmit) {
            handleSubmit(onSubmit)();
        }
    }, [formSubmit])

    /**
     * Method handles the form submission
     * @param data : form data
     */
    const onSubmit: SubmitHandler<FormData> = (data: any) => {
        onSubmitHandler && onSubmitHandler(data?.savedPrograms,'PROGRAM')
    };

    /**
     * Useeffect hook set the field based on the data
     */
    useEffect(() => {
        if (data) {
            setValue('programs', data);
            setValue('savedPrograms', data);
        }
    }, [data])

    /**
     * Method handles the saving of the programs
     */
    const handleSaveNewPrograms = () => {
        setValue('savedPrograms', watch('programs'))
        onSaveHandler && onSaveHandler(watch('programs'))
    }

    /**
     * Method handles the addition of the new program
     */
    const handleAddNewPrograms = () => {
        setValue('programs', watch('savedPrograms'))
        append({
            programName: '',
            programDescription: '',
            sessionStartTime: '',
            sessionEndTime: '',
            speaker: '',
            type: 'PAID',
            price: '',
            location: '',
            food: '',
            beverage: '',
            attendees: '',
            mealTime: ''
        })
        setProgramIndex(watch('savedPrograms')?.length ? watch('savedPrograms').length : 0)
    }

    /**
     * Method handles the Update of the program
     * @param index : index of the program to edit
     */
    const handleEdit = (index: number) => {
        setValue('programs', watch('savedPrograms'))
        setProgramIndex(index);
    }

    /**
     * Method handles the deletion of the program
     * @param index : index of the program to delete
     */
    const handleDelete = (index: number) => {
        setValue('programs', watch('savedPrograms'))
        setProgramIndex(index);
        const programsCopy = [...watch('savedPrograms')]
        programsCopy.splice(index, 1);
        setValue('savedPrograms', programsCopy)
        remove(index)
        if ((index === programsCopy.length)) {
            if (index === 0) {
                append({
                    programName: '',
                    programDescription: '',
                    sessionStartTime: '',
                    sessionEndTime: '',
                    speaker: '',
                    type: 'PAID',
                    price: '',
                    location: '',
                    food: '',
                    beverage: '',
                    attendees: '',
                    mealTime: ''
                })
            }
            else {
                setProgramIndex(index - 1)
            }

        }

    }

    return <Box className="add-program-container">
        <Grid container className="">
            <Grid container size={{ xs: 12, sm: 12 }} direction={'row'} className="">
                <Grid size={{ xs: 12, sm: 8 }} className="add-program-form-container">
                    <Box className="add-program-form-spacing">
                        <Box className="">
                            <Grid alignSelf={"center"}>
                                <Typography textAlign={"start"} variant="h3" lineHeight={2} className="add-program-title" >Add Program</Typography>
                            </Grid>
                            <Box className={"form-wrapper1"}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {fields.map((field, index) => {

                                        if (index === programIndex) {
                                            return <Box key={field.id} mb={2}>
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
                                                            type="time"
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }} >
                                                        <CustomTextField
                                                            placeholder="Session End Time"
                                                            control={control}
                                                            name={`programs.${index}.sessionEndTime`}
                                                            type="time"
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
                                                    <Grid size={{ xs: 12, sm: 12 }} >
                                                        <CustomTextField
                                                            placeholder="Price"
                                                            control={control}
                                                            name={`programs.${index}.price`}
                                                            type="text"
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 12 }}>
                                                        <Typography variant="h3" lineHeight={2} className="add-program-add-ons-title">Add Other Details</Typography>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }} >
                                                        <CustomSelect
                                                            name={`programs.${index}.food`}
                                                            label="Food Option"
                                                            options={foodArray}
                                                            control={control}
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }} >
                                                        <CustomSelect
                                                            name={`programs.${index}.beverage`}
                                                            label="Beverage Option"
                                                            options={beverageArray}
                                                            control={control}
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }} >
                                                        <CustomTextField
                                                            placeholder="Total Attendees"
                                                            control={control}
                                                            name={`programs.${index}.attendees`}
                                                            type="number"
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, sm: 6 }} >
                                                        <CustomTextField
                                                            placeholder="Meal Times"
                                                            control={control}
                                                            name={`programs.${index}.mealTime`}
                                                            type="time"
                                                        />
                                                    </Grid>
                                                    <Grid container direction={'row'}
                                                        justifyContent="right"
                                                        alignItems="center"
                                                        size={{ xs: 12, sm: 12 }}
                                                    >
                                                        <Grid>
                                                            <CustomButton
                                                                className="create-event-next-btn"
                                                                onClick={handleSaveNewPrograms}
                                                                label="Save"
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
                <Grid container direction={'column'} className='add-program-display-container' size={{ xs: 12, sm: 4 }} spacing={2}>
                    <Grid container justifyContent={'right'}>
                        <Grid>
                            <CustomButton
                                className="add-program-add-btn"
                                onClick={handleAddNewPrograms}
                                label="Add"
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<AddIcon />}
                            />
                        </Grid>
                    </Grid>

                    {watch('savedPrograms')?.map((field, index) => (
                        field.programName && (

                            <Grid key={field.id} container className='add-program-display-item' size={{ xs: 12, sm: 12 }}>
                                <Grid size={{ xs: 8, sm: 8 }}>
                                    {field.programName}
                                </Grid>

                                <Grid size={{ xs: 4, sm: 4 }}>
                                    <IconButton onClick={() => handleEdit(index)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>

                            </Grid>
                        )
                    ))}

                </Grid>
            </Grid>
        </Grid>
    </Box>
});

export default AddProgram;