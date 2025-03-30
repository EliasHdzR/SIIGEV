import NavLayoutAlumno from "./NavLayoutAlumno.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import useFetchWithAuth from "./useFetchWithAuth.jsx";
import {useEffect, useState} from "react";

export default function NavBarClaseAlumno({ children, activeTab }) {
    const navigate = useNavigate();
    const fetchWithAuth = useFetchWithAuth();
    const { id } = useParams();
    const [ clase, setClase ] = useState({});

    const getClase = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/alumno/clases/${id}`, {method: "GET"});
        const data = await res.json();
        return {status: res.status, data}
    }

    useEffect(() => {
        getClase().then(({status, data}) => {
            if (status !== 200) {
                navigate('/404');
                return;
            }

            setClase(data);
        });

    }, [id]);

    return (
        <NavLayoutAlumno>
            <div className="d-flex flex-column">
                <div className="container-fluid d-flex flex-row bg-light py-2 border-bottom gap-5">
                    <Link
                        to={`/a/clase/${clase.id}`}
                        className={`link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover ms-5 ${
                            activeTab === "tablon" ? "fw-bold text-dark" : ""
                        }`}
                    >
                        Tablón
                    </Link>

                    <Link
                        to={`/a/clase/${clase.id}/tareas`}
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