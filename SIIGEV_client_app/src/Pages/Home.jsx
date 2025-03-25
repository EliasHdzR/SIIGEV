import NavLayout from "../Components/NavLayout.jsx";
import ClassCard from "../Components/ClassCard.jsx";

export default function Home() {
    return (
        <div>
            <NavLayout>

                <div className="d-flex flex-wrap p-4 gap-4">
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