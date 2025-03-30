import {useParams} from "react-router-dom";
import NavBarClaseMaestro from "../../../Components/NavBarClaseMaestro.jsx";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import {useEffect, useState} from "react";

export default function TablonClase(){
    const fetchWithAuth = useFetchWithAuth();
    const { id } = useParams();
    const [ alumnos, setAlumnos ] = useState([]);
    const [ alumnosNoRegistrados, setAlumnosNoRegistrados ] = useState([]);
    const [ alumnoAgregar, setAlumnoAgregar ] = useState("");
    const [ warning, setWarning ] = useState("");

    const getAlumnosNoRegistrados = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/maestro/clases/${id}/get-alumnos-n/`, {method:"GET"});
        const resData = await res.json();
        return {status: res.status, resData}
    }

    const getAlumnosRegistrados = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/maestro/clases/${id}/get-alumnos/`, {method:"GET"});
        const resData = await res.json();
        return {status: res.status, resData}
    }

    function addAlumno() {
        if(alumnoAgregar === "") return;

        const matricula = alumnoAgregar.split("-")[0].trim();
        if(matricula.length !== 7 && !Number(matricula)){
            setWarning("Seleccione un alumno de la lista");
            return;
        }

        storeAlumno(matricula).then(
            ({status, resData}) => {
                if (status !== 201) {
                    setWarning(resData.message || "Seleccione un alumno de la lista");
                    return;
                }

                setAlumnos(resData["registrados"].original);
                setAlumnosNoRegistrados(resData["no_registrados"].original);
                setAlumnoAgregar("");
                setWarning("");
            }
        )
    }

    const storeAlumno = async (matricula) => {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/maestro/clases/add-alumno",
            {
                method:"POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({matricula, clase_id: id})
            }
        );

        const resData = await res.json();
        return {status: res.status, resData}
    }

    useEffect(() => {
        getAlumnosRegistrados().then(({status , resData}) => {
            if (status !== 200) {
                console.error(status, resData);
                return;
            }

            setAlumnos(resData);
        });

        getAlumnosNoRegistrados().then(({status , resData}) => {
            if (status !== 200) {
                console.error(status, resData);
                return;
            }

            setAlumnosNoRegistrados(resData);
        });
    }, []);

    return(
        <NavBarClaseMaestro claseId={id} activeTab={"alumnos"}>
            <div className="w-50 flex-column">

                <div className="mb-5 d-flex flex-column justify-content-center">
                    <div className="input-group">
                        <label htmlFor="staticEmail" className="col-sm-2 me-2 col-form-label">Agregar Alumno</label>
                        <input className="form-control" list="datalistOptions" value={alumnoAgregar} onChange={(e) => setAlumnoAgregar(e.target.value)}
                               placeholder="Buscar matrícula o nombre..."/>
                        <datalist id="datalistOptions">
                            {alumnosNoRegistrados.map((alumno) => (
                                <option key={alumno.matricula} value={`${alumno.matricula} - ${alumno.nombre}`}/>
                            ))}
                        </datalist>
                        <button className="btn btn-outline-secondary" type="button" onClick={() => addAlumno()}>
                            Agregar
                        </button>
                    </div>
                    <span className="form-text text-danger-emphasis mb-3">{ warning }</span>
                </div>

                <div className="d-flex flex-row justify-content-between align-items-center">
                    <h2>Alumnos</h2>
                </div>

                <hr/>
                {alumnos.length > 0 ? (
                    <div className="d-flex flex-column">
                        {alumnos.map((alumno) => (
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