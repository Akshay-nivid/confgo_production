import { useParams } from 'react-router-dom'
import Navbar from '../NavBar'
import EventInfo from './EventInfo'
import { useEffect } from 'react'
import  { GET, POST, setDataById, snackBar } from '@/Libs/store'



/**
 * Component to render the participant home page based on the event slug name.
 * Fetches the event details by slug and stores the event slug name in the store.
 * Also, fetches the participant types for the event and stores the options for the participant type dropdown in the store.
 * @returns {JSX.Element} - The JSX element for the participant home page.
 */
export default function ParticipantHome() {
  
  

  const { slugName } = useParams()


  useEffect(() => {
    
        /**
         * Success callback function for the GET request to fetch event details by slug.
         * Sets the event slug name in the store, and makes a POST request to fetch participant types
         * and sets the options for the participant type dropdown in the store.
         * @param {object} response - The response data from the request.
         */
    GET({url: `event/slug/${slugName}`,id: 'eventSlugInfo',successCB: (response: any) => {
        
        setDataById("slugName", { slugName })

        if(!response?.data?.event?.id) return;
        const body = {
         filters: {
          eventId:response?.data?.event?.id
          }
        }

        /**
         * Success callback function for the POST request to fetch participant types.
         * Sets the options for the participant type dropdown in the store.
         * @param {object} context - The context of the request.
         * @param {array} context.data - The response data from the request.
         */
        POST({ url: "participant/type/list", body: body, id: "participantList" ,successCB: (context: any) => {
          

          const options = context?.data.map((element: any) => ({
            value: element.id,
            label: element.name,
          }));

          setDataById("participantTypeOptions",{ options: options });

        }})
        
      },
      
      errorCB: (error: any) => {
        snackBar({ severity: 'error', message: error?.message || 'something went wrong' })
      }
   })
 })


  return (
    <>
    <Navbar/>
    <EventInfo slugName={slugName??''} />
    </>
  )
}
