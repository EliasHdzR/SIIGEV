import {useParams} from "react-router-dom";
import NavBarClaseMaestro from "../../../Components/NavBarClaseMaestro.jsx";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import {useEffect, useState} from "react";

export default function TablonClase(){
    const fetchWithAuth = useFetchWithAuth();
    const { id } = useParams();
    const [ alumnos, setAlumnos ] = useState([]);

    const getAllAlumnos = async () => {

    }

    const getAlumnosByClase = async () => {
        const resData = await fetchWithAuth(`http://127.0.0.1:8000/api/maestro/clases/${id}/get-alumnos/`, {method:"GET"});
        if(resData.status === 404 || resData.status === 403) return {status: resData.status, message: resData.message || "Error al recuperar alumnos"};
        setAlumnos(resData)
    }

    useEffect(() => {
        getAlumnosByClase();
    }, []);

    return(
        <NavBarClaseMaestro claseId={id} activeTab={"alumnos"}>
            <div className="w-50 flex-column">

                <div className="d-flex flex-row justify-content-between align-items-center">
                    <h2>Alumnos</h2>
                    <button type="button" className="btn btn-warning btn-lg align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#000000" className="me-2">
                            <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"/>
                        </svg>
                        Agregar Alumno
                    </button>
                </div>

                <hr/>
                {alumnos.length > 0 ? (
                    <div className="d-flex flex-column">
                        { alumnos.map((alumno) => (
                            <div key={alumno.id} className="d-flex flex-row justify-content-between align-items-center">
                                <p>{alumno.nombre}</p>
                                <p>{alumno.email}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info" role="alert">
                        No hay alumnos en esta clase.
                    </div>
                )}
            </div>
        </NavBarClaseMaestro>
    );
}