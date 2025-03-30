import NavLayoutMaestro from "../../Components/NavLayoutMaestro.jsx";
import ClassCard from "../../Components/ClassCard.jsx";
import {useEffect, useState} from "react";
import useFetchWithAuth from "../../Components/useFetchWithAuth.jsx";

export default function MaestrosHome() {
    const fetchWithAuth = useFetchWithAuth();
    const [clases, setClases] = useState([]);

    const getClases = async () => {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/maestro/clases/", {method: "GET"});
        const data = await res.json();
        return {status: res.status, data}
    }

    useEffect(() => {
        getClases().then(({status, data}) => {
            if (status !== 200) {
                setClases([]);
                console.error("Error al recuperar clases", data);
                return;
            }
            setClases(data);
        })
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