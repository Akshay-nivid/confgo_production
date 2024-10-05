

/**
 * Process the API response to extract status and message. 
 * @param 
 * @returns An object containing status and message extracted from the response.
 */
export function processAPIResponse(response: any,api:string ) {
  let status = false
  let message: any = "Success"
  let data: any;
  try {
    if (response.data.code === 401 && !api.includes("login")) {
      status = false
      message = response.data.message   
      sessionStorage.clear();
      window.location.href = '/login'; 
      return { status, message, data }
    }
    else if(response.data.code === 401 && api.includes("login")){
      status = false
      message = response.data.message;
      return { status, message, data }
    }
    else if (response.data.code == 400) {
      status = false;
      if (Array.isArray(response.data.message)) {
        message = response.data.message[0].msg;
      } else {
        message = response.data.message;
      }
    }
    else if (response.data.code == 403) {
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