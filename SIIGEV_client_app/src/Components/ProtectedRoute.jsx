import {Navigate} from "react-router-dom";

const ProtectedRoute = ({ allowedRole, element }) => {
    const role = localStorage.getItem("userRol");

    if (!role) return <Navigate to="/login" />;
    if (!allowedRole.includes(role)) return <Navigate to="/404" />;

    return element;
};

export default ProtectedRoute;