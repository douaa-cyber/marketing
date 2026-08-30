"use client";

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  CalendarDays,
  Clock,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { URL } from "@/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Fonction de formatage robuste
const formatDate = (dateValue) => {
  if (!dateValue) return "Non définie";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) {
    return String(dateValue).split("T")[0];
  }
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// --- COMPOSANTS INTERNES ---
const DateInfo = ({ label, value, icon: Icon, colorClass }) => (
  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-1">
    <div className={`p-2.5 rounded-lg ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-bold text-gray-800">
        {formatDate(value)}
      </span>
    </div>
  </div>
);

export default function Accueil() {
  const { user, loading: authLoading } = useContext(AuthContext);

  // Correction des clés pour correspondre à votre rendu JSX
  const [stats, setStats] = useState({ TotalMission: 0, TotalForm: 0 });
  const [activeMission, setActiveMission] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login"); // Push to login page
    }
  }, [user, authLoading, navigate]);
  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user?.id) return;

      try {
        setDataLoading(true);
        const [statsRes, missionRes] = await Promise.all([
          fetch(`${URL}/api/dashboard/stats`, { credentials: "include" }),
          fetch(`${URL}/api/mission/${user.id}`, { credentials: "include" }),
        ]);

        // If you see the console log, it means missionRes.ok was likely true
        if (statsRes.ok && missionRes.ok) {
          const statsData = await statsRes.json();
          const missions = await missionRes.json();

          const parsedMissions = Array.isArray(missions)
            ? missions.map((m) => ({
                ...m,
                objectif:
                  typeof m.objectif === "string"
                    ? JSON.parse(m.objectif)
                    : m.objectif,
              }))
            : [];

          setActiveMission(parsedMissions[0] || null);
          setStats({
            TotalMission: statsData.TotalMission || 0,
            TotalForm: statsData.TotalForm || 0,
          });
          setActiveMission(Array.isArray(missions) ? missions[0] : missions);

          // ADD THIS LINE HERE to be safe, though finally should catch it
          setDataLoading(false);
        } else {
          // If one fails, we still need to stop the spinner
          console.error("One of the requests failed");
          setDataLoading(false);
        }
      } catch (e) {
        console.error("Erreur fetch dashboard:", e);
        setDataLoading(false); // Ensure loading stops on network error
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-muted-foreground font-medium italic">
        Vérification de l'identité...
      </div>
    );
  }
  if (!user) return null;
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-muted-foreground animate-pulse font-medium">
        Initialisation du tableau de bord...
      </div>
    );
  }
  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 italic">
          Tableau de Bord
        </h1>
        <p className="text-muted-foreground">
          Ravi de vous revoir,{" "}
          <span className="font-semibold text-primary">{user?.username}</span>.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-gradient-to-br from-white to-blue-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100/50 text-blue-700 border-none text-[10px]"
              >
                TOTAL
              </Badge>
            </div>
            <div className="text-3xl font-black text-gray-900">
              {stats.TotalMission}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium italic">
              Missions assignées
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ClipboardCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <Badge
                variant="secondary"
                className="bg-emerald-100/50 text-emerald-700 border-none text-[10px]"
              >
                COMPLÉTÉ
              </Badge>
            </div>
            <div className="text-3xl font-black text-gray-900">
              {stats.TotalForm}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium italic">
              Fiches envoyés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Mission Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <div className="w-2 h-6 bg-primary rounded-full" />
          Mission en cours
        </h2>

        {activeMission ? (
          <Card
            className="border-none shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 transition hover:shadow-2xl cursor-pointer group hover:scale-[1.01]"
            onClick={() => navigate("/Form")}
          >
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {activeMission.objectif?.name}
                </h3>

                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0 text-sm md:text-md text-gray-500 italic mt-1">
                  <span>
                    {activeMission.region} — {activeMission.wilaya}
                  </span>

                  <span className="hidden md:inline mx-2 text-gray-300">|</span>

                  <span className="text-primary/80 font-medium md:font-normal">
                    Client à visiter : {activeMission.clientAVisite}
                  </span>
                </div>
              </div>
              <Badge className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border-emerald-200">
                En cours
              </Badge>
            </div>

            <CardContent className="p-6 flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateInfo
                  icon={CalendarDays}
                  label="Début"
                  value={activeMission.date_deb}
                  colorClass="bg-blue-50 text-blue-600"
                />
                <DateInfo
                  icon={Clock}
                  label="Fin"
                  value={activeMission.date_fin}
                  colorClass="bg-orange-50 text-orange-600"
                />
              </div>

              <div className="md:w-64 flex flex-col justify-center">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Prêt pour la visite ?
                </p>
                <button
                  onClick={() => (window.location.href = "/Form")}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Remplir la fiche
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2 border-gray-200 bg-transparent shadow-none">
            <CardContent className="p-16 text-center flex flex-col items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-bold text-lg italic">
                Aucune mission pour le moment
              </p>
              <p className="text-sm text-gray-500">
                Vos nouvelles missions apparaîtront ici dès qu'elles seront
                assignées.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
