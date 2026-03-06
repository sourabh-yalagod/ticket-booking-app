import { Outlet, Navigate } from "react-router-dom";
import useAuthHook from "../hooks/useAuthHook";

const AdminCheck = () => {
    const { role } = useAuthHook();

    if (role !== "ROLE_ADMIN") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AdminCheck;