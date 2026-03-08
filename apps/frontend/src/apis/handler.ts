import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { baseURL } from './apis';

/**
 * ==========================
 * 📌 @API Auth API
 * ==========================
 *
 * @desc Auth API Request
 */
const authApi = () => {
  return axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 15000,
  });
};

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.accessToken) {
          headers['Authorization'] = `Bearer ${state.accessToken}`;
        } else {
          console.warn('[WARNING] No access token found in auth storage');
        }
      } catch (e) {
        console.error('[ERROR] Error parsing auth storage:', e);
      }
    } else {
      console.warn('[WARNING] No auth storage found');
    }
  }

  return headers;
};

/**
 * ==========================
 * 📌 @API Auth API
 * ==========================
 */
export const handleAPI = async <T = any>(
  url: string,
  method: 'POST' | 'PATCH' | 'PUT' | 'GET' | 'DELETE' = 'GET',
  data?: any,
  customHeaders?: Record<string, string>
): Promise<T> => {


  try {
    const apiInstance = authApi();
    const authHeaders = getAuthHeaders();

    const config: AxiosRequestConfig = {
      url,
      method,
      headers: { ...authHeaders, ...customHeaders },
    };

    if (method !== 'GET' && data) {
      config.data = data;
    } else if (method === 'GET' && data) {
      config.params = data;
    }

    const response: AxiosResponse = await apiInstance(config);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      console.error('[ERROR] API ERROR:', {
        url: `${baseURL}${url}`,
        method,
        status: axiosError.response.status,
        statusText: axiosError.response.statusText,
        data: axiosError.response.data,
        timestamp: new Date().toISOString(),
      });
    } else if (axiosError.request) {
      console.error('[ERROR] API ERROR (NO RESPONSE):', {
        url: `${baseURL}${url}`,
        method,
        message: axiosError.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error('[ERROR] API ERROR (SETUP):', {
        url: `${baseURL}${url}`,
        method,
        message: axiosError.message,
        timestamp: new Date().toISOString(),
      });
    }

    throw error;
  }
};
