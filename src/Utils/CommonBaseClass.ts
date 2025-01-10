import moment from 'moment';
import { useMediaQuery } from "react-responsive";
import { StatusEnum } from './StatusEnum';

/**
 * Process the API response to extract status and message.
 * @param
 * @returns An object containing status and message extracted from the response.
 */
export function processAPIResponse(response: any, api: string) {
  let status = false;
  let message: any = "Success";
  let data: any;
  const resData = response?.response?.data || response?.data?.data;

  try {
    if (response.status === 401 && !api.includes("login")) {
      status = false;
      message = resData.message;
      sessionStorage.clear();
      // window.location.href = "/organization/login";
      return { status, message, data };
    } else if (response.status === 401 && api.includes("login")) {
      status = false;
      message = resData.message;
      return { status, message, data };
    } else if (
      response.status === 400 ||
      response.status == 403 ||
      response.status == 500
    ) {
      status = false;
      if (Array.isArray(resData.message)) {
        message = resData.message[0].msg;
        data = resData;
      } else {
        message = resData.message;
        data = resData;
      }
    } else if (response.status == 200 || response.status == 201) {
      status = true;
      message = response.data?.message ? response.data?.message : message;
      if (!Array.isArray(resData)) {
        data = resData?.data || resData;
      } else {
        data = resData;
      }
    } else {
      status = false;
      message = resData.message;
    }
  } catch (e) {}
  return { status, message, data };
}

/**
 * A utility function to set form values in a type-safe manner.
 * This function iterates over the provided data object and sets the values
 * in the form using the provided setValue function.
 *
 * @param data - An object containing the form data to set. It is of type Partial<T>,
 *               meaning it can contain any subset of the keys defined in type T.
 * @param setValue - A callback function that takes a key and a value, allowing
 *                   the form's state to be updated accordingly. This function
 *                   expects a key of type keyof T and a value of type T[keyof T].
 */
export const setFormValues = <T extends object>(
  data: Partial<T>,
  setValue: (key: keyof T, value: T[keyof T]) => void
) => {
  for (const key in data) {
    if (key in data) {
      const value = data[key as keyof T];

      if (value !== undefined) {
        setValue(key as keyof T, value);
      }
    }
  }
};
/**
 * Method Converts the entire string to lowercase, then capitalize the first letter
 * @param input : the string to convert
 * @returns : converted string
 */
export const toSentenceCase = (input: string) => {
  if (!input) return "";
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};

/**
 * Method returns the value to be taken from the data array based on a comparison parameter
 * @param data : data array
 * @param cmp1 : parameter to be compared in the data
 * @param cmp2 : value to be compared
 * @param name : returned parameter
 * @returns
 */
export const getValueFromArrayBasedOnParameter = (
  data: any,
  cmp1: any,
  cmp2: any,
  name: any
) => {
  if (!(data || cmp1 || cmp2 || name)) return "";
  return data?.find((item: any) => item[cmp1] == cmp2)?.[name];
};
/**
 * Converts a given string to title case, where the first letter of each word is capitalized.
 * If the input is `undefined`, it returns an empty string.
 * @param str - The string to be converted to title case.
 * @returns The title-cased version of the input string.
 * 
 */
 export const toTitleCase = (str: string | undefined): string => {
  if (!str) return '';
  return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};

/**
 * purpose types set password and reset password
 */
export const purposeTypes = {
  SET_PASSWORD: 'USER_REGISTRATION_OTP',
  RESET_PASSWORD: 'RESET_PASSWORD_OTP'
}

/**
 *  Interface defining the parameters for formatting a date.
 */
interface IDateTimeRangeParams {
  date: Date | string;
  format: 'MMMM D, YYYY' | 'DD/MM/YYYY' | 'h:mm A' | string;  
}
export function formatDateTimeRange({date,format}:IDateTimeRangeParams){
  if (!date) {
    return ''; 
  }
return  moment.utc(date).local().format(format);
}

export function formatUTCDateTime(dateString: string) {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);

  // Extract date and time components
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  // Format to desired output
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
  return formattedDate;
}

/**
 * Method used to convert text to camelcase
 * @param sentenceCase 
 * @returns 
 */
export const toCamelCase = (sentenceCase: any) => {
  let out = "";
  let str: any
  if (sentenceCase) {
    str = sentenceCase.replace(/_/gi, ' ');
    str.split(" ").forEach(function (el: any) {
      var add = el.toLowerCase();
      out += (' ' + add[0].toUpperCase() + add.slice(1));
    });
  }
  return out;
}





