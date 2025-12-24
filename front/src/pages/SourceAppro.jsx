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
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ===== Fetch API =====
  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/sourceAppro/all", {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
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
      setForm({ name: "", Surname: "", tel: "", region: "", type: "Exist" });
    }
    setOpenDialog(true);
  };

  const handleDelete = (source) => {
    setDeleteTarget(source);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`http://localhost:3000/api/sourceAppro/${deleteTarget.ID}`, {
      method: "DELETE",
      credentials: "include",
    });
    setOpenDeleteDialog(false);
    fetchSources();
  };

  const handleSubmit = async () => {
    if (selectedSource) {
      await fetch(
        `http://localhost:3000/api/sourceAppro/${selectedSource.ID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );
    } else {
      await fetch("http://localhost:3000/api/sourceAppro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
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
      row.original.region.toLowerCase().includes(value.toLowerCase()),
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
          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Surname"
              value={form.Surname}
              onChange={(e) => setForm({ ...form, Surname: e.target.value })}
            />
            <Input
              placeholder="Tel"
              maxlength={10}
              value={form.tel}
              onChange={(e) => setForm({ ...form, tel: e.target.value })}
            />
            <Input
              placeholder="Region"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border rounded p-2 w-full"
            >
              <option value="Exist">Exist</option>
              <option value="ExistNot">ExistNot</option>
            </select>
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
