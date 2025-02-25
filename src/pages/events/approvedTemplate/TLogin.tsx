import CustomButton from '@/components/CustomButton/CustomButton'
import React from 'react'

/**
 * Components handle Login
 */
const TLogin: React.FC<any> = React.memo(({ className, onClick }: { className?: string, onClick?: () => void }) => {

    const isCompany = sessionStorage.getItem('userLoggedInType') === 'COMPANYADMIN'

    return (
        <CustomButton
            className={className}
            label="Login"
            variant="contained"
            color="primary"
            onClick={isCompany ? undefined : onClick}
        />
    )
})

export default TLogin