import {useNavigate, useParams} from "react-router-dom";
import NavBarClaseMaestro from "../../../Components/NavBarClaseMaestro.jsx";
import {useEffect, useState} from "react";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";

export default function TablonClase(){
    const navigate = useNavigate();
    const fetchWithAuth = useFetchWithAuth();
    const { id } = useParams();
    const [ clase, setClase ] = useState({});

    const getClase = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/maestro/clases/${id}`, {method: "GET"});
        const data = await res.json();
        return {status: res.status, data}
    }

    useEffect(() => {
        getClase().then(({status, data}) => {
            if (status !== 200) {
                navigate('/404');
                return;
            }

            setClase(data);
        });

    }, [id]);

    return(
        <NavBarClaseMaestro activeTab={"tablon"}>
            <div className="w-75 bg-light p-3">
                <div>
                    <h1>{ clase.nombre }</h1>
                </div>
            </div>
        </NavBarClaseMaestro>
    );
}