import  { useState } from 'react';
import CustomStepper from "@/components/CustomStepper/CustomStepper";
import CustomStepperButton from '@/components/CustomButton/CustomStepperButton';
import { Box } from '@mui/material';

const Events = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: 'Create Event', description: '' },
    { label: 'Add Program', description: '' },
    { label: 'Add Ons', description: '' },
    { label: 'Confirm', description: '' }
  ];

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
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

   /* 
   * The handleBack function is used to move the stepper to the previous step.
   */
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <div>
  
      <CustomStepper steps={steps} activeStep={activeStep} onStepChange={handleStepChange}/>

      <CustomStepperButton className='nextButton' label="Next" onClick={handleNext} disabled={activeStep === steps.length }/>
      
      <Box mt={2}> 
        <CustomStepperButton
          className="backButton"
          label="Back"
          onClick={handleBack}
          disabled={activeStep === 0}
        />
      </Box>
    </div>
  );
};

export default Events;
