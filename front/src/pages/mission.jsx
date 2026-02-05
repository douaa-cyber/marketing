"use client";

import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash2, ChevronDown, Check } from "lucide-react";
import { URL } from "@/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Ensure you have this shadcn component
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

/* ================= UTIL ================= */
const formatDateTimeLocal = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
};

/* ================= TABLE COLUMNS ================= */
const columns = (onEdit, onDelete) => [
  { accessorKey: "Objectif", header: "Objectif" },
  { accessorKey: "date_deb", header: "Date Début" },
  { accessorKey: "date_fin", header: "Date Fin" },
  { accessorKey: "region", header: "Région" },
  { accessorKey: "wilaya", header: "Wilaya" },
  { accessorKey: "status", header: "Statut" },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2 justify-end">
        <Button
          size="icon"
          variant="outline"
          onClick={() => onEdit(row.original)}
        >
          <Pencil size={16} />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    ),
  },
];

export default function MissionsPage() {
  const [missions, setMissions] = useState([]);
  const [agents, setAgents] = useState([]);
  const [wilayas, setWilayas] = useState([]);
  const [Vehicule, setVehicule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Popover States
  const [openAgentCombo, setOpenAgentCombo] = useState(false);
  const [openRespCombo, setOpenRespCombo] = useState(false);
  const [openWiCombo, setOpenWiCombo] = useState(false);
  const [openVehiCombo, setOpenVehiCombo] = useState(false);

  const [selectedMission, setSelectedMission] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    Objectif: "",
    date_deb: "",
    date_fin: "",
    region: "",
    wilaya: "",
    status: "ENCOURS",
    agent_id: null,
    responsable_id: null,
    vehicule_id: null,
    Immatriculation: "",
    clientAVisite: null,
  });

  /* ================= FETCH ================= */
  const fetchMissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${URL}/api/mission/all`, {
        credentials: "include",
      });
      const data = await res.json();
      setMissions(data);
    } catch (err) {
      console.error(err);
      setMissions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${URL}/api/user/agents`, {
        credentials: "include",
      });
      const data = await res.json();
      setAgents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVehicule = async () => {
    try {
      const res = await fetch(`${URL}/api/vehicule/all`, {
        credentials: "include",
      });
      const data = await res.json();
      setVehicule(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWilayas = async () => {
    try {
      const res = await fetch(`${URL}/api/location/wilayas`, {
        credentials: "include",
      });
      const data = await res.json();
      setWilayas(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMissions();
    fetchAgents();
    fetchVehicule();
    fetchWilayas();
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
      setForm({
        Objectif: "",
        date_deb: "",
        date_fin: "",
        region: "",
        wilaya: "",
        status: "ENCOURS",
        agent_id: null,
        responsable_id: null,
        vehicule_id: null,
        Immatriculation: "",
        clientAVisite: null,
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    const url = selectedMission
      ? `${URL}/api/mission/${selectedMission.id}`
      : `${URL}/api/mission`;
    await fetch(url, {
      method: selectedMission ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    setOpenDialog(false);
    fetchMissions();
  };

  const confirmDelete = async () => {
    await fetch(`${URL}/api/mission/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setOpenDeleteDialog(false);
    fetchMissions();
  };

  const table = useReactTable({
    data: missions,
    columns: columns(handleEdit, (m) => {
      setDeleteTarget(m);
      setOpenDeleteDialog(true);
    }),
    state: { globalFilter },
    globalFilterFn: (row, _, value) =>
      row.original.Objectif.toLowerCase().includes(value.toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <p className="p-6 text-center">Chargement...</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Missions</h1>
        <Button onClick={() => handleEdit(null)}>Créer une mission</Button>
      </div>

      <Input
        placeholder="Rechercher par objectif..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm bg-white"
      />

      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
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
                <TableRow key={row.id} className="hover:bg-muted/40 transition">
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
                <TableCell colSpan={7} className="text-center py-10">
                  Aucune mission trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </Button>
      </div>

      {/* ================= DIALOG CREATE / EDIT ================= */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedMission ? "Modifier" : "Créer"} la Mission
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-1">
              <Label>Objectif de la mission</Label>
              <Input
                placeholder="Ex: Tourné Marketing"
                value={form.Objectif}
                onChange={(e) => setForm({ ...form, Objectif: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label>Date de début</Label>
              <Input
                type="datetime-local"
                value={form.date_deb}
                onChange={(e) => setForm({ ...form, date_deb: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label>Date de fin</Label>
              <Input
                type="datetime-local"
                value={form.date_fin}
                onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="region">Région</Label>
              <select
                id="region"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              >
                <option value="" disabled>
                  Sélectionner une région
                </option>
                <option value="Nord">Nord</option>
                <option value="Est">Est</option>
                <option value="Ouest">Ouest</option>
                <option value="Kabylie">Kabylie</option>
                <option value="Sud">Sud</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label>Wilaya</Label>
              <Popover open={openWiCombo} onOpenChange={setOpenWiCombo}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    {wilayas.find((w) => w.wilaya === form.wilaya)?.wilaya ||
                      "Sélectionner une wilaya"}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Chercher wilaya..." />
                    <CommandEmpty>Aucune wilaya trouvée.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
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

            <div className="space-y-1">
              <Label>Statut</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="ENCOURS">ENCOURS</option>
                <option value="TERMINE">TERMINE</option>
                <option value="ANNULE">ANNULE</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label>Agent Responsable</Label>
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
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Chercher agent..." />
                    <CommandGroup>
                      {agents.map((a) => (
                        <CommandItem
                          key={a.id}
                          onSelect={() => {
                            setForm({ ...form, responsable_id: a.id });
                            setOpenRespCombo(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              form.responsable_id === a.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {a.fullname}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <Label>Agent Compagnion</Label>
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
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Chercher agent..." />
                    <CommandGroup>
                      {agents.map((a) => (
                        <CommandItem
                          key={a.id}
                          onSelect={() => {
                            setForm({ ...form, agent_id: a.id });
                            setOpenAgentCombo(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              form.agent_id === a.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {a.fullname}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <Label>Véhicule</Label>
              <Popover open={openVehiCombo} onOpenChange={setOpenVehiCombo}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    {Vehicule.find((v) => v.id === form.vehicule_id)?.marque ||
                      "Sélectionner..."}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Chercher véhicule..." />
                    <CommandGroup>
                      {Vehicule.map((v) => (
                        <CommandItem
                          key={v.id}
                          onSelect={() => {
                            setForm({ ...form, vehicule_id: v.id });
                            setOpenVehiCombo(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              form.vehicule_id === v.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {v.marque}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <Label>Immatriculation</Label>
              <Input
                value={form.Immatriculation}
                placeholder="Ex: 00123-116-16"
                onChange={(e) =>
                  setForm({ ...form, Immatriculation: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Client A Visite</Label>
              <Input
                value={form.clientAVisite}
                placeholder="Ex: 80"
                onChange={(e) =>
                  setForm({ ...form, clientAVisite: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit} className="w-full sm:w-auto">
              {selectedMission
                ? "Sauvegarder les modifications"
                : "Créer la mission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= DIALOG DELETE ================= */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-gray-600">
            Êtes-vous sûr de vouloir supprimer la mission :{" "}
            <strong>{deleteTarget?.Objectif}</strong> ? Cette action est
            irréversible.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
