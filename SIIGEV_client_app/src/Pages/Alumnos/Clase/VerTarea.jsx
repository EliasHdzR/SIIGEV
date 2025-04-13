import { useParams } from "react-router-dom";
import NavBarClaseAlumno from "../../../Components/NavBarClaseALumno.jsx";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import TrabajoAlumno from "../../../Components/TrabajoAlumno.jsx";
import { useEffect, useState } from "react";

export default function VerTareaAlumno() {
    const fetchWithAuth = useFetchWithAuth();
    const { id, t_id } = useParams();
    const [tarea, setTarea] = useState({});
    const [createdAt, setCreatedAt] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");

    const getTarea = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/alumno/clases/${id}/tareas/${t_id}`, { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };
    };

    useEffect(() => {
        getTarea().then(({ status, data }) => {
            if (status !== 200) {
                console.error(status, data);
                return;
            }
            setCreatedAt(data.tarea.created_at);
            setFechaEntrega(data.tarea.fecha_entrega);
            setTarea(data.tarea);
        });
    }, [id, t_id]);

    function descargarArchivo(archivoId) {
        downloadFile(archivoId);
    }

    const downloadFile = async (id) => {
        const url = `http://127.0.0.1:8000/api/download/${id}`;
        const authHeader = `Bearer ${localStorage.getItem("accessToken")}`;

        const options = {
            headers: {
                Authorization: authHeader
            }
        };

        fetch(url, options)
            .then(res => res.blob())
            .then(blob => {
                const file = window.URL.createObjectURL(blob);
                window.open(file, '_blank');
            });
    };

    return (
        <NavBarClaseAlumno claseId={id} activeTab={"contenido"}>
            <div className="d-flex justify-content-center mt-3">
                <div className="d-flex flex-row justify-content-between w-75">
                    {/* Detalles de la tarea */}
                    <div className="w-60 d-flex flex-column">
                        <div className="d-flex flex-row align-items-center">
                            <div className="ms-1 me-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#640d64", borderRadius: "50%", width: "45px", height: "45px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" className="bi bi-file-earmark-text-fill" viewBox="0 0 16 16">
                                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z" />
                                </svg>
                            </div>
                            <h1>{tarea.titulo}</h1>
                        </div>
                        <small className="text-muted d-block ms-5 ps-4">
                            {new Date(createdAt.replace(" ", "T")).toLocaleString()}
                        </small>
                        <small className="text-muted d-block ms-5 ps-4 fw-bold">
                            Fecha de entrega: {new Date(fechaEntrega.replace(" ", "T")).toLocaleString()}
                        </small>
    
                        <hr />
    
                        <p className="my-2" dangerouslySetInnerHTML={{ __html: tarea.instrucciones }}></p>
                        {Array.isArray(tarea.archivos) && tarea.archivos.length > 0 ? (
                            <div className="d-flex flex-row">
                                {tarea.archivos.map((archivo) => (
                                    <button key={archivo.id} onClick={() => descargarArchivo(archivo.id)}
                                        className="btn btn-link bg-light rounded p-2 me-2">
                                        {archivo.nombre_original}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">No hay archivos adjuntos para esta tarea.</p>
                        )}
                    </div>
    
                    {/* Trabajo del alumno */}
                    <div className="w-40 ms-4">
                        <div className="border rounded p-3 shadow-sm bg-light">
                            <TrabajoAlumno
                                tareaId={t_id}
                                claseId={id}
                                estatusInicial={tarea.estatus}
                                fechaEntrega={tarea.fecha_entrega} 
                                onTareaCompletada={() => console.log("Tarea marcada como completa")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </NavBarClaseAlumno>
    );
}