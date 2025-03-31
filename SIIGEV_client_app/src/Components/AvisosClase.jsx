export default function AvisosClase({ avisos, profesorNombre }) {

    function descargarArchivo(archivoId){
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
            .then( res => res.blob() )
            .then( blob => {
                const file = window.URL.createObjectURL(blob);
                window.open(file, '_blank');
            });
    }

    return (
        <div className="mt-4">
            {avisos.length > 0 ? (
                <ul className="list-group">
                    {avisos.map((aviso, index) => (
                        <li key={index} className="list-group-item mb-2 border rounded z-1">
                            <small className="text-muted d-block">
                                Publicado por: {profesorNombre}
                            </small>
                            <small className="text-muted d-block">
                                Fecha: {new Date(aviso.created_at.replace(" ", "T")).toLocaleString()}
                            </small>
                            <p className="mt-2" dangerouslySetInnerHTML={{ __html: aviso.mensaje }}></p>

                            {aviso.archivos && (
                                <div className="d-flex flex-row">
                                    {aviso.archivos.map((archivo) => (
                                        <button key={archivo.id} onClick={() => descargarArchivo(archivo.id)}
                                                className="btn btn-link bg-light rounded p-2 me-2">
                                            {archivo.nombre_original}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">No hay avisos para esta clase.</p>
            )}
        </div>
    );
}