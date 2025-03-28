import { useNavigate } from "react-router-dom";

export default function App(){
    const navigate = useNavigate();

    function redirectToLogin(){
        return navigate("/login");
    }

    return (
        <>
            { redirectToLogin() }
        </>
    );
}