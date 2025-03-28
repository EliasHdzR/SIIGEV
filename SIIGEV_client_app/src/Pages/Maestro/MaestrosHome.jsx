import NavLayoutMaestro from "../../Components/NavLayoutMaestro.jsx";
import ClassCard from "../../Components/ClassCard.jsx";
import {useEffect, useState} from "react";
import useFetchWithAuth from "../../Components/useFetchWithAuth.jsx";

export default function MaestrosHome() {
    const fetchWithAuth = useFetchWithAuth();
    const [clases, setClases] = useState([]);

    const getClases = async () => {
        const data = await fetchWithAuth("http://127.0.0.1:8000/api/maestro/clases/", {method: "GET"});
        if (data) setClases(data);
    }

    useEffect(() => {
        getClases();
    }, []);

    return (
        <NavLayoutMaestro>
            <div className="d-flex flex-wrap p-4 gap-4 align-items-start">
                {clases.map((clase, index) => (
                    <ClassCard key={index}
                               claseNombre={clase.nombre}
                               claseMaestro={clase.maestro.nombre}
                               claseDescripcion={clase.descripcion}
                               claseCuatri = {clase.cuatrimestre}
                               tareas={["hola", "mundo", "tarea 1", "tarea 2"]}
                    />
                ))}
            </div>
        </NavLayoutMaestro>
    )
}