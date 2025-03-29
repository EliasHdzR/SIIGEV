import NavLayoutMaestro from "../../Components/NavLayoutMaestro.jsx";
import ClassCard from "../../Components/ClassCard.jsx";
import {useEffect, useState} from "react";
import useFetchWithAuth from "../../Components/useFetchWithAuth.jsx";

export default function MaestrosHome() {
    const fetchWithAuth = useFetchWithAuth();
    const [clases, setClases] = useState([]);

    const getClases = async () => {
        const resDdata = await fetchWithAuth("http://127.0.0.1:8000/api/maestro/clases/", {method: "GET"});
        if (resDdata) setClases(resDdata);
    }

    useEffect(() => {
        getClases();
    }, []);

    return (
        <NavLayoutMaestro>
            <div className="d-flex flex-wrap p-4 gap-4 align-items-start">
                { clases.length > 0 ? (
                    clases.map((clase) => (
                        <ClassCard
                            key={clase.id}
                            claseId={clase.id}
                            claseNombre={clase.nombre}
                            claseMaestro={clase.maestro.nombre}
                            claseCuatri={clase.cuatrimestre}
                            claseDescripcion={clase.descripcion}
                            tareas={["hola", "mundo", "tarea 1", "tarea 2"]}
                        />
                    ))
                ) : (
                    <div className="alert alert-info" role="alert">
                        No has creado ninguna clase.
                    </div>
                )}
            </div>
        </NavLayoutMaestro>
    )
}