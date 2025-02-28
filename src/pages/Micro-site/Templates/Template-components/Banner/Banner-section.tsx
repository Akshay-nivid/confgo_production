import { Box, Typography } from "@mui/material";
import PlaystorButton from '@/assets/svg/t5playstorebtn.svg'
import IosBtn from '@/assets/svg/t5iosbtn.svg'
import Grid from '@mui/material/Grid2';
import clsx from "clsx";
import './_bannerStyle.scss';

interface BannerSectionProps{
    className?:string
}
/**
 * Componet to render Banner of application
 */
const BannerSection=({className}:BannerSectionProps)=>{

return(
    <Box id="banner" className={clsx("banner  main section-vertical-padding",className)}>
    <Grid display={"flex"} className="banner-container">
        <Box className="banner-img">
        </Box>
        <Box flex={1} className="banner-info-container">
            <Typography className='banner-title'>Track events, manage tickets, and get real-time updates—all in one place!</Typography>
            <Box className="banner-button-container">
                <Box className="playstore-btn" onClick={()=>{
                     window.open('https://play.google.com/store/apps/details?id=com.nivid.participant_App', '_blank');
                }}>
                    <PlaystorButton width={'100%'} height={'100%'} />

                </Box>
                <Box className="playstore-btn">
                    <IosBtn width={'100%'} height={'100%'} />
                </Box>
            </Box>
            <Typography className='banner-subtitle'>Download Now & Simplify Your Event Experience!</Typography>

        </Box>
    </Grid>
</Box>
);

}
export default BannerSection