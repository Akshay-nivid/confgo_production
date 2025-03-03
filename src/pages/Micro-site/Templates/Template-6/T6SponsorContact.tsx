import { IEventResponse } from "@/Libs/types/event";
import Grid from "@mui/material/Grid2";
import SponosrContactForm from "../Template-components/SponsorContactForm";
import { Avatar, Typography } from "@mui/material";
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
/**
 * Componet for Template 6 Sponsor contact form
 * @param eventData
 */
const T6SponsorContact = ({ eventData }: { eventData?: IEventResponse }) => {
    const eventLocation: any[] = [
        {
            header: 'Location',
            value: eventData?.venue?.name,
            icon: <PlaceOutlinedIcon />
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
        <Grid id="sponsor-form" container size={12} className="t6-sponosor-contact-form" >
            <Grid container size={{ xs: 12, sm: 10 }} className="main max-w-20 ">
                <Grid className="left-section" size={{ xs: 12, sm: 12 }}>
                    <Typography textAlign={'center'} className="title">Partner with Us as a Sponsor</Typography>
                    <Typography textAlign={'center'} className="description">Unlock unique opportunities to showcase your brand and connect with our audience. Fill out the form below to explore sponsorship possibilities tailored to your goals.</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12 }} className="t7-sponosor-contact-form-t7-form-container">
                    <SponosrContactForm customStyle={'sponsor-header'} />
                </Grid>

            </Grid>
            <Grid container spacing={2}>
                {eventLocation.map((item: any) => (
                    <Grid container marginInline={'auto'} size={{ xs: 12, sm: 4, md: 4 }} key={item.id}>
                        <Grid className="venue-container main">
                            <Avatar className="avathar">
                                {item.icon}
                            </Avatar>
                            <Grid>
                                <Typography variant="subtitle2"> {item?.header}</Typography>
                                <Typography variant="subtitle1">{item?.value}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
}

export default T6SponsorContact;