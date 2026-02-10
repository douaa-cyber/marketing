import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Star,
  ChevronRight,
} from "lucide-react";

function TauxCouverture({ data }) {
  // data = { fullname, visitesUniques, objectif, taux, status, scoreMoyenGlobal, statutGlobal }

  const getTheme = (taux) => {
    if (taux < 85)
      return {
        color: "text-red-600",
        bg: "bg-red-50",
        bar: "bg-red-500",
        icon: <AlertCircle size={18} />,
      };
    if (taux <= 95)
      return {
        color: "text-amber-600",
        bg: "bg-amber-50",
        bar: "bg-amber-500",
        icon: <TrendingDown size={18} />,
      };
    return {
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      bar: "bg-emerald-500", // Un peu plus foncé pour la visibilité
      icon: <TrendingUp size={18} />,
    };
  };

  const theme = getTheme(data.taux);

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-gray-500">
          {data.fullname}
        </CardTitle>
        <span className={`p-1.5 rounded-full ${theme.bg} ${theme.color}`}>
          {theme.icon}
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* --- KPI 1: COUVERTURE --- */}
        <div>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-3xl font-bold tracking-tight">{data.taux}%</h2>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${theme.bg} ${theme.color}`}
            >
              {data.status}
            </span>
          </div>

          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Couverture Terrain</span>
              <span>
                {data.visitesUniques} / {data.objectif} clients
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full">
              <div
                className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                style={{ width: `${Math.min(data.taux, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* --- KPI 2: QUALITÉ (NOUVEAU) --- */}
        {/* --- SECTION QUALITÉ : Coloration au Hover --- */}
        <div className="pt-3 border-t border-gray-100 mt-2">
          <div className="flex items-center justify-between p-2 rounded-lg transition-colors duration-300 group-hover:bg-indigo-50/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-50 rounded-md text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-all">
                <Star size={14} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold leading-none group-hover:text-indigo-400">
                  Qualité Marketeur
                </span>
                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-900">
                  Détails par client
                </span>
              </div>
            </div>
            <ChevronRight
              size={16}
              className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
            />
          </div>
        </div>

        {data.taux < 85 && (
          <p className="mt-1 text-[10px] text-red-500 italic font-medium flex items-center gap-1">
            <AlertCircle size={10} /> Problème de discipline détecté.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default TauxCouverture;
