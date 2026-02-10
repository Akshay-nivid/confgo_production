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
  
const ModalToolTip = ({ data, type }: { data: any, type?: any }) => {
  return (
      <div className='modal-tooltip'>
        {type === 'SPONSOR'? <>
        <Avatar src={config.api.url + "asset/" + data?.sponsor?.logoAssetId}>{data?.sponsor?.name?.[0]}</Avatar>
          <Box>
              <p className='modal-tooltip-name'>{data?.sponsor?.name}</p>
          </Box>
          </>:<>
        <Avatar src={config.api.url + "asset/" + data?.user?.assetId}></Avatar>
          <Box>
              <p className='modal-tooltip-name'>{data?.user?.firstName} {data?.user?.lastName}</p>
              <p className='modal-tooltip-designation'>{data?.user?.designation || ''}</p>                  
          </Box></>}
         
    </div>
  )
}

export default ModalToolTip