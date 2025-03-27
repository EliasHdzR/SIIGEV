import { useNavigate } from "react-router-dom";
import useRefreshToken from "./useRefreshToken";

const useFetchWithAuth = () => {
    const navigate = useNavigate();
    let { access_token, refreshTokenFn } = useRefreshToken();

    const fetchWithAuth = async (url, options = {}) => {
        if (!access_token) {
            navigate("/login");
            return null;
        }

        try {
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
                ...options.headers,
            };

            const response = await fetch(url, { ...options, headers });

            if (response.status === 400 || response.status === 403) {
                navigate("/login");
                return null;
            }

            if (response.status === 401) {
                const newToken = await refreshTokenFn();
                if (!newToken) {
                    navigate("/login");
                    return null;
                }

                access_token = newToken;
                return fetchWithAuth(url, options);
            }

            return await response.json();
        } catch (error) {
            console.error("Error en fetchWithAuth:", error);
            navigate("/login");
            return null;
        }
    };

    return fetchWithAuth;
};

export default useFetchWithAuth;
