import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBarClaseAlumno from "../../../Components/NavBarClaseALumno.jsx";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";


export default function TablonClase() {
    const { id } = useParams();
    const fetchWithAuth = useFetchWithAuth();
    const [claseNombre, setClaseNombre] = useState("");
    const [profesorNombre, setProfesorNombre] = useState(""); // Nuevo estado para el nombre del profesor
    const [avisos, setAvisos] = useState([]); // Estado para almacenar los avisos

    const getClaseInfo = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/alumno/clases/${id}`, { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };
    };

    const getAvisos = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/alumno/clases/${id}/avisos`, { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };
    };

    useEffect(() => {
        getClaseInfo().then(({ status, data }) => {
            if (status !== 200) {
                setClaseNombre("");
                setProfesorNombre("");
                console.error("Error al recuperar información de la clase", data);
                return;
            }
            setClaseNombre(data.nombre);
            setProfesorNombre(data.maestro.nombre);
        });

        getAvisos().then(({ status, data }) => {
            if (status !== 200) {
                setAvisos([]);
                console.error("Error al recuperar avisos", data);
                return;
            }
            setAvisos(data);
        })
    }, [id]);

    return (
        <NavBarClaseAlumno activeTab={"tablon"}>
            <div className="w-75 d-flex flex-column">
                <div className="pt-5 px-3 pb-3 rounded" style={{ backgroundColor: "#640d64" }}>
                    <h1 className="mt-5 text-light">{ claseNombre }</h1>
                    <h6 className="text-light">{ profesorNombre }</h6>
                </div>

            </div>
        </NavBarClaseAlumno>
    );
}