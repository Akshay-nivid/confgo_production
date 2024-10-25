import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
// import template1 from '../../../assets/png/template1.png'
// import template2 from '../../../assets/png/template2.png'
// import template3 from '../../../assets/png/template3.png'

const TemplateCard = () => {
    const templateData = [
        {
            id: 1,
            name: 'Template 1',
            description: 'Description 1',
            image: 'template1'
        },
        {
            id: 1,
            name: 'Template 1',
            description: 'Description 1',
            image: 'template2',
        },
        {
            id: 1,
            name: 'Template 1',
            description: 'Description 1',
            image: 'template3',
        },
    ]
    return (
        <Grid container spacing={2}>
            <Grid container size={{ xs: 12, md:12}}>
                <Typography variant="h6">
                    Templates
                </Typography>
            </Grid>
            <Grid container size={{ xs: 12, md: 6, lg: 4 }}>
            </Grid>
            <Grid container size={{ xs: 12, md: 6, lg: 4 }}>
                {templateData.map((item) => (
                    <Grid display={'flex'} justifyContent={'center'} alignItems={'center'} key={item.id}>
                        <img src={item.image} alt={item.name} width={100} height={100} />
                    </Grid>
                ))}

            </Grid>
        </Grid>
    );
};

export default TemplateCard;
