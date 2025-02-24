import { useEffect, useState } from "react";
import { POST } from "@/Libs/store";

/**
 * TokenRefresher Component
 * It retrieves the refresh token from sessionStorage and sends a request to update the access token.
 */
const TokenRefresher = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * checks if a token exists in sessionStorage.
   * If a token is found, it triggers the refreshToken function.
   */
  useEffect(() => {
    const refreshTokenAsync = async () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        await refreshToken();
      }
    };

    refreshTokenAsync();

    // Set an interval to refresh the token every 15 minutes
    const intervalId = setInterval(refreshTokenAsync, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  /**
   * Refreshes the authentication token by sending a request with the stored refresh token.
   * If successful, updates the new access token in sessionStorage.
   */
  const refreshToken = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    const token = sessionStorage.getItem("refreshToken");
    if (!token) {
      setIsRefreshing(false);
      return;
    }
    POST({
      id: 'refreshToken',
      url: 'auth/refreshToken',
      body: {
        refreshToken: token
      },
      successCB: (context: any) => {
        sessionStorage.setItem("token", context?.data?.accessToken);
        setIsRefreshing(false);
      },
      errorCB: () => {
        setIsRefreshing(false);
      },
    })
  }
  return null;
};

export default TokenRefresher;
