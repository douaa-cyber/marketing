import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Calendar,
  Users,
  ArrowRight,
  Loader2,
  Package,
  ClipboardCheck,
  BarChart3,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComparisonChart from "@/components/ComparaisonCharts";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import TauxCouverture from "../components/TauxCouverture";
import StockRuptureCard from "../components/TauxRupureClient";
import AgentDialogWrapper from "../components/AgentCodeWrapper"; // L'import du wrapper
import { URL as API_BASE } from "@/api";

const DashboardPage = () => {
  const [view, setView] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [ruptureSearch, setRuptureSearch] = useState("");

  const [agents, setAgents] = useState([]);
  const [ruptureData, setRuptureData] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [qualityData, setQualityData] = useState([]);
  const [marketingData, setMarketingData] = useState([]);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  const [dates, setDates] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!selectedAgent) return;

    const fetchComparison = async () => {
      setComparisonLoading(true);
      try {
        const fetchOptions = {
          credentials: "include",
        };
        const [resQ, resM] = await Promise.all([
          fetch(
            `${API_BASE}/api/dashboard/ScoreMarchandising?startDate=${dates.start}&endDate=${dates.end}&utilisateur_id=${selectedAgent}`,
            fetchOptions,
          ),
          fetch(
            `${API_BASE}/api/dashboard/action?startDate=${dates.start}&endDate=${dates.end}&utilisateur_id=${selectedAgent}`,
            fetchOptions,
          ),
        ]);

        setQualityData(await resQ.json());
        setMarketingData(await resM.json());
      } catch (e) {
        console.error("Erreur comparaison:", e);
      } finally {
        setComparisonLoading(false);
      }
    };

    fetchComparison();
  }, [selectedAgent, dates]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchOptions = {
        credentials: "include",
      };
      const [resA, resR] = await Promise.all([
        fetch(
          `${API_BASE}/api/dashboard/dashboard?dateDebut=${dates.start}&dateFin=${dates.end}`,
          fetchOptions,
        ),
        fetch(
          `${API_BASE}/api/dashboard/TauxRupture?startDate=${dates.start}&endDate=${dates.end}`,
          fetchOptions,
        ),
      ]);
      setAgents(await resA.json());
      setRuptureData(await resR.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dates.start, dates.end]);

  const sortedAgents = useMemo(
    () => [...agents].sort((a, b) => b.taux - a.taux),
    [agents],
  );
  const filteredAgents = sortedAgents.filter((a) =>
    a.fullname.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const filteredRuptures = ruptureData.filter(
    (item) =>
      item.nom_client?.toLowerCase().includes(ruptureSearch.toLowerCase()) ||
      item.wilaya?.toLowerCase().includes(ruptureSearch.toLowerCase()),
  );

  if (view === "all-agents") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
          <Button
            onClick={() => setView("dashboard")}
            variant="ghost"
            className="gap-2"
          >
            <ChevronLeft size={20} /> Retour
          </Button>
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Rechercher..."
              className="pl-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => (
            <AgentDialogWrapper key={agent.id} agent={agent} dates={dates}>
              <div className="transition-transform hover:scale-[1.02]">
                <TauxCouverture data={agent} />
              </div>
            </AgentDialogWrapper>
          ))}
        </div>
      </div>
    );
  }
  if (view === "all-ruptures") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
          <Button
            onClick={() => setView("dashboard")}
            variant="ghost"
            className="gap-2"
          >
            <ChevronLeft size={20} /> Retour
          </Button>

          {/* SEARCH */}
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Rechercher par client ou wilaya..."
              className="pl-10 rounded-xl"
              value={ruptureSearch}
              onChange={(e) => setRuptureSearch(e.target.value)}
            />
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRuptures.length > 0 ? (
            filteredRuptures.map((client, i) => (
              <StockRuptureCard key={i} client={client} />
            ))
          ) : (
            <div className="col-span-3 text-center text-slate-400 py-20">
              Aucun résultat trouvé
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
        <h1 className="text-2xl font-bold">Performance Terrain</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border rounded-xl px-3 py-2">
            <input
              type="date"
              value={dates.start}
              onChange={(e) => setDates({ ...dates, start: e.target.value })}
              className="bg-transparent text-sm outline-none"
            />
            <ArrowRight size={14} className="text-slate-300" />
            <input
              type="date"
              value={dates.end}
              onChange={(e) => setDates({ ...dates, end: e.target.value })}
              className="bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* GRAPHIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-2xl border shadow-sm h-[400px] flex flex-col">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-600" /> Couverture
            Terrain %
          </h2>

          {/* Container graphique */}
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedAgents.slice(0, 10)}
                margin={{ top: 20, right: 20, left: -10, bottom: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="fullname"
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(99,102,241,0.05)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                  }}
                />
                <Bar
                  dataKey="taux"
                  radius={[8, 8, 0, 0]}
                  barSize={32}
                  animationDuration={800}
                >
                  {sortedAgents.slice(0, 10).map((e, i) => (
                    <Cell
                      key={i}
                      fill={
                        e.taux >= 85
                          ? "#10B981"
                          : e.taux >= 60
                            ? "#6366F1"
                            : "#EF4444"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Légende */}
          <div className="flex justify-center gap-6 mt-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-500 rounded-sm"></span>
              <span className="text-sm text-slate-600">Indiscipliné</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-500 rounded-sm"></span>
              <span className="text-sm text-slate-600">Très bon</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-500 rounded-sm"></span>
              <span className="text-sm text-slate-600">Acceptable</span>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border shadow-sm h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ClipboardCheck size={20} className="text-emerald-600" />
              Analyse
            </h2>
            {/* SELECT */}
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sélectionner un agent</option>
              {sortedAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.fullname}
                </option>
              ))}
            </select>
          </div>

          {/* Correction ici : On s'assure que ce conteneur prend toute la place restante et cache le surplus */}
          <div className="flex-1 w-full min-h-0 relative overflow-hidden">
            {!selectedAgent ? (
              <div className="h-full flex items-center justify-center border-2 border-dashed rounded-xl text-slate-400">
                <p>Veuillez sélectionner un agent pour voir l’analyse.</p>
              </div>
            ) : comparisonLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={30} />
              </div>
            ) : (
              /* Ce composant ComparisonChart DOIT contenir un ResponsiveContainer à l'intérieur */
              <ComparisonChart
                qualityData={qualityData}
                marketingData={marketingData}
              />
            )}
          </div>
        </section>
      </div>

      {/* TOP AGENTS */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Users className="text-indigo-600" size={20} /> Top 3 Performeurs
          </h2>
          <Button
            onClick={() => setView("all-agents")}
            variant="link"
            className="text-indigo-600 font-bold p-0"
          >
            Tout voir
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedAgents.slice(0, 3).map((agent) => (
            <AgentDialogWrapper key={agent.id} agent={agent} dates={dates}>
              <div className="transition-transform hover:scale-[1.02]">
                <TauxCouverture data={agent} />
              </div>
            </AgentDialogWrapper>
          ))}
        </div>
      </section>

      {/* RUPTURES */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Package className="text-emerald-600" size={20} />
            Disponibilité Familles
          </h2>

          <Button
            onClick={() => setView("all-ruptures")}
            variant="link"
            className="text-emerald-600 font-bold p-0"
          >
            Voir tous
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ruptureData.slice(0, 6).map((client, i) => (
            <StockRuptureCard key={i} client={client} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
