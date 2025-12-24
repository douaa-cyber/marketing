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
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAgentCombo, setOpenAgentCombo] = useState(false);
  const [openRespCombo, setOpenRespCombo] = useState(false);

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
  });

  /* ================= FETCH ================= */
  const fetchMissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/mission/all", {
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
      const res = await fetch("http://localhost:3000/api/user/agents", {
        credentials: "include",
      });
      const data = await res.json();
      setAgents(data);
    } catch (err) {
      console.error(err);
      setAgents([]);
    }
  };

  useEffect(() => {
    fetchMissions();
    fetchAgents();
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
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    const url = selectedMission
      ? `http://localhost:3000/api/mission/${selectedMission.id}`
      : "http://localhost:3000/api/mission";

    await fetch(url, {
      method: selectedMission ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    setOpenDialog(false);
    fetchMissions();
  };

  const handleDelete = (mission) => {
    setDeleteTarget(mission);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    await fetch(`http://localhost:3000/api/mission/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setOpenDeleteDialog(false);
    fetchMissions();
  };

  /* ================= TABLE ================= */
  const table = useReactTable({
    data: missions,
    columns: columns(handleEdit, handleDelete),
    state: { globalFilter },
    globalFilterFn: (row, _, value) =>
      row.original.Objectif.toLowerCase().includes(value.toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;

  if (loading) return <p className="p-6">Loading...</p>;

  /* ================= RENDER ================= */
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Missions</h1>
        <Button onClick={() => handleEdit(null)}>Créer</Button>
      </div>

      <Input
        placeholder="Rechercher..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
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
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40 transition">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Aucun mission trouvé
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMission ? "Modifier" : "Créer"} Mission
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Input
              placeholder="Objectif"
              value={form.Objectif}
              onChange={(e) => setForm({ ...form, Objectif: e.target.value })}
            />
            <Input
              type="datetime-local"
              value={form.date_deb}
              onChange={(e) => setForm({ ...form, date_deb: e.target.value })}
            />
            <Input
              type="datetime-local"
              value={form.date_fin}
              onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
            />
            <Input
              placeholder="Région"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
            />
            <Input
              placeholder="Wilaya"
              value={form.wilaya}
              onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
            />
            <select
              className="border rounded p-2 w-full"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="ENCOURS">ENCOURS</option>
              <option value="TERMINE">TERMINE</option>
              <option value="ANNULE">ANNULE</option>
            </select>

            {/* RESPONSABLE */}
            <Popover open={openRespCombo} onOpenChange={setOpenRespCombo}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {agents.find((a) => a.id === form.responsable_id)?.fullname ||
                    "Responsable"}
                  <ChevronDown size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput placeholder="Rechercher..." />
                  <CommandEmpty>Aucun agent trouvé</CommandEmpty>
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
                          className={
                            form.responsable_id === a.id
                              ? "opacity-100"
                              : "opacity-0"
                          }
                        />
                        {a.fullname}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {/* AGENT */}
            <Popover open={openAgentCombo} onOpenChange={setOpenAgentCombo}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {agents.find((a) => a.id === form.agent_id)?.fullname ||
                    "Agent"}
                  <ChevronDown size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput placeholder="Rechercher..." />
                  <CommandEmpty>Aucun agent trouvé</CommandEmpty>
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
                          className={
                            form.agent_id === a.id ? "opacity-100" : "opacity-0"
                          }
                        />
                        {a.fullname}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>
              {selectedMission ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= DIALOG DELETE ================= */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Voulez-vous vraiment supprimer{" "}
            <strong>{deleteTarget?.Objectif}</strong> ?
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
