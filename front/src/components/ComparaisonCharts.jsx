import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ComparisonChart = ({ qualityData = [], marketingData = [] }) => {
  const mergedData = qualityData.map((q) => {
    const m = marketingData.find((item) => item.clientName === q.clientName);
    return {
      name: q.clientName || "Inconnu",
      merchandising: q.scoreMoyenGlobal || 0,
      marketing: m ? m.scoreMoyenGlobal : 0,
    };
  });

  if (mergedData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl border border-dashed">
        <p className="text-slate-400 text-sm">Aucune donnée disponible.</p>
      </div>
    );
  }

  return (
    // On utilise h-full et flex-col pour occuper tout l'espace du parent
    <div className="h-full flex flex-col">
      <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
        Score Merchandising et Action Marketing (Score /10)
      </h3>

      {/* flex-1 dit à cette div de prendre TOUT l'espace restant sans dépasser */}
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mergedData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748B", fontSize: 10 }}
              angle={-20}
              textAnchor="end"
              interval={0}
              height={50} // On fixe la hauteur de l'axe pour éviter qu'il ne pousse le graphe dehors
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fill: "#64748B", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconSize={10}
              wrapperStyle={{ paddingBottom: "10px", fontSize: "11px" }}
            />
            <Bar
              name="Score Marchandising"
              dataKey="merchandising"
              fill="#6366F1"
              radius={[4, 4, 0, 0]}
              barSize={15}
            />
            <Bar
              name="Action Marketing"
              dataKey="marketing"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              barSize={15}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;
