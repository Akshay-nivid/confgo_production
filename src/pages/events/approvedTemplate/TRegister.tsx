import CustomButton from '@/components/CustomButton/CustomButton'
import React from 'react'

/**
 * Components handle Register
 */
const TRegister: React.FC<any> = React.memo(({ buttonName, className }) => {
    return (
        <CustomButton
            className={className}
            label={buttonName}
            variant="contained"
            color="primary" />
    )
})

export default TRegister