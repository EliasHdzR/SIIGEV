import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBarClaseAlumno from "../../../Components/NavBarClaseALumno.jsx";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import Publicacion from "../../../Components/Publicacion.jsx"; 

export default function TablonClase() {
    const { id } = useParams();
    const fetchWithAuth = useFetchWithAuth();
    const [claseNombre, setClaseNombre] = useState("");
    const [profesorNombre, setProfesorNombre] = useState("");
    const [publicaciones, setPublicaciones] = useState([]);

    const getClaseInfo = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/alumno/clases/${id}`, { method: "GET" });
        const data = await res.json();
        if (res.status === 200) {
            setClaseNombre(data.nombre);
            setProfesorNombre(data.maestro.nombre);
        } else {
            console.error("Error al recuperar información de la clase", data);
        }
    };

    const getTablon = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/alumno/clases/${id}/tablon`, { method: "GET" });
        const data = await res.json();
        if (res.status === 200) {
            setPublicaciones(data);
        } else {
            console.error("Error al recuperar el tablón", data);
        }
    };

    useEffect(() => {
        getClaseInfo();
        getTablon();
    }, [id]);

    return (
        <NavBarClaseAlumno activeTab={"tablon"}>
            <div className="w-75 d-flex flex-column">
                <div className="pt-5 px-3 pb-3 rounded" style={{ backgroundColor: "#640d64" }}>
                    <h1 className="mt-5 text-light">{claseNombre}</h1>
                    <h6 className="text-light">{profesorNombre}</h6>
                </div>

                <div className="mt-4">
                    {publicaciones.length > 0 ? (
                        <ul className="list-group">
                            {publicaciones.map((publicacion, index) => (
                                <Publicacion
                                    key={index}
                                    publicacion={publicacion}
                                    clase_id={id}
                                    maestroNombre={profesorNombre}
                                    basePath="/a"
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">No hay publicaciones para esta clase.</p>
                    )}
                </div>
            </div>
        </NavBarClaseAlumno>
    );
}