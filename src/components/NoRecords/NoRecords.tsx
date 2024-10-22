import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import vector from "../../assets/png/Vector.png";

/**
 * No Record Found 
 * @author Neethu
 */
export const NoRecords: React.FC = () => {

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
                <img src={vector} className="no-record-image"  alt="No records found" />
            </Grid>
            <Grid >
                <Typography  className="no-record-title">
                    No Records Available
                </Typography>
                <Typography  className="no-record-subtitle" >
                    It looks like you haven’t created any data yet.
                </Typography>
            </Grid>
        </Grid>
    );

}