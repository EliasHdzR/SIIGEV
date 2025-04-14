import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import {useParams} from "react-router-dom";
import NavBarClaseMaestro from "../../../Components/NavBarClaseMaestro.jsx";
import {useEffect, useState} from "react";

export default function VerEntregas() {
    const fetchWithAuth = useFetchWithAuth();
    const {id, t_id} = useParams();
    const [entregas, setEntregas] = useState([]);
    const [entregaSeleccionada, setEntregaSeleccionada] = useState(null);

    const getEntregas = async () => {
        const rest = await fetchWithAuth(`http://127.0.0.1:8000/api/maestro/tareas/${t_id}/entregas`, {method: "GET"});
        const resData = await rest.json();
        return {status: rest.status, resData}
    }

    useEffect(() => {
        getEntregas().then(({status, resData}) => {
            if (status !== 200) {
                console.error(status, resData);
                return;
            }

            console.log(resData.entregas)
            setEntregas(resData.entregas);
        })
    }, []);

    return (
        <NavBarClaseMaestro claseId={id} activeTab={"contenido"}>
            <div className="d-flex overflow-y-hidden w-100 h-100">
                {/* Div izquierdo con scroll */}
                <div className="w-25 h-100 p-2 overflow-y-scroll bg-light">
                    <h5 className="text-muted">Entregadas</h5>
                    {entregas.length === 0 ? (
                        <div className="alert alert-info text-center">
                            No hay entregas para esta tarea
                        </div>
                    ) : (
                        <ul className="list-group">
                            {entregas.map((entrega, index) => (
                                <li key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{cursor: "pointer"}}
                                    onClick={() => setEntregaSeleccionada(entrega)}>
                                    <span>{entrega.alumno.nombre}</span>
                                    <span>{entrega.calificacion ? entrega.calificacion + `/100` : `Sin Calificar`}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Div derecho fijo */}
                <div className="w-75 mt-3 position-fixed start-50 h-100">
                    {entregaSeleccionada ? (
                        <Entrega entrega={entregaSeleccionada}/>
                    ) : (
                        <p>Aquí puedes ver las entregas de la tarea.</p>
                    )}
                </div>
            </div>
        </NavBarClaseMaestro>
    )
}

function Entrega({entrega}) {
    const fetchWithAuth = useFetchWithAuth();
    const [calificacion, setCalificacion] = useState("");
    const [warning, setWarning] = useState("");
    const [success, setSuccess] = useState("");
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if(entrega.calificacion !== null && entrega.calificacion !== undefined){
            setCalificacion(entrega.calificacion);
            setDisabled(true);
        } else {
            setCalificacion("");
            setDisabled(false);
        }
    }, [entrega]);

    function descargarArchivo(archivoId) {
        downloadFile(archivoId);
    }

    const downloadFile = async (id) => {
        const url = `http://127.0.0.1:8000/api/download/${id}`;
        const authHeader = `Bearer ${localStorage.getItem("accessToken")}`;

        const options = {
            headers: {
                Authorization: authHeader
            }
        };

        fetch(url, options)
            .then(res => res.blob())
            .then(blob => {
                const file = window.URL.createObjectURL(blob);
                window.open(file, '_blank');
            });
    }

    function calificarEntrega() {
        if(calificacion === null || calificacion === undefined || calificacion === "") {
            setWarning("La calificación no puede estar vacía");
            return;
        }

        if(calificacion < 0 || calificacion > 100){
            setWarning("La calificación debe estar entre 0 y 100");
            return;
        }

        setWarning("");
        handleCalificar().then(({status, resData}) => {
            if(status !== 200){
                console.error(status, resData);
                setWarning("Error al calificar la entrega");
                return;
            }

            setDisabled(true)
            setSuccess("Entrega calificada correctamente");
        })
    }

    const handleCalificar = async() => {
        const res = await fetchWithAuth('http://127.0.0.1:8000/api/maestro/tareas/calificar', { method: "POST",
            body: JSON.stringify({
                entrega_id: entrega.id,
                calificacion: calificacion
            })
        });

        const resData = await res.json();
        return { status: res.status, resData }
    }

    return (
        <div className="w-50 d-flex flex-column">
            <h1>{entrega.alumno.nombre}</h1>

            <div className="d-flex flex-row w-50 align-items-center">
                <input type="number" min="0" max="100" className="form-control w-25" disabled={disabled}
                       onChange={(e) => setCalificacion(e.target.value)}
                       value={entrega.calificacion}/>
                <span className="me-2">/100</span>
                <button className="btn text-white fw-medium" style={{ backgroundColor: "#640d64" }} disabled={disabled}
                        onClick={calificarEntrega}
                >Calificar</button>
            </div>
            <p className="m-0 text-danger">{ warning }</p>
            <p className="m-0 text-success">{ success }</p>

            <hr/>
            <p className="m-0">Archivos Adjuntos</p>
            {entrega.archivos && (
                <div className="d-flex flex-row my-4">
                    {entrega.archivos.map((archivo) => (
                        <button key={archivo.id} onClick={() => descargarArchivo(archivo.id)}
                                className="btn btn-link bg-light rounded p-2 me-2">
                            {archivo.nombre_original}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}