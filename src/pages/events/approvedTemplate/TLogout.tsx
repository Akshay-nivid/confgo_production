import CustomButton from '@/components/CustomButton/CustomButton'
import { handleLogout } from '@/Utils/CommonBaseClass'
import React from 'react'
import { useNavigate } from 'react-router-dom';

/**
 * Components handle Login
 */
const TLogout: React.FC<any> = React.memo(({ className }: { className: string }) => {

    const navigate = useNavigate();

    const onLogoutSuccess = React.useCallback(() => {
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