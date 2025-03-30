import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBarClaseAlumno from "../../../Components/NavBarClaseALumno.jsx";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import AvisosClase from "../../../Components/AvisosClase.jsx"; // Importamos el componente

export default function TablonClase() {
    const { id } = useParams();
    const fetchWithAuth = useFetchWithAuth();
    const [claseNombre, setClaseNombre] = useState("");
    const [profesorNombre, setProfesorNombre] = useState(""); // Nuevo estado para el nombre del profesor
    const [avisos, setAvisos] = useState([]); // Estado para almacenar los avisos

    const getClaseInfo = async () => {
        try {
            const data = await fetchWithAuth(`http://127.0.0.1:8000/api/alumno/clases/${id}`, { method: "GET" });
            if (data) {
                setClaseNombre(data.nombre); // Asume que el backend devuelve un campo "nombre"
                setProfesorNombre(data.maestro); // Asume que el backend devuelve un campo "maestro" con el nombre del profesor
            }
        } catch (error) {
            console.error("Error al obtener la información de la clase:", error);
        }
    };

    const getAvisos = async () => {
        try {
            const data = await fetchWithAuth(`http://127.0.0.1:8000/api/alumno/clases/${id}/avisos`, { method: "GET" });
            if (data) {
                setAvisos(data); // Asume que el backend devuelve un array de avisos
            }
        } catch (error) {
            console.error("Error al obtener los avisos de la clase:", error);
        }
    };

    useEffect(() => {
        getClaseInfo();
        getAvisos();
    }, [id]);

    return (
        <NavBarClaseAlumno claseId={id} activeTab={"tablon"}>
            <div className="w-75 bg-light p-3">
                <div>
                    <h1>{claseNombre || "Cargando clase..."}</h1> 
                </div>

                <div>
                    <AvisosClase avisos={avisos} profesorNombre={profesorNombre} />
                </div>
            </div>
        </NavBarClaseAlumno>
    );
}