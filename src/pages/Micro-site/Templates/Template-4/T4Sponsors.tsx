import { ISponsor } from "@/Libs/types/event";
import TSponsors from "@/pages/events/template/_components/TSponsors/TSponsors";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import config from '../../../../../config.json';
import { toTitleCase } from "@/Utils/CommonBaseClass";
/**
 * Componet for Template 7 sponsors
 */
const T4Sponsors=()=>{
    const baseUrl = config?.api?.url;
    return(
        <Box id="sponsors" className="sponsor-section main section-vertical-padding ">
        <Typography textAlign={"center"} variant="h2" mb={5}>Sponsors</Typography>
        <Grid className="sponsor-section__container" >
            <TSponsors>
                {({ data }) => {
                    return (
                        <>
                            {
                                Object.keys(data)?.length > 0 && Object?.entries(data)?.map(([key, items]: any) => {
                                    return (
                                        key === "DIAMOND" ? items?.length > 0 && (
                                            <Box width={'100%'} className="" mb={5}>
                                                <Box width={'100%'}>
                                                    <Typography className='sponsor-banner-text' textAlign={"center"}>{`${key && toTitleCase(key)} Sponsors`}</Typography>

                                                </Box>
                                                <Box className="flex flex-col gap-y-6 w-full">
                                                    {
                                                        items?.map((item: ISponsor) => {
                                                            return (
                                                                <Grid container className=" overflow-hidden" columnSpacing={2} justifyContent={"center"} alignItems={"center"} size={12}  >
                                                                    <img
                                                                        className='sponsor-banner-diamond app-border-radius shadow-app'
                                                                        src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : `${baseUrl}asset/${item?.sponsor?.logoAssetId}`}
                                                                        alt="" />
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </Box>
                                            </Box>
                                        ) : key === "PLATINUM" ? items?.length > 0 && (
                                            <Grid size={12} justifyContent={'center'} container spacing={2} mb={5}>
                                                <Grid size={12}>
                                                    <Typography className='sponsor-banner-text' textAlign={"center"}>{`${key && toTitleCase(key)} Sponsors`}</Typography>
                                                </Grid>
                                                {
                                                    items?.map((item: any) => {
                                                        return (
                                                            <Grid container justifyContent={"center"} alignItems={"flex-start"} size={{ xs: 12, sm: 6 }}>
                                                                <img
                                                                    className='sponsor-banner-platinum app-border-radius shadow-app'
                                                                    src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''}
                                                                    alt=""
                                                                />

                                                            </Grid>
                                                        )
                                                    })
                                                }
                                            </Grid>
                                        ) : key === "GOLD" ? items?.length > 0 && (
                                            <Grid mb={5} size={12} spacing={2} container justifyContent={'center'}>
                                                <Grid size={12}>
                                                    <Typography className='sponsor-banner-text' textAlign={"center"}>{`${key && toTitleCase(key)} Sponsors`}</Typography>

                                                </Grid>
                                                {
                                                    items?.map((item: ISponsor) => {
                                                        return (
                                                            <Grid container justifyContent={"center"} alignItems={"flex-start"} alignContent={"flex-start"} size={{ xs: 12, sm: 4 }}  >
                                                                <img className='sponsor-banner-gold app-border-radius shadow-app' src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''} alt="" />
                                                            </Grid>
                                                        )
                                                    })
                                                }
                                            </Grid>
                                        ) : <>
                                            {items?.length > 0 && <Grid size={12} spacing={2} container justifyContent={'center'}>
                                                <Grid size={12}>
                                                    <Typography textAlign={"center"} className='sponsor-banner-text'>{`${key && toTitleCase(key)} Sponsors`}</Typography>
                                                </Grid>
                                                {
                                                    items?.map((item: ISponsor) => {
                                                        return (
                                                            <Grid size={{ xs: 12, sm: 3 }} container justifyContent={'center'} alignItems={"flex-start"} alignContent={"flex-start"}  >
                                                                <img className='sponsor-banner-silver app-border-radius shadow-app' src={item?.sponsor?.bannerImgAssetId ? `${baseUrl}asset/${item?.sponsor?.bannerImgAssetId}` : ''} alt="" />
                                                            </Grid>
                                                        )
                                                    })
                                                }
                                            </Grid>}
                                        </>


                                    )
                                })
                            }
                        </>
                    )
                }}
            </TSponsors>
        </Grid>
    </Box>
    );

}

export default T4Sponsors;