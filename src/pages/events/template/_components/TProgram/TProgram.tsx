import useStore from '@/Libs/store';
import { IEventResponse } from '@/Libs/types/event';


interface DataContainerProps {
  children: (props: {
    data?: any;
  }) => React.ReactNode;
}
const TProgram : React.FC<DataContainerProps> =  ({children}) => {

  const event: IEventResponse = useStore(state => state.compData?.['event']?.data);

    
  return children({ event } as any)
}

export default TProgram
