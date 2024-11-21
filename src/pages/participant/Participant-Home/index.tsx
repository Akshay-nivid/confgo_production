import { useParams } from 'react-router-dom'
import Navbar from '../NavBar'
import EventInfo from './EventInfo'
import { useEffect, useLayoutEffect } from 'react'
import useStore, { GET, POST, setDataById } from '@/Libs/store'

export default function ParticipantHome() {
  
  

  const { slugName } = useParams()

  useEffect(() => {
    GET({

      url: `event/slug/${slugName}`,

      id: 'eventSlugInfo',

      successCB: (response: any) => {
        
        setDataById("slugName", { slugName })

        if(!response?.data?.event?.id) return;
        const body = {
         filters: {
          eventId:response?.data?.event?.id
          }
        }

        POST({ url: "participant/type/list", body: body, id: "participantList" ,successCB: (context: any) => {
          

          const options = context?.data.map((element: any) => ({
            value: element.id,
            label: element.name,
          }));

          setDataById("participantTypeOptions",{ options: options });

        }})
        
      },
      
      errorCB: (error: any) => {
        console.log(error)
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
