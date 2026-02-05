import React from "react";
import { Progress } from "@/components/ui/progress"; // Si tu utilises Shadcn, sinon une div fera l'affaire
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, AlertCircle } from "lucide-react";

function TauxCouverture({ data }) {
  // data = { fullname, visitesUniques, objectif, taux, status }

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
      bar: "bg-emerald-100",
      icon: <TrendingUp size={18} />,
    };
  };

  const theme = getTheme(data.taux);

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-gray-500">
          {data.fullname}
        </CardTitle>
        <span className={`p-1.5 rounded-full ${theme.bg} ${theme.color}`}>
          {theme.icon}
        </span>
      </CardHeader>

      <CardContent>
        <div className="flex items-baseline space-x-2">
          <h2 className="text-3xl font-bold tracking-tight">{data.taux}%</h2>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${theme.bg} ${theme.color}`}
          >
            {data.status}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Couverture Terrain</span>
            <span>
              {data.visitesUniques} / {data.objectif} clients
            </span>
          </div>
          {/* Barre de progression personnalisée */}
          <div className="w-full bg-gray-100 h-2 rounded-full">
            <div
              className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
              style={{ width: `${Math.min(data.taux, 100)}%` }}
            />
          </div>
        </div>

        {data.taux < 85 && (
          <p className="mt-3 text-[10px] text-red-500 italic font-medium">
            ⚠️ Attention : Problème de discipline détecté sur le secteur.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default TauxCouverture;
