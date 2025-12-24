"use client";

import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users as UsersIcon,
  LogOut,
  Table,
  ChevronDown,
  CarFront,
  NotebookPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/context/AuthContext"; // <-- ton context

const items = [
  { title: "Accueil", href: "/accueil", icon: Home },
  {
    title: "Donnes de base",
    icon: Table,
    subItems: [
      { title: "Utilisateur", href: "/users", icon: UsersIcon },
      { title: "Produit Accessoire", href: "/ProdAcc" },
      // ... autres sous-items
    ],
  },
  { title: "Mission", href: "/Mission", icon: CarFront },
  { title: "Fiche Visite", href: "/Form", icon: NotebookPen },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [hovered, setHovered] = useState(false);
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (title) => {
    setOpenItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        credentials: "include",
      });
      setUser(null); // reset user dans le contexte
      navigate("/login"); // redirige vers login
    } catch (err) {
      console.error("Erreur logout:", err);
    }
  };

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="
        fixed left-0 top-0 z-40
        h-screen w-16 hover:w-64
        border-r bg-background
        transition-all duration-300
        flex flex-col
      "
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b">
        <span
          className={cn(
            "text-lg font-bold transition-opacity",
            hovered ? "opacity-100" : "opacity-0"
          )}
        >
          Marketing App
        </span>
        <span
          className={cn(
            "text-lg font-bold transition-opacity",
            hovered ? "opacity-0" : "opacity-100"
          )}
        >
          M
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <div key={item.title}>
              {item.subItems ? (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full flex items-center justify-between gap-3 px-3"
                  onClick={() => toggleItem(item.title)}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="h-5 w-5 shrink-0" />}
                    {hovered && <span>{item.title}</span>}
                  </div>
                  {hovered && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openItems[item.title] ? "rotate-180" : "rotate-0"
                      )}
                    />
                  )}
                </Button>
              ) : (
                <Link to={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full flex items-center gap-3 px-3 justify-start"
                  >
                    {Icon && <Icon className="h-5 w-5 shrink-0" />}
                    {hovered && <span>{item.title}</span>}
                  </Button>
                </Link>
              )}

              {item.subItems && openItems[item.title] && hovered && (
                <div className="ml-6 flex flex-col space-y-1 mt-1">
                  {item.subItems.map((sub) => {
                    const isSubActive = location.pathname === sub.href;
                    const SubIcon = sub.icon;
                    return (
                      <Link key={sub.href} to={sub.href}>
                        <Button
                          variant={isSubActive ? "secondary" : "ghost"}
                          className="w-full justify-start px-3 text-sm"
                        >
                          {hovered && SubIcon && (
                            <SubIcon className="h-5 w-5 shrink-0" />
                          )}
                          {hovered && <span>{sub.title}</span>}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t">
        <Button
          variant="destructive"
          className="w-full flex items-center gap-3 justify-start px-3"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {hovered && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
