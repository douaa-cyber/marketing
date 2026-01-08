"use client";

import React, { useEffect, useState, useContext } from "react";
import {
  ClipboardCheck,
  TrendingUp,
  LayoutDashboard,
  ArrowRight,
  AlertCircle,
  CalendarDays,
  Clock,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { URL } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// --- UTILITAIRES ---

const getStatusColor = (status) => {
  const s = status?.toLowerCase() || "";
  if (s.includes("active") || s.includes("cours"))
    return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200";
  if (s.includes("attente"))
    return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200";
  if (s.includes("termin"))
    return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

// Fonction de formatage robuste pour éviter les erreurs d'affichage
const formatDate = (dateValue) => {
  if (!dateValue) return "Non définie";
  const date = new Date(dateValue);

  // Si la date est invalide, on essaie de nettoyer la chaîne (cas SQL)
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
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ missionCount: 0, formsCount: 0 });
  const [activeMission, setActiveMission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [missionRes] = await Promise.all([
          fetch(`${URL}/api/mission/${user.id}`, { credentials: "include" }),
        ]);

        const missions = await missionRes.json();
        const missionData = Array.isArray(missions) ? missions[0] : missions;

        console.log("Mission récupérée:", missionData);

        setStats({ missionCount: 5, formsCount: 120 });
        setActiveMission(missionData || null);
      } catch (e) {
        console.error("Erreur fetch:", e);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchData();
  }, [user?.id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-muted-foreground animate-pulse">
        Chargement du tableau de bord...
      </div>
    );

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
              {stats.missionCount}
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
              {stats.formsCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium italic">
              Rapports envoyés
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
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 transition hover:shadow-2xl">
            {/* Header de mission */}
            <div className=" px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {activeMission.Objectif}
              </h3>
              <Badge
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200`}
              >
                {"En cours"}
              </Badge>
            </div>

            {/* Corps de la mission */}
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 md:gap-12">
              {/* Dates et infos */}
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

              {/* Call to action */}
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
