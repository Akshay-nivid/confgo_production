import CustomButton from '@/components/CustomButton/CustomButton'
import React from 'react'

/**
 * Components handle Login
 */
const TLogin: React.FC<any> = React.memo(({ className, onClick }: any) => {
    
    return (
        <CustomButton
            className={className}
            label="Login"
            variant="contained"
            color="primary" 
            onClick={onClick}
            />
    )
})

export default TLogin