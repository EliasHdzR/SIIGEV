import { useNavigate } from "react-router-dom";
import {useEffect} from "react";

export default function App(){
    const navigate = useNavigate();

    function redirectToLogin(){
        return navigate("/login");
    }

    useEffect(() => {
        redirectToLogin();
    }, []);

    return (
        <>
        </>
    );
}