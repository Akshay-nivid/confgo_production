import CustomButton from '@/components/CustomButton/CustomButton'
import { handleLogout } from '@/Utils/CommonBaseClass'
import React from 'react'
import { useNavigate } from 'react-router-dom';

/**
 * Components handle Login
 */

interface TLogoutProps {
    className: string;
    onBeforeLogout?: () => void; // Adding a function as a prop
}
const TLogout: React.FC<TLogoutProps> = React.memo(({ className, onBeforeLogout}) => {

    const navigate = useNavigate();

    const onLogoutSuccess = React.useCallback(() => {

        if (onBeforeLogout) {
            onBeforeLogout(); // TypeScript still thinks it might be undefined
        }
            }, [navigate]);

    return (
        <CustomButton
            className={className}
            label="Logout"
            variant="contained"
            color="primary"
            onClick={() => handleLogout({ onLogoutSuccess: onLogoutSuccess })}
        />
    )
})

export default TLogout