import NavLayoutAlumno from "../../Components/NavLayoutAlumno.jsx";
import ClassCard from "../../Components/ClassCard.jsx";
import { useEffect, useState } from "react";
import useFetchWithAuth from "../../Components/useFetchWithAuth.jsx";

export default function AlumnosHome() {
    const fetchWithAuth = useFetchWithAuth();
    const [clases, setClases] = useState([]);

    const getClases = async () => {
        const resData = await fetchWithAuth("http://127.0.0.1:8000/api/alumno/clases/", { method: "GET" });
        console.log(resData);
        if (resData) setClases(resData);
    };

    useEffect(() => {
        getClases();
    }, []);

    return (
        <NavLayoutAlumno>
            <div className="d-flex flex-wrap p-4 gap-4 align-items-start">
                {clases.length > 0 ? (
                    clases.map((clase) => (
                        <ClassCard
                            key={clase.id}
                            claseId={clase.id}
                            claseNombre={clase.nombre}
                            claseMaestro={clase.maestro.nombre}
                            claseCuatri={clase.cuatrimestre}
                            claseDescripcion={clase.descripcion}
                            tareas={clase.tareas || []}
                            basePath="/a"
                        />
                    ))
                ) : (
                    <div className="alert alert-info" role="alert">
                        No estás inscrito en ninguna clase.
                    </div>
                )}
            </div>
        </NavLayoutAlumno>
    );
}