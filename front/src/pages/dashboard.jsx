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
import AgentQualityDetails from "../components/AgentQualityDetails"; // Ton 2ème KPI
import { URL as API_BASE } from "@/api";

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [qualityData, setQualityData] = useState([]); // Pour stocker les scores qualité
  const [loadingQuality, setLoadingQuality] = useState(false);
  const [dates, setDates] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  // 1. Fetch KPI 1 : Taux de couverture
  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/dashboard/dashboard?dateDebut=${dates.start}&dateFin=${dates.end}`,
      );
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch KPI 2 : Scores Qualité (appelé au clic sur un agent)
  const fetchAgentQuality = async (agentId) => {
    setLoadingQuality(true);
    setQualityData([]); // Reset précédent
    try {
      const response = await fetch(
        `${API_BASE}/api/dashboard/ScoreMarchandising?startDate=${dates.start}&endDate=${dates.end}&utilisateur_id=${agentId}`,
      );
      if (!response.ok) throw new Error("Erreur qualité");
      const data = await response.json();
      setQualityData(data);
    } catch (error) {
      console.error("Erreur scores qualité:", error);
    } finally {
      setLoadingQuality(false);
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Performance Terrain
          </h1>
          <p className="text-slate-500 text-sm">
            Analyse du{" "}
            <span className="font-semibold text-slate-700">{dates.start}</span>{" "}
            au <span className="font-semibold text-slate-700">{dates.end}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border rounded-xl px-3 py-2 flex-grow lg:flex-grow-0">
            <Calendar size={16} className="text-slate-400" />
            <input
              type="date"
              value={dates.start}
              onChange={(e) => setDates({ ...dates, start: e.target.value })}
              className="bg-transparent border-none text-sm focus:ring-0 outline-none cursor-pointer font-medium"
            />
            <ArrowRight size={14} className="text-slate-300" />
            <input
              type="date"
              value={dates.end}
              onChange={(e) => setDates({ ...dates, end: e.target.value })}
              className="bg-transparent border-none text-sm focus:ring-0 outline-none cursor-pointer font-medium"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl shadow-sm"
            onClick={fetchPerformanceData}
          >
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {/* --- MAIN SECTION --- */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Users size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Top Performeurs
            </h2>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-indigo-600 font-bold p-0">
                Voir tous les agents ({agents.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto rounded-3xl border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-black italic text-slate-800 uppercase tracking-tighter">
                  Classement Complet
                </DialogTitle>
                <div className="relative mt-4">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <Input
                    placeholder="Rechercher un agent..."
                    className="pl-10 h-11 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-3">
                {filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl hover:bg-indigo-50/50 hover:border-indigo-100 transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full shadow-sm ${agent.taux < 85 ? "bg-red-500 ring-4 ring-red-50" : "bg-emerald-500 ring-4 ring-emerald-50"}`}
                      />
                      <span className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
                        {agent.fullname}
                      </span>
                    </div>
                    <div className="flex items-center gap-8">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {agent.visitesUniques} / {agent.objectif} pts
                      </span>
                      <span className="font-black text-lg text-slate-900">
                        {agent.taux}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4 opacity-50" />
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
              Synchronisation...
            </p>
          </div>
        ) : agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAgents.slice(0, 3).map((agent) => (
              /* ICI : Chaque carte ouvre le Dialog de Qualité */
              <Dialog
                key={agent.id}
                onOpenChange={(open) => open && fetchAgentQuality(agent.id)}
              >
                <DialogTrigger asChild>
                  <div className="cursor-pointer group">
                    <TauxCouverture data={agent} />
                  </div>
                </DialogTrigger>

                <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                  {/* Header plus équilibré : Padding réduit de p-10 à p-6 */}
                  <div className="bg-white p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      {agent.fullname}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                      Analyse de la qualité merchandising et exécution terrain.
                    </p>
                  </div>

                  {/* Zone de Contenu : Suppression de l'espace inutile */}
                  <div className="bg-slate-50 p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    {loadingQuality ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-3 opacity-40" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                          Synchronisation...
                        </p>
                      </div>
                    ) : qualityData && qualityData.length > 0 ? (
                      <div className="animate-in fade-in slide-in-from-bottom-1 duration-400">
                        {/* Le composant est maintenant collé au contenu grâce au padding p-6 cohérent */}
                        <AgentQualityDetails data={qualityData} />
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-400 text-sm">
                          Aucun historique disponible pour cette période.
                        </p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
            <p className="text-slate-400 font-medium tracking-tight italic">
              Aucun agent actif pour cette période.
            </p>
          </div>
        )}
      </section>

      {/* Tu pourras décommenter la section discipline terrain critique ici plus tard */}
    </div>
  );
};

export default DashboardPage;
