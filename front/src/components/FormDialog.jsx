"use client";

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext"; // adapte le chemin
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
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";

export default function FormDialog({ open, onOpenChange, missions }) {
  const { user, loading: userLoading } = useContext(AuthContext);
  const [cities, setCities] = useState([]);
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    mission_id: null,
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
    concurrentLampeId: null,
    SatisfactionCli: 0,
    evalueBms: 0,
    evaluconcurrent: 0,
    commentaire: "",
    Image: "",
    plaques: "",
    cadeaux: [],
  });

  // Mettre utilisateur_id quand user est chargé
  useEffect(() => {
    if (user) setForm((prev) => ({ ...prev, utilisateur_id: user.id }));
  }, [user]);

  // Récupérer liste des villes
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/algeriaCities", {
          credentials: "include",
        });
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error(err);
        setCities([]);
      }
    };
    fetchCities();
  }, []);

  // Récupérer position actuelle
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }));
        },
        (err) => console.error("Erreur géolocalisation:", err)
      );
    }
  }, []);

  const handleNext = () => step < 5 && setStep(step + 1);
  const handlePrev = () => step > 1 && setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/formulaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      const form_id = data.id;

      if (form.cadeaux.length > 0) {
        await fetch("http://localhost:3000/api/cadeau_forms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ form_id, cadeaux: form.cadeaux }),
        });
      }

      // reset
      setForm((prev) => ({
        ...prev,
        mission_id: null,
        Fullname: "",
        Tel: "",
        nom_magasin: "",
        longitude: "",
        latitude: "",
        algeriaCitiesId: null,
        Activite: "",
        produitLampeId: null,
        produitAppareillageId: null,
        concurrentLampeId: null,
        SatisfactionCli: 0,
        evalueBms: 0,
        evaluconcurrent: 0,
        commentaire: "",
        Image: "",
        plaques: "",
        cadeaux: [],
      }));
      setStep(1);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (userLoading) return <p>Loading user...</p>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Formulaire Multi-Step</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step 1 : Client / Magasin / Ville / Mission */}
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
              <Input placeholder="Longitude" value={form.longitude} readOnly />
              <Input placeholder="Latitude" value={form.latitude} readOnly />
              <Input
                placeholder="Activité"
                value={form.Activite}
                onChange={(e) => setForm({ ...form, Activite: e.target.value })}
              />

              {/* Popover villes */}
              <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {form.algeriaCitiesId
                      ? `${
                          cities.find((c) => c.id === form.algeriaCitiesId)
                            ?.Commune
                        } - ${
                          cities.find((c) => c.id === form.algeriaCitiesId)
                            ?.Daira
                        }`
                      : "Sélectionner Ville"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher ville..." />
                    <CommandEmpty>Aucune ville trouvée</CommandEmpty>
                    <CommandGroup>
                      {cities.map((c) => (
                        <CommandItem
                          key={c.id}
                          onSelect={() => {
                            setForm({ ...form, algeriaCitiesId: c.id });
                            setCityPopoverOpen(false);
                          }}
                        >
                          {c.Commune} - {c.Daira} ({c.wilaya})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Missions filtrées par agent connecté */}
              <select
                className="border p-2 rounded w-full"
                value={form.mission_id || ""}
                onChange={(e) =>
                  setForm({ ...form, mission_id: Number(e.target.value) })
                }
              >
                <option value="">Sélectionner Mission</option>
                {user &&
                  missions
                    .filter(
                      (m) => m.agent_id === user.id && m.status === "ENCOURS"
                    )
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.Objectif}
                      </option>
                    ))}
              </select>
            </div>
          )}

          {/* Step 2 - 5: Produits / Concurrents / Évaluation / Image */}
          {/* ... ton code existant pour les autres steps ... */}
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
            {step < 5 ? (
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
