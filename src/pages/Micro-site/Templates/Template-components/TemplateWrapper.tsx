import useStore from '@/Libs/store'
import { IEventResponse } from '@/Libs/types/event'
import Box from '@mui/material/Box/Box';
import clsx from 'clsx';
import React from 'react'


interface ChildProps {
    eventData?: IEventResponse;
}
/**
 * TemplateWrapper
 * 
 * A wrapper component that injects the event data into all child components
 * that accept the "eventData" prop.
 * 
 * Props:
 * - `children` (ReactNode): The children components to be wrapped
 * - `className` (string, optional): Additional class names for styling the wrapper
 * 
 * All child components will receive an "eventData" prop with the event data
 * from the store. This is useful for components that need access to the event
 * data, but don't want to fetch it from the store themselves.
 * 
 * The wrapper also applies a "template-wrapper" class for styling.
 * 
 */
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