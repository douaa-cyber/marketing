import { Link, useLocation } from "react-router-dom";
import { Home, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { title: "Accueil", href: "/accueil", icon: Home },
  { title: "Utilisateurs", href: "/users", icon: Users },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      className="
        group fixed left-0 top-0 z-40
        h-screen w-16 hover:w-64
        border-r bg-background
        transition-all duration-300 ease-in-out
        flex flex-col
      "
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b">
        <span className="text-lg font-bold group-hover:hidden">M</span>
        <span className="hidden group-hover:block text-lg font-bold">
          Marketing App
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full flex items-center gap-3 justify-start",
                  "px-3",
                  isActive && "font-semibold"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="hidden group-hover:inline">{item.title}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t">
        <Button
          variant="destructive"
          className="w-full flex items-center gap-3 justify-start px-3"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className="hidden group-hover:inline">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
