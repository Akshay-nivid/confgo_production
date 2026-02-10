import axios from "axios";


export const fetchConferenceUrl=async()=>{
    try {
        let res = await axios.post("https://webinar.confgo.com/api/create-meeting-public", {
        "user_id": 1,
        "title": "My External Meeting",
        "description": "Created from external app",
        "password": "1234",
        "date": "2026-01-14",
        "time": "17:49",
        "timezone": "Atlantic Standard Time (ADT)"
      })
      return { value: res?.data?.data?.link, id: res?.data?.data?.meeting_id }
    } catch (error) {

    }
}
