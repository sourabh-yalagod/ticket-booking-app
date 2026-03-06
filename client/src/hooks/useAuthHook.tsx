import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";

const useAuthHook = () => {

    const authData = useMemo(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return {
                userId: null,
                username: null,
                role: null,
                isAuthenticated: false
            };
        }

        try {
            const decoded: any = jwtDecode(token);
            console.log(decoded)
            return {
                userId: decoded.userId,
                username: decoded.sub,
                role: decoded.role,
                isAuthenticated: true
            };

        } catch (error) {
            console.error("Invalid token", error);
            localStorage.removeItem("token");

            return {
                userId: null,
                username: null,
                role: null,
                isAuthenticated: false
            };
        }

    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return { ...authData, logout };
};

export default useAuthHook;