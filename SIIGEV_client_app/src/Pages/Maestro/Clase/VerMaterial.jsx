import {useParams} from "react-router-dom";
import NavBarClaseMaestro from "../../../Components/NavBarClaseMaestro.jsx";
import useFetchWithAuth from "../../../Components/useFetchWithAuth.jsx";
import {useEffect, useState} from "react";

export default function VerMaterialProfesor(){
    const fetchWithAuth = useFetchWithAuth();
    const { id , m_id} = useParams();
    const [ material, setMaterial ] = useState({});
    const [ createdAt, setCreatedAt ] = useState("");

    const getMaterial = async () => {
        const rest = await fetchWithAuth(`http://127.0.0.1:8000/api/maestro/materiales/${m_id}/`, { method: "GET" });
        const resData = await rest.json();
        return { status: rest.status, resData }
    }

    useEffect(() => {
        getMaterial().then(({status, resData}) => {
            if(status !== 200){
                console.error(status, resData);
                return;
            }

            setCreatedAt(resData.material.created_at);
            setMaterial(resData.material);
        });
    }, [id])

    function descargarArchivo(archivoId){
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
            .then( res => res.blob() )
            .then( blob => {
                const file = window.URL.createObjectURL(blob);
                window.open(file, '_blank');
            });
    }

    return(
        <NavBarClaseMaestro claseId={id} activeTab={"contenido"}>
            <div className="w-50 d-flex flex-column mt-3">
                <div className="d-flex flex-row align-items-center">
                    <div className="ms-1 me-3 d-flex align-items-center justify-content-center" style={{backgroundColor: "#640d64", borderRadius: "50%", width: "45px", height: "45px"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" className="bi bi-journal-bookmark-fill" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6 1h6v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z"/>
                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
                            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
                        </svg>
                    </div>
                    <h1>{ material.titulo }</h1>
                </div>
                <small className="text-muted d-block ms-5 ps-4">
                    {new Date(createdAt.replace(" ", "T")).toLocaleString()}
                </small>

                <hr/>

                <p className="my-2" dangerouslySetInnerHTML={{__html: material.descripcion}}></p>
                {material.archivos && (
                    <div className="d-flex flex-row">
                        {material.archivos.map((archivo) => (
                            <button key={archivo.id} onClick={() => descargarArchivo(archivo.id)}
                                    className="btn btn-link bg-light rounded p-2 me-2">
                                {archivo.nombre_original}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </NavBarClaseMaestro>
    );
}