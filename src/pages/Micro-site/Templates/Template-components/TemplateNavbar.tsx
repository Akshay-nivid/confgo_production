import Box from '@mui/material/Box/Box'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import React from 'react';
import { IEventResponse } from '@/Libs/types/event';
import config from '../../../../../config.json'
import clsx from 'clsx';

const TemplateNavbar = ({ children, eventData, className }: { children: (props: { data?: IEventResponse }) => React.ReactNode, eventData?: IEventResponse; className?: string }) => {


    const baseUrl = config.api.url

    return (
        <Box className={clsx("template-navbar", className)}>
            <Box className="logo-container">
                <img className='logo' src={eventData?.assetId ? `${baseUrl}asset/${eventData?.assetId}` : ''} alt="" />
            </Box>
            <Box className="nav-content-container">
                {children({ data: eventData })}
            </Box>
            <Box className='menu-container'>
                <MenuRoundedIcon className="menu-icon" />
            </Box>

        </Box>
    )
}

export default TemplateNavbar