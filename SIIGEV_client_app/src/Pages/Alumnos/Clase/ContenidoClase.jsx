import NavBarClaseAlumno from "../../../Components/NavBarClaseALumno.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import Publicacion from "../../../Components/Publicacion.jsx";

export default function ContenidoClaseAlumno() {
    const fetchWithAuth = useFetchWithAuth();
    const { id } = useParams();
    const [temas, setTemas] = useState([]);
    const [profesorNombre, setProfesorNombre] = useState("");

    const getClaseInfo = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/alumno/clases/${id}`, { method: "GET" });
        const data = await res.json();
        if (res.status === 200) {
            setProfesorNombre(data.maestro.nombre);
        } else {
            console.error("Error al recuperar información de la clase", data);
        }
    };

    const getTemas = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/alumno/clases/${id}/contenido`, { method: "GET" });
        const resData = await res.json();
        return { status: res.status, resData };
    };

    useEffect(() => {
        getClaseInfo(); // Recuperar el nombre del profesor
        getTemas().then(({ status, resData }) => {
            if (status !== 200) {
                console.error(status, resData);
                return;
            }
            setTemas(resData.temas);
        });
    }, [id]);

    return (
        <NavBarClaseAlumno claseId={id} activeTab={"contenido"}>
            <div className="w-75 mx-auto mt-4">
                {temas.length === 0 ? (
                    <div className="alert alert-info text-center">
                        No hay temas en esta clase.
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {temas.map((tema) => (
                            <div key={tema.id} className="border rounded p-3 shadow-sm">
                                <h2>{tema.nombre}</h2>
                                <p>{tema.descripcion}</p>
                                <hr />
                                {tema.publicaciones.length === 0 ? (
                                    <div className="alert alert-info text-center">
                                        No hay publicaciones en este tema.
                                    </div>
                                ) : (
                                    <ul className="list-group">
                                        {tema.publicaciones.map((publicacion, index) => (
                                            <Publicacion
                                                publicacion={publicacion}
                                                key={index}
                                                clase_id={id}
                                                maestroNombre={profesorNombre} // Pasar el nombre del profesor
                                                basePath="/a" // Prefijo para alumnos
                                            />
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </NavBarClaseAlumno>
    );
}