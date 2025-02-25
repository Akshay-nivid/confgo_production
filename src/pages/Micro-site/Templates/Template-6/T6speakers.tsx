import TEventSpeakers, { TEventSpeakerModal } from '@/pages/events/template/_components/TEventSpeakers/TEventSpeakers'
import { IconButton, CardMedia, CardContent, Typography, Card } from '@mui/material'
import Box from '@mui/material/Box/Box'
import Grid from '@mui/material/Grid2';

import config from '../../../../../config.json';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const T6speakers = () => {

    const baseUrl = config.api.url

    return (
        <Box className='t6-speakers-section'>
            <Box className='main'>
                <h3 className='template-section-title  t6-speakers-section-title'>Meet Our Esteemed Speakers</h3>
            </Box>

            <Grid container className="main">

                <TEventSpeakers usageType="CUSTOM">
                    {({ data, handleModalOpen }) => {
                        return (
                            <Grid container columnSpacing={4} rowSpacing={4} className="t6-speakers-container">
                                {data?.map((speaker: any) => (
                                    <Grid key={speaker?.id} justifyContent={"center"} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} className="t6-speakers-container">

                                        <Card
                                            sx={{
                                                maxHeight: 400,
                                                height: "100%",
                                                borderRadius: "1.66rem",
                                                position: "relative",
                                                background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.4) 100%)",
                                            }}
                                        >
                                            <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
                                                <IconButton
                                                    onClick={() => handleModalOpen(speaker)}
                                                    sx={{
                                                        backgroundColor: "white",
                                                        "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                                                    }}
                                                >
                                                    <ArrowOutwardIcon fontSize='large' />
                                                </IconButton>
                                            </Box>

                                            <CardMedia
                                                className='speaker-image'
                                                component="img"
                                                image={`${baseUrl}/asset/${speaker?.user?.assetId}`}
                                                alt="Doctor profile"
                                                sx={{
                                                    objectFit: "cover",
                                                }}
                                            />

                                            <CardContent
                                                sx={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    width: "100%",
                                                    background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                                                    padding: "2rem",
                                                }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    component="h2"
                                                    sx={{
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        marginBottom: 1,
                                                    }}
                                                >
                                                    Dr. John Anderson
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        color: "rgba(255,255,255,0.9)",
                                                    }}
                                                >
                                                    Cardiologist, Harvard Medical School
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )
                    }}
                </TEventSpeakers>

            </Grid >
            <TEventSpeakerModal />

        </Box >
    )
}

export default T6speakers