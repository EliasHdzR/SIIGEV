function ClassCard() {
    return (
        <button type="button" className="p-3 border rounded bg-white d-flex-col align-items-start shadow-sm" style={{width: "300px"}}>
            <h2>Class Name</h2>
            <p>Class Description</p>
        </button>
    );
}

export default ClassCard;