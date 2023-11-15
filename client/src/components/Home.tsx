import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import CleanerCard from './Cleaner/CleanerCard';
import api from "../api/api.js";

export default function Home({ isAuth }: { isAuth: boolean }) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchValueCity, setSearchValueCity] = useState<string>("");
  const [arrayCleaner, setArrayCleaner] = useState<Array<any>>([])
  useEffect(() => {
    if (isAuth === false) {
      navigate("/login");
    }
  }, [isAuth]);

  useEffect(() => {
    if (searchValueCity.length === 0 && searchValue.length === 0) {
      getAllCleaners()
    }
  }, [searchValueCity, searchValue])

  const searchByCleaner = () => {
    api.get(`/cleaner/getCleanerByNameOrUsername/${searchValue}`)
      .then(response => {
        setArrayCleaner(response.data)
      })
      .catch(() => {
        setArrayCleaner([]);
      })
  }
  const searchByCity = () => {
    api.get(`/cleaner/getCleanerByCity/${searchValueCity}`)
      .then(response => {
        setArrayCleaner(response.data)
      })
      .catch(() => {
        setArrayCleaner([]);
      })
  }
  const getAllCleaners = () => {
    api.get(`/cleaner/seeAllCleaners`)
      .then(response => {
        setArrayCleaner(response.data)
      })
      .catch(() => {
        setArrayCleaner([]);
      })
  }

  useEffect(() => {
    getAllCleaners()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center" }}>
      <div style={{ backgroundColor: "#107ACA", width: "100%", paddingLeft: "25%" }}>
        <p style={{ color: "white", fontWeight: "bold", fontSize: 45 }}>Find an appointment with our cleaning staff</p>
        <div style={{ display: "flex", width: "66%", justifyContent: "space-between", paddingBottom: "10px", flexDirection: "row", flexWrap: "wrap" }}>
          <div style={{ display: 'flex', backgroundColor: "#107ACA", maxWidth: "300px", flexDirection: "row", flexWrap: "wrap" }}>
            <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Name of cleaner" style={{ border: "3px solid transparent", borderRadius: "10px", maxWidth: "200px" }} />
            <button onClick={() => searchByCleaner()} style={{ marginLeft: "5px", border: "3px solid black", borderRadius: "10px", display: "flex", flexDirection: "row", maxWidth: "90px" }}>Search By Cleaner</button>
          </div>
          <div style={{ display: 'flex', backgroundColor: "#107ACA", maxWidth: "300px", flexDirection: "row", flexWrap: "wrap" }}>
            <input type="text" value={searchValueCity} onChange={(e) => setSearchValueCity(e.target.value)} placeholder="City" style={{ border: "3px solid transparent", borderRadius: "10px", maxWidth: "200px" }} />
            <button onClick={() => searchByCity()} style={{ marginLeft: "5px", border: "3px solid black", borderRadius: "10px", display: "flex", flexDirection: "row", maxWidth: "90px" }}>Search By City</button>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", width: "90%" }}>
        {arrayCleaner.length !== 0 && arrayCleaner.map((cleaner, index) => {
          return (
            <div key={index} style={{ minWidth: "45%", maxWidth: "400px" }}>
              <CleanerCard cleaner={cleaner} displayButton />
            </div>
          )
        })}
      </div>
    </div>
  )
}
