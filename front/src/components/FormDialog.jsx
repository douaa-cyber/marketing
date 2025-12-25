"use client";

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
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

const categories = ["lampe", "appareillage", "disjoncteur", "accessoire"];

export default function FormDialog({ open, onOpenChange }) {
  const { user, loading: userLoading } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState([]);
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [missions, setMissions] = useState([]);
  const [sourcesList, setSourcesList] = useState([]);

  const [form, setForm] = useState({
    mission_id: null,
    utilisateur_id: null,
    Fullname: "",
    Tel: "",
    nom_magasin: "",
    latitude: "",
    longitude: "",
    algeriaCitiesId: null,
    Activite: "",
    plaques: false,
    espacepub: false,
    packDetaillant: false,
    Image: null,
    cadeaux: [],
    sourceAppro: [],
    evalueBms: 0,
    SatisfactionCli: 0,
    evaluconcurrent: 0,
  });

  const [activeCategory, setActiveCategory] = useState("lampe");
  const [data, setData] = useState({
    lampe: { produits: [], concurrents: [], prodConcurrents: [] },
    appareillage: { produits: [], concurrents: [], prodConcurrents: [] },
    disjoncteur: { produits: [], concurrents: [], prodConcurrents: [] },
    accessoire: { produits: [], concurrents: [], prodConcurrents: [] },
  });

  const [selected, setSelected] = useState({
    lampe: { produits: [], concurrents: [], prodConcurrents: [] },
    appareillage: { produits: [], concurrents: [], prodConcurrents: [] },
    disjoncteur: { produits: [], concurrents: [], prodConcurrents: [] },
    accessoire: { produits: [], concurrents: [], prodConcurrents: [] },
  });

  const [cadeauxList, setCadeauxList] = useState([]);

  // User id
  useEffect(() => {
    if (user) setForm((prev) => ({ ...prev, utilisateur_id: user.id }));
  }, [user]);

  // Fetch cities and cadeaux
  useEffect(() => {
    fetch("http://localhost:3000/api/location/ville", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setCities)
      .catch(() => setCities([]));

    fetch("http://localhost:3000/api/cadeau/all", { credentials: "include" })
      .then((r) => r.json())
      .then(setCadeauxList)
      .catch(() => setCadeauxList([]));
  }, []);

  // Fetch active category data when it changes
  useEffect(() => {
    const fetchCategoryData = async (cat) => {
      try {
        const [produitsRes, concurrentsRes, prodConcurrentsRes] =
          await Promise.all([
            fetch(`http://localhost:3000/api/product/${cat}`, {
              credentials: "include",
            }),
            fetch(`http://localhost:3000/api/concurrent/${cat}`, {
              credentials: "include",
            }),
            fetch(`http://localhost:3000/api/productConcu/${cat}`, {
              credentials: "include",
            }),
          ]);
        const [produits, concurrents, prodConcurrents] = await Promise.all([
          produitsRes.json(),
          concurrentsRes.json(),
          prodConcurrentsRes.json(),
        ]);

        setData((prev) => ({
          ...prev,
          [cat]: { produits, concurrents, prodConcurrents },
        }));
      } catch (err) {
        console.error(`Erreur fetch ${cat}:`, err);
        setData((prev) => ({
          ...prev,
          [cat]: { produits: [], concurrents: [], prodConcurrents: [] },
        }));
      }
    };

    fetchCategoryData(activeCategory);
  }, [activeCategory]);

  // Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) =>
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }))
      );
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/api/sourceAppro/all", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setSourcesList(data))
      .catch(() => setSourcesList([]));
  }, []);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:3000/api/mission/${user.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMissions(data);
        else setMissions([]);
      })
      .catch(() => setMissions([]));
  }, [user]);

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    const payload = { ...form, selections: selected };
    const formData = new FormData();
    Object.keys(payload).forEach((k) => {
      if (k === "Image" && payload.Image)
        formData.append("Image", payload.Image);
      else formData.append(k, JSON.stringify(payload[k]));
    });

    await fetch("http://localhost:3000/api/formulaire", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    setStep(1);
    onOpenChange(false);
  };

  if (userLoading) return <p>Loading...</p>;

  const renderStars = (value, onChange) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`cursor-pointer text-xl ${
            i <= value ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => onChange(i)}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[650px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Formulaire Multi-Step</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-2">
              <select
                className="border rounded p-2 w-full"
                onChange={(e) =>
                  setForm({ ...form, mission_id: Number(e.target.value) })
                }
              >
                <option value="">Selectionner Mission</option>
                {missions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.Objectif}
                  </option>
                ))}
              </select>
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

              {/* Popover Ville */}
              <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {form.algeriaCitiesId
                      ? cities.find((c) => c.id === form.algeriaCitiesId)?.name
                      : "Sélectionner Ville"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 max-h-60 overflow-y-auto">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher ville..."
                      value={citySearch}
                      onValueChange={setCitySearch}
                      className="h-9"
                    />
                    <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                    <CommandGroup>
                      {cities
                        .filter((c) =>
                          c.name
                            .toLowerCase()
                            .includes(citySearch.toLowerCase())
                        )
                        .map((c) => (
                          <CommandItem
                            key={c.id}
                            value={c.name}
                            onSelect={() => {
                              setForm({ ...form, algeriaCitiesId: c.id });
                              setCityPopoverOpen(false);
                              setCitySearch("");
                            }}
                          >
                            {c.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex justify-center gap-6">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className={`flex items-center gap-2 capitalize cursor-pointer ${
                      activeCategory === cat ? "font-bold text-blue-600" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="categorie"
                      checked={activeCategory === cat}
                      onChange={() => setActiveCategory(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>

              <div className="space-y-4">
                {["produits", "concurrents", "prodConcurrents"].map((key) => {
                  const labelMap = {
                    produits: "Produits",
                    concurrents: "Concurrents",
                    prodConcurrents: "Produits concurrents",
                  };

                  return (
                    <div key={key} className="space-y-1">
                      <label className="font-medium">{labelMap[key]}</label>
                      <select
                        multiple
                        className="w-full border rounded p-2"
                        value={selected[activeCategory][key]}
                        onChange={(e) =>
                          setSelected((prev) => ({
                            ...prev,
                            [activeCategory]: {
                              ...prev[activeCategory],
                              [key]: [...e.target.selectedOptions].map(
                                (o) => o.value
                              ),
                            },
                          }))
                        }
                      >
                        {data[activeCategory][key].map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold">Source d'approvisionnement</label>
                <select
                  multiple
                  className="w-full border rounded p-2"
                  value={form.sourceAppro}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sourceAppro: [...e.target.selectedOptions].map((o) =>
                        Number(o.value)
                      ),
                    })
                  }
                >
                  {sourcesList?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ( {""}
                      {s.Surname} {""})
                    </option>
                  ))}
                </select>
              </div>
              <p className="font-bold">Cadeaux :</p>
              {cadeauxList.map((c) => {
                const cadeauSelected = form.cadeaux.find(
                  (item) => item.id === c.id
                );
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={(e) => {
                      if (e.target.tagName === "INPUT") return;

                      const isChecked = !!cadeauSelected;
                      if (!isChecked) {
                        setForm((prev) => ({
                          ...prev,
                          cadeaux: [...prev.cadeaux, { id: c.id, qty: 1 }],
                        }));
                      } else {
                        setForm((prev) => ({
                          ...prev,
                          cadeaux: prev.cadeaux.filter(
                            (item) => item.id !== c.id
                          ),
                        }));
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!cadeauSelected}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          setForm((prev) => ({
                            ...prev,
                            cadeaux: [...prev.cadeaux, { id: c.id, qty: 1 }],
                          }));
                        } else {
                          setForm((prev) => ({
                            ...prev,
                            cadeaux: prev.cadeaux.filter(
                              (item) => item.id !== c.id
                            ),
                          }));
                        }
                      }}
                    />
                    <span>{c.name}</span>
                    {cadeauSelected && (
                      <input
                        type="number"
                        min={1}
                        className="w-16 border rounded p-1"
                        value={cadeauSelected.qty}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            cadeaux: prev.cadeaux.map((item) =>
                              item.id === c.id
                                ? { ...item, qty: Number(e.target.value) }
                                : item
                            ),
                          }))
                        }
                      />
                    )}
                  </div>
                );
              })}

              <select
                multiple
                className="w-full border rounded p-2"
                onChange={(e) =>
                  setForm({
                    ...form,
                    sourceAppro: [...e.target.selectedOptions].map((o) =>
                      Number(o.value)
                    ),
                  })
                }
              >
                {sourcesList?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nom}
                  </option>
                ))}
              </select>

              <div className="flex gap-4">
                {["plaques", "espacepub", "packDetaillant"].map((key) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.checked })
                      }
                    />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                ))}
              </div>

              <div>
                <label className="font-bold">Image : </label> <br />
                <br />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, Image: e.target.files[0] })
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <p>Satisfaction Client :</p>
                {renderStars(form.SatisfactionCli, (val) =>
                  setForm({ ...form, SatisfactionCli: val })
                )}
              </div>
              <div>
                <p>Évaluation BMS :</p>
                {renderStars(form.evalueBms, (val) =>
                  setForm({ ...form, evalueBms: val })
                )}
              </div>
              <div>
                <p>Évaluation Produit Concurrent :</p>
                {renderStars(form.evaluconcurrent, (val) =>
                  setForm({ ...form, evaluconcurrent: val })
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <DialogFooter className="flex justify-between border-t pt-3">
          {step > 1 && (
            <Button variant="outline" onClick={handlePrev}>
              Précédent
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={handleNext}>Suivant</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
