/**
 * TemplateContainer component handles the template creation
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import DefaultTemplate from './DefaultTemplate';



type TemplateContainerProps = {
    id: string
}

const TemplateContainer: React.FC<TemplateContainerProps> = React.memo(({  }) => {


   // const { handleSubmit, control, setValue, watch, formState: { errors } } = useForm<any>();


   /**
     * Method handles the form submission
     * @param data 
     */
    // const onSubmit: SubmitHandler<any> = (data: any) => {
    // };

    // const [editorContent, setEditorContent] = useState(editData?.description);
    // const [editorHeaderContent, setEditorHeaderContent] = useState('');
    // const [programData, setProgramData] = useState(sampleProgramData)
    // const [speakersData, setSpeakersData] = useState(sampleSpeakersData)
    // const [sponsorsData, setSponsorsData] = useState(sampleSponsorsData)
    


    // const handleChange = (value: any) => {
    //     setEditorContent(value);
    //     setValue('description',value)
    // };

    // const handleHeaderDescriptionChange = (value: any) => {
    //     setEditorHeaderContent(value);
    //     setValue('headerDescription',value)
    // };

    // const handleAddNewPrograms = () => {
    //     const programDataCopy = [...programData];
    //     programDataCopy.push({
    //         programType: 'PROGRAM',
    //         programName: '',
    //         programDescription: '',
    //         startDateTime: ''
    //     })
    //     setProgramData(programDataCopy);
    // }


    // const handleAddNewSpeakers = () => {
    //     const speakersDataCopy = [...speakersData];
    //     speakersDataCopy.push({
    //         name: '',
    //         designation: ''
    //     })
    //     setSpeakersData(speakersDataCopy);
    // }
    
 
    // const handleAddNewSponsors = () => {
    //     const sponsorsDataCopy = [...sponsorsData];
    //     sponsorsDataCopy.push({
    //         name: '',
    //         description: ''
    //     })
    //     setSponsorsData(sponsorsDataCopy);
    // }




    return <Grid container size={{ xs: 12, sm: 12 }} className="event-template" spacing={1}>
       <Grid container size={{ xs: 12, sm: 12 }} spacing={1}>
            <DefaultTemplate temp={"temp1"}/>
       </Grid>

       {/* <Grid container size={{ xs: 12, sm: 6 }}>
       <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={1} alignItems={'center'} justifyContent={'center'} >
                        <Grid size={{ xs: 12, sm: 12 }}>
                                <Typography variant="h3" className="create-event-description">Header Section</Typography>
                            </Grid>
                        <Grid size={{ xs: 12, sm: 12 }} >
                                <CustomTextField
                                    placeholder="Title"
                                    control={control}
                                    name="name"
                                    type="text"
                                    rules={{ required: true }}
                                    defaultValue={editData?.name}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} className="create-event-description">
                                <ReactQuill
                                    className={(errors?.headerDescription || watch('headerDescription') === '<p><br></p>')? "create-event-description-error": ''}
                                    value={editorHeaderContent}
                                    onChange={handleHeaderDescriptionChange}
                                    theme="snow"
                                    placeholder="Type your description here..."
                                />
                                <CustomTextField
                                    control={control}
                                    name="headerDescription"
                                    type="hidden"
                                    rules={{ required: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }}>
                                <Typography variant="h3" className="create-event-description">About Section</Typography>
                            </Grid>
                        <Grid size={{ xs: 12, sm: 12 }} >
                                <CustomTextField
                                    placeholder="Title"
                                    control={control}
                                    name="aboutTitle"
                                    type="text"
                                    rules={{ required: true }}
                                    defaultValue={editData?.name? `Welcome to ${editData?.name}`: ''}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} className="create-event-description">
                                <ReactQuill
                                    className={(errors?.description || watch('description') === '<p><br></p>')? "create-event-description-error": ''}
                                    value={editorContent}
                                    onChange={handleChange}
                                    theme="snow"
                                    placeholder="Type your description here..."
                                />
                                <CustomTextField
                                    control={control}
                                    name="description"
                                    type="hidden"
                                    rules={{ required: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} container justifyContent={'space-between'}>
                                <Typography variant="h3" className="create-event-description">Program Section</Typography>
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
                            <Grid size={{ xs: 12, sm: 12 }} >
                                <CustomTextField
                                    placeholder="Program Highlights"
                                    control={control}
                                    name="programTitle"
                                    type="text"
                                    rules={{ required: false }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} >
                                <CustomTextField
                                    placeholder="Program Highlights Description"
                                    control={control}
                                    name="programTitleDescription"
                                    type="text"
                                    rules={{ required: false }}
                                    multiline={true}
                                    rows={4}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} >
                                {
                                    programData?.map((item: any, index: number) => {
                                        const i = index+1;
                                        return <Grid size={{ xs: 12, sm: 12 }} container spacing={1}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <CustomTextField
                                                    placeholder="Program Description"
                                                    control={control}
                                                    name={`description_${i}`}
                                                    type="text"
                                                    rules={{ required: false }}
                                                    defaultValue={
                                                        (item.programName || item.addOns)
                                                          ? `${item.programType === 'PROGRAM' ? item.programName + ": " + item.programDescription : item.programType === 'ADD_ONS' ? item.addOns : ''}` 
                                                          : ''
                                                      }                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                            <CustomTextField
                                                    placeholder="Program Start Date & Time"
                                                    control={control}
                                                    name={`program_start_time_${i}`}
                                                    type="text"
                                                    rules={{ required: false }}
                                                    defaultValue={item.startDateTime? moment(item.startDateTime).format('MMMM Do, h:mm A'):''}
                                                />
                                            </Grid>
                                        </Grid>    
                                    })
                                }
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} container justifyContent={'space-between'}>
                                <Typography variant="h3" className="create-event-description">Speakers Section</Typography>
                                <Grid>
                                    <CustomButton
                                        className="add-program-add-btn"
                                        onClick={handleAddNewSpeakers}
                                        label="Add"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        startIcon={<AddIcon />}
                                    />
                                </Grid>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} >
                                <CustomTextField
                                    placeholder="Title"
                                    control={control}
                                    name="SpeakerTitle"
                                    type="text"
                                    rules={{ required: false }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} >
                                <CustomTextField
                                    placeholder="Sub Title"
                                    control={control}
                                    name="SpeakerSubTitle"
                                    type="text"
                                    rules={{ required: false }}
                                    multiline={true}
                                    rows={4}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} >
                                {
                                    speakersData?.map((item: any, index: number) => {
                                        const i = index+1;
                                        return <Grid size={{ xs: 12, sm: 12 }} container spacing={1}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <CustomTextField
                                                    placeholder="Name"
                                                    control={control}
                                                    name={`speakers_name_${i}`}
                                                    type="text"
                                                    rules={{ required: false }}
                                                    defaultValue={item.name? item.name: ''}                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                            <CustomTextField
                                                    placeholder="Designation"
                                                    control={control}
                                                    name={`speakers_designation_${i}`}
                                                    type="text"
                                                    rules={{ required: false }}
                                                    defaultValue={item.designation? item.designation: ''}   
                                                />
                                            </Grid>
                                        </Grid>    
                                    })
                                }
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} container justifyContent={'space-between'}>
                                <Typography variant="h3" className="create-event-description">Sponsors Section</Typography>
                                
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} >
                                <CustomTextField
                                    placeholder="Name"
                                    control={control}
                                    name="sponsorTitle"
                                    type="text"
                                    rules={{ required: false }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }} >
                                <CustomTextField
                                    placeholder="Decription"
                                    control={control}
                                    name="sponsorDescription"
                                    type="text"
                                    rules={{ required: false }}
                                    multiline={true}
                                    rows={4}
                                />
                            </Grid>
                           
                        </Grid>

                    </form>
       </Grid> */}
    </Grid>
});

export default TemplateContainer;