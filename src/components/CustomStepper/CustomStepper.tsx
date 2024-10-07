import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { StepIconProps } from '@mui/material/StepIcon';
import { StepperActive, StepperCurrent, StepperDefault } from '@/assets/svg';
import { IconButton } from '@mui/material';

interface CustomStepperProps {
  steps: { label: string; description: string }[];
  activeStep: number;
  onStepChange: (step: number) => void;
}
/*
*  Customized Common stepper  component 
*/
const CustomStepper: React.FC<CustomStepperProps> = ({ steps, activeStep, onStepChange }) => {

  /*
  * Custom Step Icon using your provided icons
  */
  function StepIcon(props: StepIconProps) {
    const { active, completed } = props;

    return (
      <Box className="custom-stepper-step-icon-box">
      {completed ? (
          <IconButton className='custom-stepper-stepper-icon'>
            <StepperActive />
          </IconButton>
      
      ) : active ? (
            <IconButton className='custom-stepper-stepper-icon'>
              <StepperCurrent />
            </IconButton>
      ) : (
              <IconButton className='custom-stepper-stepper-icon'>
                <StepperDefault />
              </IconButton>
      )}
    </Box>
    );
  }

  return (
    <>
      <Box className="custom-stepper-container">
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
