import React, { useState } from "react";
import { Loader2, BarChart3, ClipboardCheck } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentQualityDetails from "./AgentQualityDetails";
import ActionMarketer from "./ActionMarketingKPI";
import { URL as API_BASE } from "@/api";

const AgentDialogWrapper = ({ agent, dates, children }) => {
  const [qualityData, setQualityData] = useState([]);
  const [marketingData, setMarketingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const [resQ, resM] = await Promise.all([
        fetch(
          `${API_BASE}/api/dashboard/ScoreMarchandising?startDate=${dates.start}&endDate=${dates.end}&utilisateur_id=${agent.id}`,
        ),
        fetch(
          `${API_BASE}/api/dashboard/action?startDate=${dates.start}&endDate=${dates.end}&utilisateur_id=${agent.id}`,
        ),
      ]);
      setQualityData(await resQ.json());
      setMarketingData(await resM.json());
    } catch (e) {
      console.error("Erreur détails agent:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => open && fetchDetails()}>
      <DialogTrigger asChild>
        <div className="cursor-pointer outline-none">{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden rounded-2xl border-none shadow-2xl z-[100]">
        <div className="bg-white p-6 border-b">
          <h2 className="text-xl font-bold text-slate-900">{agent.fullname}</h2>
          <p className="text-slate-500 text-sm">
            Analyse terrain du {dates.start} au {dates.end}
          </p>
        </div>
        <div className="bg-slate-50 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="qualite">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-200/50 p-1 rounded-xl">
              <TabsTrigger
                value="qualite"
                className="rounded-lg data-[state=active]:bg-white shadow-sm py-2"
              >
                <BarChart3 size={16} className="mr-2" /> Merchandising
              </TabsTrigger>
              <TabsTrigger
                value="marketing"
                className="rounded-lg data-[state=active]:bg-white shadow-sm py-2"
              >
                <ClipboardCheck size={16} className="mr-2" /> Marketing
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
              </div>
            ) : (
              <>
                <TabsContent value="qualite" className="outline-none">
                  <AgentQualityDetails data={qualityData} />
                </TabsContent>
                <TabsContent value="marketing" className="outline-none">
                  <ActionMarketer data={marketingData} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentDialogWrapper;
