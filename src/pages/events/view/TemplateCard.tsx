import { IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Template1 from '../../../assets/png/template1-preview.png'
import Template2 from '../../../assets/png/template2-preview.png'
import  PreviewButtonIcon  from "@/assets/svg/preview-button.svg";

interface TemplateType{
    id: string,
    name: string,
    image: string
}
const templateData :TemplateType[] = [
    {
        id: 'temp1',
        name: 'Template 1',
        image: Template1
    },
    {
        id: 'temp2',
        name: 'Template 2',
        image: Template2
    },
]

const TemplateCard = (data: any) => {

    const handlePreview = (temp: any) => {
        const url = `/event/detail/${data?.eventData?.id}/template/${temp?.id}/preview`;
        window.open(url, '_blank');
    }

    const handleItem = (_data: any) => {
        const url = `/event-link/test`;
        window.open(url, '_blank');
        //const externalUrl = `https://${config['event-link']['sub-domain']}.${'test'}.${config['event-link']['top-level-domain']}`;
        //window.location.href = externalUrl;
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
                <Grid className="event-detail-template-card-selection-container">
                    <Grid container justifyContent={'flex-end'} >
                    <IconButton
                          onClick={() => handlePreview(item)}
                        >
                          <PreviewButtonIcon />
                        </IconButton>
                        </Grid>
                    <Grid className="event-detail-template-card-selection-preview-container" onClick={() => handleItem(item)}>
                        <img id={item.id.toString()} src={item.image} alt={item.name} />
                    </Grid>
                </Grid>
            ))}
            </Grid>
        </Grid>
    );
};

export default TemplateCard;
