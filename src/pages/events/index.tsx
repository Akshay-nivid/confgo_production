/*
 *Events component handles the event creation
 */
import { useState } from 'react';
import CustomStepper from '@/components/CustomStepper/CustomStepper';
import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import CreateEvent from './CreateEvent';
import AddProgram from './AddProgram';
import ConferenceDetails from './ConferenceDetails';

const steps = [
  { label: 'Create Event', description: '' },
  { label: 'Add Program', description: '' },
  { label: 'Confirm', description: '' },
];

const Events = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formSubmit, setFormSubmit] = useState<any>({
    event: false,
    program: false,
  });
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
      const formKey =
        activeStep === 0
          ? 'event'
          : activeStep === 1
          ? 'program'
          : null;

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
    console.log('submitformdata', formData);
  };

  /*
   * The handleBack function is used to move the stepper to the previous step.
   */
  const handleBack = () => {
    setFormSubmit({
      event: false,
      program: false,
    })
    if (activeStep >= 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  /**
   * Method handles the submission of the various forms
   * @param data : form data
   * @param type : 'EVENT' | 'PROGRAM' | 'ADDS'
   */
  const onSubmitHandler = (data: object, type: string) => {
    const formKey =
      type === 'EVENT'
        ? 'event'
        : type === 'PROGRAM'
        ? 'program'
        : null;
    if (formKey) {
      setFormData({ ...formData, [formKey]: data });
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  /**
   * Method handles the saving of the program
   * @param data : form data
   */
  const onSaveHandler = (data: object) => {
      setFormData({ ...formData, ['program']: data });
  };

  return (
    <Grid container size={{ xs: 12, sm: 12 }} className="custom-stepper">
      <Grid size={{ xs: 12, sm: 2 }} className="custom-stepper-main">
        <CustomStepper
          steps={steps}
          activeStep={activeStep}
          onStepChange={handleStepChange}
        />
      </Grid>
      <Grid container size={{ xs: 12, sm: 10 }}>
        {activeStep === 0 && (
          <CreateEvent
            formSubmit={formSubmit?.event}
            onSubmitHandler={onSubmitHandler}
            data={formData?.event}
          />
        )}
        {activeStep === 1 && (
          <AddProgram
            formSubmit={formSubmit?.program}
            onSubmitHandler={onSubmitHandler}
            onSaveHandler={onSaveHandler}
            data={formData?.program}
          />
        )}
        {activeStep === 2 && <ConferenceDetails data={formData}/>}

        <Grid
          container
          justifyContent={'right'}
          spacing={2}
          size={{ xs: activeStep === 2? 12: 9, sm: activeStep === 2? 12: 9}}
          sx={{
            width: '100%'
          }}
          className="custom-stepper-button-container"
        >
         
          <Grid>
            <CustomButton
              className="custom-stepper-back-button"
              label="Back"
              onClick={handleBack}
              disabled={activeStep === 0}
            />
          </Grid>
          <Grid>
            {<CustomButton
              className={`custom-stepper-next-button ${
                activeStep === 0
                  ? 'custom-stepper-next-button-event'
                  : activeStep === 1
                  ? 'custom-stepper-next-button-program'
                  : 'custom-stepper-next-button-details'
              } ${activeStep === 1 && !(formData?.program?.[0]?.programName) ? 'disabled-button' : ''}`}
              onClick={activeStep === 2 ? handleSubmit : handleNext}
              label={activeStep === 2 ? 'Submit' : 'Next'}
              disabled={(activeStep === steps.length) || (activeStep === 1 && !(formData?.program?.[0]?.programName))}
            />}
          </Grid>
          {activeStep === 1 && (
            <Grid className="custom-stepper-other-details">
              <span>
                &bull; The standard cost of providing food and beverages for
                each attendee: $25 per person.
              </span>
              <br />
              <span>
                &bull; Additional charges for customized meal options, such as
                special dietary needs or <br />
                &nbsp; premium choices: Add $5 per person for vegan or
                gluten-free options.
              </span>
              <br />
              <span>
                &bull; Any extra services, such as waitstaff, special
                presentation, or additional snacks:
                <br />
                &nbsp; Add $200 for additional snack stations during breaks.
              </span>
              <br />
              <span>
                &bull; 50% deposit required upon booking, with the balance due
                on the day of the event.
              </span>
            </Grid>
          )} 
           {activeStep === 1 &&<Grid className="custom-stepper-bottom-spacing"></Grid>}
        </Grid>
        <Grid container className="custom-stepper-button-container" size={{ xs: activeStep === 2? 2: 3, sm: activeStep === 2? 2: 3}}></Grid>
      </Grid>
    </Grid>
  );
};

export default Events;
