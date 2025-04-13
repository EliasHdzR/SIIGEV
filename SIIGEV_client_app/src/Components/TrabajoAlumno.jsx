import { useState, useEffect } from "react";

export default function TrabajoAlumno({ tareaId, claseId, estatusInicial, fechaEntrega, onTareaCompletada }) {
    const [archivos, setArchivos] = useState([]);
    const [estatus, setEstatus] = useState(estatusInicial || "No entregada");
    const [entregada, setEntregada] = useState(0); // Estado de la entrega (0 = no entregada, 1 = entregada)
    const [calificacion, setCalificacion] = useState(null); // Calificación de la tarea

    // Verificar si la fecha actual supera la fecha de entrega
    const isFechaEntregaPasada = fechaEntrega
        ? new Date() > new Date(fechaEntrega.replace(" ", "T"))
        : false;
    
    // Recuperar el estado de la entrega y la calificación
    useEffect(() => {
        const fetchEstadoYCalificacion = async () => {
            try {
                let estadoData = null; // Declarar estadoData fuera del bloque if

                // Recuperar el estado de la entrega
                const estadoRes = await fetch(`http://127.0.0.1:8000/api/alumno/clases/${claseId}/tareas/${tareaId}/estado`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                if (estadoRes.status === 200) {
                    estadoData = await estadoRes.json();
                    setEntregada(estadoData.entrega?.entregada || 0); // Actualizar el estado de la entrega
                } else {
                    console.error("Error al recuperar el estado de la entrega");
                }

                // Recuperar la calificación
                const calificacionRes = await fetch(`http://127.0.0.1:8000/api/alumno/clases/${claseId}/tareas/${tareaId}/calificacion`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                if (calificacionRes.status === 200) {
                    const calificacionData = await calificacionRes.json();
                    setCalificacion(calificacionData.calificacion); // Actualizar la calificación

                    // Actualizar el estatus basado en la calificación y el estado de entrega
                    if (estadoData?.entrega?.entregada === 1) {
                        setEstatus(
                            calificacionData.calificacion === null
                                ? "Entregada"
                                : `${calificacionData.calificacion}/100`
                        );
                    } else {
                        setEstatus("No entregada");
                    }
                } else {
                    console.error("Error al recuperar la calificación");
                }
            } catch (error) {
                console.error("Error al recuperar el estado o la calificación:", error);
            }
        };

        fetchEstadoYCalificacion();
    }, [claseId, tareaId]);

    // Recuperar archivos de la entrega
    useEffect(() => {
        const fetchArchivosEntrega = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/alumno/clases/${claseId}/tareas/${tareaId}/entregas`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

                if (res.status === 200) {
                    const data = await res.json();
                    setArchivos(data.archivos || []);
                } else {
                    console.error("Error al recuperar los archivos de la entrega");
                }
            } catch (error) {
                console.error("Error al recuperar los archivos de la entrega:", error);
            }
        };

        fetchArchivosEntrega();
    }, [claseId, tareaId]);

    // Subir archivos al servidor
    const handleArchivoSeleccionado = async (e) => {
        const nuevosArchivos = Array.from(e.target.files);
    
        // Filtrar archivos que ya existen en el estado
        const archivosFiltrados = nuevosArchivos.filter(
            (nuevoArchivo) =>
                !archivos.some((archivoExistente) => archivoExistente.nombre_original === nuevoArchivo.name)
        );
    
        if (archivosFiltrados.length === 0) {
            console.log("Todos los archivos seleccionados ya existen.");
            return;
        }
    
        setArchivos((prevArchivos) => [...prevArchivos, ...archivosFiltrados]);
    
        try {
            const formData = new FormData();
            archivosFiltrados.forEach((archivo) => {
                formData.append("archivos[]", archivo);
            });
    
            const res = await fetch(`http://127.0.0.1:8000/api/alumno/clases/${claseId}/tareas/${tareaId}/subir-archivos`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: formData,
            });
    
            if (res.ok) { // Manejar cualquier código de estado exitoso (200-299)
                console.log("Archivos subidos exitosamente");
            } else {
                console.error(`Error al subir los archivos: ${res.status} ${res.statusText}`);
            }
        } catch (error) {
            console.error("Error al subir los archivos:", error);
        }
    };

    // Eliminar archivo
    const handleEliminarArchivo = async (archivoId) => {
        try {
            const res = await fetch(
                `http://127.0.0.1:8000/api/alumno/clases/${claseId}/tareas/${tareaId}/entregas/${archivoId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            if (res.status === 200) {
                setArchivos((prevArchivos) => prevArchivos.filter((archivo) => archivo.id !== archivoId));
                console.log("Archivo eliminado exitosamente");
            } else {
                console.error("Error al eliminar el archivo");
            }
        } catch (error) {
            console.error("Error al eliminar el archivo:", error);
        }
    };

    // Manejar el estado de la entrega (entregar o cancelar entrega)
    const handleToggleEntrega = async () => {
        const url = entregada
            ? `http://127.0.0.1:8000/api/alumno/clases/${claseId}/tareas/${tareaId}/cancelar`
            : `http://127.0.0.1:8000/api/alumno/clases/${claseId}/tareas/${tareaId}/completar`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (res.status === 200) {
                const message = entregada ? "Entrega cancelada" : "Tarea marcada como completada";
                console.log(message);
                setEntregada((prev) => (prev === 1 ? 0 : 1)); // Alternar el estado de la entrega
                setEstatus(entregada ? "No entregada" : "Entregada");
                onTareaCompletada && onTareaCompletada();
            } else {
                console.error("Error al cambiar el estado de la entrega");
            }
        } catch (error) {
            console.error("Error al cambiar el estado de la entrega:", error);
        }
    };

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="me-3">Tu trabajo</h5>
                <span className={`badge ${estatus === "Entregada" || estatus.includes("/100") ? "bg-success" : "bg-secondary"}`}>
                    {estatus}
                </span>
            </div>

            {archivos.length > 0 && (
                <ul className="list-group mb-3">
                    {archivos.map((archivo) => (
                        <li key={archivo.id || archivo.name} className="list-group-item d-flex justify-content-between align-items-center">
                            {archivo.nombre_original || archivo.name}
                            {archivo.id && entregada === 0 && ( // Mostrar botón de eliminar solo si no está entregada
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleEliminarArchivo(archivo.id)}
                                >
                                    Eliminar
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <div className="mb-3 d-flex justify-content-center">
                <label
                    htmlFor="archivoInput"
                    className={`btn px-4 ${entregada === 1 ? "btn-secondary" : "btn-primary"}`}
                    style={{ whiteSpace: "nowrap", cursor: entregada === 1 ? "not-allowed" : "pointer" }}
                >
                    Añadir archivos
                </label>
                <input
                    id="archivoInput"
                    type="file"
                    multiple
                    className="d-none"
                    onChange={handleArchivoSeleccionado}
                    disabled={entregada === 1 || isFechaEntregaPasada} // Deshabilitar si la tarea está entregada
                />
            </div>

            <div className="d-flex justify-content-center">
                <button
                    className={`btn ${entregada ? "btn-danger" : "btn-success"} px-4`}
                    style={{ whiteSpace: "nowrap" }}
                    onClick={handleToggleEntrega}
                    disabled={archivos.length === 0 && !entregada || isFechaEntregaPasada}
                >
                    {entregada ? "Anular entrega" : "Entregar"}
                </button>
            </div>
        </div>
    );
}