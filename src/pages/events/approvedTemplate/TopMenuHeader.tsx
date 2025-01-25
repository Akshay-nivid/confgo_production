/**
 * Component displays the top menu section of the template
 */
import useStore, { clearDataById, setDataById } from '@/Libs/store';
import Grid from '@mui/material/Grid2';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import config from "../../../../config.json";
import CustomButton from '@/components/CustomButton/CustomButton';

export type LinkData = {
    text: any; // The displayed text of the link
    url?: string; // Optional, if additional properties exist
};
type TopMenuHeaderProps = {
    links:LinkData[];
    data: any;
    classPrefix?: string;
    onScrollToProgram?: any;
    onScrollToAbout?: any;
    onScrollToContributors?: any;
    onScrollToLocation?: any;
    temp?: any;
}

/**
 * Component displays the top menu section of the template
 */
const TopMenuHeader: React.FC<TopMenuHeaderProps> = React.memo(({ links, data, classPrefix, onScrollToProgram, onScrollToLocation }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const baseUrl = config.api.url;
    const slugName = useStore((state: any) => state?.compData?.["slugName"]?.value) || '';
    const slugInfo = useStore((state: any) => state?.compData?.['slugEventDetails']?.[`event/slug/${slugName}`]?.data) ?? [];
    const currentLink = useStore((state: any) => state?.compData?.['currentLink']?.value) || ''

    /**
     * Method us to handle click and scroll to that particular section
     * @param link 
     * @returns 
     */
    function scrollToTargetLink(link: 'Speakers' | 'Sponsers' | 'Programmes' | 'Location' | 'BeSponser') {

        if (link === 'Speakers') {
            return
        }
        if (link === 'Programmes') {
            onScrollToProgram()
            return
        }
        if (link === 'Sponsers') {
            return
        }
        if (link === 'Location') {
            onScrollToLocation()
            return
        }
        if (link === "BeSponser") {
            return
        }
    }

    useEffect(() => {
        if (currentLink) {
            const timer = setTimeout(() => {
                const element = document.getElementById(currentLink);
                if (element) {
                    scrollToTargetLink(currentLink);
                    clearDataById('currentLink')
                }
            }, 100);

            return () => {
                clearTimeout(timer)
            };
        }
        // ...
    }, [location, currentLink]);

    /**
     * Handles the click event on a link, prevents the default anchor behavior,
     * and triggers the scroll to the "About" section.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} e - The mouse event triggered by the link click.
     */

    function handleLinkClick(value: "Speakers" | "Sponsers" | "Programmes" | "Location" | "BeSponser") {
        if (location?.pathname?.startsWith('/event-link')) {
            scrollToTargetLink(value)

        } else {
            setDataById('currentLink', { value: value });
            const targetRoute = `/event-link/${slugName}`
            navigate(targetRoute);
        }
    }

    return (
        <Grid container size={{ xs: 12, sm: 12 }} className={`${classPrefix}`}>
            <Grid container size={{ xs: 12, sm: 12 }} justifyContent={'space-between'} alignItems={'center'} className={`${classPrefix}-container`}>
                <>
                    <Grid className={`${classPrefix}-logo`}>{(data?.assetId || slugInfo?.assetId) ? <img
                        className={`${classPrefix}-logo-img`}
                        src={`${baseUrl}asset/${data?.assetId ?? slugInfo?.assetId ?? ''}`}
                    /> : <Grid></Grid>}</Grid>
                    <Grid container spacing={4} className={`${classPrefix}-sub-container`}>
                        {links.map((link, index) => (
                            <Grid key={index} className={`${classPrefix}-sub-container-item`}><Link key={`${index}-link`} to={'#'} onClick={() => handleLinkClick(link?.text)}> {link?.text} </Link></Grid>
                        ))}
                        <CustomButton className={`${classPrefix}-sponser-button`}
                            label="Become Sponsor"
                            variant="contained"
                            color="primary" />
                    </Grid>
                </>
            </Grid>
        </Grid>)
});

export default TopMenuHeader;