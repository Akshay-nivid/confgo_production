import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import template1 from '../../../assets/png/template1.png'


const TemplateCard = () => {
    interface TemplateType{
        id:number,
        name:string,
        description:string,
        image:string
    }
    const templateData :TemplateType[] = [
        {
            id: 1,
            name: 'Template 1',
            description: 'Description 1',
            image: template1
        },
    ]
    /**
   *function to handle template selection
   */
    const templateSelected=(_item:TemplateType)=>{
    }
    return (
        <Grid className="event-detail-template-card" container spacing={2}>
            <Grid container size={{ xs: 12, md:12}}>
                <Typography className="event-detail-template-card-header" >
                    Templates
                </Typography>
            </Grid>
            <Grid container className="event-detail-template-card-selection" >
            {templateData.map((item) => (
                <Grid onClick={() => templateSelected(item)}>
                    <img id={item.id.toString()} src={item.image} alt={item.name} />
                </Grid>
            ))}
            </Grid>
        </Grid>
    );
};

export default TemplateCard;
