import TextEditor from "../../../Components/TextEditor.jsx";
import NavBarClaseMaestro from "../../../Components/NavBarClaseMaestro.jsx";
import {useNavigate, useParams} from "react-router-dom";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import {useEffect, useState} from "react";

export default function CrearMaterial(){
    const navigate = useNavigate();
    const fetchWithAuth = useFetchWithAuth();

    const { id } = useParams();
    const [ titulo, setTitulo ] = useState("");
    const [ temaId, setTema ] = useState("");
    const [ listaTemas, setListaTemas ] = useState([]);
    const [ descripcion, setDescripcion ] = useState("");
    const [ materialFiles, setMaterialFiles ] = useState([]);

    const [ warningTitulo, setWarningTitulo ] = useState("");
    const [ warningTema, setWarningTema ] = useState("");
    const [ warningDescripcion, setWarningDescripcion ] = useState("");

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
            descripcion: "Ingrese una descripción",
        }

        const newWarnings = {};
        if (titulo.trim() === "") newWarnings.titulo = warnings.titulo;
        if (temaId === "") newWarnings.tema = warnings.tema;
        if (descripcion.trim() === "") newWarnings.descripcion = warnings.descripcion;

        setWarningTitulo(newWarnings.titulo || "");
        setWarningTema(newWarnings.tema || "");
        setWarningDescripcion(newWarnings.descripcion || "");

        if (Object.keys(newWarnings).length > 0) return;

        crearMaterial().then(({status, resData}) => {
            if (status !== 201) {
                setWarningTitulo(resData?.message || "Error en el servidor");
                return;
            }

            navigate("/m/clase/" + id);
        });
    }

    const crearMaterial = async () => {
        const body = new FormData();
        body.append("titulo", titulo);
        body.append("tema_id", temaId);
        body.append("descripcion", descripcion);

        for (let i = 0; i < materialFiles.length; i++) {
            body.append("archivos[]", materialFiles[i]);
        }

        const res = await fetchWithAuth("http://127.0.0.1:8000/api/maestro/materiales/", {
            method: "POST",
            body: body,
        });

        const data = await res.json();
        return { status: res.status, data };
    }

    return(
        <NavBarClaseMaestro claseId={id} activeTab={"contenido"}>
            <div className="container-fluid p-4 d-flex flex-column justify-content-center">
                <h1>Crear Material</h1>
                <div className="mt-4 bg-light p-4 rounded shadow-sm">
                    <h3>Información del Material</h3>
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
                            Descripción
                            <p className="text-danger mb-1">*</p>
                        </label>
                        <TextEditor content={descripcion} setContent={setDescripcion} files={materialFiles} setFiles={setMaterialFiles}/>
                        <span className="form-text text-danger-emphasis">{ warningDescripcion }</span>

                        { materialFiles.length > 0 && (
                            <div>
                                <p>Archivos adjuntos:
                                    {Array.from(materialFiles).map((file, index) => (
                                        <span key={index} className={"mx-3"}>{file.name}</span>
                                    ))}
                                </p>
                            </div>
                        )}
                    </div>

                    <button className="w-100 btn fw-medium text-white" style={{ backgroundColor: "#640d64" }}
                            onClick={() => validarCampos()}>
                        Crear Material
                    </button>
                </div>
            </div>
        </NavBarClaseMaestro>
    );
}