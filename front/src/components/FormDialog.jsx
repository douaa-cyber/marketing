"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormDialog({ open, onOpenChange, missions }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    utilisateur_id: null,
    Fullname: "",
    Tel: "",
    nom_magasin: "",
    longitude: "",
    latitude: "",
    algeriaCitiesId: null,
    Activite: "",
    produitLampeId: null,
    produitAppareillageId: null,
    produitDisjoncteurId: null,
    produitAccessoireId: null,
    concurrentLampeId: null,
    concurrentAppareillageId: null,
    concurrentDisjoncteurId: null,
    ConcurrentProduitAccessoireId: null,
    ConcurrentProduitLampeId: null,
    ConcurrentProduitAppareillageId: null,
    ConcurrentProduitDisjoncteurId: null,
    SourceApproId: null,
    SatisfactionCli: 0,
    evalueBms: 0,
    evaluconcurrent: 0,
    commentaire: "",
    espacepub: "",
    Image: "",
    plaque: "",
    mission_id: null,
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:3000/api/formulaire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    onOpenChange(false); // Fermer le dialogue
    setStep(1);
    setForm({
      utilisateur_id: null,
      Fullname: "",
      Tel: "",
      nom_magasin: "",
      longitude: "",
      latitude: "",
      algeriaCitiesId: null,
      Activite: "",
      produitLampeId: null,
      produitAppareillageId: null,
      produitDisjoncteurId: null,
      produitAccessoireId: null,
      concurrentLampeId: null,
      concurrentAppareillageId: null,
      concurrentDisjoncteurId: null,
      ConcurrentProduitAccessoireId: null,
      ConcurrentProduitLampeId: null,
      ConcurrentProduitAppareillageId: null,
      ConcurrentProduitDisjoncteurId: null,
      SourceApproId: null,
      SatisfactionCli: 0,
      evalueBms: 0,
      evaluconcurrent: 0,
      commentaire: "",
      espacepub: "",
      Image: "",
      plaque: "",
      mission_id: null,
    });
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Création Formulaire</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step 1 : Client & Magasin */}
          {step === 1 && (
            <div className="space-y-2">
              <Input
                placeholder="Fullname"
                value={form.Fullname}
                onChange={(e) => setForm({ ...form, Fullname: e.target.value })}
              />
              <Input
                placeholder="Tel"
                value={form.Tel}
                onChange={(e) => setForm({ ...form, Tel: e.target.value })}
              />
              <Input
                placeholder="Nom Magasin"
                value={form.nom_magasin}
                onChange={(e) =>
                  setForm({ ...form, nom_magasin: e.target.value })
                }
              />
              <Input
                placeholder="Longitude"
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: e.target.value })
                }
              />
              <Input
                placeholder="Latitude"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              />
              <Input
                placeholder="Activité"
                value={form.Activite}
                onChange={(e) => setForm({ ...form, Activite: e.target.value })}
              />
              <Select
                value={form.mission_id}
                onValueChange={(value) =>
                  setForm({ ...form, mission_id: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner Mission" />
                </SelectTrigger>
                <SelectContent>
                  {missions.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.Objectif}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 2 : Produits */}
          {step === 2 && (
            <div className="space-y-2">
              <Input
                placeholder="Produit Lampe ID"
                value={form.produitLampeId || ""}
                onChange={(e) =>
                  setForm({ ...form, produitLampeId: Number(e.target.value) })
                }
              />
              <Input
                placeholder="Produit Appareillage ID"
                value={form.produitAppareillageId || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    produitAppareillageId: Number(e.target.value),
                  })
                }
              />
              <Input
                placeholder="Produit Disjoncteur ID"
                value={form.produitDisjoncteurId || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    produitDisjoncteurId: Number(e.target.value),
                  })
                }
              />
              <Input
                placeholder="Produit Accessoire ID"
                value={form.produitAccessoireId || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    produitAccessoireId: Number(e.target.value),
                  })
                }
              />
              <Input
                placeholder="Concurrent Lampe ID"
                value={form.concurrentLampeId || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    concurrentLampeId: Number(e.target.value),
                  })
                }
              />
              {/* Ajouter les autres concurrents de manière similaire */}
            </div>
          )}

          {/* Step 3 : Évaluation & Commentaire */}
          {step === 3 && (
            <div className="space-y-2">
              <Input
                placeholder="Satisfaction Client"
                type="number"
                value={form.SatisfactionCli}
                onChange={(e) =>
                  setForm({ ...form, SatisfactionCli: Number(e.target.value) })
                }
              />
              <Input
                placeholder="Évaluation BMS"
                type="number"
                value={form.evalueBms}
                onChange={(e) =>
                  setForm({ ...form, evalueBms: Number(e.target.value) })
                }
              />
              <Input
                placeholder="Évaluation Concurrent"
                type="number"
                value={form.evaluconcurrent}
                onChange={(e) =>
                  setForm({ ...form, evaluconcurrent: Number(e.target.value) })
                }
              />
              <Input
                placeholder="Commentaire"
                value={form.commentaire}
                onChange={(e) =>
                  setForm({ ...form, commentaire: e.target.value })
                }
              />
              <Input
                placeholder="Espace Pub"
                value={form.espacepub}
                onChange={(e) =>
                  setForm({ ...form, espacepub: e.target.value })
                }
              />
              <Input
                placeholder="Plaque"
                value={form.plaque}
                onChange={(e) => setForm({ ...form, plaque: e.target.value })}
              />
            </div>
          )}

          {/* Step 4 : Image / Fichier */}
          {step === 4 && (
            <div className="space-y-2">
              <Input
                placeholder="Image URL"
                value={form.Image}
                onChange={(e) => setForm({ ...form, Image: e.target.value })}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handlePrev}>
                Précédent
              </Button>
            )}
          </div>
          <div>
            {step < 4 ? (
              <Button onClick={handleNext}>Suivant</Button>
            ) : (
              <Button onClick={handleSubmit}>Submit</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
