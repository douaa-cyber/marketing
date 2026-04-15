"use client";

import React, { useEffect, useState } from "react";
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
  ChevronDown,
  Check,
  Loader2,
  Plus,
} from "lucide-react";
import { URL } from "@/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

/* ================= UTILS ================= */
const formatDateTimeLocal = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
};

const initialFormState = {
  Objectif_id: null,
  date_deb: "",
  date_fin: "",
  region: "",
  wilaya: "",
  status: "ENCOURS",
  agent_id: null,
  responsable_id: null,
  vehicule_id: null,
  Immatriculation: "",
  clientAVisite: "",
};

/* ================= COLUMNS ================= */
const columns = (onEdit, onDelete, objectifs) => [
  {
    accessorKey: "Objectif_id",
    header: "Objectif",
    cell: ({ row }) => {
      const obj = objectifs.find((o) => o.id === row.original.Objectif_id);
      return <span className="font-medium">{obj?.name || "—"}</span>;
    },
  },
  {
    accessorKey: "date_deb",
    header: "Début",
    cell: ({ row }) =>
      new Date(row.original.date_deb).toLocaleDateString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  {
    accessorKey: "date_fin",
    header: "Fin",
    cell: ({ row }) =>
      new Date(row.original.date_fin).toLocaleDateString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
  { accessorKey: "region", header: "Région" },
  { accessorKey: "wilaya", header: "Wilaya" },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs font-semibold",
          row.original.status === "TERMINE"
            ? "bg-green-100 text-green-700"
            : row.original.status === "ANNULE"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700",
        )}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2 justify-end">
        <Button
          size="icon"
          variant="outline"
          onClick={() => onEdit(row.original)}
        >
          <Pencil size={16} className="text-blue-600" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 size={16} className="text-red-600" />
        </Button>
      </div>
    ),
  },
];
const RequiredLabel = ({ children }) => (
  <Label>
    {children} <span className="text-red-500">*</span>
  </Label>
);

