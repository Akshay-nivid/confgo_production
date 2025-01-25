import CustomButton from '@/components/CustomButton/CustomButton'
import React from 'react'

/**
 * Components handle Login
 */
const TLogin: React.FC<any> = React.memo(({className}:any) => {
    return (
        <CustomButton
            className={className}
            label="Login"
            variant="contained"
            color="primary" />
    )
})

export default TLogin