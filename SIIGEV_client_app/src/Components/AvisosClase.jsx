export default function AvisosClase({ avisos, profesorNombre }) {
    return (
        <div className="mt-4">
            {avisos.length > 0 ? (
                <ul className="list-group">
                    {avisos.map((aviso, index) => (
                        <li key={index} className="list-group-item mb-2 border rounded">
                            <small className="text-muted d-block">
                                Publicado por: {profesorNombre}
                            </small>
                            <small className="text-muted d-block">
                                Fecha: {new Date(aviso.created_at.replace(" ", "T")).toLocaleString()}
                            </small>
                            <p className="mt-2">{aviso.mensaje}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">No hay avisos para esta clase.</p>
            )}
        </div>
    );
}