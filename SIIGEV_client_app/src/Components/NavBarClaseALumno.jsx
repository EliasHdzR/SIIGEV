import NavLayoutAlumno from "./NavLayoutAlumno.jsx";
import { Link } from "react-router-dom";

export default function NavBarClaseAlumno({ children, claseId, activeTab }) {
    return (
        <NavLayoutAlumno>
            <div className="d-flex flex-column">
                <div className="container-fluid d-flex flex-row bg-light py-2 border-bottom gap-5">
                    <Link
                        to={`/a/clase/${claseId}`}
                        className={`link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover ms-5 ${
                            activeTab === "tablon" ? "fw-bold text-dark" : ""
                        }`}
                    >
                        Tablón
                    </Link>

                    <Link
                        to={`/a/clase/${claseId}/tareas`}
                        className={`link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover ms-5 ${
                            activeTab === "tareas" ? "fw-bold text-dark" : ""
                        }`}
                    >
                        Tareas
                    </Link>
                </div>
                <div className="d-flex justify-content-center mt-5">
                    {children}
                </div>
            </div>
        </NavLayoutAlumno>
    );
}