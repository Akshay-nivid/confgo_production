/**
 * TemplateContainer component handles the template creation
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import TemplateView from './TemplateView';
import { useParams } from 'react-router-dom';

type TemplateContainerProps = {
    id?: number;
}

/**
 * Component handles the template creation
 */
const TemplateContainer: React.FC<TemplateContainerProps> = React.memo(({ }) => {

    const { id, entityId, slug } = useParams();




    return <Grid container size={{ xs: 12, sm: 12 }} className={`event-template${!slug ? " event-template-preview" : ""}`} spacing={1}>
        <Grid container size={{ xs: 12, sm: 12 }} spacing={1}>
            <TemplateView temp={typeof id === 'number' ? id : Number(id) || 1} eventId={entityId} slug={slug}/>
        </Grid>
    </Grid>
});

export default TemplateContainer;