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
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
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

export default function ProductsPage() {
  const [Products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);

  // ===== Dialog states =====
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);

  // ===== Fetch API =====
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/cadeau/all", {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ===== Handlers =====
  const handleEdit = (Product) => {
    if (Product) {
      setSelectedProduct(Product);
      setForm({
        name: Product.name,
      });
    } else {
      setSelectedProduct(null);
      setForm({ name: "" });
    }
    setOpenDialog(true);
  };

  const handleDelete = (Product) => {
    setDeleteProductTarget(Product);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteProductTarget) return;
    await fetch(`http://localhost:3000/api/cadeau/${deleteProductTarget.ID}`, {
      method: "DELETE",
      credentials: "include",
    });
    setOpenDeleteDialog(false);
    fetchProducts();
  };

  const handleSubmit = async () => {
    if (selectedProduct) {
      // Update
      await fetch(`http://localhost:3000/api/cadeau/${selectedProduct.ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
    } else {
      await fetch("http://localhost:3000/api/cadeau", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
    }
    setOpenDialog(false);
    fetchProducts();
  };

  // ===== Table =====
  const table = useReactTable({
    data: Products,
    columns: columns(handleEdit, handleDelete),
    state: { globalFilter },
    globalFilterFn: (row, _, value) =>
      row.original.name.toLowerCase().includes(value.toLowerCase()),
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
        <h1 className="text-2xl font-bold">Gestion des Cadeaux</h1>
        <Button onClick={() => handleEdit(null)}>
          <Pencil className="w-4 h-4 mr-2" /> Créer
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Rechercher Cadeau..."
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
                      header.getContext()
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
                <TableCell colSpan={4} className="text-center py-10">
                  Aucun Cadeau trouvé
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
              {selectedProduct ? "Modifier Produit" : "Créer Produit"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>
              {selectedProduct ? "Modifier" : "Créer"}
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
            <strong>{deleteProductTarget?.name}</strong> ?
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
