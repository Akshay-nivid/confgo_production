import useStore from '@/Libs/store';
import CustomButton from '@/components/CustomButton/CustomButton';
import routes from '@/router/routes';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';

type EventInfoProps = {
    data: dataProps;
}
type dataProps = {
    name: string;
    description: string;
    id: string;
}
/**
 * Component used ot draw event details
 * @param param
 * @returns 
 */
export default function EventInfo({ data }: EventInfoProps) {
    let { name, description, id }: dataProps = data;
    const navigate = useNavigate();
    const setDataById = useStore((state: any) => state.setDataById);

    /**
     * Method used to handle participate button
     */
    const handleParticipate = () => {
        setDataById('eventSelected', { id: id });
        navigate(routes.programSelection())
    }

    return (
        <Grid container spacing={2} className="eventInfo-conatiner" justifyContent={'center'}>
            <Grid container size={12} className="eventInfo">
                <Grid size={4}>

                </Grid>
                <Grid container size={8} justifyContent={'center'} direction={'column'}>
                    <Grid container>
                        <Typography>Welcome to </Typography> &nbsp;
                        {name}
                    </Grid>
                    {description}
                </Grid>
            </Grid>
            <Grid container>
                <CustomButton
                    label="Participate"
                    variant="outlined"
                    onClick={handleParticipate}
                />
            </Grid>
        </Grid>

    )
}
