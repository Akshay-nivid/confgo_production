/*
*Events component handles the event creation
*/
import { useState } from 'react';
import CustomStepper from "@/components/CustomStepper/CustomStepper";
import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import CreateEvent from './CreateEvent';
import AddProgram from './AddProgram';
import AddOtherDetails from './AddOtherDetails';
import ConferenceDetails from './ConferenceDetails';

const steps = [
  { label: 'Create Event', description: '' },
  { label: 'Add Program', description: '' },
  { label: 'Add Ons', description: '' },
  { label: 'Confirm', description: '' }
];

const Events = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formSubmit, setFormSubmit] = useState<any>({ event: false, program: false });
  const [formData, setFormData] = useState<any>({});

  /* 
  * The function sets the active step of the stepper.
  */
  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  /* 
  * The handleNext function is used to move the stepper to the next step.
  */
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      const formKey = activeStep === 0 ? 'event' : activeStep === 1 ? 'program' : activeStep === 2 ? 'adds' : null;

      if (formKey) {
        setFormSubmit({ ...formSubmit, [formKey]: true });

        setTimeout(() => {
          setFormSubmit({ ...formSubmit, [formKey]: false });
        }, 1000);
      }
    }
  };

  /**
   * Method handles the final submission of all forms
   */
  const handleSubmit = () => {
    console.log('submitformdata', formData)
  }

  /* 
  * The handleBack function is used to move the stepper to the previous step.
  */
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  /**
   * Method handles the submission of the various forms
   * @param data : form data
   * @param type : 'EVENT' | 'PROGRAM' | 'ADDS'
   */
  const onSubmitHandler = (data: object, type: string) => {
    const formKey = type === 'EVENT' ? 'event' : type === 'PROGRAM' ? 'program' : type === 'ADDS' ? 'adds' : null;
    if (formKey) {
      setFormData({ ...formData, [formKey]: data });
    }
    setActiveStep((prevStep) => prevStep + 1);
  }


  return (
    <Grid container size={{ xs: 12, sm: 12 }} className='custom-stepper'>
      <Grid size={{ xs: 12, sm: 2 }}>
        <CustomStepper steps={steps} activeStep={activeStep} onStepChange={handleStepChange} />
      </Grid>
      <Grid size={{ xs: 12, sm: 10 }}>
        {activeStep === 0 && <CreateEvent formSubmit={formSubmit?.event} onSubmitHandler={onSubmitHandler} data={formData?.event} />}
        {activeStep === 1 && <AddProgram formSubmit={formSubmit?.program} onSubmitHandler={onSubmitHandler} data={formData?.program} />}
        {activeStep === 2 && <AddOtherDetails formSubmit={formSubmit?.adds} onSubmitHandler={onSubmitHandler} data={formData?.adds} />}
        {activeStep === 3 && <ConferenceDetails />}
        <Grid container direction={'column'} justifyContent={'center'} alignItems={'center'} spacing={2} size={{ xs: 12, sm: 12 }}>
          <Grid>
            <CustomButton
              className="custom-stepper-next-button"
              onClick={activeStep === 3 ? handleSubmit : handleNext}
              label={activeStep === 3 ? "Submit" : "Next"}
              disabled={activeStep === steps.length}
            />
          </Grid>
          <Grid>
            <CustomButton
              className="custom-stepper-back-button"
              label="Back"
              onClick={handleBack}
              disabled={activeStep === 0}
            />
          </Grid>
          {activeStep === 2 && <Grid className="custom-stepper-other-details">
            <span>&bull; The standard cost of providing food and beverages for each attendee: $25 per person.</span><br />
            <span>&bull; Additional charges for customized meal options, such as special dietary needs or <br />&nbsp; premium choices: Add $5 per person for vegan or gluten-free options.</span><br />
            <span>&bull; Any extra services, such as waitstaff, special presentation, or additional snacks:<br />&nbsp; Add $200 for additional snack stations during breaks.</span><br />
            <span>&bull; 50% deposit required upon booking, with the balance due on the day of the event.</span>
          </Grid>}
          <Grid className="custom-stepper-bottom-spacing"></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Events;
