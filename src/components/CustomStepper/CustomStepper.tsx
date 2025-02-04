/**
 * CustomStepper component handles the customization of the stepper functionality
 */
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { StepIconProps } from '@mui/material/StepIcon';
import { CustomStep1, CustomStep2, CustomStep3, CustomStep4, CustomStepInactive2, CustomStepInactive3, CustomStepInactive4, StepperActive, StepperDefault } from '@/assets/svg';
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
    const { active, completed, icon } = props;

    return (
      <Box className={`custom-stepper-step-icon-box`}>
        {completed ? (
          <IconButton className="custom-stepper-stepper-icon">
            <StepperActive />
          </IconButton>
        ) : icon == 1 ? (
          <IconButton className="custom-stepper-stepper-icon">
            <CustomStep1 />
          </IconButton>
        ) : icon == 2 && active ? (
          <IconButton className="custom-stepper-stepper-icon">
            <CustomStep2 />
          </IconButton>
        ) : icon == 3 && active ? (
          <IconButton className="custom-stepper-stepper-icon">
            <CustomStep3 />
          </IconButton>
        ) : icon == 4 && active ? (
          <IconButton className="custom-stepper-stepper-icon">
            <CustomStep4 />
          </IconButton>
        ) : icon == 4 ? (
          <IconButton className="custom-stepper-stepper-icon">
            <CustomStepInactive4 />
          </IconButton>
        ) :  icon == 3 ? (
          <IconButton className="custom-stepper-stepper-icon">
            <CustomStepInactive3 />
          </IconButton>
        ) : icon == 2 ? (
          <IconButton className="custom-stepper-stepper-icon">
            <CustomStepInactive2 />
          </IconButton>
        ) :
        (
          <IconButton className="custom-stepper-stepper-icon">
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
      marginLeft: '1rem'
    },
  }));

  return (
    <>
      <Grid className="custom-stepper-container" mt={8}>
        <Stepper activeStep={activeStep} orientation="vertical" connector={<GreenConnector />}>
          {steps.map((step, index) => {
            const isInactive = index > activeStep;
            return (
              <Step key={step.label} >
                <Grid
                  size={8}
                  className={`custom-stepper-stepBox ${isInactive ? 'stepper-inactive-step' : ''}`}
                  onClick={() => onStepChange(index)}
                >
                  <StepLabel StepIconComponent={StepIcon} className={`custom-stepper-StepLabel ${isInactive ? 'stepper-inactive' : ''}`}>
                    {step.label}
                  </StepLabel>
                </Grid>
              </Step>
            );
          })}
        </Stepper>
      </Grid>
    </>
  );
};

export default CustomStepper;
