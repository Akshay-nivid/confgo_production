import Navbar from '../NavBar'
import EventInfo from './EventInfo'

export default function ParticipantHome() {
  let data={
    "name":"Health Club",
    "title":"Blood Test",
    "amount":"50000.00",
    "description":"Blood Test Camp",
    "statusId":"3",
    "interval":" not required ",
    "startTime":"2024-10-25",
    "endTime":"2024-10-30",
    "id":'28',
    "venue": {
        "name":"Science Hall",
        "address":"Left block",
        "city":"Bangalore",
        "state":"Karnataka",
        "country":"INDIA",
        "postalCode":"560062",
        "totalCapacity":"100"
    },
    "programs": [
        {
            "name":"Dengue test",
            "title":"Dengue Testing",
            "startTime":"2024-10-25",
            "endTime":"2024-10-30",
            "statusId":"3",
            "interval":" not required ",
            "amount":"30.00",
            "description":"testing blood"
        },
                {
            "name":"Maleria test",
            "title":"Maleria Testing",
            "statusId":"3",    
            "interval":" not required ",
            "startTime":"2024-10-25",
            "endTime":"2024-10-30",
            "amount":"30.00",
            "description":"testing blood"
        }
    ],
     "addon":[
        {
            "addonId":"1",  
            "amount":"20.0",
            "startTime":"2024-10-25",
            "endTime":"2024-10-30",
            "tier":"not rquired"
        },
        {
            "addonId":"1",
            "amount":"45.00",
            "startTime":"2024-10-25",
            "endTime":"2024-10-30",
            "tier":"not rquired"
        }
     ]
}
  return (
    <>
    <Navbar/>
    <EventInfo data={data}/>
    </>
  )
}
