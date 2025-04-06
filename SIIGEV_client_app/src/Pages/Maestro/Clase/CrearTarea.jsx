import NavBarClaseMaestro from "../../../Components/NavBarClaseMaestro.jsx";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import {useParams, useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import TextEditor from "../../../Components/TextEditor.jsx";

export default function CrearTema(){
    const navigate = useNavigate();
    const fetchWithAuth = useFetchWithAuth();

    const { id } = useParams();
    const [ titulo, setTitulo ] = useState("");
    const [ temaId, setTema ] = useState("");
    const [ listaTemas, setListaTemas ] = useState([]);
    const [ instrucciones, setInstrucciones ] = useState("");
    const [ tareaFiles, setTareaFiles ] = useState([]);
    const [ fechaEntrega, setFechaEntrega ] = useState("");

    const [ warningTitulo, setWarningTitulo ] = useState("");
    const [ warningTema, setWarningTema ] = useState("");
    const [ warningInstrucciones, setWarningInstrucciones ] = useState("");
    const [ warningFechaEntrega, setWarningFechaEntrega ] = useState("");

    const getTemas = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/maestro/temas/${id}/listado/`, { method:"GET" } );
        const data = await res.json();
        return { status: res.status, data }
    }

    useEffect(() => {
        getTemas().then(({status, data}) => {
            if (status !== 200) {
                console.error("Error al recuperar carreras", data);
                return;
            }

            setListaTemas(data.temas);
        });
    }, [id]);

    function validarCampos() {
        const warnings = {
            titulo: "Ingrese un título",
            tema: "Seleccione un tema",
            instrucciones: "Ingrese instrucciones",
            fechaEntrega: "Seleccione una fecha de entrega",
            fechaEntregaInvalida: "La fecha de entrega no puede ser menor a la fecha actual",
        };

        const newWarnings = {};

        if (titulo.trim() === "") newWarnings.titulo = warnings.titulo;
        if (temaId === "") newWarnings.tema = warnings.tema;
        if (instrucciones.trim() === "") newWarnings.instrucciones = warnings.instrucciones;
        if (fechaEntrega === "") newWarnings.fechaEntrega = warnings.fechaEntrega;
        if (new Date(fechaEntrega) < new Date()) newWarnings.fechaEntregaInvalida = warnings.fechaEntregaInvalida;

        setWarningTitulo(newWarnings.titulo || "");
        setWarningTema(newWarnings.tema || "");
        setWarningInstrucciones(newWarnings.instrucciones || "");
        setWarningFechaEntrega(newWarnings.fechaEntrega || "");
        if (newWarnings.fechaEntregaInvalida) {
            setWarningFechaEntrega(newWarnings.fechaEntregaInvalida || "");
        }

        if (Object.keys(newWarnings).length > 0) return;

        crearTarea().then(({status, resData}) => {
            if (status !== 201) {
                setWarningTitulo(resData?.message || "Error en el servidor");
                return;
            }

            navigate("/m/clase/" + id);
        });
    }

    const crearTarea = async () => {
        const body = new FormData();
        body.append("tema_id", temaId);
        body.append("titulo", titulo);
        body.append("instrucciones", instrucciones);
        body.append("fecha_entrega", fechaEntrega);

        for (let i = 0; i < tareaFiles.length; i++) {
            body.append("archivos[]", tareaFiles[i]);
        }

        const res = await fetchWithAuth("http://127.0.0.1:8000/api/maestro/tareas/", {
            method: "POST",
            body: body,
        });

        const data = await res.json();
        return { status: res.status, data };
    }

    return(
        <NavBarClaseMaestro claseId={id} activeTab={"contenido"}>
            <div className="container-fluid p-4 d-flex flex-column justify-content-center">
                <h1>Crear Tarea</h1>
                <div className="mt-4 bg-light p-4 rounded shadow-sm">
                    <h3>Información de la Tarea</h3>
                    <div className="mb-3">
                        <label className="d-flex flex-row">
                            Título
                            <p className="text-danger mb-1">*</p>
                        </label>
                        <input type="text" className="form-control mb-1" value={titulo} onChange={(e) => setTitulo(e.target.value)}/>
                        <span className="form-text text-danger-emphasis">{ warningTitulo }</span>
                    </div>

                    <div className="mb-3">
                        <label className="d-flex flex-row">
                            Tema
                            <p className="text-danger mb-1">*</p>
                        </label>
                        <select className="form-control mb-1" name="carreras" onChange={(e) => setTema(e.target.value)}>
                            <option value="">Seleccione un Tema</option>
                            {listaTemas.map((tema, index) => (
                                <option key={index} value={tema.id}>{tema.nombre}</option>
                            ))}
                        </select>
                        <span className="form-text text-danger-emphasis">{ warningTema }</span>
                    </div>

                    <div className="mb-3">
                        <label className="d-flex flex-row">
                            Instrucciones
                            <p className="text-danger mb-1">*</p>
                        </label>
                        <TextEditor content={instrucciones} setContent={setInstrucciones} files={tareaFiles} setFiles={setTareaFiles}/>
                        <span className="form-text text-danger-emphasis">{ warningInstrucciones }</span>

                        { tareaFiles.length > 0 && (
                            <div>
                                <p>Archivos adjuntos:
                                    {Array.from(tareaFiles).map((file, index) => (
                                        <span key={index} className={"mx-3"}>{file.name}</span>
                                    ))}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="d-flex flex-row">
                            Fecha de Entrega
                            <p className="text-danger mb-1">*</p>
                        </label>
                        <input type="datetime-local" className="form-control mb-1" onChange={(e) => setFechaEntrega(e.target.value)}/>
                        <span className="form-text text-danger-emphasis">{ warningFechaEntrega }</span>
                    </div>

                    <button className="w-100 btn fw-medium text-white" style={{ backgroundColor: "#640d64" }}
                            onClick={() => validarCampos()}>
                        Crear Tarea
                    </button>
                </div>
            </div>
        </NavBarClaseMaestro>
    );
}