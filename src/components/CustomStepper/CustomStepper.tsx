/**
 * CustomStepper component handles the customization of the stepper functionality
 */
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { StepIconProps } from '@mui/material/StepIcon';
import { StepperActive, StepperCurrent, StepperDefault } from '@/assets/svg';
import { IconButton, StepConnector, styled } from '@mui/material';
import Grid from "@mui/material/Grid2";

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
  /**
   * Method defines the connector in the step
   */
  const GreenConnector = styled(StepConnector)(({ }) => ({
    '& .MuiStepConnector-line': {
      borderColor: '#2eac2b',
      borderTopWidth: 2, // Adjust thickness here
    },
  }));

  return (
    <>
      <Grid className="custom-stepper-container" ml={8} mr={8} mt={8}>
        <Stepper activeStep={activeStep} orientation="horizontal" connector={<GreenConnector />}>
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
      </Grid>
    </>
  );
};

export default CustomStepper;
