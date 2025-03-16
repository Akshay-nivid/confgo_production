import TEventSpeakers, { TEventSpeakerModal } from '@/pages/events/template/_components/TEventSpeakers/TEventSpeakers'
import { CardMedia, CardContent, Typography, Card } from '@mui/material'
import Box from '@mui/material/Box/Box'
import Grid from '@mui/material/Grid2';
import config from '../../../../../config.json';
import { personPlaceholder } from '@/assets/png';

/**
 * Componet for Template 7 speakers
 */
const T7Speakers = () => { 
    const baseUrl = config.api.url
    return (
        <Box id="speakers" className='t7-speakers-section'>
            <Box className='main'>
                <h3 className='template-section-title  t6-speakers-section-title'>Meet Our Esteemed Speakers</h3>
            </Box>
            <Grid container className="main mt-10">
                <TEventSpeakers usageType="CUSTOM">
                    {({ data, handleModalOpen }) => {
                        
                        return (
                            <Grid container columnSpacing={4} rowSpacing={4} marginInline={'auto'} flex={1} >
                                {data?.map((speaker: any) => {
                                    return <Grid key={speaker?.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} className="t7-speakers-container">
                                        <Card
                                            className='card'
                                        >
                                            {speaker?.user?.assetId ? <CardMedia
                                                component="img"
                                                image={`${baseUrl}/asset/${speaker?.user?.assetId}`}
                                                alt="Doctor profile"
                                                className='speaker-img-card'
                                            />
                                                : <CardMedia
                                                    component="img"
                                                    image={personPlaceholder}
                                                    alt="Doctor profile"
                                                    className='speaker-img-card'
                                                />}

                                            <CardContent
                                                className='card-content'
                                            >
                                                <Typography
                                                    className='speaker-name'
                                                >
                                                    {speaker?.user?.firstName}{" "}{speaker?.user?.lastName}
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    className='speaker-job'
                                                >
                                                    {speaker?.user?.designation}
                                                </Typography>
                                                <Grid container justifyContent={"center"}>
                                                    <Grid className="speaker-view" onClick={() => handleModalOpen(speaker)}>
                                                        <Typography className='view-more'>View More</Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                })}
                            </Grid>
                        )
                    }}
                </TEventSpeakers>
            </Grid >
            <TEventSpeakerModal />
        </Box >
    )
}

export default T7Speakers