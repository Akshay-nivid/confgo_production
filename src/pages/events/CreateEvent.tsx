import { setFormValues } from '@/Utils/CommonBaseClass';
import CustomButton from '@/components/CustomButton/CustomButton';
import CustomRadio from '@/components/CustomRadio/CustomRadio';
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

const CreateEvent: React.FC<EventProps> = React.memo(({ formSubmit, onSubmitHandler, data }) => {
    const navigate = useNavigate();
    const { handleSubmit, control, setValue } = useForm<FormData>();
    type FormData = {
        type: string,
        name: string,
        specialty: string,
        date: Date,
        venue: string,
        agenda: string,
        speakers: string
    };
    const typeArray = [ 
        { label: 'Offline', value: 'OFFLINE' },
        { label: 'Online', value: 'ONLINE' },
        { label: 'Hybrid', value: 'HYBRID' }
    ];

    useEffect(() => {
        if(formSubmit){
            handleSubmit(onSubmit)();
        }
    },[formSubmit])

    const onSubmit: SubmitHandler<FormData> = (data: any) => { 
        console.log('testform',data)
        onSubmitHandler && onSubmitHandler(data,'EVENT')
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
                            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="create-event-title">Create New Conference</Typography>
                        </Grid>
                        <Grid>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* <FormControl > */}
                                <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>
                                <Grid size={{ xs: 12, sm: 12 }} >
                                        <CustomRadio
                                            control={control}
                                            name="type"
                                            label=""
                                            options={typeArray}
                                            row={true}
                                            value={'OFFLINE'}
                                        />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Conference Name"
                                        control={control}
                                        name="name"
                                        type="text"
                                        rules={{required: true}}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Specialty"
                                        control={control}
                                        name="specialty"
                                        type="text"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Date & Time"
                                        control={control}
                                        name="date"
                                        type="date"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Venue/Location"
                                        control={control}
                                        name="venue"
                                        type="text"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Agenda"
                                        control={control}
                                        name="agenda"
                                        type="text"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <CustomTextField
                                        placeholder="Speakers"
                                        control={control}
                                        name="speakers"
                                        type="text"
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
  
  export default CreateEvent;