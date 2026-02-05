"use client";

import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash2, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { URL } from "@/api";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ===== Columns =====
const columns = (onEdit, onDelete) => [
  {
    accessorKey: "marque",
    header: "Marque",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.marque}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

export default function VehiculePage() {
  const [Vehicule, setVehicule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);

  // ===== Dialog states =====
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const [form, setForm] = useState({
    marque: "",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteVehiculeTarget, setDeleteVehiculeTarget] = useState(null);

  // ===== Fetch API =====
  const fetchVehicule = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${URL}/api/vehicule/all`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      setVehicule(data);
    } catch (err) {
      console.error(err);
      setVehicule([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicule();
  }, []);

  // ===== Handlers =====
  const handleEdit = (v) => {
    if (v) {
      setSelectedVehicule(v);
      setForm({
        marque: v.marque,
      });
    } else {
      setSelectedVehicule(null);
      setForm({ marque: "" });
    }
    setOpenDialog(true);
  };

  const handleDelete = (v) => {
    setDeleteVehiculeTarget(v);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteVehiculeTarget) return;
    await fetch(`${URL}/api/vehicule/${deleteVehiculeTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setOpenDeleteDialog(false);
    fetchVehicule();
  };

  const handleSubmit = async () => {
    if (selectedVehicule) {
      // Update
      await fetch(`${URL}/api/vehicule/${selectedVehicule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${URL}/api/vehicule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
    }
    setOpenDialog(false);
    fetchVehicule();
  };

  // ===== Table =====
  const table = useReactTable({
    data: Vehicule,
    columns: columns(handleEdit, handleDelete),
    state: { globalFilter },
    globalFilterFn: (row, _, value) =>
      row.original.marque.toLowerCase().includes(value.toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Vehicules</h1>
        <Button onClick={() => handleEdit(null)}>
          <Pencil className="w-4 h-4 mr-2" /> Créer
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Rechercher Vehicule..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
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
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40 transition">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
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
                <TableCell colSpan={4} className="text-center py-10">
                  Aucune Vehicule trouvé
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

      {/* Dialog Création / Edition */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedVehicule ? "Modifier Vehicule" : "Créer Vehicule"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="marque"
              value={form.marque}
              onChange={(e) => setForm({ ...form, marque: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>
              {selectedVehicule ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmation Suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Voulez-vous vraiment supprimer{" "}
            <strong>{deleteVehiculeTarget?.marque}</strong> ?
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