/**
 * Clears the localStorage and sessionStorage, then invokes the success callback function.
 * 
 * @param successCB - A callback function that will be executed after clearing storage.
 */
export function handleLogout({ onLogoutSuccess }: { onLogoutSuccess: Function }) {
  localStorage.clear();
  sessionStorage.clear();
  onLogoutSuccess();
}


/**
 * Method fetches the user token
 * @returns : user token
 */
export const getUserToken = () => {
  return sessionStorage.getItem("userToken");
}

/**
 * Converts a timestamp to a time string formatted as "HH:mm" (24-hour format).
 * @param timestamp 
 * @returns 
 */
export function getTimeFromTimestamp(timestamp:any) {
  const date = new Date(timestamp);
  return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
}

/**
 * Formats a timestamp into a string with the format "YYYY-MM-DDTHH:mm"
 * @param timestamp 
 * @returns 
 */
export function formatTimestamp(timestamp:any) {
  const date = new Date(timestamp);
  
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Hook for checking mobile screen
 */
export const useIsMobileScreen = () => useMediaQuery({ query: '(max-width: 600px)' });

export const useIsMobileOrTabletScreen = () => useMediaQuery({ query: '(max-width: 900px)' });

// Utility function to truncate strings
export const truncateString = (str: string | undefined, limit: number, fallback: string = "N/A"): string => {
    if (!str) return fallback;
    return str.length > limit ? `${str.substring(0, limit)}...` : str;
};

/**
 * Method transforms the start time and end time to November 20-25, 2024 like format
 * @param startTime : start time
 * @param endTime : end time
 * @returns : November 20-25, 2024 like format
 */
export const formatDateRange = (startTime: string, endTime: string) => {
  const start = moment(startTime);
  const end = moment(endTime);

  if (start.month() === end.month() && start.year() === end.year()) {
    // Same month and year
    return `${start.format('MMMM D')}-${end.format('D, YYYY')}`;
  } else if (start.year() === end.year()) {
    // Same year but different month
    return `${start.format('MMMM D')}-${end.format('MMMM D, YYYY')}`;
  } else {
    // Different year
    return `${start.format('MMMM D, YYYY')} - ${end.format('MMMM D, YYYY')}`;
  }
};
/**
 * Method returns the file type from a file object
 * @param fileObject : uploaded file object data
 * @returns : file type
 */
export function extractFileType(fileObject: any) {
  if (!fileObject || !fileObject.mimeType) {
    return;
  }

  const mimeTypeParts = fileObject.mimeType.split('/');
  return mimeTypeParts.length > 1 ? mimeTypeParts[1] : null;
}
/**
 * Determines the status of an event based on its properties.
 *
 * @param {any} data - The event data object containing details such as `published`, `statusId`, and `eventEndTime`.
 * @returns {string} - A string representing the event status:
 *   - "6" if the event is published.
 *   - "4" if the event status is ACTIVE and the event's end time is in the future.
 *   - "3" for all other cases.
 */
export const findEventStatus = (data: any) => {
  if(data.published){
      return "6";
  }
  else{
      if((data.statusId === StatusEnum.ACTIVE) && (new Date(data.eventEndTime) > new Date())){
          return "4";
      }
      else{
          return "3";
      }
  }
}

/**
 * Function to convert local time to UTC time
 * @returns 
 */
export function convertLocalToUTC(localTime:any, format = 'YYYY-MM-DD') {
  const localMoment = moment(localTime);

  // Convert to UTC and return formatted date
  const utcTime = localMoment.utc();
  return utcTime.format(format);
}

/**
 * Function to convert the time from utc to local 
 * @param utcDateTime 
 * @param format 
 * @param timezone 
 * @param fallbackText 
 * @returns 
 */
export function getLocalTimeDate(
  utcDateTime :any,
  format = "hh:mm A",
  timezone = "auto",
  fallbackText = "Not Available",
)  {
  if (utcDateTime == null) {
  
    return fallbackText;
  }

    // Normalize input to ensure proper parsing
    const normalizedInput =
      typeof utcDateTime === "string" ? utcDateTime.trim() : utcDateTime;

    // Detect or use specified timezone
    const detectedTimezone =
      timezone === "auto" ? moment.tz.guess() : timezone;

    // Parse UTC time with explicit UTC parsing
    const utcMoment = moment.utc(normalizedInput);

    // Validate the moment object
    if (!utcMoment.isValid()) {
      throw new Error("Invalid date parsing");
    }

    // Convert to local time
    const localMoment = utcMoment.tz(detectedTimezone);

        
    return localMoment.format(format);

}
