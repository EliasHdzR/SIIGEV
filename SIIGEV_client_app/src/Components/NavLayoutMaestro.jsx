import {useEffect, useState} from "react";
import useFetchWithAuth from "./useFetchWithAuth.jsx";
import {Link} from "react-router-dom";

function NavLayoutMaestro({children}) {
    return (
        <div className="d-flex flex-column vh-100">
            {/* Topbar fijo */}
            <TopBar/>

            <div className="d-flex flex-row h-100 overflow-y-hidden">
                <div>
                    <SideBar/>
                </div>
                <div className="container-fluid h-100 overflow-y-scroll p-0">
                    {children}
                </div>
            </div>
        </div>
    )
}

function TopBar() {
    const fetchWithAuth = useFetchWithAuth();
    const [usuario, setUsuario] = useState({});

    const getUserInfo = async () => {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/account/info", { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };
    }

    useEffect(() => {
        getUserInfo().then(({status, data}) => {
            if (status !== 200) {
                console.error("Error fetching user info:", data);
                return;
            }

            setUsuario(data);
        })
    }, []);

    return (
        <div className="p-3 border-bottom bg-light d-flex align-items-center shadow-sm justify-content-between">
            <Link className="link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover d-flex align-items-center ms-2"
               to="/m/home">
                <img src="/upvlogo.png" width="35" height="30" alt="SIIGEV"/>
                <div className="ms-2">SIIGEV</div>
            </Link>
            <div className="d-flex align-items-center ms-2">
                <div className="ms-2">{ usuario.nombre }</div>
            </div>
        </div>
    )
}

function SideBar() {
    const fetchWithAuth = useFetchWithAuth();
    const [clases, setClases] = useState([]);

    const getClases = async () => {
        const res = await fetchWithAuth("http://127.0.0.1:8000/api/maestro/clases/", { method: "GET" });
        const data = await res.json();
        return { status: res.status, data };
    }

    useEffect(() => {
        getClases().then(({status, data}) => {
            if (status !== 200) {
                console.error("Error fetching classes:", data);
                return;
            }

            setClases(data);
        });
    }, []);


    return (
        <div className="bg-light border-end d-flex flex-column h-100" style={{width: "300px"}}>
            <ul className="list-unstyled">
                <li className="p-3 border-bottom">
                    <Link to="/m/home" className="link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368" className={"me-3"}>
                            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
                        </svg>
                        <span>Inicio</span>
                    </Link>
                </li>

                {/* CLASES  */}
                <li className="px-3 pt-3">
                    <Link to="/m/clase/crear" className="link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368" className={"me-3"}>
                            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                        </svg>
                        <span>Crear Clase</span>
                    </Link>
                </li>

                <li className="p-3">
                    <div className="text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368" className={"me-3"}>
                            <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z"/>
                        </svg>
                        <span>Mis Clases</span>
                    </div>
                </li>

                {clases.length > 0 ? (
                    clases.map((clase) => (
                        <ClassItem key={clase.id} claseNombre={clase.nombre} href={`/m/clase/${clase.id}`} />
                    ))
                ) : (
                    <li className="p-3 text-muted">No tienes clases</li>
                )}

                <li className="border-bottom pb-3"></li>
                {/* FIN CLASES  */}

                <li className="p-3">
                    <Link to="/login"
                       className="link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368" className="me-3">
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                        </svg>
                        <span>Cerrar Sesión</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

function ClassItem({claseNombre, href}) {
    return (
        <li className="pt-1 px-3">
            <Link to={href}
                  className="link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover d-flex align-items-center text-truncate">
                <span>{claseNombre}</span>
            </Link>
        </li>
    )
}

export default NavLayoutMaestro;