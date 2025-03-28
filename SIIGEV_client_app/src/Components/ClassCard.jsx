function ClassCard({ claseNombre, claseMaestro, claseCuatri,claseDescripcion, tareas}) {

    return (
        <div className="border rounded bg-white d-flex-col align-items-start shadow-sm" style={{width: "300px", height: "300px"}}>
            <div className="p-3 rounded-top border-bottom" style={{ backgroundColor: "#ab379c" }}>
                <h4
                    className="mb-0 text-truncate"
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}
                >
                    { claseNombre }
                </h4>
                <p
                    className="text-truncate"
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}
                >
                    Cuatrimestre { claseCuatri } - { claseDescripcion }
                </p>
                <p className="mb-0">{ claseMaestro }</p>
            </div>

            <div className="px-3 pt-2">
                <ul className="list-unstyled">
                    {tareas.map((tarea, index) => (
                        <li key={index} className="">{tarea}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ClassCard;