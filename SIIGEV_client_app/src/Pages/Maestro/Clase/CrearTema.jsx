import NavBarClaseMaestro from "../../../Components/NavBarClaseMaestro.jsx";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import {useParams, useNavigate } from "react-router-dom";
import {useState} from "react";

export default function CrearTema(){
    const navigate = useNavigate();
    const fetchWithAuth = useFetchWithAuth();

    const { id } = useParams();
    const [ nombre, setNombre ] = useState("");
    const [ descripcion, setDescripcion ] = useState("");

    const [ warningNombre, setWarningNombre ] = useState("");
    const [ warningDescripcion, setWarningDescripcion ] = useState("");

    function validarCampos() {
        const warnings = {
            nombre: "Ingrese un nombre",
            descripcion: "Ingrese una descripción",
        };

        const newWarnings = {};

        if (nombre.trim() === "") newWarnings.nombre = warnings.nombre;
        if (descripcion.trim() === "") newWarnings.descripcion = warnings.descripcion;

        setWarningNombre(newWarnings.nombre || "");
        setWarningDescripcion(newWarnings.descripcion || "");

        if (Object.keys(newWarnings).length > 0) return;

        crearTema().then(({status, resData}) => {
            if (status !== 201) {
                setWarningNombre(resData?.message || "Error en el servidor");
                return;
            }

            navigate("/m/clase/" + id);
        });
    }

    const crearTema = async () => {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/maestro/temas/", {
            method: "POST",
            body: JSON.stringify({
                nombre: nombre,
                descripcion: descripcion,
                clase_id: id
            }),
        });

        const data = await res.json();
        return { status: res.status, data };
    };

    return(
        <NavBarClaseMaestro claseId={id} activeTab={"contenido"}>
            <div className="container-fluid p-4 d-flex flex-column justify-content-center">
                <h1>Crear Tema</h1>
                <div className="mt-4 bg-light p-4 rounded shadow-sm">
                    <h3>Información del Tema</h3>
                    <div className="mb-3">
                        <label className="d-flex flex-row">
                            Nombre
                            <p className="text-danger mb-1">*</p>
                        </label>
                        <input type="text" className="form-control mb-1" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
                        <span className="form-text text-danger-emphasis">{ warningNombre }</span>
                    </div>

                    <div className="mb-3">
                        <label className="d-flex flex-row">
                            Descripción
                            <p className="text-danger mb-1">*</p>
                        </label>
                        <input type="text" className="form-control mb-1" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}/>
                        <span className="form-text text-danger-emphasis">{ warningDescripcion }</span>
                    </div>

                    <button className="w-100 btn fw-medium text-white" style={{ backgroundColor: "#640d64" }}
                            onClick={() => validarCampos()}>
                        Crear Tema
                    </button>
                </div>
            </div>
        </NavBarClaseMaestro>
    );
}