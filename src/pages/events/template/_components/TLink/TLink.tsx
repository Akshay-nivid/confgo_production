import React from 'react'
import { Link } from 'react-router-dom'



interface TLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
    to?: string;
    targetelementId: "speakers" | "sponsors" | "programs" | "location" | "tickets" | "sponsor-form";
    children: React.ReactNode
}
const TLink = ({ to, ...props }: TLinkProps) => {

    function handleClickLink() {
        const element = document.getElementById(props.targetelementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }


    return (
        <Link {...props} to={to ? to : '#'} onClick={props.onClick ? props.onClick : handleClickLink}>{props.children}</Link>
    )
}

export default TLink