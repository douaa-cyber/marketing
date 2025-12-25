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

import FormDialog from "../components/FormDialog";
import { URL } from "@/api";

export default function FormulairesPage() {
  const [formulaires, setFormulaires] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFormulaire, setSelectedFormulaire] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ===== Fetch data =====
  const fetchFormulaires = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${URL}/api/formulaire/all`, {
        credentials: "include",
      });
      const data = await res.json();
      setFormulaires(data);
    } catch (err) {
      console.error(err);
      setFormulaires([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMissions = async () => {
    try {
      const res = await fetch(`${URL}/api/mission/all`, {
        credentials: "include",
      });
      const data = await res.json();
      setMissions(data);
    } catch (err) {
      console.error(err);
      setMissions([]);
    }
  };

  useEffect(() => {
    fetchFormulaires();
    fetchMissions();
  }, []);

  // ===== Handlers =====
  const handleEdit = (formulaire) => {
    setSelectedFormulaire(formulaire || null);
    setOpenDialog(true);
  };

  const handleDelete = (formulaire) => {
    setDeleteTarget(formulaire);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`${URL}/api/formulaire/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setOpenDeleteDialog(false);
    fetchFormulaires();
  };

  // ===== Table =====
  const columns = [
    { accessorKey: "Fullname", header: "Fullname" },
    { accessorKey: "Tel", header: "Tel" },
    { accessorKey: "nom_magasin", header: "Magasin" },
    { accessorKey: "Activite", header: "Activité" },
    { accessorKey: "mission_id", header: "Mission ID" },
    { accessorKey: "createdAt", header: "Créé le" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => handleDelete(row.original)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: formulaires,
    columns,
    state: { globalFilter },
    globalFilterFn: (row, _, value) =>
      row.original.Fullname.toLowerCase().includes(value.toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Formulaires</h1>
        <Button onClick={() => handleEdit(null)}>Créer Formulaire</Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center my-4">
        <Input
          placeholder="Rechercher..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
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
                  Aucun formulaire trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-2">
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

      {/* Dialog Multi-Step */}
      {openDialog && (
        <FormDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          missions={missions}
        />
      )}

      {/* Dialog Delete */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation Suppression</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Voulez-vous vraiment supprimer{" "}
            <strong>{deleteTarget?.Fullname}</strong> ?
          </p>
          <DialogFooter className="flex justify-end gap-2">
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
