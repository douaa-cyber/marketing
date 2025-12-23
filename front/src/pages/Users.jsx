import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Pencil, Trash2, Plus } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState({
    username: "",
    fullname: "",
    password: "",
    role: "marketer",
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= Helpers =================
  const openCreate = () => {
    setSelectedUser(null);
    setForm({ username: "", fullname: "", password: "", role: "marketer" });
    setOpenForm(true);
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setForm({
      username: user.username,
      fullname: user.fullname,
      password: "",
      role: user.role,
    });
    setOpenForm(true);
  };

  const closeForm = () => {
    setOpenForm(false);
    setSelectedUser(null);
  };
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Créer
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Fullname</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.fullname}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEdit(u)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setSelectedUser(u);
                    setOpenDelete(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Modifier utilisateur" : "Créer utilisateur"}
            </DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            placeholder="fullname"
            value={form.fullname}
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
          />

          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            className="border rounded p-2"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="marketeur">Marketeur</option>
            <option value="responsable">Responsable</option>
          </select>

          <DialogFooter>
            <Button onClick={selectedUser ? updateUser : createUser}>
              {selectedUser ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
          </DialogHeader>

          <p>
            Voulez-vous vraiment supprimer{" "}
            <strong>{selectedUser?.username}</strong> ?
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
