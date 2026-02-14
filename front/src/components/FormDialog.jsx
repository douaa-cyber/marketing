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
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  MapPin,
  ListChecks,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { URL } from "@/api";

const categories = ["lampe", "appareillage", "disjoncteur", "accessoire"];

export default function FormDialog({
  open,
  onOpenChange,
  selectedFormulaire,
  onSuccess,
}) {
  const { user, loading: userLoading } = useContext(AuthContext);
  const [step, setStep] = useState(1);

  const [cities, setCities] = useState([]);
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const [activites, setActivites] = useState([]);
  const [missions, setMissions] = useState([]);
  const [sourcesList, setSourcesList] = useState([]);
  const [sourcePopoverOpen, setSourcePopoverOpen] = useState(false);
  const [sourceSearch, setSourceSearch] = useState("");

  const [cadeauxList, setCadeauxList] = useState([]);
  const [cadeauxOpen, setCadeauxOpen] = useState(false);

  const [criteriaList, setCriteriaList] = useState([]);
  const [actionsList, setActionsList] = useState([]);
  const [errors, setErrors] = useState({});

  const [activeCategory, setActiveCategory] = useState("lampe");

  const [data, setData] = useState({
    lampe: { produits: [], concurrents: [], prodConcurrents: [] },
    appareillage: { produits: [], concurrents: [], prodConcurrents: [] },
    disjoncteur: { produits: [], concurrents: [], prodConcurrents: [] },
    accessoire: { produits: [], concurrents: [], prodConcurrents: [] },
  });

  const initialFormState = {
    mission_id: null,
    utilisateur_id: user?.id || null,
    Fullname: "",
    Tel: "",
    nom_magasin: "",
    latitude: "",
    longitude: "",
    algeriaCitiesId: null,
    ActiviteId: null,
    plaques: false,
    espacepub: false,
    packDetaillant: false,
    Image: null,
    cadeaux: [],
    sourceAppro: [],
    evalueBms: 0,
    SatisfactionCli: 0,
    evaluconcurrent: 0,
    criteres: [],
    actions: [],
    commentaire: "",
  };

  const [form, setForm] = useState(initialFormState);

  const defaultCategoryState = {
    produits: [],
    concurrents: [],
    prodConcurrents: [],
    nbr_article: "",
    nbr_article_commande: "",
  };

  const [selected, setSelected] = useState({
    lampe: { ...defaultCategoryState },
    appareillage: { ...defaultCategoryState },
    disjoncteur: { ...defaultCategoryState },
    accessoire: { ...defaultCategoryState },
  });

  // ----------------- Fetch Data -----------------
  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({ ...prev, utilisateur_id: user.id }));

    // Chargement des données de base
    const fetchBaseData = async () => {
      try {
        const [villes, cadeaux, sources, acts, crit, actions] =
          await Promise.all([
            fetch(`${URL}/api/location/ville`, { credentials: "include" }).then(
              (r) => r.json(),
            ),
            fetch(`${URL}/api/cadeau/all`, { credentials: "include" }).then(
              (r) => r.json(),
            ),
            fetch(`${URL}/api/sourceAppro/all`, {
              credentials: "include",
            }).then((r) => r.json()),
            fetch(`${URL}/api/activite/all`, { credentials: "include" }).then(
              (r) => r.json(),
            ),
            fetch(`${URL}/api/criteria`, { credentials: "include" }).then((r) =>
              r.json(),
            ), // Fetch critères
            fetch(`${URL}/api/action`, { credentials: "include" }).then((r) =>
              r.json(),
            ), // Fetch critères
          ]);
        setCities(villes || []);
        setCadeauxList(cadeaux || []);
        setSourcesList(sources || []);
        setActivites(acts || []);
        setCriteriaList(crit || []);
        setActionsList(actions || []);
      } catch (err) {
        console.error("Erreur lors du chargement des données initiales", err);
      }
    };

    fetchBaseData();

    fetch(`${URL}/api/mission/${user.id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setMissions(Array.isArray(d) ? d : []))
      .catch(() => setMissions([]));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }));
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchCategoryData = async (cat) => {
      try {
        const [produitsRes, concurrentsRes, prodConcurrentsRes] =
          await Promise.all([
            fetch(`${URL}/api/product/${cat}`, { credentials: "include" }),
            fetch(`${URL}/api/concurrent/${cat}`, { credentials: "include" }),
            fetch(`${URL}/api/productConcu/${cat}`, { credentials: "include" }),
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
        console.error(err);
      }
    };
    fetchCategoryData(activeCategory);
  }, [activeCategory]);

  // ----------------- Mapping Edition -----------------
  const mapFormulaireToSelected = (f) => ({
    lampe: {
      produits: f.ProduitLampes?.map((p) => String(p.ID)) || [],
      concurrents: f.ConcurrentLampes?.map((c) => String(c.ID)) || [],
      prodConcurrents: f.ProdConcurrentLampes?.map((pc) => String(pc.ID)) || [],
      nbr_article:
        f.ProduitLampes?.[0]?.Form_ProdLampe?.nbArticle?.toString() || "",
      nbr_article_commande:
        f.ProduitLampes?.[0]?.Form_ProdLampe?.nbArticleCommande?.toString() ||
        "",
    },
    appareillage: {
      produits: f.ProduitAppareillages?.map((p) => String(p.ID)) || [],
      concurrents: f.ConcurrentAppareillages?.map((c) => String(c.ID)) || [],
      prodConcurrents:
        f.ProdConcurrentAppareillages?.map((pc) => String(pc.ID)) || [],
      nbr_article:
        f.ProduitAppareillages?.[0]?.Form_ProdAppareillage?.nbArticle?.toString() ||
        "",
      nbr_article_commande:
        f.ProduitAppareillages?.[0]?.Form_ProdAppareillage?.nbArticleCommande?.toString() ||
        "",
    },
    disjoncteur: {
      produits: f.ProduitDisjoncteurs?.map((p) => String(p.ID)) || [],
      concurrents: f.ConcurrentDisjoncteurs?.map((c) => String(c.ID)) || [],
      prodConcurrents: f.ProdConcurrentDisjs?.map((pc) => String(pc.ID)) || [],
      nbr_article:
        f.ProduitDisjoncteurs?.[0]?.Form_ProdDisj?.nbArticle?.toString() || "",
      nbr_article_commande:
        f.ProduitDisjoncteurs?.[0]?.Form_ProdDisj?.nbArticleCommande?.toString() ||
        "",
    },
    accessoire: {
      produits: f.ProduitAccessoires?.map((p) => String(p.ID)) || [],
      concurrents: f.ConcurrentAccessoires?.map((c) => String(c.ID)) || [],
      prodConcurrents:
        f.ProdConcurrentAccessoires?.map((pc) => String(pc.ID)) || [],
      nbr_article:
        f.ProduitAccessoires?.[0]?.Form_ProdAcc?.nbArticle?.toString() || "",
      nbr_article_commande:
        f.ProduitAccessoires?.[0]?.Form_ProdAcc?.nbArticleCommande?.toString() ||
        "",
    },
  });
  const validateStep1 = () => {
    const newErrors = {};

    if (!form.mission_id) newErrors.mission_id = "La mission est obligatoire";
    if (!form.Fullname.trim())
      newErrors.Fullname = "Le nom du client est obligatoire";
    if (!form.Tel.trim()) newErrors.Tel = "Le téléphone est obligatoire";
    if (!form.latitude.trim()) newErrors.latitude = "Latitude obligatoire";
    if (!form.longitude.trim()) newErrors.longitude = "Longitude obligatoire";
    if (!form.algeriaCitiesId)
      newErrors.algeriaCitiesId = "La ville est obligatoire";
    if (!form.ActiviteId) newErrors.ActiviteId = "L'activité est obligatoire";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep2 = () => {
    const newErrors = {};
    const cat = activeCategory;
    const data = selected[cat];

    if (data.nbr_article === "" || Number(data.nbr_article) < 0) {
      newErrors[`nbr_article_${cat}`] = "Nombre d'articles obligatoire";
    }

    if (
      data.nbr_article_commande === "" ||
      Number(data.nbr_article_commande) < 0
    ) {
      newErrors[`nbr_article_commande_${cat}`] =
        "Nombre d'articles commandés obligatoire";
    }

    if (Number(data.nbr_article_commande) > Number(data.nbr_article)) {
      newErrors[`nbr_article_commande_${cat}`] =
        "La commande ne peut pas dépasser le stock";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep3 = () => {
    const newErrors = {};

    if (!form.sourceAppro || form.sourceAppro.length === 0) {
      newErrors.sourceAppro = "La source d'approvisionnement est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep4 = () => {
    const newErrors = {};

    if (!form.criteres || form.criteres.length === 0) {
      newErrors.criteres = "Vous devez sélectionner au moins un critère";
    }

    if (!form.actions || form.actions.length === 0) {
      newErrors.actions = "Vous devez sélectionner au moins une action";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (selectedFormulaire) {
      setForm({
        ...initialFormState,
        ...selectedFormulaire,
        plaque:
          selectedFormulaire.plaque === "true" ||
          selectedFormulaire.plaque === true,
        espacepub:
          selectedFormulaire.espacepub === "true" ||
          selectedFormulaire.espacepub === true,
        packDetaillant:
          selectedFormulaire.packDetaillant === "true" ||
          selectedFormulaire.packDetaillant === true,

        sourceAppro: selectedFormulaire.SourceAppros?.map((s) => s.ID) || [],
        cadeaux:
          selectedFormulaire.cadeaus?.map((c) => ({
            id: c.ID,
            qty: c.cadeau_form.quantity,
          })) || [],
        criteres: selectedFormulaire.Criteres?.map((c) => c.id) || [],
        actions: selectedFormulaire.ActionMarketings?.map((a) => a.id) || [],
      });
      setSelected(mapFormulaireToSelected(selectedFormulaire));
    } else {
      setForm(initialFormState);
      setSelected({
        lampe: { ...defaultCategoryState },
        appareillage: { ...defaultCategoryState },
        disjoncteur: { ...defaultCategoryState },
        accessoire: { ...defaultCategoryState },
      });
    }
  }, [selectedFormulaire, open]);

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step === 4 && !validateStep4()) return;

    setStep((s) => Math.min(s + 1, 4));
  };

  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  // ----------------- Normalisation pour Backend -----------------
  const normalizeSelections = (sel) => {
    const out = {};

    categories.forEach((cat) => {
      const catData = sel[cat] || defaultCategoryState;

      out[cat] = {
        produits: (catData.produits || []).map((id) => ({
          produitId: Number(id),
        })),
        concurrents: (catData.concurrents || []).map((id) => ({
          concurrentId: Number(id),
        })),
        prodConcurrents: (catData.prodConcurrents || []).map((id) => ({
          prodConcurrentId: Number(id),
        })),

        nbr_article: Number(catData.nbr_article) || 0,
        nbr_article_commande: Number(catData.nbr_article_commande) || 0,
      };
    });

    return out;
  };

  const normalizeCadeaux = (cadeaux) =>
    cadeaux.map((c) => ({ cadeauId: c.id, quantite: Number(c.qty) }));

  const normalizeCriteres = (criteresIds) =>
    criteresIds.map((id) => ({ critereId: Number(id), is_checked: 1 }));

  const normalizeActions = (actionsIds) =>
    actionsIds.map((id) => ({
      actionId: Number(id),
      is_checked: 1,
    }));

  const handleSubmit = async () => {
    const formData = new FormData();

    const payload = {
      ...form,
      selections: normalizeSelections(selected),
      cadeaux: normalizeCadeaux(form.cadeaux),
      criteres: normalizeCriteres(form.criteres),
      actions: normalizeActions(form.actions),
    };

    Object.keys(payload).forEach((key) => {
      if (key === "Image" && payload.Image) {
        formData.append("Image", payload.Image);
      } else {
        formData.append(
          key,
          typeof payload[key] === "object"
            ? JSON.stringify(payload[key])
            : payload[key],
        );
      }
    });

    const url = selectedFormulaire
      ? `${URL}/api/form/${selectedFormulaire.ID}`
      : `${URL}/api/form`;
    const method = selectedFormulaire ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: formData,
      credentials: "include",
    });
    if (res.ok) {
      onSuccess?.();
      setStep(1);
      onOpenChange(false);
    }
  };

  const renderStars = (value, onChange) => (
    <div className="flex gap-2 py-2 justify-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`cursor-pointer text-4xl ${i <= value ? "text-yellow-400" : "text-gray-300"}`}
          onClick={() => onChange(i)}
        >
          ★
        </span>
      ))}
    </div>
  );

  if (userLoading) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden bg-white">
        <DialogHeader className="px-6 py-4 border-b shrink-0 bg-white z-10">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <ListChecks className="w-5 h-5 text-blue-600" />
            {selectedFormulaire ? "Modifier Visite" : "Nouvelle Visite"} ({step}
            /4)
          </DialogTitle>
          <div className="flex w-full gap-2 mt-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${step >= s ? "bg-blue-600" : "bg-gray-100"}`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 bg-slate-50/30">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* STEP 1: Infos Générales */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-sm font-medium">Mission</label>
                    <select
                      className="w-full border rounded-md p-2 bg-white"
                      value={form.mission_id || ""}
                      onChange={(e) =>
                        setForm({ ...form, mission_id: Number(e.target.value) })
                      }
                    >
                      <option value="">Sélectionner Mission</option>
                      {missions.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.Objectif}
                        </option>
                      ))}
                    </select>
                    {errors.mission_id && (
                      <p className="text-red-500 text-sm">
                        {errors.mission_id}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Nom Client</label>
                    <Input
                      value={form.Fullname}
                      onChange={(e) =>
                        setForm({ ...form, Fullname: e.target.value })
                      }
                    />
                    {errors.Fullname && (
                      <p className="text-red-500 text-sm">{errors.Fullname}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Téléphone</label>
                    <Input
                      value={form.Tel}
                      maxLength="10"
                      onChange={(e) =>
                        setForm({ ...form, Tel: e.target.value })
                      }
                    />
                    {errors.Tel && (
                      <p className="text-red-500 text-sm">{errors.Tel}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-sm font-medium">Nom Magasin</label>
                    <Input
                      value={form.nom_magasin}
                      onChange={(e) =>
                        setForm({ ...form, nom_magasin: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Latitude</label>
                    <Input
                      value={form.latitude}
                      onChange={(e) =>
                        setForm({ ...form, latitude: e.target.value })
                      }
                      placeholder="Géo-localisation..."
                    />
                    {errors.latitude && (
                      <p className="text-red-500 text-sm">{errors.latitude}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Longitude</label>
                    <Input
                      value={form.longitude}
                      onChange={(e) =>
                        setForm({ ...form, longitude: e.target.value })
                      }
                      placeholder="Géo-localisation..."
                    />
                    {errors.longitude && (
                      <p className="text-red-500 text-sm">{errors.longitude}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Ville</label>
                    <Popover
                      open={cityPopoverOpen}
                      onOpenChange={setCityPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-white"
                        >
                          {form.algeriaCitiesId
                            ? cities.find((c) => c.id === form.algeriaCitiesId)
                                ?.name
                            : "Choisir ville"}
                          <MapPin className="w-4 h-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Rechercher..."
                            onValueChange={setCitySearch}
                          />
                          <CommandGroup className="max-h-60 overflow-y-auto">
                            {cities
                              .filter((c) =>
                                c.name
                                  .toLowerCase()
                                  .includes(citySearch.toLowerCase()),
                              )
                              .map((c) => (
                                <CommandItem
                                  key={c.id}
                                  onSelect={() => {
                                    setForm({ ...form, algeriaCitiesId: c.id });
                                    setCityPopoverOpen(false);
                                  }}
                                >
                                  {c.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors.algeriaCitiesId && (
                      <p className="text-red-500 text-sm">
                        {errors.algeriaCitiesId}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Activité</label>
                    <select
                      className="w-full border rounded-md p-2 bg-white"
                      value={form.ActiviteId || ""}
                      onChange={(e) =>
                        setForm({ ...form, ActiviteId: Number(e.target.value) })
                      }
                    >
                      <option value="">Sélectionner</option>
                      {activites.map((act) => (
                        <option key={act.ID} value={act.ID}>
                          {act.name}
                        </option>
                      ))}
                    </select>
                    {errors.ActiviteId && (
                      <p className="text-red-500 text-sm">
                        {errors.ActiviteId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Produits et Concurrents */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={activeCategory === cat ? "default" : "outline"}
                      onClick={() => setActiveCategory(cat)}
                      className="capitalize shrink-0"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Nombre d'articles
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={selected[activeCategory].nbr_article}
                      onChange={(e) => {
                        setSelected({
                          ...selected,
                          [activeCategory]: {
                            ...selected[activeCategory],
                            nbr_article: e.target.value,
                          },
                        });

                        setErrors((prev) => ({
                          ...prev,
                          [`nbr_article_${activeCategory}`]: null,
                        }));
                      }}
                      className={
                        errors[`nbr_article_${activeCategory}`]
                          ? "border-red-500"
                          : ""
                      }
                    />

                    {errors[`nbr_article_${activeCategory}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`nbr_article_${activeCategory}`]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Nombre d'articles commandés
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={selected[activeCategory].nbr_article_commande}
                      onChange={(e) => {
                        setSelected({
                          ...selected,
                          [activeCategory]: {
                            ...selected[activeCategory],
                            nbr_article_commande: e.target.value,
                          },
                        });

                        setErrors((prev) => ({
                          ...prev,
                          [`nbr_article_commande_${activeCategory}`]: null,
                        }));
                      }}
                      className={
                        errors[`nbr_article_commande_${activeCategory}`]
                          ? "border-red-500"
                          : ""
                      }
                    />

                    {errors[`nbr_article_commande_${activeCategory}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`nbr_article_commande_${activeCategory}`]}
                      </p>
                    )}
                  </div>
                </div>

                {["produits", "concurrents", "prodConcurrents"].map((key) => (
                  <div key={key} className="space-y-3">
                    <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
                      {key === "produits"
                        ? "Nos Produits"
                        : key === "concurrents"
                          ? "Concurrents"
                          : "Produits Concurrents"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {data[activeCategory][key].map((item) => {
                        const isSelected = selected[activeCategory][
                          key
                        ].includes(String(item.ID));
                        return (
                          <div
                            key={item.ID}
                            onClick={() => {
                              const list = selected[activeCategory][key];
                              const next = isSelected
                                ? list.filter((id) => id !== String(item.ID))
                                : [...list, String(item.ID)];
                              setSelected({
                                ...selected,
                                [activeCategory]: {
                                  ...selected[activeCategory],
                                  [key]: next,
                                },
                              });
                            }}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"}`}
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "bg-blue-600 border-blue-600" : "bg-white"}`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {item.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 3: Marketing et Appro */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-3">
                  <label className="font-bold text-sm text-slate-600">
                    Source d'approvisionnement
                  </label>
                  <Popover
                    open={sourcePopoverOpen}
                    onOpenChange={setSourcePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-white h-auto min-h-[40px] text-left"
                      >
                        <div className="flex flex-wrap gap-1">
                          {form.sourceAppro.length > 0 ? (
                            form.sourceAppro.map((id) => (
                              <Badge
                                key={id}
                                variant="secondary"
                                className="font-normal"
                              >
                                {sourcesList.find((s) => s.ID === id)?.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-slate-500">
                              Sélectionner source(s)
                            </span>
                          )}
                        </div>
                        <Search className="w-4 h-4 opacity-50 ml-2 shrink-0" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Rechercher une source..."
                          onValueChange={setSourceSearch}
                        />
                        <CommandEmpty>Aucune source trouvée.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {sourcesList
                            .filter((s) =>
                              s.name
                                .toLowerCase()
                                .includes(sourceSearch.toLowerCase()),
                            )
                            .map((s) => (
                              <CommandItem
                                key={s.ID}
                                onSelect={() => {
                                  const isSelected = form.sourceAppro.includes(
                                    s.ID,
                                  );
                                  setForm({
                                    ...form,
                                    sourceAppro: isSelected
                                      ? form.sourceAppro.filter(
                                          (id) => id !== s.ID,
                                        )
                                      : [...form.sourceAppro, s.ID],
                                  });
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${form.sourceAppro.includes(s.ID) ? "opacity-100" : "opacity-0"}`}
                                />
                                <span className="capitalize">
                                  {s.name} - {s.surname}
                                </span>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.sourceAppro && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sourceAppro}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="font-bold text-sm text-slate-600">
                    Cadeaux & Marketing
                  </label>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-12 bg-white"
                    onClick={() => setCadeauxOpen(true)}
                  >
                    <span>{form.cadeaux.length} cadeau(x) sélectionnés</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {["plaque", "espacepub", "packDetaillant"].map((k) => (
                    <label
                      key={k}
                      className={`flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${form[k] ? "bg-blue-50 border-blue-500" : "bg-white"}`}
                    >
                      <input
                        type="checkbox"
                        checked={form[k]}
                        onChange={(e) =>
                          setForm({ ...form, [k]: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        {k.replace("espacepub", "Pub")}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="border-2 border-dashed rounded-xl p-8 bg-white text-center hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    id="image-up"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({ ...form, Image: e.target.files[0] })
                    }
                  />
                  <label
                    htmlFor="image-up"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-blue-500" />
                    <span className="text-sm font-medium text-slate-600">
                      {form.Image
                        ? form.Image.name
                        : "Cliquez pour uploader une photo"}
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4: Évaluation et Critères */}
            {step === 4 && (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { l: "Satisfaction Client", k: "SatisfactionCli" },
                    { l: "Évaluation BMS", k: "evalueBms" },
                    { l: "Produit Concurrent", k: "evaluconcurrent" },
                  ].map((item) => (
                    <div
                      key={item.k}
                      className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center"
                    >
                      <p className="font-bold text-slate-700 text-sm mb-1">
                        {item.l}
                      </p>
                      {renderStars(form[item.k], (val) =>
                        setForm({ ...form, [item.k]: val }),
                      )}
                    </div>
                  ))}
                </div>

                {/* CHAMP CRITÈRES (DYNAMIQUE) */}
                {/* CRITÈRES D'ÉVALUATION */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-700">
                      Critères d'évaluation
                    </h3>
                    <p className="text-xs text-slate-400">
                      Sélectionnez les points observés chez le client
                    </p>
                  </div>
                  {errors.criteres && (
                    <p className="text-red-500 text-sm">{errors.criteres}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {criteriaList.map((crit) => {
                      const isChecked = form.criteres.includes(crit.id);

                      return (
                        <div
                          key={crit.id}
                          onClick={() => {
                            const next = isChecked
                              ? form.criteres.filter((id) => id !== crit.id)
                              : [...form.criteres, crit.id];
                            setForm({ ...form, criteres: next });
                          }}
                          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all
            ${
              isChecked
                ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50"
            }
          `}
                        >
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center
              ${
                isChecked
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-slate-300"
              }
            `}
                          >
                            {isChecked && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>

                          <span className="text-sm font-medium">
                            {crit.nom}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* ACTIONS */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-700">
                      Actions à entreprendre
                    </h3>
                    <p className="text-xs text-slate-400">
                      Sélectionnez les actions recommandées
                    </p>
                  </div>
                  {errors.actions && (
                    <p className="text-red-500 text-sm">{errors.actions}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {actionsList.map((action) => {
                      const isChecked = form.actions.includes(action.id);

                      return (
                        <div
                          key={action.id}
                          onClick={() => {
                            const next = isChecked
                              ? form.actions.filter((id) => id !== action.id)
                              : [...form.actions, action.id];

                            setForm({ ...form, actions: next });
                          }}
                          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all
            ${
              isChecked
                ? "bg-green-50 border-green-500 text-green-700 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:border-green-300 hover:bg-slate-50"
            }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center
              ${
                isChecked
                  ? "bg-green-600 border-green-600"
                  : "bg-white border-slate-300"
              }`}
                          >
                            {isChecked && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>

                          <span className="text-sm font-medium">
                            {action.nom}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">
                    Commentaires ou observations
                  </label>
                  <textarea
                    className="w-full min-h-[120px] p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm shadow-sm"
                    placeholder="Rédigez vos remarques ici..."
                    value={form.commentaire}
                    onChange={(e) =>
                      setForm({ ...form, commentaire: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-white shrink-0 flex flex-row items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={step === 1}
            className={step === 1 ? "invisible" : "flex items-center"}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Précédent
          </Button>
          {step < 4 ? (
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 px-10 shadow-md text-white"
            >
              Suivant <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 px-10 shadow-md text-white"
            >
              Valider
            </Button>
          )}
        </DialogFooter>

        {/* MODAL CADEAUX */}
        <Dialog open={cadeauxOpen} onOpenChange={setCadeauxOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sélectionner Cadeaux</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto p-1">
              {cadeauxList.map((c) => {
                const sel = form.cadeaux.find((i) => i.id === c.ID);
                return (
                  <div
                    key={c.ID}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!sel}
                        onChange={() => {
                          setForm((p) => ({
                            ...p,
                            cadeaux: sel
                              ? p.cadeaux.filter((i) => i.id !== c.ID)
                              : [...p.cadeaux, { id: c.ID, qty: 1 }],
                          }));
                        }}
                      />
                      <span className="text-sm font-medium">{c.name}</span>
                    </div>
                    {sel && (
                      <Input
                        type="number"
                        className="w-20 h-8"
                        min="1"
                        value={sel.qty}
                        onChange={(e) => {
                          setForm((p) => ({
                            ...p,
                            cadeaux: p.cadeaux.map((i) =>
                              i.id === c.ID
                                ? { ...i, qty: Number(e.target.value) }
                                : i,
                            ),
                          }));
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => setCadeauxOpen(false)}
            >
              Terminer
            </Button>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
