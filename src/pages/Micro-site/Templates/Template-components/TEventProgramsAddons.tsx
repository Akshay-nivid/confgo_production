import useStore, { setNonPersistedDataById } from "@/Libs/store";
import { IEventResponse } from "@/Libs/types/event"

const TEventProgramsAddons = ({ eventData,children }: { eventData?: IEventResponse,children:(data:any)=>React.ReactNode }) => {

  

  const allItems = [...(eventData?.programs || []), ...(eventData?.addons || [])];


  const groupedItems = groupByDateAndTime(allItems);


  const selectedDate = useStore((state: any) => state.nonPersistedData?.selectedDate?.value) || Object?.keys(groupedItems)?.[0];
  

  function handleTabChange(date: string) {

    setNonPersistedDataById('selectedDate', { value: date });
  }



  // Function to group by date and time
  function groupByDateAndTime(items: any) {
    // Create an object to hold our groups
    const groups: any = {};

    items?.forEach((item: any) => {


      if (!item.startTime) {
        if (!groups.general) {
          groups.general = { general: [] };
        }
        groups.general.general.push(item);
        return; // Skip further processing for this item.
      }


      // Create a Date object from the startDate string

      const dateObj = new Date(item?.startTime);

      // Extract the date part (YYYY-MM-DD)
      const dateKey = dateObj?.toISOString().split('T')[0];

      // Extract the time part in HH:MM format (you can customize this format as needed)
      const hours = dateObj.getUTCHours().toString().padStart(2, '0');
      const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
      const timeKey = `${hours}:${minutes}`;

      // Initialize nested groups if not already set
      if (!groups[dateKey]) {
        groups[dateKey] = {};
      }
      if (!groups[dateKey][timeKey]) {
        groups[dateKey][timeKey] = [];
      }

      // Add the item to the proper group
      groups?.[dateKey]?.[timeKey]?.push(item);
    });

    // Now, create a sorted array of groups
    const sortedDates = Object?.keys(groups)?.sort(); // sorts dates in ascending order

    // Transform the groups object into an array format
    const result = sortedDates?.reduce((acc:any,dateKey) => {
      // Sort the time keys ascending as well


      const sortedTimes = Object?.keys(groups?.[dateKey])?.sort();
      const timeGroups = sortedTimes?.map(timeKey => ({
        time: timeKey,
        items: groups[dateKey][timeKey]
      }));

      if (!acc[dateKey]) {
      acc[dateKey] = timeGroups
      }

      return acc;


    },{});

    return result;
  }




  const data = { data: groupedItems, tabs: Object.keys(groupedItems),selectedDate,handleTabChange };

  return  children(data)
}

export default TEventProgramsAddons