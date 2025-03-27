import NavLayout from "../../Components/NavLayout.jsx";
import ClassCard from "../../Components/ClassCard.jsx";
import {useEffect, useState} from "react";
import useFetchWithAuth from "../../Components/useFetchWithAuth.jsx";

export default function MaestrosHome() {
    const fetchWithAuth = useFetchWithAuth();

    const getClases = async () => {
        const data = await fetchWithAuth("http://127.0.0.1:8000/api/maestro/clases/", { method: "GET" });

        if(data) {
            console.log(data);
        }
    }

    useEffect(() => {
        getClases();
    }, []);

    return (
        <div>
            <NavLayout>
                <div className="d-flex flex-wrap p-4 gap-4 align-items-start">
                    <ClassCard/>
                    <ClassCard/>
                    <ClassCard/>
                    <ClassCard/>
                    <ClassCard/>
                    <ClassCard/>
                    <ClassCard/>
                    <ClassCard/>
                    <ClassCard/>
                </div>
            </NavLayout>
        </div>
    )
}