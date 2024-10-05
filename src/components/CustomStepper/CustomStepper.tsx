import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { StepIconProps } from '@mui/material/StepIcon';
import { StepperActive, StepperCurrent, StepperDefault } from '@/assets/svg';

interface CustomStepperProps {
  steps: { label: string; description: string }[];
  activeStep: number;
  onStepChange: (step: number) => void;
}

const CustomStepper: React.FC<CustomStepperProps> = ({ steps, activeStep, onStepChange }) => {

  /*
  * Custom Step Icon using your provided icons
  */
  function StepIcon(props: StepIconProps) {
    const { active, completed } = props;

    return (
      <Box className="stepIconBox">
      {completed ? (
        <StepperActive  className='stepperIcon'/> 
      
      ) : active ? (
        <StepperCurrent className='stepperIcon'/>
      ) : (
        <StepperDefault className='stepperIcon' />
      )}
    </Box>
    );
  }

  return (
    <>
      <Box className="stepperContainer">
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <Box className="stepBox" onClick={() => onStepChange(index)}>
                <StepLabel 
                  StepIconComponent={StepIcon} 
                >
                  {step.label}
                </StepLabel>
              </Box>
            </Step>
          ))}
        </Stepper>
      </Box>
    </>
  );
};

export default CustomStepper;
