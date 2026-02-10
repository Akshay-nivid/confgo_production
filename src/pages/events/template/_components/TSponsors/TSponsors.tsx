import useStore from "@/Libs/store";
import { IEventResponse, IEventSponsor, IEventSponsorType } from "@/Libs/types/event";



interface ISponsor {
    id: number;
    sponsorId: number;
    sponsorTypeId: number;
    eventId: number;
    parentEventId: number;
    eventAddonId: number | null;
    eventAddonPropertyId: number | null;
    reservedSeats: number | null;
    statusId: number;
    sponsor: IEventSponsor;
    sponsorType: IEventSponsorType;
  }
function groupSponsorsByCategory(sponsors: ISponsor[]) {

    const groupedSponsors = {
        "DIAMOND": [],
        "PLATINUM": [],
        "GOLD": [],
        "SILVER": [],
    } as any

    sponsors?.forEach((sponsor: ISponsor) => {

        groupedSponsors[sponsor?.sponsorType?.name]?.push(sponsor)
    })

    return groupedSponsors
}

   /**
  * Extracts unique sponsors from a given list based on their `sponsorId`.
  * 
  * @param {any[]} sponsors - An array of sponsor objects. Each object is expected to have a `sponsorId` property.
  * @returns {any[]} An array of unique sponsor objects, ensuring no duplicate `sponsorId`s.
  * 
  * This function uses a Map to track speakers by their `sponsorId`. 
  * It ensures that only one sponsor per `sponsorId` is included in the returned array.
  */
   function getUniqueSponsors(sponsors:any) {
       const uniqueSponsorsMap = new Map<number, any>();

       sponsors.forEach((sponsor: ISponsor) => {
        if (!uniqueSponsorsMap.has(sponsor.sponsorId)) {
            uniqueSponsorsMap.set(sponsor.sponsorId, sponsor);
        }
    });

    return Array.from(uniqueSponsorsMap.values());
}


interface TSponsorsProps {
    children: (props: {
        data: {
            "DIAMOND": ISponsor[],
            "PLATINUM": ISponsor[],
            "GOLD": ISponsor[],
            "SILVER": ISponsor[],
    } }) => React.ReactNode;

}

const TSponsors:React.FC<TSponsorsProps> = ({children}) => {

    const eventData:IEventResponse = useStore(state=>state.compData?.event?.data)


    const sponsors = getUniqueSponsors(eventData?.eventSponsors)

    const groupedSponsors = groupSponsorsByCategory(sponsors)
    


  return <>{children({data:groupedSponsors})}</>

}

export default TSponsors
