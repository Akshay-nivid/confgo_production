import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

interface NoRecordsProps {
    imageSrc?: string;
    noRecordSubtitle?:string;
}
/**
 * No Record Found 
 * @author Neethu
 */
export const NoRecords: React.FC<NoRecordsProps> = ({imageSrc,noRecordSubtitle}) => {
    
    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className="no-record-container"
            size={{ xs: 12 }}
        >
            <Grid >
                <img src={imageSrc} className="no-record-image"  alt="No records found" />
            </Grid>
            <Grid size={6} container direction="column" alignItems="center" alignContent="center">
                <Typography  className="no-record-title">
                    No Records Available
                </Typography>
                <Typography  className="no-record-subtitle" >
                   {noRecordSubtitle?noRecordSubtitle:'It looks like you haven’t created any data yet.'}
                </Typography>
            </Grid>
        </Grid>
    );

}