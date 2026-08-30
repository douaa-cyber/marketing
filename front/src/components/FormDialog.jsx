"use client";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

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
import { Label } from "./ui/label";

const RequiredLabel = ({ children }) => (
  <Label>
    {children} <span className="text-red-500">*</span>
  </Label>
);
export default function FormDialog({
  open,
  onOpenChange,
  selectedFormulaire,
  onSuccess,
}) {
  const { user, loading: userLoading } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  // Remplacez votre état selected par celui-ci
  const [selected, setSelected] = useState({});
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

  const [activeCategory, setActiveCategory] = useState(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
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

  useEffect(() => {
    if (!user) return;

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
            ),
            fetch(`${URL}/api/action`, { credentials: "include" }).then((r) =>
              r.json(),
            ),
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
  }, [user]);

  // Modifiez le useEffect qui gère le chargement des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${URL}/api/categorie/info`, {
          credentials: "include",
        });
        const data = await res.json();
        setCategories(data);

        // Initialisation dynamique de l'état selected pour chaque catégorie reçue
        const initialSelected = {};
        data.forEach((cat) => {
          initialSelected[cat.ID] = { ...defaultCategoryState };
        });
        setSelected(initialSelected);

        if (data.length > 0) setActiveCategory(data[0].ID);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    if (!cities.length) return; // wait for cities to load
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setForm((prev) => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString(),
      }));

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        );
        const data = await res.json();
        const detectedCity =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.county;
        if (!detectedCity) return;

        const normalize = (str) =>
          str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        const match = cities.find((c) =>
          normalize(detectedCity).includes(normalize(c.name)),
        );

        if (match) {
          setForm((prev) => ({ ...prev, algeriaCitiesId: match.id }));
          toast.success(`Ville détectée automatiquement: ${match.name}`);
        }
      } catch (err) {
        console.error("Reverse geocoding error", err);
      }
    });
  }, [cities]);
  useEffect(() => {
    if (!user) return;
    fetch(`${URL}/api/mission/${user.id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const parsed = Array.isArray(d)
          ? d.map((m) => ({
              ...m,
              objectif:
                typeof m.objectif === "string"
                  ? JSON.parse(m.objectif)
                  : m.objectif,
            }))
          : [];
        setMissions(parsed);
      })
      .catch(() => setMissions([]));
  }, [user]); // <-- run only once after cities loaded // <-- run only once per user
  // ----------------- Fetch Data -----------------
  /*  useEffect(() => {
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
        console.log("sources:", sources);
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
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Save lat/lng
        setForm((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));

        // Reverse Geocode from Nominatim API (free)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          );
          const data = await res.json();

          const detectedCity =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county;

          if (!detectedCity) return;

          console.log("Detected city:", detectedCity);

          // Normalize name for comparison
          const normalize = (str) =>
            str
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");

          // Find match from API cities
          const match = cities.find((c) =>
            normalize(detectedCity).includes(normalize(c.name)),
          );

          if (match) {
            setForm((prev) => ({
              ...prev,
              algeriaCitiesId: match.id,
            }));

            toast.success(`Ville détectée automatiquement: ${match.name}`);
          } else {
            toast.warning(
              `Ville détectée (${detectedCity}) mais non trouvée dans la base.`,
            );
          }
        } catch (err) {
          console.error("Reverse geocoding error", err);
        }
      });
    }
  }, [cities, user]); */

  const currentCategory =
    categories.find((c) => c.ID === activeCategory) || null; // ----------------- Mapping Edition -----------------
  const mapFormulaireToSelected = (f) => {
    const result = {};

    // Initialiser toutes les catégories à vide
    categories.forEach((cat) => {
      result[cat.ID] = { ...defaultCategoryState };
    });

    // Grouper les Produits par categorieId
    (f.Produits || []).forEach((p) => {
      const catId = p.Form_Prod?.categorieId;
      if (!catId || !result[catId]) return;

      if (!result[catId].produits.includes(String(p.ID))) {
        result[catId].produits.push(String(p.ID));
      }

      // nbr_article / commande depuis la jointure
      if (!result[catId].nbr_article) {
        result[catId].nbr_article = p.Form_Prod?.nbArticle?.toString() || "";
      }
      if (!result[catId].nbr_article_commande) {
        result[catId].nbr_article_commande =
          p.Form_Prod?.nbArticleCommande?.toString() || "";
      }
    });

    // Grouper les Concurrents par categorieId
    (f.Concurrents || []).forEach((c) => {
      const catId = c.Form_Concu?.categorieId;
      if (!catId || !result[catId]) return;

      if (!result[catId].concurrents.includes(String(c.ID))) {
        result[catId].concurrents.push(String(c.ID));
      }
    });

    // Grouper les ProdConcurrents par categorieId
    (f.ProdConcurrents || []).forEach((pc) => {
      const catId = pc.Form_ProdConcu?.categorieId;
      if (!catId || !result[catId]) return;

      if (!result[catId].prodConcurrents.includes(String(pc.ID))) {
        result[catId].prodConcurrents.push(String(pc.ID));
      }
    });

    return result;
  };
  useEffect(() => {
    if (!selectedFormulaire || categories.length === 0) return; // ← attendre categories

    setForm({
      ...initialFormState,
      ...selectedFormulaire,
      plaques:
        selectedFormulaire.plaques === "true" ||
        selectedFormulaire.plaques === true,
      espacepub:
        selectedFormulaire.espacepub === "true" ||
        selectedFormulaire.espacepub === true,
      packDetaillant:
        selectedFormulaire.packDetaillant === "true" ||
        selectedFormulaire.packDetaillant === true,
      sourceAppro: selectedFormulaire.SourceAppros?.map((s) => s.ID) || [],
      cadeaux:
        selectedFormulaire.cadeaus?.map((c) => ({
          // vérifier le bon nom de clé
          id: c.ID,
          qty: c.cadeau_form?.quantity || c.cadeau_form?.quantity || 1,
        })) || [],
      criteres: selectedFormulaire.Criteres?.map((c) => c.id) || [],
      actions: selectedFormulaire.ActionMarketings?.map((a) => a.id) || [],
    });

    setSelected(mapFormulaireToSelected(selectedFormulaire));
  }, [selectedFormulaire, open, categories]); // ← ajouter categories ici

  const handleNext = () => {
    setStep((s) => Math.min(s + 1, 4));
  };

  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  // ----------------- Normalisation pour Backend -----------------
  const normalizeSelections = (sel) => {
    const out = {};

    categories.forEach((cat) => {
      const catData = sel[cat.ID] || defaultCategoryState;

      out[cat.ID] = {
        categorieId: cat.ID,
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
  const handleFetchLastVisit = async () => {
    if (!form.Fullname.trim()) return;

    try {
      const res = await fetch(
        `${URL}/api/form/lastVisite/${encodeURIComponent(form.Fullname)}/${encodeURIComponent(form.Tel)}`,
        {
          credentials: "include",
          method: "GET",
        },
      );

      if (res.ok) {
        const lastVisit = await res.json();

        if (lastVisit) {
          toast.info(`Données récupérées pour ${form.Fullname}`);

          setForm((prev) => ({
            ...prev,
            nom_magasin: lastVisit.nom_magasin || prev.nom_magasin,
            algeriaCitiesId: lastVisit.algeriaCitiesId || prev.algeriaCitiesId,
            ActiviteId: lastVisit.ActiviteId || prev.ActiviteId,
            latitude: lastVisit.latitude || prev.latitude,
            longitude: lastVisit.longitude || prev.longitude,

            // Map Booleans (handling potential string "true"/"false" from DB)
            espacepub:
              lastVisit.espacepub === "true" || lastVisit.espacepub === true,
            plaque: lastVisit.plaque === "true" || lastVisit.plaque === true,
            packDetaillant:
              lastVisit.packDetaillant === "true" ||
              lastVisit.packDetaillant === true,

            // Map Arrays for Step 3 & 4
            sourceAppro: lastVisit.SourceAppros?.map((s) => s.ID) || [],
            criteres: lastVisit.Criteres?.map((c) => c.id) || [],
            actions: lastVisit.ActionMarketings?.map((a) => a.id) || [],

            // Map Cadeaux (handling the pivot table quantity)
            cadeaux:
              lastVisit.cadeaus?.map((c) => ({
                id: c.ID,
                qty: c.cadeau_form?.quantity || 0,
              })) || [],

            // Evaluation stars
            SatisfactionCli: lastVisit.SatisfactionCli || 0,
            evalueBms: lastVisit.evalueBms || 0,
            evaluconcurrent: lastVisit.evaluconcurrent || 0,
          }));

          // 2. Update Categories (Lampes, Appareillages, etc.)
          setSelected(mapFormulaireToSelected(lastVisit));
        } else {
          toast.secondary("Aucune visite précédente trouvée pour ce nom.");
        }
      }
    } catch (err) {
      console.error("Erreur récup last visit:", err);
      toast.error("Impossible de récupérer les détails de la dernière visite");
    }
  };
  const handleSubmit = async () => {
    const missingFields = [];

    if (!form.mission_id) missingFields.push("Mission");
    if (!form.Fullname?.trim()) missingFields.push("Nom Client");
    if (!form.Tel?.trim()) missingFields.push("Téléphone");
    if (!form.latitude || !form.longitude)
      missingFields.push("Géo-localisation");
    if (!form.algeriaCitiesId) missingFields.push("Ville");
    if (!form.ActiviteId) missingFields.push("Activité");

    categories.forEach((cat) => {
      const catData = selected[cat.ID];

      const hasSelection =
        catData.produits.length > 0 ||
        catData.concurrents.length > 0 ||
        catData.prodConcurrents.length > 0;

      if (hasSelection) {
        if (!catData.nbr_article) {
          missingFields.push(`Nombre d'articles pour ${cat}`);
        }
        if (!catData.nbr_article_commande) {
          missingFields.push(`Nombre d'articles commandés pour ${cat}`);
        }

        if (catData.nbr_article && catData.nbr_article_commande) {
          const nbr = Number(catData.nbr_article);
          const cmd = Number(catData.nbr_article_commande);

          if (cmd > nbr) {
            missingFields.push(
              `Pour ${cat}, la commande (${cmd}) ne peut pas dépasser le nombre d'articles (${nbr})`,
            );
          }
        }
      }
    });

    if (form.sourceAppro.length === 0)
      missingFields.push("Source d'approvisionnement");

    if (form.criteres.length === 0) missingFields.push("Critères d'évaluation");
    if (form.actions.length === 0) missingFields.push("Actions à entreprendre");

    // 1. Affichage du Warning si champs manquants
    if (missingFields.length > 0) {
      return toast.warning(
        <div>
          <strong>Champs manquants :</strong>
          <ul className="list-disc ml-4 text-xs mt-1">
            {missingFields.slice(0, 3).map((f) => (
              <li key={f}>{f}</li>
            ))}
            {missingFields.length > 3 && (
              <li>et {missingFields.length - 3} autres...</li>
            )}
          </ul>
        </div>,
      );
    }
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
    try {
      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });
      if (res.ok) {
        toast.success(
          selectedFormulaire ? "Mise à jour réussie !" : "Visite enregistrée !",
        );
        onSuccess?.();
        setStep(1);
        onOpenChange(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Erreur fetch:", error);
      toast.error("Impossible de contacter le serveur");
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
            {(isMobile || step === 1) && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <RequiredLabel className="text-sm font-medium">
                      Mission
                    </RequiredLabel>
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
                          {m.objectif?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <RequiredLabel className="text-sm font-medium">
                      Nom Client
                    </RequiredLabel>

                    <Input
                      value={form.Fullname}
                      onChange={(e) =>
                        setForm({ ...form, Fullname: e.target.value })
                      }
                      placeholder="Entrez le nom du client..."
                    />
                  </div>
                  <div className="space-y-1">
                    <RequiredLabel className="text-sm font-medium">
                      Téléphone
                    </RequiredLabel>
                    <div className="flex gap-2">
                      <Input
                        value={form.Tel}
                        maxLength="10"
                        onChange={(e) =>
                          setForm({ ...form, Tel: e.target.value })
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleFetchLastVisit}
                        title="Récupérer dernière visite"
                      >
                        <Search className="w-4 h-4 text-blue-600" />
                      </Button>
                    </div>
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
                    <RequiredLabel className="text-sm font-medium">
                      Latitude
                    </RequiredLabel>
                    <Input
                      value={form.latitude}
                      onChange={(e) =>
                        setForm({ ...form, latitude: e.target.value })
                      }
                      placeholder="Géo-localisation..."
                    />
                  </div>
                  <div className="space-y-1">
                    <RequiredLabel className="text-sm font-medium">
                      Longitude
                    </RequiredLabel>
                    <Input
                      value={form.longitude}
                      onChange={(e) =>
                        setForm({ ...form, longitude: e.target.value })
                      }
                      placeholder="Géo-localisation..."
                    />
                  </div>
                  <div className="space-y-1">
                    <RequiredLabel className="text-sm font-medium">
                      Ville
                    </RequiredLabel>
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
                  </div>
                  <div className="space-y-1">
                    <RequiredLabel className="text-sm font-medium">
                      Activité
                    </RequiredLabel>
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
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Produits et Concurrents */}
            {/* STEP 2: Produits et Concurrents */}
            {(isMobile || step === 2) && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Onglets des catégories */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b">
                  {categories.map((cat) => (
                    <Button
                      key={cat.ID}
                      variant={
                        activeCategory === cat.ID ? "default" : "outline"
                      }
                      onClick={() => setActiveCategory(cat.ID)}
                      className="shrink-0"
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>

                {/* Inputs numériques pour la catégorie active */}
                {activeCategory && selected[activeCategory] && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1">
                        <RequiredLabel className="text-sm font-medium">
                          Total Gamme
                        </RequiredLabel>
                        <Input
                          type="number"
                          value={selected[activeCategory].nbr_article}
                          onChange={(e) =>
                            setSelected({
                              ...selected,
                              [activeCategory]: {
                                ...selected[activeCategory],
                                nbr_article: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <RequiredLabel className="text-sm font-medium">
                          Disponibles
                        </RequiredLabel>
                        <Input
                          type="number"
                          value={selected[activeCategory].nbr_article_commande}
                          onChange={(e) =>
                            setSelected({
                              ...selected,
                              [activeCategory]: {
                                ...selected[activeCategory],
                                nbr_article_commande: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Affichage dynamique des 3 listes de l'API */}
                    {currentCategory &&
                      [
                        {
                          key: "Produits",
                          label: "Nos Produits",
                          stateKey: "produits",
                        },
                        {
                          key: "Concurrents",
                          label: "Concurrents",
                          stateKey: "concurrents",
                        },
                        {
                          key: "ProdConcurrents",
                          label: "Produits Concurrents",
                          stateKey: "prodConcurrents",
                        },
                      ].map((group) => (
                        <div key={group.key} className="space-y-3">
                          <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
                            {group.label}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {currentCategory[group.key]?.map((item) => {
                              const isSelected = selected[activeCategory][
                                group.stateKey
                              ]?.includes(String(item.ID));
                              return (
                                <div
                                  key={item.ID}
                                  onClick={() => {
                                    const list =
                                      selected[activeCategory][group.stateKey];
                                    const next = isSelected
                                      ? list.filter(
                                          (id) => id !== String(item.ID),
                                        )
                                      : [...list, String(item.ID)];

                                    setSelected({
                                      ...selected,
                                      [activeCategory]: {
                                        ...selected[activeCategory],
                                        [group.stateKey]: next,
                                      },
                                    });
                                  }}
                                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                    isSelected
                                      ? "bg-blue-50 border-blue-500 text-blue-700"
                                      : "bg-white border-slate-200"
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "bg-blue-600 border-blue-600" : "bg-white"}`}
                                  >
                                    {isSelected && (
                                      <Check className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                  <span className="text-sm font-medium">
                                    {item.name || "Sans nom"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </div>
            )}
            {/* STEP 3: Marketing et Appro */}
            {(isMobile || step === 3) && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-3">
                  <RequiredLabel className="font-bold text-sm text-slate-600">
                    Source d'approvisionnement
                  </RequiredLabel>
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
                                  {s.name} - ( {s.Surname} )
                                </span>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
            {(isMobile || step === 4) && (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { l: "Satisfaction Client", k: "SatisfactionCli" },
                    { l: "Évaluation Company", k: "evalueBms" },
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
                    <RequiredLabel className="text-sm font-bold text-slate-700">
                      Critères d'évaluation
                    </RequiredLabel>
                    <p className="text-xs text-slate-400">
                      Sélectionnez les points observés chez le client
                    </p>
                  </div>

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
                    <RequiredLabel className="text-sm font-bold text-slate-700">
                      Actions à entreprendre
                    </RequiredLabel>
                    <p className="text-xs text-slate-400">
                      Sélectionnez les actions recommandées
                    </p>
                  </div>

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

        {/* Desktop footer (with steps) */}
        {!isMobile && (
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
        )}

        {/* Mobile footer — only show "Valider" */}
        {isMobile && (
          <DialogFooter className="px-6 py-4 border-t bg-white shrink-0 flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 px-10 shadow-md text-white w-full"
            >
              Valider
            </Button>
          </DialogFooter>
        )}

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
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
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

                        <span className="text-sm font-medium select-none">
                          {c.name}
                        </span>
                      </label>
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
