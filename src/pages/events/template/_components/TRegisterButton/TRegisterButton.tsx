import useStore, { snackBar } from '@/Libs/store';
import { IEventResponse } from '@/Libs/types/event';
import routes from '@/router/routes';
import Button, { ButtonProps } from '@mui/material/Button/Button'
import { useNavigate } from 'react-router-dom';


interface TRegisterButtonProps extends ButtonProps {
    buttonUseCase?: "DEFAULT" | "TIER-CARD";

    userTypeId?: number;

}

const TRegisterButton = ({ userTypeId, buttonUseCase = "DEFAULT", children, ...props }: TRegisterButtonProps) => {

    const navigate = useNavigate();

    const isCompany = sessionStorage.getItem('userLoggedInType') === 'COMPANYADMIN';

    const isUserLoggedIn = sessionStorage.getItem('userToken')

    const isUserRegistered = useStore(state => state.compData?.['isUserRegistered']?.value) || false;

    const event: IEventResponse = useStore(state => state.compData?.['event']?.data);

    const isPriceTierPresent = event?.eventPriceTiers?.length > 0

    /**
     * Handles the click event for the register button.
     * Prevents further actions if the user is a company admin.
     */

    function handleClickRegister() {
        if (isCompany) {

            snackBar({ severity: 'error', message: 'please login using participant credentials' })

            return
        }

        if (new Date(event?.startTime) < new Date()) {
            snackBar({ severity: 'error', message: 'The event has ended' });
            return
        }



        if (buttonUseCase === 'DEFAULT' && isPriceTierPresent) {

            const targetElement = document.getElementById('tier');

            if (!targetElement) return

            targetElement.scrollIntoView({ behavior: 'smooth' })

            return

        }

        if (isUserLoggedIn && isUserRegistered) {
            snackBar({ severity: 'error', message: 'You are already registered' })
            return;
        }

        navigate(routes.programSelection(), { state: { userTypeId: userTypeId ? userTypeId : undefined } });


    }

    return (
        <Button {...props} onClick={handleClickRegister} >{children ? children : 'Register'}</Button>
    )

}

export default TRegisterButton