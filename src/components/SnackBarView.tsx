import React, { useMemo } from 'react';
import { Snackbar, Alert, SnackbarOrigin, AlertColor } from '@mui/material';
import useStore from '@/Libs/store';

export type SnackBarViewProps = {
    open: boolean;
    autoHideDuration: number;
    anchorOrigin: SnackbarOrigin;
    severity: AlertColor;
    text: string | string[];
}

export const SnackBarView: React.FC<SnackBarViewProps> = (props) => {
    const clearDataById = useStore((state:any) => state?.clearDataById)

    // Final message generation from text
    const finalMessage = useMemo(() => {
      if (typeof props?.text === "string") {
        return props.text;
      }

      if (Array.isArray(props?.text)) {
        return props.text.map((message, index) => (
          <React.Fragment key={index}>
            {message}
            <br />
          </React.Fragment>
        ));
      }
    }, [props?.text]);
    
    /**
     * Method used to close snackbar
     */
    const onClose=()=>{
        clearDataById('snackBarInfo')
    }

    return (
        <Snackbar id='snack-bar'
            open={props.open}
            autoHideDuration={props.autoHideDuration}
            onClose={onClose}
            anchorOrigin={props.anchorOrigin}>
            <Alert severity={props.severity}
                variant={'filled'}
                onClose={onClose}>
                <div>
                    {finalMessage}
                </div>
            </Alert>
        </Snackbar>
    );
}
