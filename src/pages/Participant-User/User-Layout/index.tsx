import { Box } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import TopMenuSection from '@/pages/events/template/TopMenuSection';
import useStore, { GET, IStoreState, setDataById, setNonPersistedDataById, snackBar } from '@/Libs/store';
import { useEffect } from 'react';
import apiClient from '@/Libs/Https/API-client';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
import routes from '@/router/routes';
import { Logger } from '@/Utils/Logger';


/**
 * 
 * @returns 
 */
const UserLayout = () => {

  const templateId = useStore((state: any) => state.compData?.["templateId"]?.id)

  const location = useLocation();

  const eventId = useStore((state: any) => state?.compData?.["eventSelected"]?.id)

  const slugName = useStore((state: IStoreState) => state?.compData?.slugName?.value);

  const initialFetchDone = useStore(state => state.nonPersistedData.checkUserPaymentinitialFetchDone.value);

  const navigate = useNavigate()

  const payedUser = useStore(state => state.compData?.payedUser) || {}

  /**
   * checks if the event is published.
   * If `slugName` is missing, the user is redirected to the login page.
   * If event is not published,user will be redirected to external event link route to show maintanance page.
   */
  const checkPublished = async () => {
    try {
      if (!slugName) {
        navigate(routes.userLogin());
        return;
      }
      await GET({
        url: `event/slug/${slugName}`,
        id: 'slugEventDetails',
        successCB: (context: any) => {
          const eventData = context?.data;
          if (!(eventData?.published)) {
            navigate(routes.eventExternalLink(slugName))
          }
        },
        errorCB: () => {
          navigate(routes.eventExternalLink(slugName));
        }
      });
    } catch (error: any) {
      Logger.error("Error fetching event by slugname",error)
      snackBar({ severity: 'error', message: error?.message || 'something went wrong' })
    }
  };

/**
 * Fetches participant data and checks if user has already paid for the event.
 * Runs on component mount or update.
 */

  useEffect(() => {
    
    (async () => { 
      await checkPublished();

      const user = sessionStorage.getItem('userId');
      
      if (!user) return
      

      if (user) { 

        if (!initialFetchDone) {
          
          try {
            const response = await apiClient.post('participant/existing', { eventId: eventId })
            
            const { data, status } = processAPIResponse(response, 'participant/existing');
            
            setDataById('payedUser', data)

            setNonPersistedDataById('checkUserPaymentinitialFetchDone',{ value: true })
    
            if (status) { 
    
              if (data?.participant) {
                snackBar({ severity: 'error', message: 'You have already paid for this event' })
                navigate(routes.userHome())
                
              }
  
            }
            
          } catch (err:any) {
    
            snackBar({severity:'error',message:err?.response?.data?.message ||err?.message || 'something went wrong'})
          }
          
        } else {

          if (initialFetchDone) {

            if (payedUser?.participant) {
              snackBar({severity:'error',message:'You have already paid for this event'})
              navigate(routes.userHome())
            }
  
    
          }
          return
        }

      }

    })()


  }, [location.pathname])




  return (
    <Box className="user-layout">
      <TopMenuSection classPrefix={`template${templateId}`} />
      <Box className="user-layout-content">
        <Box className="user-layout-card">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default UserLayout;
