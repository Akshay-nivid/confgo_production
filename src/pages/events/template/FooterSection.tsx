/**
 * Component displays the footer section of the template
 */
import Grid from '@mui/material/Grid2';
import React from 'react';
import LogoIcon from '@/assets/svg/template1-logo.svg';
//import FacebookIcon from '@/assets/svg/template1-facebook.svg';
//import InstagramIcon from '@/assets/svg/template1-instagram.svg';
//import TwitterIcon from '@/assets/svg/template1-twitter.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useStore, { setDataById } from '@/Libs/store';


export type LinkData = {
    text: any; // The displayed text of the link
    url?: string; // Optional, if additional properties exist
};

type FooterSectionProps = {
    data?: any;
    classPrefix?: string;
    temp?: any;
    links?:LinkData[];
    onScrollToProgram?: any;
    onScrollToAbout?: any;
    onScrollToContributors?: any;
    onScrollToLocation?: any;
    onScrollToBeSponsor?: any;
    onScrollToSponsor?: any;
}


/**
 * Component displays the footer section of the template
 */
const FooterSection: React.FC<FooterSectionProps> = React.memo(({ links, classPrefix, onScrollToProgram, onScrollToLocation, onScrollToContributors, onScrollToBeSponsor, onScrollToSponsor }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const slugName = useStore((state: any) => state?.compData?.["slugName"]?.value) || '';

     /**
     * Method us to handle click and scroll to that particular section
     * @param link 
     * @returns 
     */
     function scrollToTargetLink(link: 'Speakers' | 'Sponsors' | 'Programs' | 'Venue' | 'BeSponser') {

        if (link === 'Speakers') {
            onScrollToContributors()
            return
        }
        if (link === 'Programs') {
            onScrollToProgram()
            return
        }
        if (link === 'Sponsors') {
            onScrollToSponsor();
            return
        }
        if (link === 'Venue') {
            onScrollToLocation()
            return
        }
        if (link === "BeSponser") {
            onScrollToBeSponsor()
            return
        }
    }


    /**
     * Handles the click event on a link, prevents the default anchor behavior,
     * and triggers the scroll to the "About" section.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} e - The mouse event triggered by the link click.
     */

    function handleLinkClick(value: "Speakers" | "Sponsors" | "Programs" | "Venue" | "BeSponser") {
        if (location?.pathname?.startsWith('/event')) {
            scrollToTargetLink(value)

        } else {
            setDataById('currentLink', { value: value });
            const targetRoute = `/event/${slugName}`
            navigate(targetRoute);
        }
    }

    return <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`} spacing={1}>
        <Grid size={{ xs: 12, sm: 4 }} container justifyContent={'center'} alignItems={'center'} direction={'column'}>
            <Grid className={`${classPrefix}-logo`}><LogoIcon /></Grid>
            <Grid className={`${classPrefix}-social-media`} container direction={'row'}>
                {/* <Grid><FacebookIcon /></Grid>
                <Grid><InstagramIcon /></Grid>
                <Grid><TwitterIcon /></Grid> */}
            </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 3 }} container justifyContent={'center'} direction={'column'}>
            <Grid container direction={'row'} size={{ xs: 12, sm: 12}}>
                <Grid size={{ xs: 6, sm: 6}}>6737 W Washington St.Suite </Grid>
                <Grid size={{ xs: 6, sm: 6}}>+1 (414) 559-4745</Grid>
            </Grid>
            <Grid container direction={'row'} size={{ xs: 12, sm: 12 }}>
                <Grid  size={{ xs: 6, sm: 6}}>3265 West Allis, WI 53214</Grid>
                <Grid  size={{ xs: 6, sm: 6}}>support@confgo.com</Grid>
            </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 1 }}></Grid>
        <Grid size={{ xs: 12, sm: 2 }} container justifyContent={'center'} direction={'column'}>
            <Grid container direction={'row'} size={{ xs: 12, sm: 12}}>
                {links?.map((link, index) => (
                    <Grid key={index} size={{ xs: 6, sm: 6 }} className={`${classPrefix}-sub-container-item`}><Link key={`${index}-link`} to={'#'} onClick={() => handleLinkClick(link?.text)}> {link?.text} </Link></Grid>
                ))}
            </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 1 }}></Grid>
    </Grid>
});

export default FooterSection;

