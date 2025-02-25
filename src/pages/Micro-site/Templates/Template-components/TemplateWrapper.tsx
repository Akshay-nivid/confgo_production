import useStore from '@/Libs/store'
import { IEventResponse } from '@/Libs/types/event'
import Box from '@mui/material/Box/Box';
import clsx from 'clsx';
import React from 'react'


interface ChildProps {
    eventData?: IEventResponse;
}
const TemplateWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {

    const eventData: IEventResponse = useStore(state => state.compData?.event?.data) || {}


    const childrenWithData = React.Children?.map(children, child => {


        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<ChildProps>, { eventData });
        }
        return child
    })

    return <Box className={clsx("template-wrapper", className)}>{childrenWithData}</Box>
}

export default TemplateWrapper