

/**
 * Process the API response to extract status and message. 
 * @param 
 * @returns An object containing status and message extracted from the response.
 */
export function processAPIResponse(response: any,api:string ) {
  console.log("processAPIResponse ",response);
  let status = false
  let message: any = "Success"
  let data: any;
  try {
    if (response.status === 401 && !api.includes("login")) {
      status = false
      message = response.data.message   
      sessionStorage.clear();
      window.location.href = '/login'; 
      return { status, message, data }
    }
    else if(response.status === 401 && api.includes("login")){
      status = false
      message = response.data.message;
      return { status, message, data }
    }
    else if (response.status == 400) {
      status = false;
      if (Array.isArray(response.data.message)) {
        message = response.data.message[0].msg;
      } else {
        message = response.data.message;
      }
    }
    else if (response.status == 403) {
      status = false;
      if (Array.isArray(response.data.message)) {
        message = response.data.message[0].msg;
      } else {
        message = response.data.message;
      }
    }
    else if (response.status == 200) {
      status = true;
      message = message;
      if (!Array.isArray(response.data)) {
        data = response?.data?.data;
      }
      else {
        data = response?.data;
      }
    }

  } catch (e) {

  }
  return { status, message, data }
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
export const setFormValues = <T extends object>(data: Partial<T>, setValue: (key: keyof T, value: T[keyof T]) => void) => {
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
  if(!input) return '';
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
export const getValueFromArrayBasedOnParameter = (data: any, cmp1: any, cmp2: any, name: any) => {
  if(!(data || cmp1 || cmp2 || name)) return '';
  return data?.find((item: any) => item[cmp1] == cmp2)?.[name]
}