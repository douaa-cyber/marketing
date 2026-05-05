"use client";

import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash2, Plus, Loader2, X } from "lucide-react";
import { URL } from "@/api";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ===== Définition des colonnes =====
const columns = (onEdit, onDelete) => [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    id: "categorie",
    header: "Catégorie",
    // Accès au nom de la catégorie (ajustez selon votre structure JSON)
    accessorFn: (row) => row.Categories?.[0]?.name || "Non classé",
    cell: ({ row }) => (
      <span className="text-muted-foreground italic">
        {row.getValue("categorie")}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
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

export default function ConcurrentsPage() {
  const [concurrents, setConcurrents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // États de filtrage
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);

  // États des Dialogues
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConcurrent, setSelectedConcurrent] = useState(null);
  const [form, setForm] = useState({
    name: "",
    categorieId: "",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ===== Fetch des données =====
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resConc, resCat] = await Promise.all([
        fetch(`${URL}/api/concurrent/`, { credentials: "include" }),
        fetch(`${URL}/api/categorie/all`, { credentials: "include" }), // Assurez-vous que cet endpoint existe
      ]);

      if (resConc.ok && resCat.ok) {
        const concData = await resConc.json();
        const catData = await resCat.json();
        setConcurrents(concData);
        setCategories(catData);
      }
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
  const handleEdit = (concurrent) => {
    if (concurrent) {
      setSelectedConcurrent(concurrent);
      setForm({
        name: concurrent.name,
        categorieId: concurrent.Categories?.[0]?.ID?.toString() || "",
      });
    } else {
      setSelectedConcurrent(null);
      setForm({ name: "", categorieId: "" });
    }
    setOpenDialog(true);
  };

  const handleDelete = (concurrent) => {
    setDeleteTarget(concurrent);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`${URL}/api/concurrent/${deleteTarget.ID}`, {
        method: "DELETE",
        credentials: "include",
      });
      setOpenDeleteDialog(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;

    const method = selectedConcurrent ? "PUT" : "POST";
    const endpoint = selectedConcurrent
      ? `${URL}/api/concurrent/${selectedConcurrent.ID}`
      : `${URL}/api/concurrent/`;

    try {
      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          categorieId: form.categorieId || null,
        }),
      });
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Table Configuration =====
  const table = useReactTable({
    data: concurrents,
    columns: columns(handleEdit, handleDelete),
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Concurrents</h1>
        <Button onClick={() => handleEdit(null)}>
          <Plus className="w-4 h-4 mr-2" /> Nouveau Concurrent
        </Button>
      </div>

      {/* Toolbar - Filtres */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Rechercher..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm bg-white"
        />

        <Select
          value={table.getColumn("categorie")?.getFilterValue() ?? "all"}
          onValueChange={(val) =>
            table
              .getColumn("categorie")
              ?.setFilterValue(val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.ID} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(globalFilter || columnFilters.length > 0) && (
          <Button
            variant="ghost"
            onClick={() => {
              setGlobalFilter("");
              setColumnFilters([]);
            }}
          >
            <X className="w-4 h-4 mr-1" /> Effacer
          </Button>
        )}
      </div>

      {/* Tableau */}
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                <TableCell colSpan={3} className="h-24 text-center">
                  Aucun résultat.
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

      {/* Modal Edit/Create */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedConcurrent ? "Modifier" : "Ajouter"} Concurrent
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nom du concurrent"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Catégorie associée</label>
              <Select
                value={form.categorieId}
                onValueChange={(val) => setForm({ ...form, categorieId: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.ID} value={cat.ID.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={!form.name.trim()}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Delete */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Supprimer le concurrent{" "}
            <span className="font-bold">{deleteTarget?.name}</span> ?
          </div>
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
