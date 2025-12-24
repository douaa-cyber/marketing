import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { MoreHorizontal, Plus } from "lucide-react";

export default function Users() {
  const [users, setUsers] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const [openForm, setOpenForm] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  const [form, setForm] = React.useState({
    username: "",
    fullname: "",
    password: "",
    role: "marketeur",
  });

  // ================= API =================
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:3000/api/user/all", {
      credentials: "include",
    });
    setUsers(await res.json());
  };

  const createUser = async () => {
    await fetch("http://localhost:3000/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    closeForm();
    fetchUsers();
  };

  const updateUser = async () => {
    await fetch(`http://localhost:3000/api/user/${selectedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    closeForm();
    fetchUsers();
  };

  const deleteUser = async () => {
    await fetch(`http://localhost:3000/api/user/${selectedUser.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setOpenDelete(false);
    fetchUsers();
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const closeForm = () => {
    setOpenForm(false);
    setSelectedUser(null);
  };

  // ================= COLUMNS =================
  const columns = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "username",
        header: "Username",
      },
      {
        accessorKey: "fullname",
        header: "Nom complet",
      },
      {
        accessorKey: "role",
        header: "Rôle",
        cell: ({ row }) => (
          <Badge variant="secondary">{row.getValue("role")}</Badge>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(user);
                    setForm({
                      username: user.username,
                      fullname: user.fullname,
                      password: "",
                      role: user.role,
                    });
                    setOpenForm(true);
                  }}
                >
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    setSelectedUser(user);
                    setOpenDelete(true);
                  }}
                >
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  // ================= UI =================
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Utilisateurs</h1>
          <p className="text-sm text-muted-foreground">
            Gestion des comptes utilisateurs
          </p>
        </div>
        <Button onClick={() => setOpenForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {/* FILTER */}
      <Input
        placeholder="Rechercher par username..."
        value={table.getColumn("username")?.getFilterValue() ?? ""}
        onChange={(e) =>
          table.getColumn("username")?.setFilterValue(e.target.value)
        }
        className="max-w-sm"
      />

      {/* TABLE */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
                  Aucun utilisateur
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* CREATE / EDIT */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Modifier utilisateur" : "Créer utilisateur"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <Input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <Input
              placeholder="Nom complet"
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <select
              className="border rounded-md p-2"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="marketeur">Marketeur</option>
              <option value="responsable">Responsable</option>
            </select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>
              Annuler
            </Button>
            <Button onClick={selectedUser ? updateUser : createUser}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Supprimer utilisateur
            </DialogTitle>
          </DialogHeader>
          <p>
            Supprimer <strong>{selectedUser?.username}</strong> ?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={deleteUser}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
