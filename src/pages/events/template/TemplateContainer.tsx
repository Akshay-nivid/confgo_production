/**
 * TemplateContainer component handles the template creation
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import TemplateView from './TemplateView';
import { useParams } from 'react-router-dom';

type TemplateContainerProps = {
    id?: string;
}

const TemplateContainer: React.FC<TemplateContainerProps> = React.memo(({ }) => {

    const { id, entityId } = useParams();


    return <Grid container size={{ xs: 12, sm: 12 }} className="event-template" spacing={1}>
        <Grid container size={{ xs: 12, sm: 12 }} spacing={1}>
            <TemplateView temp={id} eventId={entityId} />
        </Grid>
    </Grid>
});

export default TemplateContainer;