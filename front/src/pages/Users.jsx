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
import { URL } from "@/api";

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

// ===== Role Badge =====
const roleStyle = {
  admin: "bg-red-100 text-red-700",
  marketeur: "bg-blue-100 text-blue-700",
  responsable: "bg-green-100 text-green-700",
};

// ===== Columns =====
const columns = (onEdit, onDelete) => [
  { accessorKey: "fullname", header: "Full name" },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.username}</span>
    ),
  },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge className={`${roleStyle[row.original.role]} capitalize`}>
        {row.original.role}
      </Badge>
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

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);

  // ===== Dialog states =====
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullname: "",
    role: "marketeur",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  // ===== Fetch API =====
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${URL}/api/user/all`, {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== Handlers =====
  const handleEdit = (user) => {
    if (user) {
      setSelectedUser(user);
      setForm({
        username: user.username,
        password: user.password,
        fullname: user.fullname,
        role: user.role,
      });
    } else {
      setSelectedUser(null);
      setForm({ username: "", fullname: "", password: "", role: "marketeur" });
    }
    setOpenDialog(true);
  };

  const handleDelete = (user) => {
    setDeleteUserTarget(user);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteUserTarget) return;
    await fetch(`http://localhost:3000/api/user/${deleteUserTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setOpenDeleteDialog(false);
    fetchUsers();
  };

  const handleSubmit = async () => {
    if (selectedUser) {
      // Update
      await fetch(`http://localhost:3000/api/user/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
    } else {
      // Create
      await fetch(`${URL}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
    }
    setOpenDialog(false);
    fetchUsers();
  };

  // ===== Table =====
  const table = useReactTable({
    data: users,
    columns: columns(handleEdit, handleDelete),
    state: { globalFilter },
    globalFilterFn: (row, _, value) =>
      row.original.username.toLowerCase().includes(value.toLowerCase()) ||
      row.original.fullname.toLowerCase().includes(value.toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = roleFilter
    ? table.getRowModel().rows.filter((r) => r.original.role === roleFilter)
    : table.getRowModel().rows;

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <Button onClick={() => handleEdit(null)}>
          <Pencil className="w-4 h-4 mr-2" /> Créer
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Rechercher utilisateur..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filtrer par rôle <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setRoleFilter(null)}>
              Tous
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("admin")}>
              Admin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("marketeur")}>
              Marketeur
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("responsable")}>
              Responsable
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
                  Aucun utilisateur trouvé
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
              {selectedUser ? "Modifier utilisateur" : "Créer utilisateur"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              placeholder="Full name"
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            />
            <Input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <Input
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <select
              className="border rounded p-2 w-full"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="marketeur">Marketeur</option>
              <option value="responsable">Responsable</option>
            </select>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>
              {selectedUser ? "Modifier" : "Créer"}
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
            <strong>{deleteUserTarget?.username}</strong> ?
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
