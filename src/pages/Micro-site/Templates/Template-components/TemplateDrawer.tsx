import useStore, { setNonPersistedDataById } from '@/Libs/store'
import { Box, Drawer } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TLink from './TLink';
import TAuthButton from '@/pages/events/template/_components/TAuthButton/TAuthButton';
import clsx from 'clsx';

/**
 * TemplateDrawer component renders a customizable drawer UI element.
 *
 * @param {Object} props - The properties object.
 * @param targetElementId - The id of the target element to scroll to when the link is clicked. "speakers" | "sponsors" | "programs" | "location" | "tickets" | "sponsor-form"
 * @param {Array} props.data - An optional array of objects representing items to display in the drawer. Each object should contain a `label` and a `targetElementId` property.
 * @param {string} props.className - A custom CSS class to apply for additional styling.
 *
 * The drawer displays links and authentication buttons. It can be toggled open or closed based on the state managed by `useStore`. The drawer is anchored to the right of the screen and takes full width. It includes close functionality and maps through the provided data to render each link using the `TLink` component. Additionally, it provides authentication buttons for signup, login, and logout actions using the `TAuthButton` component.
 */

const TemplateDrawer = ({ data = [], className }: { data?: { label: string, targetElementId: string }[], className: string }) => {

    const isOpen = useStore(state => state.nonPersistedData?.templateDrawer?.value)

    const handleCloseDrawer = () => {
        setNonPersistedDataById('templateDrawer', { value: false })
    }
    return (
        <Drawer
            open={isOpen}
            className={clsx('template-drawer', className)}
            anchor='right'
            onClose={handleCloseDrawer}
            sx={{
                width: '100%',
            }}
        >
            <Box className="drawer-wrapper">

                <Box className="drawer-header">

                    <CloseRoundedIcon onClick={handleCloseDrawer} className='close-icon' />

                </Box>
                <Box className="drawer-content">
                    {
                        data?.map((item) => (

                            <TLink usageType='Drawer' className='item' key={item.label} targetelementId={item?.targetElementId as "speakers" | "sponsors" | "programs" | "location" | "tickets" | "sponsor-form"} >{item?.label}</TLink>

                        ))
                    }
                    <Box className="auth-buttons flex-1  flex flex-col justify-end pb-4 gap-y-4">
                        <TAuthButton authType='SIGNUP' className='signup'>Sign up</TAuthButton>
                        <TAuthButton authType='LOGIN' className='login'>Login</TAuthButton>
                        <TAuthButton fullWidth variant='contained' className='logout' authType='LOGOUT'>Log out</TAuthButton>
                    </Box>
                </Box>

            </Box>

        </Drawer>
    )
}

export default TemplateDrawer
