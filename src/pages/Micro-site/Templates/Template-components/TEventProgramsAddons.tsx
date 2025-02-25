import useStore, { IStoreState } from '@/Libs/store';
import { IEventResponse } from '@/Libs/types/event';

const TEventProgramsAddons = () => {

    const eventData:IEventResponse = useStore((state:IStoreState)=>state.compData?.event?.data);


  return (
    <div>TEventProgramsAddons</div>
  )
}

export default TEventProgramsAddons