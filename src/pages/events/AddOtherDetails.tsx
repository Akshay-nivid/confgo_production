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

type EventProps = {
    formSubmit: boolean;
    onSubmitHandler: (event: React.FormEvent<HTMLFormElement>, type: string) => void;
    data: object;
}

const AddOtherDetails: React.FC<EventProps> = React.memo(({ formSubmit, onSubmitHandler, data }) => {
    const navigate = useNavigate();
    const { handleSubmit, control, setValue } = useForm<FormData>();
    type FormData = {
        food: string,
        beverage: string,
        specialty: string,
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

    useEffect(() => {
        if(formSubmit){
            handleSubmit(onSubmit)();
        }
    },[formSubmit])

    const onSubmit: SubmitHandler<FormData> = (data: any) => { 
        console.log('testform',data)
        onSubmitHandler && onSubmitHandler(data,'ADDS')
    };
   
    useEffect(() => {
        if(data){
            setFormValues(data,setValue)
        }
    },[data])


    return <Box className="create-event-container">
            <Grid container size={{ xs: 12, sm: 12 }} justifyContent="center" alignItems="center" spacing={4}>
                <Grid size={{ xs: 0, sm: 3 }}></Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                        <Grid >
                            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="create-event-title">Add Other Details</Typography>
                        </Grid>
                        <Grid>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* <FormControl > */}
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