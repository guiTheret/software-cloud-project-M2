import React from 'react'
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";


export default function CleanerCard({ cleaner, displayButton }: { cleaner: cleaner, displayButton: boolean }) {
    const navigate = useNavigate();
    const profilPicture = "";
    const redirectToProfil = () => {
        navigate("/book/", { state: { cleaner: cleaner } });
    }
    return (
        <div style={{ width: "100%", border: "3px solid black", marginBottom: 10, marginTop: 10, borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "row" }}>
            <div style={{ backgroundColor: "#107ACA", width: "40%", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div style={{ color: "white", fontWeight: "bold", textAlign: "center", fontSize: "20px" }}>{cleaner.firstName.toUpperCase()} {cleaner.lastName.toUpperCase()}</div>
                <div style={{ width: "40%", padding: "4px", backgroundColor: "#0D4DFD", borderRadius: 1000 }}>
                    <img src={cleaner.profilPicture} style={{ width: "100%", borderRadius: 1000, border: "1px solid black" }} />
                </div>
                <p style={{ color: "white", fontWeight: "bold" }}>{cleaner.city} / {cleaner.rayon} km</p>
            </div>
            <div style={{ backgroundColor: "white", width: "60%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
                <p style={{ fontWeight: "bold" }}>Bio</p>
                <p>{cleaner.bio}</p>
                <div style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                    {displayButton &&
                        <Button style={{ marginLeft: 10, }} onClick={() => redirectToProfil()} variant="outline-primary">Book</Button>
                    }
                    <div style={{textAlign: "center" }}>Joined : {new Date(cleaner.joinDate).toLocaleDateString("fr-FR")}</div>
                </div>
            </div>
        </div>
    )
}
