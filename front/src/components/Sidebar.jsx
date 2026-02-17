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
  Menu,
  Lightbulb,
  Package,
  Plug,
  Zap,
  Truck,
  Columns,
  Gift,
  MapPin,
  Car,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/context/AuthContext";
import { URL } from "@/api";

const items = [
  { title: "Accueil", href: "/", icon: Home },
  {
    title: "Donnes de base",
    icon: Table,
    subItems: [
      { title: "Utilisateur", href: "/users", icon: UsersIcon },
      { title: "Produit Accessoire", href: "/ProdAcc", icon: Package },
      { title: "Produit Appareillage", href: "/ProdApp", icon: Plug },
      { title: "Produit Disjoncteur", href: "/ProdDisj", icon: Zap },
      { title: "Produit Lampe", href: "/ProdLamp", icon: Lightbulb },
      { title: "Concurrent Accessoire", href: "/ConcuAcc", icon: Package },
      { title: "Concurrent Appareillage", href: "/ConcuApp", icon: Plug },
      { title: "Concurrent Disjoncteur", href: "/ConcuDisj", icon: Zap },
      { title: "Concurrent Lampe", href: "/ConcuLamp", icon: Lightbulb },
      {
        title: "Produit Concurrent Accessoire",
        href: "/ProdConcuAcc",
        icon: Package,
      },
      {
        title: "Produit Concurrent Appareillage",
        href: "/ProdConcuApp",
        icon: Plug,
      },
      {
        title: "Produit Concurrent Disjoncteur",
        href: "/ProdConcuDisj",
        icon: Zap,
      },
      {
        title: "Produit Concurrent Lampe",
        href: "/ProdConcuLamp",
        icon: Lightbulb,
      },
      { title: "Source Approvisionement", href: "/SourceAppro", icon: Truck },
      { title: "Activite", href: "/Activite", icon: Columns },
      { title: "Cadeau", href: "/Cadeau", icon: Gift },
      { title: "Wilaya", href: "/Location", icon: MapPin },
      { title: "vehicule", href: "/vehicule", icon: Car },
    ],
  },
  { title: "Mission", href: "/Mission", icon: CarFront },
  { title: "Fiche Visite", href: "/Form", icon: NotebookPen },
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [hovered, setHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openItems, setOpenItems] = useState({});

  const isSidebarOpen = hovered || isOpen;

  const filteredItems = items.filter((item) => {
    if (user?.role === "marketeur") {
      if (
        item.title === "Donnes de base" ||
        item.title === "Mission" ||
        item.title === "Dashboard"
      ) {
        return false;
      }
    }
    return true;
  });
  const toggleItem = (title) => {
    setOpenItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleNavigate = (href) => {
    navigate(href);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);

      navigate("/login");
    } catch (err) {
      console.error("Erreur logout:", err);
    }
  };

  return (
    <>
      {/* Bouton mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen((o) => !o)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-64" : "w-16",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b">
          <span className="text-lg font-bold">
            {isSidebarOpen ? "Marketing App" : "M"}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-auto">
          {filteredItems.map((item) => {
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
                      {isSidebarOpen && <span>{item.title}</span>}
                    </div>
                    {isSidebarOpen && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openItems[item.title] ? "rotate-180" : "rotate-0",
                        )}
                      />
                    )}
                  </Button>
                ) : (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full flex items-center gap-3 px-3 justify-start"
                    onClick={() => handleNavigate(item.href)}
                  >
                    {Icon && <Icon className="h-5 w-5 shrink-0" />}
                    {isSidebarOpen && <span>{item.title}</span>}
                  </Button>
                )}

                {item.subItems && openItems[item.title] && isSidebarOpen && (
                  <div className="ml-6 flex flex-col space-y-1 mt-1">
                    {item.subItems.map((sub) => {
                      const isSubActive = location.pathname === sub.href;
                      const SubIcon = sub.icon;
                      return (
                        <Button
                          key={sub.href}
                          variant={isSubActive ? "secondary" : "ghost"}
                          className="w-full justify-start px-3 text-sm"
                          onClick={() => handleNavigate(sub.href)}
                        >
                          {SubIcon && (
                            <SubIcon className="h-4 w-4 shrink-0 mr-2" />
                          )}
                          {isSidebarOpen && <span>{sub.title}</span>}
                        </Button>
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
            {isSidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
