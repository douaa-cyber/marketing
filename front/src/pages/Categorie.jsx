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
    header: "Nom de la Catégorie",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.name}</span>
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  // États des Dialogues
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form, setForm] = useState({
    name: "",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ===== Fetch des données =====
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/api/categorie/all`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Erreur de chargement des catégories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ===== Handlers =====
  const handleEdit = (category) => {
    if (category) {
      setSelectedCategory(category);
      setForm({ name: category.name || "" });
    } else {
      setSelectedCategory(null);
      setForm({ name: "" });
    }
    setOpenDialog(true);
  };

  const handleDelete = (category) => {
    setDeleteTarget(category);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`${URL}/api/categorie/${deleteTarget.ID}`, {
        method: "DELETE",
        credentials: "include",
      });
      setOpenDeleteDialog(false);
      fetchCategories();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;

    const method = selectedCategory ? "PUT" : "POST";
    const endpoint = selectedCategory
      ? `${URL}/api/categorie/${selectedCategory.ID}`
      : `${URL}/api/categorie/`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: form.name.trim() }),
      });

      if (response.ok) {
        setOpenDialog(false);
        fetchCategories();
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
    }
  };

  // ===== Table Configuration =====
  const table = useReactTable({
    data: categories,
    columns: columns(handleEdit, handleDelete),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestion des Catégories
          </h1>
          <p className="text-muted-foreground italic text-sm">
            Organisez vos produits et concurrents par catégorie.
          </p>
        </div>
        <Button onClick={() => handleEdit(null)}>
          <Plus className="w-4 h-4 mr-2" /> Nouvelle Catégorie
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Rechercher une catégorie..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm bg-white shadow-sm"
        />
        {globalFilter && (
          <Button variant="ghost" size="sm" onClick={() => setGlobalFilter("")}>
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
                <TableRow
                  key={row.id}
                  className="hover:bg-slate-50/50 transition-colors"
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
                <TableCell
                  colSpan={2}
                  className="h-24 text-center text-muted-foreground"
                >
                  Aucune catégorie trouvée.
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
              {selectedCategory
                ? "Modifier la catégorie"
                : "Ajouter une catégorie"}
            </DialogTitle>
            <DialogDescription>
              Entrez le nom de la catégorie ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nom</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                placeholder="Ex: Accessoires, Appareillages..."
                autoFocus
              />
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
            <DialogTitle>Supprimer la catégorie</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Êtes-vous sûr de vouloir supprimer la catégorie{" "}
            <span className="font-bold text-destructive">
              {deleteTarget?.name}
            </span>{" "}
            ?
            <p className="text-xs text-muted-foreground mt-2">
              Attention : Cela pourrait affecter les produits liés à cette
              catégorie.
            </p>
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
