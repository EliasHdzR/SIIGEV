import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ClassCard({ claseId, claseNombre, claseMaestro, claseCuatri, claseDescripcion, basePath = "/m", tipo = "alumno" }) {
    const navigate = useNavigate();
    const [tareasPendientes, setTareasPendientes] = useState([]);

    // Recuperar las tareas pendientes de la clase
    const getTareasPendientes = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/alumno/clases/${claseId}/tareas-pendientes`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setTareasPendientes(data);
            } else {
                console.error("Error al recuperar tareas pendientes");
            }
        } catch (error) {
            console.error("Error al recuperar tareas pendientes:", error);
        }
    };

    useEffect(() => {
        getTareasPendientes();
    }, [claseId]);

    return (
        <div
            onClick={() => navigate(`${basePath}/clase/${claseId}`)}
            className="border rounded bg-white d-flex-col align-items-start shadow-sm"
            style={{ width: "300px", height: "300px" }}
        >
            <div className="p-3 rounded-top border-bottom" style={{ backgroundColor: "#640d64" }}>
                <Link
                    to={`${basePath}/clase/${claseId}`}
                    className="link-light link-underline-opacity-0 link-underline-opacity-100-hover h5 d-flex align-items-center text-truncate"
                >
                    {claseNombre}
                </Link>
                <p className="text-truncate text-light">
                    Cuatrimestre {claseCuatri} - {claseDescripcion}
                </p>
                <p className="mb-0 text-light">{claseMaestro}</p>
            </div>

            <div className="px-3 pt-2">
                { tipo === "alumno" ? (
                    <>
                        <h6>Tareas pendientes:</h6>
                        <ul className="list-unstyled text-truncate">
                            {tareasPendientes.length > 0 ? (
                                tareasPendientes.map((tarea, index) => (
                                    <li key={index} className="">
                                        {tarea.nombre} (Vence: {new Date(tarea.fecha_entrega).toLocaleDateString()})
                                    </li>
                                ))
                            ) : (
                                <li className="text-muted">No tienes tareas pendientes.</li>
                            )}
                        </ul>
                    </>
                )  : (
                    <></>
                )}

            </div>
        </div>
    );
}

export default ClassCard;