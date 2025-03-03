import useStore, { setNonPersistedDataById } from '@/Libs/store'
import { Box, Drawer } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TLink from './TLink';
import TAuthButton from '@/pages/events/template/_components/TAuthButton/TAuthButton';
import clsx from 'clsx';

const TemplateDrawer = ({ data = [], className }: { data?: { label: string, targetElementId: "speakers" | "sponsors" | "programs" | "location" | "tickets" | "sponsor-form" }[], className: string }) => {

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

                            <TLink usageType='Drawer' className='item' key={item.label} targetelementId={item?.targetElementId} >{item?.label}</TLink>

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