export default function MissionsPage() {
  const [missions, setMissions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [wilayas, setWilayas] = useState([]);
  const [objectifs, setObjectifs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [openAgentCombo, setOpenAgentCombo] = useState(false);
  const [openRespCombo, setOpenRespCombo] = useState(false);
  const [openWiCombo, setOpenWiCombo] = useState(false);
  const [openObjCombo, setOpenObjCombo] = useState(false);
  const [openVehiCombo, setOpenVehiCombo] = useState(false);

  const [selectedMission, setSelectedMission] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(initialFormState);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, aRes, vRes, oRes, wRes] = await Promise.all([
        fetch(`${URL}/api/mission/all`, { credentials: "include" }),
        fetch(`${URL}/api/user/agents`, { credentials: "include" }),
        fetch(`${URL}/api/vehicule/all`, { credentials: "include" }),
        fetch(`${URL}/api/objectif/all`, { credentials: "include" }),
        fetch(`${URL}/api/location/wilayas`, { credentials: "include" }),
      ]);

      const [mD, aD, vD, OD, wD] = await Promise.all([
        mRes.json(),
        aRes.json(),
        vRes.json(),
        oRes.json(),
        wRes.json(),
      ]);

      setMissions(mD);
      setAgents(aD);
      setObjectifs(OD);
      setVehicules(vD);
      setWilayas(wD);
    } catch (err) {
      toast.error("Erreur lors de la récupération des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= HANDLERS ================= */
  const handleEdit = (mission) => {
    if (mission) {
      setSelectedMission(mission);
      setForm({
        ...mission,
        date_deb: formatDateTimeLocal(mission.date_deb),
        date_fin: formatDateTimeLocal(mission.date_fin),
      });
    } else {
      setSelectedMission(null);
      setForm(initialFormState);
    }
    setOpenDialog(true);
  };

  const handleVehiculeSelect = (v) => {
    setForm({
      ...form,
      vehicule_id: v.id,
      Immatriculation: v.immatriculation || "", // Assurez-vous que le champ existe dans votre API
    });
    setOpenVehiCombo(false);
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !form.Objectif_id ||
      !form.date_deb ||
      !form.date_fin ||
      !form.wilaya ||
      !form.vehicule_id
    ) {
      return toast.warning("Veuillez remplir les champs obligatoires");
    }

    if (new Date(form.date_deb) >= new Date(form.date_fin)) {
      return toast.error("La date de début doit être avant la date de fin");
    }

    try {
      const isEdit = !!selectedMission;
      const url = isEdit
        ? `${URL}/api/mission/${selectedMission.id}`
        : `${URL}/api/mission`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(isEdit ? "Mission mise à jour" : "Mission créée");
        setOpenDialog(false);
        setForm(initialFormState);
        fetchData(); // Refresh list
      } else {
        toast.error("Erreur lors de l'enregistrement");
      }
    } catch (err) {
      toast.error("Serveur injoignable");
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${URL}/api/mission/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.info("Mission supprimée avec succès");
        setOpenDeleteDialog(false);
        fetchData();
      }
    } catch (err) {
      toast.error("Erreur de suppression");
    }
  };

  const table = useReactTable({
    data: missions,
    columns: columns(
      handleEdit,
      (m) => {
        setDeleteTarget(m);
        setOpenDeleteDialog(true);
      },
      objectifs,
    ),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestion des Missions
          </h1>
          <p className="text-sm text-gray-500 text-muted-foreground">
            Gérez vos tournées et agents sur le terrain
          </p>
        </div>
        <Button onClick={() => handleEdit(null)} className="gap-2">
          <Plus size={18} /> Créer une mission
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Rechercher par objectif..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm bg-white"
        />
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
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
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucun résultat trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </Button>
      </div>

      {/* CREATE/EDIT DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMission ? "Modifier la Mission" : " Nouvelle Mission"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="col-span-2 space-y-2">
              <RequiredLabel>Objectif de la mission</RequiredLabel>

              <Popover open={openObjCombo} onOpenChange={setOpenObjCombo}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    {objectifs.find((o) => o.ID === form.Objectif_id)?.name ||
                      "Sélectionner..."}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0 pointer-events-auto">
                  <Command>
                    <CommandInput placeholder="Chercher..." />
                    <CommandEmpty>Aucun objectif.</CommandEmpty>

                    <CommandGroup className="max-h-48 overflow-auto">
                      {objectifs.map((o) => (
                        <CommandItem
                          key={o.ID}
                          onSelect={() => {
                            setForm({ ...form, Objectif_id: o.ID });
                            setOpenObjCombo(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              form.Objectif_id === o.ID
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {o.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <RequiredLabel>Date de début</RequiredLabel>
              <Input
                type="datetime-local"
                value={form.date_deb}
                onChange={(e) => setForm({ ...form, date_deb: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <RequiredLabel>Date de fin</RequiredLabel>
              <Input
                type="datetime-local"
                value={form.date_fin}
                onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <RequiredLabel>Région</RequiredLabel>
              <select
                className="w-full h-10 border rounded-md px-3 text-sm"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              >
                <option value="">Choisir...</option>
                <option value="Nord">Nord</option>
                <option value="Est">Est</option>
                <option value="Ouest">Ouest</option>
                <option value="Sud">Sud</option>
              </select>
            </div>

            <div className="space-y-2">
              <RequiredLabel>Wilaya</RequiredLabel>
              <Popover open={openWiCombo} onOpenChange={setOpenWiCombo}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    {wilayas.find((w) => w.wilaya === form.wilaya)?.wilaya ||
                      "Sélectionner..."}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 pointer-events-auto">
                  <Command>
                    <CommandInput placeholder="Chercher..." />
                    <CommandEmpty>Aucune wilaya.</CommandEmpty>
                    <CommandGroup className="max-h-48 overflow-auto">
                      {wilayas.map((w) => (
                        <CommandItem
                          key={w.wilaya}
                          onSelect={() => {
                            setForm({ ...form, wilaya: w.wilaya });
                            setOpenWiCombo(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              form.wilaya === w.wilaya
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {w.wilaya}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <RequiredLabel>Responsable</RequiredLabel>
              <Popover open={openRespCombo} onOpenChange={setOpenRespCombo}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    {agents.find((a) => a.id === form.responsable_id)
                      ?.fullname || "Sélectionner..."}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 pointer-events-auto">
                  <Command>
                    <CommandInput placeholder="Chercher..." />
                    <CommandGroup className="max-h-48 overflow-auto">
                      {agents.map((a) => (
                        <CommandItem
                          key={a.id}
                          onSelect={() => {
                            setForm({ ...form, responsable_id: a.id });
                            setOpenRespCombo(false);
                          }}
                        >
                          {a.fullname}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <RequiredLabel>Agent Accompagnant</RequiredLabel>
              <Popover open={openAgentCombo} onOpenChange={setOpenAgentCombo}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    {agents.find((a) => a.id === form.agent_id)?.fullname ||
                      "Sélectionner..."}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 pointer-events-auto">
                  <Command>
                    <CommandInput placeholder="Chercher..." />
                    <CommandGroup className="max-h-48 overflow-auto">
                      {agents.map((a) => (
                        <CommandItem
                          key={a.id}
                          onSelect={() => {
                            setForm({ ...form, agent_id: a.id });
                            setOpenAgentCombo(false);
                          }}
                        >
                          {a.fullname}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <RequiredLabel>Véhicule</RequiredLabel>
              <Popover open={openVehiCombo} onOpenChange={setOpenVehiCombo}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    {vehicules.find((v) => v.id === form.vehicule_id)?.marque ||
                      "Sélectionner..."}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 pointer-events-auto">
                  <Command>
                    <CommandInput placeholder="Chercher..." />
                    <CommandGroup className="max-h-48 overflow-auto">
                      {vehicules.map((v) => (
                        <CommandItem
                          key={v.id}
                          onSelect={() => handleVehiculeSelect(v)}
                        >
                          {v.marque}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <RequiredLabel>Immatriculation</RequiredLabel>
              <Input
                value={form.Immatriculation}
                readOnly
                className="bg-gray-50 text-gray-500"
                placeholder="Ex: 999548-122-16"
              />
            </div>

            <div className="space-y-2">
              <RequiredLabel>Nombre de clients à visiter</RequiredLabel>
              <Input
                type="number"
                value={form.clientAVisite || ""}
                onChange={(e) =>
                  setForm({ ...form, clientAVisite: e.target.value })
                }
              />
            </div>

            {selectedMission && (
              <div className="col-span-2 space-y-2">
                <Label>Statut</Label>
                <select
                  className="w-full h-10 border rounded-md px-3"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="ENCOURS">ENCOURS</option>
                  <option value="TERMINE">TERMINE</option>
                  <option value="ANNULE">ANNULE</option>
                </select>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {selectedMission
                ? "Appliquer les changements"
                : "Enregistrer la mission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Voulez-vous vraiment supprimer la mission{" "}
            <span className="font-bold text-gray-800">
              "{deleteTarget?.Objectif}"
            </span>{" "}
            ?
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
