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
import { Label } from "@/components/ui/label";

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
  { accessorKey: "name", header: "Name" },
  { accessorKey: "Surname", header: "Surname" },
  { accessorKey: "tel", header: "Tel" },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "mode_vente", header: "Mode vente" },
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

export default function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [form, setForm] = useState({
    name: "",
    Surname: "",
    tel: "",
    region: "",
    type: "Exist",
    mode_vente: "",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ===== Fetch API =====
  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${URL}/api/sourceAppro/all`, {
        credentials: "include",
      });
      const data = await res.json();

      setSources(data);
    } catch (err) {
      console.error(err);
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  // ===== Handlers =====
  const handleEdit = (source) => {
    if (source) {
      setSelectedSource(source);
      setForm({ ...source });
    } else {
      setSelectedSource(null);
      setForm({
        name: "",
        Surname: "",
        tel: "",
        region: "",
        type: "Exist",
        mode_vente: null,
      });
    }
    setOpenDialog(true);
  };

  const handleDelete = (source) => {
    setDeleteTarget(source);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`${URL}/api/sourceAppro/${deleteTarget.ID}`, {
      method: "DELETE",
      credentials: "include",
    });
    setOpenDeleteDialog(false);
    fetchSources();
  };
  const payload = {
    ...form,
    mode_vente: form.mode_vente || null,
  };
  const handleSubmit = async () => {
    if (selectedSource) {
      await fetch(`${URL}/api/sourceAppro/${selectedSource.ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(`${URL}/api/sourceAppro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
    }
    setOpenDialog(false);
    fetchSources();
  };

  // ===== Table =====
  const table = useReactTable({
    data: sources,
    columns: columns(handleEdit, handleDelete),
    state: { globalFilter },
    globalFilterFn: (row, _, value) =>
      row.original.name.toLowerCase().includes(value.toLowerCase()) ||
      row.original.Surname.toLowerCase().includes(value.toLowerCase()) ||
      row.original.tel.toLowerCase().includes(value.toLowerCase()) ||
      row.original.region.toLowerCase().includes(value.toLowerCase()) ||
      row.original.mode_vente.toLowerCase().includes(value.toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table
    .getRowModel()
    .rows.filter((r) => !typeFilter || r.original.type === typeFilter);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sources d’approvisionnement</h1>
        <Button onClick={() => handleEdit(null)}>Créer</Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Rechercher..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filtrer Type</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTypeFilter(null)}>
              Tous
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("Exist")}>
              Exist
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("ExistNot")}>
              ExistNot
            </DropdownMenuItem>
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
                  <TableHead key={header.id} className="text-left">
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
                <TableCell colSpan={6} className="text-center py-10">
                  Aucun source trouvé
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
              {selectedSource ? "Modifier Source" : "Créer Source"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nom commercial</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="surname">Nom connu au marché</Label>
              <Input
                id="surname"
                value={form.Surname}
                onChange={(e) => setForm({ ...form, Surname: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="tel">Téléphone</Label>
              <Input
                id="tel"
                maxLength={10}
                value={form.tel}
                onChange={(e) => setForm({ ...form, tel: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="region">Région</Label>
              <Input
                id="region"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="border rounded p-2 w-full"
              >
                <option value="Exist">Exist</option>
                <option value="ExistNot">Exist Not</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="mode_vente">Mode de vente</Label>
              <select
                id="mode_vente"
                value={form.mode_vente}
                onChange={(e) =>
                  setForm({ ...form, mode_vente: e.target.value })
                }
                className="border rounded p-2 w-full"
              >
                <option value="">-- Non spécifié --</option>
                <option value="distribution_direct">Distribution Direct</option>
                <option value="super_gros">Super Gros</option>
                <option value="demi_gros">Demi Gros</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>
              {selectedSource ? "Modifier" : "Créer"}
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
            Voulez-vous vraiment supprimer <strong>{deleteTarget?.name}</strong>{" "}
            ?
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
