
import {  Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
/*
 * compoent used to render form indicator
 */
export const   StepperBoxes = ({ activeStep }:any) => {
    return (
        <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, index) => (
                <Grid  size={3} key={index}>
                    <Box 
                       className={`stepper-box ${index < activeStep ? 'active' : 'inactive'}`}       
                    >
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};