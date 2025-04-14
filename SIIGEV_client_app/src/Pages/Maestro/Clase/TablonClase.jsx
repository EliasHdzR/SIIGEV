import { useParams } from "react-router-dom";
import NavBarClaseMaestro from "../../../Components/NavBarClaseMaestro.jsx";
import {useEffect, useState} from "react";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import TextEditor from "../../../Components/TextEditor.jsx";
import PublicacionMaestro from "../../../Components/PublicacionMaestro.jsx";

export default function TablonClase(){
    const { id } = useParams();
    const fetchWithAuth = useFetchWithAuth();
    const [ clase, setClase ] = useState({});
    const [ maestro, setMaestro ] = useState({});
    const [ publicaciones, setPublicaciones ] = useState([]);
    const [ avisoContent, setAvisoContent] = useState("");
    const [ avisoFiles, setAvisoFiles] = useState([]);

    function publicarAviso() {
        if (avisoContent.length < 1) {
            alert("El aviso no puede estar vacío");
            return;
        }

         storeAviso().then(({status, data}) => {
             if (status !== 201) {
                 console.error("Error al publicar el aviso:", data.message);
                 return;
             }

             getTablon().then(({ status, data }) => {
                 if (status !== 200) {
                     setPublicaciones([]);
                     console.error("Error al recuperar avisos", data.message);
                     return;
                 }
                setPublicaciones(data);
             });

            setAvisoContent("");
            setAvisoFiles([]);
         });
    }

    const storeAviso = async () => {
        const body = new FormData();
        body.append("mensaje", avisoContent);
        body.append("clase_id", id);
        for (let i = 0; i < avisoFiles.length; i++) {
            body.append("archivos[]", avisoFiles[i]);
        }

        const res = await fetchWithAuth("http://127.0.0.1:8000/api/maestro/avisos/store", {
            method: "POST",
            body: body,
        });

        const data = await res.json();
        return { status: res.status, data };
    }

    const getUserInfo = async () => {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/account/info", { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };
    }

    const getClaseInfo = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/maestro/clases/${id}`, { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };
    };

    const getTablon = async () => {
        const res = await fetchWithAuth(`http://127.0.0.1:8000/api/maestro/clases/${id}/tablon`, { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };
    };

    useEffect(() => {
        getClaseInfo().then(({ status, data }) => {
            if (status !== 200) {
                setClase({});
                setMaestro({});
                console.error("Error al recuperar información de la clase", data);
                return;
            }

            setClase(data);
        });

        getTablon().then(({ status, data }) => {
            if (status !== 200) {
                setPublicaciones([]);
                console.error("Error al recuperar avisos", data);
                return;
            }
            setPublicaciones(data)
        });

        getUserInfo().then(({status, data}) => {
            if (status !== 200) {
                console.error("Error fetching user info:", data);
                return;
            }

            setMaestro(data);
        });
    }, [id]);

    return(
        <NavBarClaseMaestro activeTab={"tablon"}>
            <div className="w-75 d-flex flex-column">
                <div className="pt-5 px-3 pb-3 rounded" style={{ backgroundColor: "#640d64" }}>
                    <h1 className="mt-5 text-light">{ clase.nombre }</h1>
                    <h6 className="text-light">{ maestro.nombre }</h6>
                </div>

                <div className="bg-white border rounded shadow-sm p-3 zn-1 mt-3 d-flex flex-column">
                    <h5>Crear Aviso</h5>
                    <TextEditor content={avisoContent} setContent={setAvisoContent} files={avisoFiles} setFiles={setAvisoFiles}/>

                    { avisoFiles.length > 0 && (
                        <div>
                            <p>Archivos adjuntos:
                                {Array.from(avisoFiles).map((file, index) => (
                                    <span key={index} className={"mx-3"}>{file.name}</span>
                                ))}
                            </p>
                        </div>
                    )}

                    <button className={`mt-2 w-25 btn btn-primary`} onClick={() => publicarAviso()}>
                        Publicar
                    </button>
                </div>

                <div className="mt-4">
                    {publicaciones.length > 0 ? (
                        <ul className="list-group">
                            {publicaciones.map((publicacion, index) => (
                                <PublicacionMaestro
                                    publicacion={publicacion}
                                    key={index}
                                    clase_id={id}
                                    maestroNombre={maestro.nombre}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">No hay publicaciones para esta clase.</p>
                    )}
                </div>

            </div>
        </NavBarClaseMaestro>
    );
}