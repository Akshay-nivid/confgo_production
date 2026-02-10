import useStore from '@/Libs/store'
import { IEventPriceTier, IEventResponse } from '@/Libs/types/event';
import React from 'react'


interface TEventPriceTiersProps {
  children: ({ data }: { data: Record<string, IEventPriceTier[]>}) => React.ReactNode
}

const TEventPriceTiers: React.FC<TEventPriceTiersProps> = ({ children }) => {

  const eventData: IEventResponse = useStore(state => state.compData?.event?.data) ?? [];

  const groupedData = eventData?.eventPriceTiers?.reduce((acc: Record<string, IEventPriceTier[]>, item: IEventPriceTier) => {


    if (!acc[item?.participantType?.id]) {
      acc[item?.participantType?.id] = [item];
    } else {
      acc[item?.participantType?.id].push(item);
    }
    return acc
  }, {})


  return <>{children({ data: groupedData })}</>
}

export default TEventPriceTiers