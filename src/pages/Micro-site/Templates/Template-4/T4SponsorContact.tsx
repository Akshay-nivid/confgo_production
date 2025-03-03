import { IEventResponse } from "@/Libs/types/event";
import Grid from "@mui/material/Grid2";
import SponosrContactForm from "../Template-components/SponsorContactForm";
import { Typography } from "@mui/material";
/**
 * Componet for Template 4 Sponsor contact form
 * @param eventData
 */
const T4SponsorContact = ({ eventData }: { eventData?: IEventResponse }) => {
    return (
        <Grid id="sponsor-form" container size={12} className="t4-sponosor-contact-form" >
            <Grid container size={{xs:12,sm:10}} className="main max-w-20 ">
                <Grid className="left-section" size={{ xs: 12, sm: 12 }}>
                    <Typography textAlign={'center'} className="title">Partner with Us as a Sponsor</Typography>
                    <Typography textAlign={'center'} className="description">Unlock unique opportunities to showcase your brand and connect with our audience. Fill out the form below to explore sponsorship possibilities tailored to your goals.</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12 }} className="t7-sponosor-contact-form-t7-form-container">
                    <SponosrContactForm Id={eventData?.id} customStyle={'sponsor-header'} />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default T4SponsorContact;