import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CustomButton from '../CustomButton/CustomButton';
import { useNavigate } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";

interface NoRecordsProps {
    imageSrc?: string;
    noRecordTitle?: string;
    noRecordSubtitle?:string;
    redirectTo?: () => string;
    btnName?: string;
}
/**
 * No Record Found 
 * @author Neethu
 */
export const NoRecords: React.FC<NoRecordsProps> = ({imageSrc,noRecordTitle,noRecordSubtitle,redirectTo,btnName}) => {
    const navigate = useNavigate()
/**
 * function to navigate to desired route from datagridlist
*/
    const navipath = () => {
        const path = redirectTo ? redirectTo() : "";
        navigate(path); 
    };
    
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
                  {noRecordTitle ? noRecordTitle : "No Records Available"}
                </Typography>
                <Typography  className="no-record-subtitle" >
                   {noRecordSubtitle?noRecordSubtitle:'It looks like you haven’t created any data yet.'}
                </Typography>
                {redirectTo ?    
                <CustomButton
                    className="no-record-create-btn"
                    label={`${btnName}`}
                    variant="contained"
                    size="large"
                    type="submit"
                    startIcon={<AddIcon />}
                    onClick={() => {
                     navipath();
                    }}
                /> : null}
            
            </Grid>
        </Grid>
    );

}