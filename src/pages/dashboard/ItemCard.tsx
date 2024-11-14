/**
 * Component displays the item card in the dashboard
 */
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

interface ItemCardProps{
    label: string;
    value: string;
    icon: any;
}

export const ItemCard: React.FC<ItemCardProps> = ({ label, value, icon }) =>  {

    return(
        <Grid container justifyContent={'center'} alignItems={'center'} size={{ xs: 12, sm: 12 }} style={{ height: '100%' }}>
            <Grid size={{ xs: 4, sm: 4 }} container justifyContent={'center'} alignItems={'center'} style={{ height: '100%' }}>{icon}</Grid>
            <Grid size={{ xs: 8, sm: 8 }} container direction={'column'}>
                <Grid><Typography className="dashboard-item-card-title">{value}</Typography></Grid>
                <Grid><Typography className="dashboard-item-card-sub-title">{label}</Typography></Grid>
            </Grid>
        </Grid>
    )    
};