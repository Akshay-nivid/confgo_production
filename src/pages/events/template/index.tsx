/**
 * TemplateContainer component handles the template creation
 */
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Template1 from './Template1';
import useStore, { setDataById } from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import routes from '@/router/routes';
import Template3 from './Template3';
import Template2 from './Template2';
import Template4 from '../approvedTemplate/Template4';
import { CircularProgress } from '@mui/material';
import NoEvents from '@/pages/Participant-User/No-Event/NoEvent';

type TemplateContainerProps = {
    id?: number;
}

const templates: any = {
  1: Template4,
  2: Template2,
  3: Template3,
  4: Template1
};

/**
 * Component handles the template creation
 */
const TemplateContainer: React.FC<TemplateContainerProps> = React.memo(({ }) => {

    const { id, entityId, slug } = useParams();

    const temp = typeof id === 'number' ? id : Number(id) || 1;
    const GET = useStore((state: any) => state.GET);
    const dataInfo = useStore((state: any) => state?.compData?.['templateEventDetails']?.[`event/${entityId}`]) ?? [];
    const slugInfo = useStore((state: any) => state?.compData?.['slugEventDetails']?.[`event/slug/${slug}`]) ?? [];
    const clearDataById = useStore((state: any) => state?.clearDataById);
    const navigate = useNavigate();
    // const isIntialGetCartCalled = useStore(state=>state?.nonPersistedData[NonPersistedKeys.INITIAL_GET_CART]?.value)
    const [publish, setpublish] = useState<boolean>(false);
    const [loading, setloading] = useState<boolean>(true);

  // const cartId = useStore(state => state.compData?.userDetails?.userCart?.id) || null; 
    
  
    /**
  * Useeffect hook handles the api call for fetching event details
  */
  useEffect(() => {
    if (entityId) {
      fetchEventDetails();
      setpublish(true);
    }
    else if (slug) {
      fetchEventDetailsFromSlug()
    }

  }, [])


  // function handleNavigateToCart() {
  //   navigate(routes.programSelection());
  // }

  // check if user is logged in or not. if logged in call cart api and get the cart data
  // useEffect(() => {
   
  //   const userToken = sessionStorage.getItem('token')
  //   const userRole = sessionStorage.getItem('userRole')


  //   if (userToken && userRole === 'USER') { 

  //     if(isIntialGetCartCalled) return // return if cart api is called for the first time

  //     if (cartId) {

  //       getUserCart({ helperFn: handleNavigateToCart, cartID: cartId }) 
  //       setNonPersistedDataById('intialGetCart',{ value: true })
  //      }


  //   }

  //   return 
    
  // },[])

  useEffect(() => () => {
    clearDataById('templateEventDetails');
    clearDataById('defaultProgramData')
  }, [])

    /**
* Method fetch the event details
*/
const fetchEventDetails = async () => {
    try {
      setloading(true);
      await GET({
        url: `event/${entityId}`,
        id: 'templateEventDetails',
        errorCB: (context: any) => {
          Logger.error('TemplateView.tsx', context?.message);
        }
      });
    } catch (error) {
      Logger.error('TemplateView.tsx', error);
    } finally {
      setloading(false);
    }
  }

  /**
* Method fetch the event details from slug
*/
  const fetchEventDetailsFromSlug = async () => {
    setloading(true);
    try {
      await GET({
        url: `event/slug/${slug}`,
        id: 'slugEventDetails',
        successCB: (context: any) => {
          const eventData = context?.data;
          setDataById('eventSelected', { id: eventData?.id });
          setDataById('slugName', { value: slug });
          setDataById('templateId', { id: eventData?.templateId });
          setDataById('Event-Published', { published: eventData?.published });
          setpublish(eventData?.published);
        },
        errorCB: (context: any) => {
          Logger.error('TemplateView.tsx', context?.message);
          navigate(routes.userLogin());
        }
      });
    } catch (error) {
      Logger.error('TemplateView.tsx', error);
    } finally {
      setloading(false);
    }
  }

  /**
   * Method returns the template id
   * @param eventData : event details
   * @param slugData : slug details
   * @returns : template id
   */
  const findTemp = ( temp: any, slugData: any) => {
    return slugData?.templateId || temp;
  }

  const SelectedTemplate = templates[findTemp(temp, slugInfo?.data)];

  return loading ? (
    <CircularProgress color="inherit" size={20} />
  ) : publish ? (
    <Grid container size={{ xs: 12, sm: 12 }} className={`event-template${!slug ? " event-template-preview" : ""}`} spacing={1}>
      {(dataInfo?.data || slugInfo?.data) && (
        <Grid container size={{ xs: 12, sm: 12 }} spacing={1}>
          <Grid container size={{ xs: 12, sm: 12 }} className="event-template">
            {SelectedTemplate ? <SelectedTemplate data={dataInfo?.data || slugInfo?.data} /> : null}
          </Grid>
        </Grid>
      )}
    </Grid>
  ) : (
    <NoEvents description="" title="This event is currently under maintenance" />
  );
});

export default TemplateContainer;