import {useParams} from "react-router-dom";
import NavBarClaseMaestro from "../../../Components/NavBarClaseMaestro.jsx";

export default function TablonClase(){
    const { id } = useParams();

    return(
        <NavBarClaseMaestro claseId={id} activeTab={"tablon"}>
            <div className="w-75 bg-light p-3">
                <div>
                    <h1>Clase {id}</h1>
                </div>
            </div>
        </NavBarClaseMaestro>
    );
}