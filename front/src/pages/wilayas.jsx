"use client";

import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// ===== Columns =====
const columns = (onEdit, onDelete) => [
  { accessorKey: "Commune", header: "Commune" },
  { accessorKey: "Daira", header: "Daira" },
  { accessorKey: "wilaya", header: "Wilaya" },
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

export default function WilayasPage() {
  const [wilayas, setWilayas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterWilaya, setFilterWilaya] = useState(null);
  const [filterDaira, setFilterDaira] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [form, setForm] = useState({ Commune: "", Daira: "", wilaya: "" });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ===== Fetch API =====
  const fetchWilayas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${URL}/api/location/`, {
        credentials: "include",
      });
      const data = await res.json();
      setWilayas(data);
    } catch (err) {
      console.error(err);
      setWilayas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWilayas();
  }, []);

  // ===== Handlers =====
  const handleEdit = (wilaya) => {
    if (wilaya) {
      setSelectedWilaya(wilaya);
      setForm({
        Commune: wilaya.Commune,
        Daira: wilaya.Daira,
        wilaya: wilaya.wilaya,
      });
    } else {
      setSelectedWilaya(null);
      setForm({ Commune: "", Daira: "", wilaya: "" });
    }
    setOpenDialog(true);
  };

  const handleDelete = (wilaya) => {
    setDeleteTarget(wilaya);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`http://localhost:3000/api/wilaya/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setOpenDeleteDialog(false);
    fetchWilayas();
  };

  const handleSubmit = async () => {
    if (selectedWilaya) {
      await fetch(`http://localhost:3000/api/wilaya/${selectedWilaya.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${URL}/api/wilaya`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
    }
    setOpenDialog(false);
    fetchWilayas();
  };

  // ===== Table =====
  const table = useReactTable({
    data: wilayas,
    columns: columns(handleEdit, handleDelete),
    state: { globalFilter },
    globalFilterFn: (row, _, value) =>
      row.original.Commune.toLowerCase().includes(value.toLowerCase()) ||
      row.original.Daira.toLowerCase().includes(value.toLowerCase()) ||
      row.original.wilaya.toLowerCase().includes(value.toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // ===== Apply dropdown filters =====
  const rows = table.getRowModel().rows.filter((r) => {
    return (
      (!filterWilaya || r.original.wilaya === filterWilaya) &&
      (!filterDaira || r.original.Daira === filterDaira)
    );
  });

  // ===== Unique values for filters =====
  const wilayaOptions = Array.from(new Set(wilayas.map((w) => w.wilaya)));
  const dairaOptions = Array.from(
    new Set(
      filterWilaya
        ? wilayas.filter((w) => w.wilaya === filterWilaya).map((w) => w.Daira)
        : wilayas.map((w) => w.Daira)
    )
  );

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Wilayas</h1>
        <Button onClick={() => handleEdit(null)}>Créer</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Rechercher..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filtrer Wilaya</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterWilaya(null)}>
              Tous
            </DropdownMenuItem>
            {wilayaOptions.map((w) => (
              <DropdownMenuItem key={w} onClick={() => setFilterWilaya(w)}>
                {w}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filtrer Daira</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterDaira(null)}>
              Tous
            </DropdownMenuItem>
            {dairaOptions.map((d) => (
              <DropdownMenuItem key={d} onClick={() => setFilterDaira(d)}>
                {d}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
                  Aucun Wilaya trouvé
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

      {/* Dialogs */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedWilaya ? "Modifier Wilaya" : "Créer Wilaya"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Commune"
              value={form.Commune}
              onChange={(e) => setForm({ ...form, Commune: e.target.value })}
            />
            <Input
              placeholder="Daira"
              value={form.Daira}
              onChange={(e) => setForm({ ...form, Daira: e.target.value })}
            />
            <Input
              placeholder="Wilaya"
              value={form.wilaya}
              onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>
              {selectedWilaya ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Voulez-vous vraiment supprimer{" "}
            <strong>{deleteTarget?.wilaya}</strong> ?
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
