import React from "react";
import {
  Store,
  ChevronDown,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ActionMarketingKPI = ({ data }) => {
  if (!data || data.length === 0)
    return <p className="text-center py-10 text-slate-400">Aucune donnée.</p>;

  return (
    <Accordion type="single" collapsible className="w-full space-y-3 mt-4">
      {data.map((client, idx) => (
        <AccordionItem
          key={idx}
          value={`item-${idx}`}
          className="border border-slate-100 bg-white rounded-2xl px-4 overflow-hidden shadow-sm"
        >
          {/* --- NIVEAU 2 : NOM DU CLIENT + SCORE GLOBAL --- */}
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex justify-between items-center w-full text-left pr-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Store size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-none">
                    {client.clientName}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    {client.nombreTotalVisites} visites au total
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span
                    className="text-lg font-black"
                    style={{ color: client.couleurGlobal }}
                  >
                    {client.scoreMoyenGlobal}/10
                  </span>
                  <p
                    className="text-[9px] font-bold uppercase opacity-70"
                    style={{ color: client.couleurGlobal }}
                  >
                    {client.statutGlobal}
                  </p>
                </div>
              </div>
            </div>
          </AccordionTrigger>

          {/* --- NIVEAU 3 : DÉTAILS DES VISITES (ACCORDÉON) --- */}
          <AccordionContent className="pt-0 pb-4">
            <div className="border-t border-slate-50 mt-2 pt-4 space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Historique des passages
              </p>

              {client.historiqueVisites &&
                client.historiqueVisites.map((visite, vIdx) => (
                  <div
                    key={vIdx}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-white shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarDays size={14} className="text-slate-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          {new Date(visite.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Évaluation de terrain
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-col text-right">
                          <span className="text-xs font-black text-slate-900">
                            {visite.scoreVisite}/10
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium">
                            Score Visite
                          </span>
                        </div>
                        {visite.scoreVisite >= 7 ? (
                          <CheckCircle2
                            size={16}
                            className="text-emerald-500"
                          />
                        ) : (
                          <AlertTriangle size={16} className="text-amber-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ActionMarketingKPI;
