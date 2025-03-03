import { IEventResponse } from "@/Libs/types/event";
import Grid from "@mui/material/Grid2";
import SponosrContactForm from "../Template-components/SponsorContactForm";
import { Avatar, Typography } from "@mui/material";
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
/**
 * Componet for Template 7 Sponsor contact form
 * @param eventData
 */
const T7SponsorContact = ({ eventData }: { eventData?: IEventResponse }) => {
    const eventLocation: any[] = [
        {
            header: 'Location',
            value: eventData?.venue?.name,
            icon:<PlaceOutlinedIcon/>
        },
        {
            header: 'Phone',
            value: eventData?.companyPhone,
            icon: <PhoneOutlinedIcon />
        },
        {
            header: 'Email',
            value: eventData?.companyEmail,
            icon: <MailOutlinedIcon />
        }
    ];
    return (
        <Grid id="sponsor-form" container size={12} className="t7-sponosor-contact-form" >
            <Grid container size={12} className="main">
                <Grid className="left-section" size={{ xs: 12, sm: 5 }}>
                    <Typography className="title">Partner with Us as a Sponsor</Typography>
                    <Typography className="description">Unlock unique opportunities to showcase your brand and connect with our audience. Fill out the form below to explore sponsorship possibilities tailored to your goals.</Typography>
                    <Grid mt={5}>
                        {eventLocation&&eventLocation.map((item: any,index:number) => (
                            <Grid key={item?.header+index} className="venue-container">
                                <Avatar className="avathar">
                                 {item?.icon}
                                </Avatar>
                                <Grid >
                                    <Typography variant="subtitle2"> {item?.header}</Typography>
                                    <Typography variant="subtitle1">{item?.value}</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, sm: 7 }} className="t7-sponosor-contact-form-t7-form-container">
                    <SponosrContactForm customStyle={'sponsor-header'} />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default T7SponsorContact;