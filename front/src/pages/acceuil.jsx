import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Accueil() {
  const { user } = useContext(AuthContext);
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const fetchMissions = async () => {
      const res = await fetch("http://localhost:3000/api/missions", {
        credentials: "include",
      });
      if (res.ok) setMissions(await res.json());
    };
    fetchMissions();
  }, []);

  return (
    <div>
      <h1>Bienvenue {user?.username}</h1>
      <button>Nouvelle fiche visite client</button>

      <h2>Vos missions :</h2>
    </div>
  );
}
