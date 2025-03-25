function NavLayout({children}) {

    return (
        <div className="d-flex flex-column vh-100">
            {/* Topbar fijo */}
            <TopBar/>

            <div className="d-flex flex-row">
                <SideBar/>
                {children}
            </div>
        </div>
    );
}

function TopBar() {
    return (
        <div className="p-3 border-bottom bg-light d-flex align-items-center shadow-sm">
            <a className="link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover d-flex align-items-center ms-2"
               href="/">
                <img src="/upvlogo.png" width="35" height="30" alt="SII"/>
                <div className="ms-2">SIIGEV</div>
            </a>
        </div>
    );
}

function SideBar() {
    return (
        <div className="bg-light border-end d-flex flex-column" style={{width: "220px"}}>
            <ul className="list-unstyled">
                <li className="p-3 border-bottom">
                    <a href="#" className="link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368" className={"me-3"}>
                            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
                        </svg>
                        <span>Inicio</span>
                    </a>
                </li>

                {/* CLASES  */}
                <li className="py-3 px-3">
                    <div className="text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368" className={"me-3"}>
                            <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z"/>
                        </svg>
                        <span>Mis Clases</span>
                    </div>
                </li>

                <ClassItem classname="Clase 1" href="/#"/>
                <ClassItem classname="Clase 2" href="/#"/>
                <ClassItem classname="Clase 3" href="/#"/>

                <li className="border-bottom pb-3"></li>
                {/* FIN CLASES  */}

                <li className="p-3">
                    <a href="#" className="link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368" className="me-3">
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                        </svg>
                        <span>Cerrar Sesión</span>
                    </a>
                </li>
            </ul>
        </div>
    );
}

function ClassItem ({classname, href})
    {
        return (
            <li className="pt-1 px-3">
                <a href={href} className="link-secondary link-underline link-underline-opacity-0 link-underline-opacity-100-hover d-flex align-items-center">
                    <span>{ classname }</span>
                </a>
            </li>
        );
    }

export default NavLayout;