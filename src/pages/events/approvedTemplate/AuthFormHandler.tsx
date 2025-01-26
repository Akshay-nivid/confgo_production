import React from 'react'
import Grid from '@mui/material/Grid2';
import TLogin from './TLogin';
import TRegister from './TRegister';
import { Typography } from '@mui/material';

/**
 * Component handles auth section
 */
const AuthFormHandler: React.FC<any> = React.memo(({ className, data }) => {
    return (
        <Grid size={12} className={className}>
            <Typography className={`${className}-title`}>{data?.name}</Typography>
            <Grid direction={'row'} container>
                <TLogin className={`${className}-login`} />
                <TRegister buttonName='Regsiter' className={`${className}-register`} />
            </Grid>
        </Grid>
    )
})

export default AuthFormHandler