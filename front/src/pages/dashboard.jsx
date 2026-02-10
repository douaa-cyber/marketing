import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Calendar,
  Users,
  Filter,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TauxCouverture from "../components/TauxCouverture";
import { URL as API_BASE } from "@/api";
const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [dates, setDates] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      // 1. Construire l'URL avec les query params directement
      // On utilise l'import URL (ton api) et on ajoute les paramètres
      const response = await fetch(
        `${API_BASE}/api/dashboard/dashboard?dateDebut=${dates.start}&dateFin=${dates.end}`,
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, [dates.start, dates.end]);

  const sortedAgents = useMemo(
    () => [...agents].sort((a, b) => b.taux - a.taux),
    [agents],
  );

  const filteredAgents = sortedAgents.filter((a) =>
    a.fullname.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Performance Terrain
          </h1>
          <p className="text-slate-500 text-sm">
            Analyse du {dates.start} au {dates.end}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-2 flex-grow lg:flex-grow-0">
            <Calendar size={16} className="text-slate-400" />
            <input
              type="date"
              value={dates.start}
              onChange={(e) => setDates({ ...dates, start: e.target.value })}
              className="bg-transparent border-none text-sm focus:ring-0 outline-none cursor-pointer"
            />
            <ArrowRight size={14} className="text-slate-300" />
            <input
              type="date"
              value={dates.end}
              onChange={(e) => setDates({ ...dates, end: e.target.value })}
              className="bg-transparent border-none text-sm focus:ring-0 outline-none cursor-pointer"
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchPerformanceData}>
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {/* --- MAIN SECTION --- */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Users size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              Top Performeurs
            </h2>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="text-indigo-600 font-semibold p-0"
              >
                Voir tous les agents ({agents.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Classement Complet</DialogTitle>
                <div className="relative mt-4">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                {filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${agent.taux < 85 ? "bg-red-500" : "bg-emerald-500"}`}
                      />
                      <span className="font-medium text-sm">
                        {agent.fullname}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xs text-slate-500">
                        {agent.visitesUniques} / {agent.objectif}
                      </span>
                      <span className="font-bold text-sm">{agent.taux}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-slate-500 text-sm font-medium">
              Mise à jour des données...
            </p>
          </div>
        ) : agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedAgents.slice(0, 3).map((agent) => (
              <TauxCouverture key={agent.id} data={agent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
            <p className="text-slate-400">Aucun résultat pour cette période.</p>
          </div>
        )}
      </section>

      {/*  {!loading && sortedAgents.filter((a) => a.taux < 85).length > 0 && (
        <section className="bg-red-50/50 p-6 rounded-2xl border border-red-100 space-y-4">
          <h2 className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
            Discipline Terrain Critique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedAgents
              .filter((a) => a.taux < 85)
              .slice(0, 4)
              .map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white p-3 rounded-xl border border-red-200 flex flex-col shadow-sm"
                >
                  <span className="text-sm font-bold text-slate-800">
                    {agent.fullname}
                  </span>
                  <span className="text-xs text-red-600 font-bold">
                    {agent.taux}% de couverture
                  </span>
                </div>
              ))}
          </div>
        </section>
      )} */}
    </div>
  );
};

export default DashboardPage;
