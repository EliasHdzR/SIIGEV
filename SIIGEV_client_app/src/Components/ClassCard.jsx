import { Link, useNavigate } from "react-router-dom";

function ClassCard({ claseId, claseNombre, claseMaestro, claseCuatri, claseDescripcion, tareas, basePath = "/m" }) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`${basePath}/clase/${claseId}`)}
             className="border rounded bg-white d-flex-col align-items-start shadow-sm" style={{ width: "300px", height: "300px" }}>
            <div className="p-3 rounded-top border-bottom" style={{ backgroundColor: "#ab379c" }}>
                <Link to={`${basePath}/clase/${claseId}`}
                      className="link-dark link-underline-opacity-0 link-underline-opacity-100-hover h5 d-flex align-items-center text-truncate">
                    {claseNombre}
                </Link>
                <p className="text-truncate">
                    Cuatrimestre {claseCuatri} - {claseDescripcion}
                </p>
                <p className="mb-0">{claseMaestro}</p>
            </div>

            <div className="px-3 pt-2">
                <ul className="list-unstyled text-truncate">
                    {tareas.map((tarea, index) => (
                        <li key={index} className="">{tarea}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ClassCard;