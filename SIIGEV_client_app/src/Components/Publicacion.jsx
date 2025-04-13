import { Link } from "react-router-dom";

export default function Publicacion({ publicacion, maestroNombre, clase_id, basePath = "/m" }) {
    let linkTo = "";
    if (publicacion.tipo === "materiales" || publicacion.tipo === "tareas") {
        linkTo = publicacion.tipo === "materiales"
            ? `${basePath}/clase/${clase_id}/material/${publicacion.id}`
            : `${basePath}/clase/${clase_id}/tarea/${publicacion.id}`;
    }

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
        <Link to={linkTo} key={publicacion.id} className="list-group-item mb-2 border rounded z-1">
            <div className="d-flex flex-row align-items-center">
                <div className="ms-1 me-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#640d64", borderRadius: "50%", width: "35px", height: "35px" }}>
                    {publicacion.tipo === "avisos" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-megaphone-fill" viewBox="0 0 16 16">
                            <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25 25 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009l.496.008a64 64 0 0 1 1.51.048m1.39 1.081q.428.032.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a66 66 0 0 1 1.692.064q.491.026.966.06" />
                        </svg>
                    )}
                    {publicacion.tipo === "tareas" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-file-earmark-text-fill" viewBox="0 0 16 16">
                            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z" />
                        </svg>
                    )}
                    {publicacion.tipo === "materiales" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-journal-bookmark-fill" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6 1h6v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z" />
                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
                        </svg>
                    )}
                </div>
                <div>
                    <small className="text-muted d-block">
                        Publicado por: {maestroNombre}
                    </small>
                    <small className="text-muted d-block">
                        Fecha: {new Date(publicacion.created_at.replace(" ", "T")).toLocaleString()}
                    </small>
                </div>
            </div>
            {publicacion.tipo === "avisos" && (
                <>
                    <p className="my-2" dangerouslySetInnerHTML={{ __html: publicacion.mensaje }}></p>
                    {publicacion.archivos && (
                        <div className="d-flex flex-row">
                            {publicacion.archivos.map((archivo) => (
                                <button key={archivo.id} onClick={() => descargarArchivo(archivo.id)}
                                    className="btn btn-link bg-light rounded p-2 me-2">
                                    {archivo.nombre_original}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
            {publicacion.tipo === "tareas" && (
                <>
                    <p className="my-2 fw-medium">El profesor ha publicado una nueva tarea: {publicacion.titulo}</p>
                    {publicacion.fecha_entrega && (
                        <p className="text-muted">
                            Fecha de entrega: {new Date(publicacion.fecha_entrega.replace(" ", "T")).toLocaleDateString()}
                        </p>
                    )}
                </>
            )}
            {publicacion.tipo === "materiales" && (
                <p className="my-2 fw-medium">El profesor ha publicado nuevo material: {publicacion.titulo}</p>
            )}
        </Link>
    );
}