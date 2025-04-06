import NavBarClaseMaestro from "../../../Components/NavBarClaseMaestro.jsx";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import Publicacion from "../../../Components/Publicacion.jsx";

export default function ContenidoClase(){
    const fetchWithAuth = useFetchWithAuth();

    const { id } = useParams();
    const [ temas, setTemas ] = useState([]);
    const [ maestro, setMaestro ] = useState({});

    const getTemas = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/maestro/temas/${id}/`, { method: "GET" });
        const resData = await res.json();
        return { status: res.status, resData }
    }

    const getUserInfo = async () => {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/account/info", { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };
    }

    useEffect(() => {
        getTemas().then(({status, resData}) => {
            if(status !== 200){
                console.error(status, resData);
                return;
            }

            console.log(resData.temas)
            setTemas(resData.temas);
        });

        getUserInfo().then(({status, data}) => {
            if (status !== 200) {
                console.error("Error fetching user info:", data);
                return;
            }

            setMaestro(data);
        });
    }, [id])

    return(
        <NavBarClaseMaestro claseId={id} activeTab={"contenido"}>
            <div className="d-flex flex-row w-100">
                <div className="w-25 mt-5 pt-2 px-4 gap-3 d-flex flex-column align-items-end">
                    <Link to={`/m/clase/${id}/nuevo-tema`} className="btn w-75 text-white fw-medium" style={{ backgroundColor: "#640d64" }}>Crear Tema</Link>
                    <Link to={`/m/clase/${id}/nueva-tarea`} className="btn w-75 text-white fw-medium" style={{ backgroundColor: "#640d64" }}>Crear Nueva Tarea</Link>
                    <Link to={`/m/clase/${id}/nuevo-material`} className="btn w-75 text-white fw-medium" style={{ backgroundColor: "#640d64" }}>Crear Nuevo Material</Link>
                </div>
                <div className="w-50">
                    { temas.length === 0 ? (
                        <div className="alert alert-info text-center">
                            No hay temas en esta clase
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3 mt-5">
                            {temas.map((tema) => (
                                <div key={tema.id}>
                                    <h2>{tema.nombre}</h2>
                                    <p>{tema.descripcion}</p>
                                    <hr/>

                                    { tema.publicaciones.length === 0 ? (
                                        <div className="alert alert-info text-center">
                                            No hay publicaciones en este tema
                                        </div>
                                    ) : (
                                        <ul className="list-group">
                                            {tema.publicaciones.map((publicacion, index) => (
                                                <Publicacion
                                                    publicacion={publicacion}
                                                    key={index}
                                                    clase_id={id}
                                                    maestroNombre={maestro.nombre}
                                                />
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </NavBarClaseMaestro>
    );
}