import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useRefreshToken = () => {
    const navigate = useNavigate();
    const [access_token, setAccessToken] = useState(localStorage.getItem("accessToken"));

    const refreshTokenFn = async () => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/account/refresh-token/", {
                method: "POST",
                body: JSON.stringify({ refresh_token: refreshToken }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const resData = await response.json();

            if (response.status === 200) {
                localStorage.setItem("accessToken", resData.access_token);
                setAccessToken(resData.access_token);
                return resData.access_token;
            } else {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userRol");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error en useRefreshToken:", error);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userRol");
            navigate("/login");
        }
    };

    return { access_token, refreshTokenFn };
};

export default useRefreshToken;
