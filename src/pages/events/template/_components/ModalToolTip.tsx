import { Avatar, Box } from '@mui/material'
import config from '../../../../../config.json'

// type User = {
//     acceptedTerms: boolean | null;
//     assetId: number;
//     email: string;
//     firstName: string;
//     id: number;
//     isSsoUser: boolean;
//     lastName: string;
//     phone: string;
//     phoneVerified: boolean;
//     ssoMetadata: any | null; 
//     statusId: number;
//   };
  
const ModalToolTip = ({ data }: { data: any }) => {
  return (
      <div className='modal-tooltip'>
          <Avatar src={config.api.url + "asset/" + data?.user?.assetId}></Avatar>
          <Box>
              <p className='modal-tooltip-name'>{data?.userInfo?.firstName} {data?.user?.lastName}</p>
              <p className='modal-tooltip-designation'>{data?.speakerBios?.[0]?.designation || ''}</p>                  
          </Box>
    </div>
  )
}

export default ModalToolTip