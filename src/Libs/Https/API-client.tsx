import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '../../../config.json';

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    // Set your base API URL
    const baseURL = config.api.url;

    // Create an Axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      // You can add additional default headers or configurations here
      headers: ApiClient.getHeaders()
    });

    

    this.axiosInstance.interceptors.response.use(
      (response) => { 
        return response;
      },
      (error) => {
        if (error.response.status && (error.response.status === 401 || error.response.status === 403)) {
          window.location.href = "/"
        }
        return Promise.resolve(error);
      }
    );
  }

  static getInstance(): ApiClient {
    console.log("Token ",sessionStorage.getItem("token"));
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public setToken(token: string) {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem("token", token);
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return this;
  }
  public static getToken() {
    //encypt token value from session storage
    const encryptedToken =typeof window !== 'undefined' && sessionStorage.getItem('token');
    if (encryptedToken && typeof window !== 'undefined') {
        const decryptedToken = encryptedToken;
        return decryptedToken;
    }
    return null; // Or handle the case where token decryption fails
}

  static getHeaders() {
    const token = ApiClient.getToken();
    const retVal: any = {};
    if (token) {
      retVal['Authorization'] = `Bearer ${token}`
    }
    return retVal
  }
  

  // Method for making GET requests
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(url, config);
  }

  // Method for making POST requests
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(url, data, config);
    // return this.axiosInstance.post(url, data, { ...config, headers });
  }

  // Method for making PUT requests
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put(url, data, config);
  }

  // Method for making DELETE requests
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete(url, config);
  }
}

// Create a singleton instance of the ApiClient class
const apiClient = ApiClient.getInstance();

export default apiClient;
