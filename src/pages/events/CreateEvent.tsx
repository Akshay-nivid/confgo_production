/**
 * CreateEvent handles the event creation first screen
 */
import { setFormValues } from '@/Utils/CommonBaseClass';
import CustomRadio from '@/components/CustomRadio/CustomRadio';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
type EventProps = {
    formSubmit: boolean;
    onSubmitHandler: (event: React.FormEvent<HTMLFormElement>, type: string) => void;
    data: any;
}

type FormData = {
    type: string,
    name: string,
    specialty: string,
    date: Date,
    venue: string,
    agenda: string,
    speakers: string,
    description: string
};

const typeArray = [
    { label: 'Offline', value: 'OFFLINE' },
    { label: 'Online', value: 'ONLINE' },
    { label: 'Hybrid', value: 'HYBRID' }
];

const CreateEvent: React.FC<EventProps> = React.memo(({ formSubmit, onSubmitHandler, data }) => {
    const { handleSubmit, control, setValue } = useForm<FormData>();

    const [editorContent, setEditorContent] = useState('');

    console.log('testvalue',editorContent,typeof(editorContent))

    const handleChange = (value: any) => {
        setEditorContent(value);
        setValue('description',value)
    };


    /**
     * Useeffect hook handles the form submission based on the formSubmit variable
     */
    useEffect(() => {
        if (formSubmit) {
            handleSubmit(onSubmit)();
        }
    }, [formSubmit])

    /**
     * Method handles the form submission
     * @param data 
     */
    const onSubmit: SubmitHandler<FormData> = (data: any) => {
        onSubmitHandler && onSubmitHandler(data, 'EVENT')
    };

    /**
     * Useeffect hook set the form values based on the data
     */
    useEffect(() => {
        if (data) {
            setFormValues(data, setValue)
            data?.description && setEditorContent(data?.description);
        }
    }, [data])


    return <Box className="create-event-container">
        <Grid container size={{ xs: 12, sm: 12 }} justifyContent="center" alignItems="center" spacing={4}>
            <Grid size={{ xs: 0, sm: 3 }}></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Grid >
                    <Typography textAlign={"center"} variant="h3" lineHeight={2} className="create-event-title">Create Event</Typography>
                </Grid>
                <Grid>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>
                        <Grid size={{ xs: 12, sm: 12 }} >
                                <CustomTextField
                                    placeholder="Event Name"
                                    control={control}
                                    name="name"
                                    type="text"
                                    rules={{ required: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} >
                                <ReactQuill
                                    value={editorContent}
                                    onChange={handleChange}
                                    theme="snow"
                                    placeholder="Type your message here..."
                                />
                                {/* <CustomTextField
                                    placeholder="Event Description"
                                    control={control}
                                    name="description"
                                    type="text"
                                    rules={{ required: true }}
                                    multiline={true}
                                    rows={4}
                                /> */}
                            </Grid>
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
                                    type="datetime-local"
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
                            <Grid size={{ xs: 12, sm: 12 }} >
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