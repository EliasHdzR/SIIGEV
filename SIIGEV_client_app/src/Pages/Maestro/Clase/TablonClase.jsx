import { useParams } from "react-router-dom";
import NavBarClaseMaestro from "../../../Components/NavBarClaseMaestro.jsx";
import {useEffect, useState} from "react";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import AvisosClase from "../../../Components/AvisosClase.jsx";

export default function TablonClase(){
    const { id } = useParams();
    const fetchWithAuth = useFetchWithAuth();
    const [ clase, setClase ] = useState({});
    const [ maestro, setMaestro ] = useState({});
    const [ avisos, setAvisos ] = useState([]);

    const getUserInfo = async () => {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/account/info", { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };
    }

    const getClaseInfo = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/maestro/clases/${id}`, { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };
    };

    const getAvisos = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/maestro/clases/${id}/avisos`, { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };
    };

    useEffect(() => {
        getClaseInfo().then(({ status, data }) => {
            if (status !== 200) {
                setClase("");
                setMaestro("");
                console.error("Error al recuperar información de la clase", data);
                return;
            }

            setClase(data);
        });

        getAvisos().then(({ status, data }) => {
            if (status !== 200) {
                setAvisos([]);
                console.error("Error al recuperar avisos", data);
                return;
            }
            setAvisos(data);
        });

        getUserInfo().then(({status, data}) => {
            if (status !== 200) {
                console.error("Error fetching user info:", data);
                return;
            }

            setMaestro(data);
        })
    }, [id]);

    return(
        <NavBarClaseMaestro activeTab={"tablon"}>
            <div className="w-75 d-flex flex-column">
                <div className="pt-5 px-3 pb-3 rounded" style={{ backgroundColor: "#640d64" }}>
                    <h1 className="mt-5 text-light">{ clase.nombre }</h1>
                    <h6 className="text-light">{ maestro.nombre }</h6>
                </div>
                <AvisosClase avisos={avisos} profesorNombre={ maestro.nombre } />
            </div>
        </NavBarClaseMaestro>
    );
}