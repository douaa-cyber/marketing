"use client";

import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Pencil,
  Trash2,
  Search,
  Calendar,
  User,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import FormDialog from "../components/FormDialog";
import { URL } from "@/api";

export default function FormulairesPage() {
  // States
  const [formulaires, setFormulaires] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  // States pour les filtres
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agents, setAgents] = useState([]);

  // States pour les Dialogs
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFormulaire, setSelectedFormulaire] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ===== Fetch data =====
  const fetchData = async () => {
    setLoading(true);
    try {
      const [formsRes, missionsRes] = await Promise.all([
        fetch(`${URL}/api/form/`, { credentials: "include" }),
        fetch(`${URL}/api/mission/all`, { credentials: "include" }),
      ]);

      const formsData = await formsRes.json();
      const missionsData = await missionsRes.json();

      setFormulaires(formsData);
      setMissions(missionsData);

      // Extraire la liste unique des agents
      const uniqueAgents = Array.from(
        new Set(formsData.map((f) => f.agent?.fullname)),
      ).filter(Boolean);
      setAgents(uniqueAgents);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== Handlers =====
  const handleEdit = (formulaire) => {
    setSelectedFormulaire(formulaire || null);
    setOpenDialog(true);
  };

  const handleDelete = (formulaire) => {
    setDeleteTarget(formulaire);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    // Création de la promesse de suppression
    const deletePromise = fetch(`${URL}/api/form/${deleteTarget.ID}`, {
      method: "DELETE",
      credentials: "include",
    }).then(async (res) => {
      // Si la réponse n'est pas OK (ex: 404, 500), on jette une erreur pour le toast
      if (!res.ok) {
        throw new Error("Erreur lors de la suppression");
      }
      return res;
    });

    // Utilisation de toast.promise pour gérer les 3 états : loading, success, error
    toast.promise(deletePromise, {
      pending: "Suppression du rapport en cours...",
      success: {
        render() {
          setOpenDeleteDialog(false);
          fetchData(); // Rafraîchir les données
          return `Le rapport de ${deleteTarget.Fullname} a été supprimé.`;
        },
      },
      error: {
        render({ data }) {
          // "data" contient l'erreur jetée plus haut
          return `Échec : ${data.message || "Serveur injoignable"}`;
        },
      },
    });
  };

  // ===== Logic de Filtrage Alternatif (avant TanStack) =====
  const filteredData = useMemo(() => {
    return formulaires.filter((row) => {
      // Filtre Agent
      const matchAgent =
        selectedAgent === "all" || row.agent?.fullname === selectedAgent;

      // Filtre Date
      const createdAt = new Date(row.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (end) end.setHours(23, 59, 59, 999);
      const matchDate =
        (!start || createdAt >= start) && (!end || createdAt <= end);

      return matchAgent && matchDate;
    });
  }, [formulaires, selectedAgent, startDate, endDate]);

  // ===== Colonnes du Tableau =====
  const columns = [
    {
      accessorKey: "agent.fullname",
      header: "Agent",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">
            {row.original.agent?.fullname || "Inconnu"}
          </span>
          <span className="text-[10px] text-slate-400">
            ID: {row.original.utilisateur_id}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "Image",
      header: "Magasin",
      cell: ({ row }) => {
        const image = row.getValue("Image");
        const imageUrl = `${URL}/${image}`;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg overflow-hidden border bg-slate-100 flex-shrink-0">
              {image ? (
                <img
                  src={imageUrl}
                  alt="Store"
                  className="h-full w-full object-cover cursor-pointer hover:scale-110 transition"
                  onClick={() => window.open(imageUrl, "_blank")}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm truncate">
                {row.original.Fullname}
              </span>
              <span className="text-xs text-slate-500 truncate">
                {row.original.Tel || "Pas de tel"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "location",
      header: "Localisation",
      cell: ({ row }) => {
        const city = row.original.city;
        const { latitude, longitude } = row.original;

        const handleClick = () => {
          if (latitude && longitude) {
            const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
            window.open(url, "_blank");
          } else {
            alert("Localisation non disponible");
          }
        };

        return (
          <div
            className="flex items-center gap-1.5 text-slate-600 cursor-pointer hover:text-blue-700"
            onClick={handleClick}
            title={
              city
                ? `${city.wilaya} - ${city.Commune}`
                : "Localisation non définie"
            }
          >
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs">
              {city ? `${city.wilaya} - ${city.Commune}` : "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "Activite.name",
      header: "Activité",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {row.original.Activite?.name}
        </Badge>
      ),
    },
    {
      id: "sources",
      header: "Approvisionnement",
      cell: ({ row }) => {
        const sources = row.original.SourceAppros || [];
        const names = sources.map((s) => s.name).join(", ");
        return (
          <span className="text-xs text-slate-500 italic max-w-[150px] block truncate">
            {names || "Non précisé"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {new Date(row.original.createdAt).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right px-4">Actions</div>,
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDelete(row.original)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, value) => {
      const val = value.toLowerCase();
      const city = row.original.city;
      return (
        row.original.Fullname?.toLowerCase().includes(val) ||
        city?.wilaya?.toLowerCase().includes(val) ||
        city?.Commune?.toLowerCase().includes(val)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Chargement des données...</p>
      </div>
    );

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen text-slate-900">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Rapports de Visite
          </h1>
          <p className="text-slate-500 mt-1">
            Suivi des activités Marketing et inventaires terrain.
          </p>
        </div>
        <Button
          onClick={() => handleEdit(null)}
          className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all px-6"
        >
          + Nouvelle Visite
        </Button>
      </div>

      {/* FILTRES PANEL */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Filter className="w-4 h-4 text-blue-600" />
            <h2>Filtrer les résultats</h2>
            <Badge
              variant="secondary"
              className="ml-2 bg-blue-50 text-blue-700 border-blue-100"
            >
              {filteredData.length} fiches trouvées
            </Badge>
          </div>
          {(startDate ||
            endDate ||
            selectedAgent !== "all" ||
            globalFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setSelectedAgent("all");
                setGlobalFilter("");
              }}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-2" /> Réinitialiser
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Recherche */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Client / Ville
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Ex: Magasin Ali..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Agent */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Agent Marketaire
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              >
                <option value="all">Tous les agents</option>
                {agents.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Période */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Période d'activité
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
              <span className="text-slate-300 font-light">jusqu'à</span>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLEAU SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-4 text-slate-600 font-bold"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-blue-50/30 transition-colors border-b border-slate-100 last:border-0 md:text-lg"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 md:text-lg">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-20 text-lg"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Search className="w-10 h-10 text-slate-200" />
                    <p className="text-slate-400 font-medium">
                      Aucun résultat ne correspond à vos filtres.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setGlobalFilter("");
                        setSelectedAgent("all");
                        setStartDate("");
                        setEndDate("");
                      }}
                    >
                      Effacer tout
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Page{" "}
            <span className="font-semibold text-slate-900">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            sur{" "}
            <span className="font-semibold text-slate-900">
              {table.getPageCount()}
            </span>
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="bg-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="bg-white"
            >
              Suivant <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* DIALOGS */}
      {openDialog && (
        <FormDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          selectedFormulaire={selectedFormulaire}
          missions={missions}
          onSuccess={() => {
            fetchData();
            setOpenDialog(false);
          }}
        />
      )}

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Supprimer le rapport
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-600">
            Voulez-vous vraiment supprimer le rapport de{" "}
            <strong>{deleteTarget?.Fullname}</strong> ? Cette action est
            irréversible.
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Confirmer la suppression
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
