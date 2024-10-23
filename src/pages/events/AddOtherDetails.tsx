/**
 * AddOtherDetails component handles adding other details in the event
 */
import { setFormValues } from '@/Utils/CommonBaseClass';
import CustomSelect from '@/components/CustomSelectBox/CustomSelect';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type EventProps = {
    formSubmit: boolean;
    onSubmitHandler: (event: React.FormEvent<HTMLFormElement>, type: string) => void;
    data: object;
}
type FormData = {
    food: string,
    beverage: string,
    attendees: string,
    mealTime: Date
};
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

const AddOtherDetails: React.FC<EventProps> = React.memo(({ formSubmit, onSubmitHandler, data }) => {
    const { handleSubmit, control, setValue } = useForm<FormData>();


    /**
     * Useeffect hook submits the form based on the formSubmit variable
     */
    useEffect(() => {
        if (formSubmit) {
            handleSubmit(onSubmit)();
        }
    }, [formSubmit])

    /**
     * Method handles the form submit event
     * @param data : for data
     */
    const onSubmit: SubmitHandler<FormData> = (data: any) => {
        onSubmitHandler && onSubmitHandler(data, 'ADDS')
    };

    /**
     * Useeffect hook set the form values based on the data 
     */
    useEffect(() => {
        if (data) {
            setFormValues(data, setValue)
        }
    }, [data])


    return <Box className="create-event-container">
        <Grid container size={{ xs: 12, sm: 12 }} justifyContent="center" alignItems="center" spacing={4}>
            <Grid size={{ xs: 0, sm: 3 }}></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Grid >
                    <Typography textAlign={"center"} variant="h3" lineHeight={2} className="create-event-title">Add Other Details</Typography>
                </Grid>
                <Grid>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>
                            <Grid size={{ xs: 12, sm: 6 }} >
                                <CustomSelect
                                    name="food"
                                    label="Food Option"
                                    options={foodArray}
                                    control={control}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }} >
                                <CustomSelect
                                    name="beverage"
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
                                    name="attendees"
                                    type="number"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }} >
                                <CustomTextField
                                    placeholder="Meal Times"
                                    control={control}
                                    name="mealTime"
                                    type="date"
                                />
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            <Grid size={{ xs: 0, sm: 3 }}></Grid>
        </Grid>
    </Box>
});

export default AddOtherDetails;