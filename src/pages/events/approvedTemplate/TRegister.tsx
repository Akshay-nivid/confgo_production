import CustomButton from '@/components/CustomButton/CustomButton'
import React from 'react'

/**
 * Components handle Register
 */
const TRegister: React.FC<any> = React.memo(({ buttonName, className, onClick }) => {
    const isCompany = sessionStorage.getItem('userLoggedInType') === 'COMPANYADMIN' 

    return (
        <CustomButton
            className={className}
            label={buttonName}
            variant="contained"
            color="primary"
            disabled={isCompany}
            onClick={isCompany ? undefined : onClick}
            />
    )
})

export default TRegister