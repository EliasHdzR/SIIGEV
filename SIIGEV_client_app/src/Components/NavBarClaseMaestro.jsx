import NavLayoutMaestro from "./NavLayoutMaestro.jsx";
import {Link} from "react-router-dom";

export default function NavBarClaseMaestro({children, claseId, activeTab}) {
    return (
        <NavLayoutMaestro>
            <div className="d-flex flex-column">
                <div className="container-fluid d-flex flex-row bg-light py-2 border-bottom gap-5">
                        <Link to={`/m/clase/${claseId}`}
                              className={`link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover ms-5 ${
                                  activeTab === "tablon" ? "fw-bold text-dark" : ""
                              }`}
                        >
                            Tablón
                        </Link>

                    <Link to={`/m/clase/${claseId}/a`}
                          className={`link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover ms-5 ${
                              activeTab === "alumnos" ? "fw-bold text-dark" : ""
                          }`}
                    >
                        Alumnos
                    </Link>
                </div>
                <div className="d-flex justify-content-center mt-5">
                    {children}
                </div>
            </div>
        </NavLayoutMaestro>
    );
}