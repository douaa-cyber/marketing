import React from "react";
import { MapPin, Package, History, Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const TauxRuptureClient = ({ client }) => {
  // Calcul de la couleur selon le taux de disponibilité
  const getRateColor = (rate) => {
    if (rate === 0) return "bg-slate-100 text-slate-400 border-slate-200"; // Pas de données
    if (rate < 50) return "bg-red-50 text-red-600 border-red-100"; // Rupture critique
    if (rate < 85) return "bg-amber-50 text-amber-600 border-amber-100"; // Attention
    return "bg-emerald-50 text-emerald-600 border-emerald-100"; // Bon stock
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      {/* 1. HEADER : Client & Localisation */}
      <div className="p-6 border-b border-slate-50 bg-gradient-to-br from-white to-slate-50/30">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-tight">
              {client.clientName}
            </h3>
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin size={14} className="text-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {client.region} — {client.wilaya}
              </span>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="rounded-full bg-indigo-50 text-indigo-700 border-none px-3"
          >
            {client.visites.length} Visites
          </Badge>
        </div>
      </div>

      <div className="px-4  py-1 bg-slate-50/50">
        <div className="flex items-center gap-2 px-2 mb-3">
          <History size={12} className="text-slate-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Historique par famille
          </span>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {client.famillesMoyennes.map((famille, fIdx) => (
            <AccordionItem
              key={fIdx}
              value={`famille-${client.clientName}-${fIdx}`}
              className="border border-slate-200 bg-white rounded-2xl px-4 overflow-hidden border-none shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline py-4 outline-none">
                <div className="flex justify-between items-center w-full pr-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-indigo-500 transition-colors">
                      <Package size={16} />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">
                      {famille.nom}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${getRateColor(famille.taux)}`}
                    >
                      {famille.taux}%
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-4 pt-0">
                <div className="space-y-2 mt-2">
                  {client.visites.map((visite, vIdx) => {
                    // CORRECTION ICI : Accès au bon chemin dans le JSON
                    const tauxVisite = visite.scoresFamilles[famille.nom] || 0;

                    return (
                      <div
                        key={vIdx}
                        className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 border border-slate-100"
                      >
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-700">
                            {new Date(visite.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium">
                            Par: {visite.agentName}
                          </span>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-lg text-[10px] font-black border ${getRateColor(tauxVisite)}`}
                        >
                          {tauxVisite}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default TauxRuptureClient;
