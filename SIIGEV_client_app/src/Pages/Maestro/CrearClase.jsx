import NavLayoutMaestro from "../../Components/NavLayoutMaestro.jsx";
import {useEffect, useState} from "react";
import useFetchWithAuth from "../../Components/useFetchWithAuth.jsx";
import { useNavigate } from "react-router-dom";

function CrearClase() {
    const navigate = useNavigate();
    const fetchWithAuth = useFetchWithAuth();

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [codigo, setCodigo] = useState("");
    const [carrera_id, setCarrera] = useState("");
    const [cuatrimestre, setCuatrimestre] = useState("");
    const [listaCarreas, setListaCarreras] = useState([]);
    
    const [warningNombre, setWarningNombre] = useState("");
    const [warningDescripcion, setWarningDescripcion] = useState("");
    const [warningCodigo, setWarningCodigo] = useState("");
    const [warningCarrera, setWarningCarrera] = useState("");
    const [warningCuatrimestre, setWarningCuatrimestre] = useState("");

    function validarCampos() {
        const warnings = {
            nombre: "Ingrese un nombre",
            descripcion: "Ingrese una descripción",
            codigo: "Ingrese un código de grupo",
            carrera: "Seleccione una carrera",
            cuatrimestre: "Seleccione un cuatrimestre"
        };

        const newWarnings = {};

        if (nombre.trim() === "") newWarnings.nombre = warnings.nombre;
        if (descripcion.trim() === "") newWarnings.descripcion = warnings.descripcion;
        if (codigo.trim() === "") newWarnings.codigo = warnings.codigo;
        if (carrera_id === "") newWarnings.carrera = warnings.carrera;
        if (cuatrimestre === "") newWarnings.cuatrimestre = warnings.cuatrimestre;

        setWarningNombre(newWarnings.nombre || "");
        setWarningDescripcion(newWarnings.descripcion || "");
        setWarningCodigo(newWarnings.codigo || "");
        setWarningCarrera(newWarnings.carrera || "");
        setWarningCuatrimestre(newWarnings.cuatrimestre || "");

        if (Object.keys(newWarnings).length > 0) return;

        crearClase().then(({status, resData}) => {
            if (status !== 201) {
                setWarningNombre(resData?.message || "Error en el servidor");
                return;
            }

            navigate("/m/home");
        });
    }

    const crearClase = async () => {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/maestro/clases/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre,
                descripcion,
                codigo,
                carrera_id,
                cuatrimestre,
            }),
        });

        const data = await res.json();
        return { status: res.status, data };
    };

    const getCarreras = async () => {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/maestro/carreras/", { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };

    }

    useEffect(() => {
        getCarreras().then(({status, data}) => {
            if (status !== 200) {
                console.error("Error al recuperar carreras", data);
                return;
            }
            setListaCarreras(data);
        });
    }, []);

    return (
        <NavLayoutMaestro>
            <div className="p-4 d-flex flex-column justify-content-center">
                <h1>Crear Clase</h1>
                <div className="container-fluid d-flex flex-column mt-4 bg-light p-4 rounded shadow-sm">
                    <h3>Información de la Clase</h3>
                    <div className="mb-3">
                        <label className="d-flex flex-row">
                            Nombre de la Clase
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
                        <textarea className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                        <span className="form-text text-danger-emphasis">{ warningDescripcion }</span>
                    </div>

                    <div className="mb-3">
                        <label className="d-flex flex-row">
                            Código de Grupo
                            <p className="text-danger mb-1">*</p>
                        </label>
                        <input type="text" className="form-control mb-1" value={codigo} onChange={(e) => setCodigo(e.target.value)}/>
                        <span className="form-text text-danger-emphasis">{ warningCodigo }</span>
                    </div>

                    <div className="mb-3">
                        <label className="d-flex flex-row">
                            Carrera
                            <p className="text-danger mb-1">*</p>
                        </label>
                        <select className="form-control mb-1" name="carreras" onChange={(e) => setCarrera(e.target.value)}>
                            <option value="">Seleccione una Carrera</option>
                            {listaCarreas.map((carrera, index) => (
                                <option key={index} value={carrera.id}>{carrera.nombre}</option>
                            ))}
                        </select>
                        <span className="form-text text-danger-emphasis">{ warningCarrera }</span>
                    </div>

                    <div className="mb-3">
                        <label className="d-flex flex-row">
                            Cuatrimestre
                            <p className="text-danger mb-1">*</p>
                        </label>
                        <select className="form-control mb-1" name="cuatrimestres" onChange={(e) => setCuatrimestre(e.target.value)}>
                            <option value="">Seleccione un Cuatrimestre</option>
                            {Array.from({length: 10}, (v, i) => i + 1).map((cuatrimestre, index) => (
                                <option key={index} value={cuatrimestre}>{cuatrimestre}</option>
                            ))}
                        </select>
                        <span className="form-text text-danger-emphasis">{ warningCuatrimestre }</span>
                    </div>

                    <button className="btn fw-medium text-white" style={{ backgroundColor: "#640d64" }} onClick={() => validarCampos()}>Crear Clase</button>
                </div>
            </div>
        </NavLayoutMaestro>
    );
}

export default CrearClase;