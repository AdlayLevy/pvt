import TitleFilterSection from "../../widgets/titleFilterSection";
import TableSection from "../tableSection";
import {
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Edit, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Switch } from "../ui/switch";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState(false);
  const [openCreateUser, setOpenCreateUser] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users_services");
      console.log("in the fecthUsers function", response.status);
      if (!response.ok) {
        console.log("error", response);
        toast(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setUsers(data);
    } catch (error) {
      console.log(error);
      toast("Usuarios no cargados correctamente");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    toast("Creando usuario...");
    setUserName("");
    setEmail("");
    setPassword(""), setPhone("");
    setRole("");
    try {
      const response = await fetch("/api/users_services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: email,
          password: password,
          phone: phone,
          role: role,
        }),
      });
      if (!response.ok) {
        toast(`Error creating user. Status:${response.status}`);
      }
      // const newUser = response.json();
      // add new user to users array
      // setUsers((prevUsers) => [...prevUsers, newUser]);
      // clean inputs
      setUserName("");
      setEmail("");
      setPassword(""), setPhone("");
      setRole("");
      setOpenCreateUser(false);
      // reload users
      fetchUsers();
    } catch (error) {
      console.log(error);
      toast.error("Error al crear usuario. Intente de nuevo más tarde.");
    } finally {
      toast.success("Usuario creado");
    }
  };

  const updateUser = async (user) => {
    toast("Actualizando usuario ...");
    try {
      const response = await fetch("/api/users_services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: userName || user.name,
          email: email || user.email,
          password: password || user.password,
          phone: phone || user.phone,
          isActive: status,
          role: role || user.role,
        }),
      });
      if (!response.ok) {
        toast(`Error updating user. Status: ${response.status}`);
      }
      setUserName("");
      setEmail("");
      setPassword(""), setPhone("");
      setRole("");
      fetchUsers();
    } catch (error) {
      console.log(error, ":Error updating user");
      toast.error("Error actualizando usuario. Intente de nuevo más tarde");
    } finally {
      toast.success("Usuario actualizado.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.createdAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
  );

  return (
    <div className="w-full p-6">
      <TitleFilterSection titleSection="Usuarios" />
      {isMobile ? (
        <div className="p-6 bg-gray-50 rounded-lg ">
          <p className="text-center">
            Demasiados datos para mostrar en este dispositivo.
          </p>
          <div className="flex p-6 justify-center">Nothing to show</div>
        </div>
      ) : (
        <TableSection
          searchInput
          searchValue={searchTerm}
          searchOnChange={(e) => setSearchTerm(e.target.value)}
          hasAddButton
          addButton={
            <Dialog open={openCreateUser} onOpenChange={setOpenCreateUser}>
              <DialogTrigger asChild>
                <Button onClick={() => setOpenCreateUser(true)}>
                  <Plus /> Añadir Usuario
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Juan Pérez"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Correo</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="ejemplo@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="812 123 45 67"
                      type="number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="role">Rol</Label>
                    <Select
                      value={role}
                      onValueChange={(e) => {
                        setRole(e);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccion un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Rol</SelectLabel>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Administrador</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => createUser()}>Guardar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
          tableTitles={[
            "Nombre",
            "Correo",
            "Teléfono",
            "Tipo",
            "Estatus",
            "Creado",
            "Último accesso",
          ]}
          tableBody={
            loading ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-indigo-500 text-base"
                >
                  Cargando ...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, key) => (
                <TableRow key={key} className="text-xs">
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.role == "ADMIN" ? "Administrador" : "Usuario"}
                  </TableCell>
                  <TableCell>{user.isActive ? "Activo" : "Inactivo"}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="">
                    <Dialog>
                      <DialogTrigger>
                        <Edit />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Usuario</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                          <div className="grid gap-3">
                            <Label>Nombre</Label>
                            <Input
                              id="name"
                              name="name"
                              value={userName || user.name}
                              onChange={(e) => setUserName(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label>Contraseña</Label>
                            <Input
                              id="psw"
                              name="psw"
                              value={password || user.password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label>Teléfono</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={phone || user.phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label>Rol</Label>
                            <Select
                              onValueChange={(e) => setRole(e)}
                              defaultValue={user.role}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccion un rol" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Rol</SelectLabel>
                                  <SelectItem value="USER">Ususario</SelectItem>
                                  <SelectItem value="ADMIN">
                                    Administrador
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className=" gap-3 flex">
                            <Label>Inactivo</Label>
                            <Switch
                              checked={
                                status === user.isActive
                                  ? status
                                  : user.isActive
                              }
                              onCheckedChange={(e) => setStatus(e)}
                            />
                            <Label>Activo</Label>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => updateUser(user)}>
                            Guardar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-indigo-500 text-base"
                >
                  No hay información que coincida.
                </TableCell>
              </TableRow>
            )
          }
        />
      )}
    </div>
  );
}
