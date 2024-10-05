import CustomButton from '@/components/CustomButton/CustomButton';
import CustomRadio from '@/components/CustomRadio/CustomRadio';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { Box, FormControl, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const CreateEvent = React.memo(() => {
    const navigate = useNavigate();
    const { handleSubmit, control } = useForm<FormData>();
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
    const onSubmit: SubmitHandler<FormData> = () => { };
    const handleClick = () => {

    }
    return <Box className="create-event-container">
            <Grid container size={{ xs: 12, sm: 12 }} justifyContent="center" alignItems="center" spacing={4}>
                <Grid size={{ xs: 0, sm: 3 }}></Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                        <Grid >
                            <Typography textAlign={"center"} variant="h3" lineHeight={2} className="create-event-title">Create New Conference</Typography>
                        </Grid>
                        <Grid>
                            <form onSubmit={handleSubmit(onSubmit)} className="form1">
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
                                    <Grid container direction={'column'}
                                    justifyContent="center" 
                                    alignItems="center"  
                                    style={{ width: '100%' }} 
                                    size={{ xs: 12, sm: 12 }}
                                    >
                                        <Grid>
                                            <CustomButton
                                                className="create-event-next-btn"
                                                onClick={handleClick}
                                                label="Next"
                                                variant="contained"
                                                //color="default"
                                                size="large"
                                            />
                                        </Grid>
                                        <Grid>
                                            <CustomButton
                                                className="create-event-back-btn"
                                                onClick={handleClick}
                                                label="Back"
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                            />
                                        </Grid>
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