import  { setNonPersistedDataById } from '@/Libs/store';
import React from 'react'
import { Link } from 'react-router-dom'
import useValidateEventData from '../programHandler';



interface TLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
    to?: string;
    targetelementId: "speakers" | "sponsors" | "programs" | "location" | "tickets" | "sponsor-form";
    children: React.ReactNode,
    usageType?: "Drawer" | "Header"
}
function handleCloseDrawer() {
    setNonPersistedDataById("templateDrawerOpen", { value: false })
}

/**
 * TLink is a component that displays a link.
 * It will scroll to the element with the id of targetelementId when clicked.
 * If usageType is "Drawer", it will close the drawer when clicked.
 * The link will be hidden if the corresponding data is not available (e.g. speakers, sponsors, location, tickets).
 */
const TLink = ({ to, ...props }: TLinkProps) => {


    function handleClickLink() {

        if (props.usageType === "Drawer") {
            handleCloseDrawer()
        }

        const element = document.getElementById(props.targetelementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }


    const {isEventPriceTiers, isSpeakers, isSponsors, isLocation}= useValidateEventData()

    if(props.targetelementId === 'speakers' && !isSpeakers) {
        return null
    } else if (props.targetelementId === 'sponsors' && !isSponsors) {
        return null
    } else if (props.targetelementId === 'location' && !isLocation) {
        return null
    } else if(props.targetelementId === 'tickets' && !isEventPriceTiers) {
        return null  
    }


    return (

        <Link {...props} to={to ? to : '#'} onClick={props.onClick ? props.onClick : handleClickLink}>{props.children}</Link>
    )
}

export default TLink