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
    // accessorFn est crucial pour que le filtrage fonctionne sur le texte de la catégorie
    accessorFn: (row) => row.Categories?.[0]?.name || "Non classé",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("categorie")}</span>
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

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour les filtres
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  // États des Dialogues
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    categorieId: "",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);

  // ===== Chargement des données =====
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProd, resCat] = await Promise.all([
        fetch(`${URL}/api/product/`, { credentials: "include" }),
        fetch(`${URL}/api/categorie/all`, { credentials: "include" }),
      ]);

      if (resProd.ok && resCat.ok) {
        const prodData = await resProd.json();
        const catData = await resCat.json();
        setProducts(prodData);
        setCategories(catData);
      }
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== Handlers =====
  const handleEdit = (product) => {
    if (product) {
      setSelectedProduct(product);
      setForm({
        name: product.name,
        categorieId: product.Categories?.[0]?.ID?.toString() || "",
      });
    } else {
      setSelectedProduct(null);
      setForm({ name: "", categorieId: "" });
    }
    setOpenDialog(true);
  };

  const handleDelete = (product) => {
    setDeleteProductTarget(product);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteProductTarget) return;
    try {
      await fetch(`${URL}/api/product/${deleteProductTarget.ID}`, {
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

    const method = selectedProduct ? "PUT" : "POST";
    const endpoint = selectedProduct
      ? `${URL}/api/product/${selectedProduct.ID}`
      : `${URL}/api/product/`;

    try {
      await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          categorieId: form.categorieId || null,
        }),
      });
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Configuration Table =====
  const table = useReactTable({
    data: products,
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des données...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Gestion des Produits
        </h1>
        <Button onClick={() => handleEdit(null)}>
          <Plus className="w-4 h-4 mr-2" /> Nouveau Produit
        </Button>
      </div>

      {/* Barre de recherche et Filtres */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Rechercher un produit..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm bg-white"
        />

        {/* Filtre par Catégorie */}
        <Select
          value={table.getColumn("categorie")?.getFilterValue() ?? "all"}
          onValueChange={(value) =>
            table
              .getColumn("categorie")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[220px] bg-white text-left">
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

        {/* Bouton de réinitialisation des filtres */}
        {(globalFilter || columnFilters.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setGlobalFilter("");
              setColumnFilters([]);
            }}
          >
            <X className="w-4 h-4 mr-2" /> Réinitialiser
          </Button>
        )}
      </div>

      {/* Tableau */}
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
                <TableRow key={row.id} className="hover:bg-slate-50/50">
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
                  colSpan={3}
                  className="h-24 text-center text-muted-foreground"
                >
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <span className="text-sm text-muted-foreground mr-2">
          Page {table.getState().pagination.pageIndex + 1} sur{" "}
          {table.getPageCount()}
        </span>
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

      {/* Modal Création / Édition */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          className="sm:max-w-[425px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Modifier le produit" : "Ajouter un produit"}
            </DialogTitle>
            <DialogDescription>
              Saisissez les détails du produit ici. Le nom est obligatoire.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom du Produit
              </label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Chargeur Rapide USB-C"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select
                value={form.categorieId}
                onValueChange={(val) => setForm({ ...form, categorieId: val })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent position="popper">
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

      {/* Modal Suppression */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            Le produit{" "}
            <span className="font-semibold text-destructive">
              {deleteProductTarget?.name}
            </span>{" "}
            sera supprimé.
          </div>
          <DialogFooter>
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
